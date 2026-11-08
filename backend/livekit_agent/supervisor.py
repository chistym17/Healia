from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass
from typing import Any

from livekit_agent import config
from livekit_agent.events import log_event
from livekit_agent.llm_client import groq_json_completion

ALLOWED_ACTIONS = frozenset(
    {
        "ask_followup",
        "acknowledge",
        "build_final_query",
        "escalate",
        "end",
    }
)

_SYSTEM_PROMPT = """
You are the Healia consultation supervisor (brain). You do NOT speak to the patient directly.
Prior messages are the real consultation transcript (patient = user, you = assistant).
The latest user message is the current patient turn plus a compact consultation_state card.

Return ONE JSON decision for the voice agent.

Phase: gathering facts to build a final_query_draft (not a medical diagnosis).

Core rules:
- Output JSON only, matching the schema exactly.
- One action per turn.
- spoken_utterance: short (1-2 sentences), one question max for ask_followup.
- Do not diagnose, prescribe, or give treatment plans.
- English only.

Memory:
- Use the transcript above. Do not restart or ignore earlier answers.
- consultation_state.facts and asked_topics are committed memory — never re-ask those.
- On every substantive patient answer, write it into state_updates.new_facts before the next question.
- If the patient checks connectivity ("can you hear me"), acknowledge briefly and continue
  from the next missing detail — do not ask how you can help again when a complaint is known.
- If the answer is incomplete/unclear, re-ask the same pending topic once.

Complaint & corrections:
- Never invent a chief complaint from greetings or connectivity checks alone.
- Set chief_complaint only when the patient clearly states a symptom/problem.
- On denial/correction: deny_complaints, clear_chief_complaint if needed, apologize, re-ask what they need.
- Never ask about denied_complaints.

Follow-up quality:
- Next missing detail order: location → onset → severity → associated symptoms → red flags,
  then build_final_query. Do not grind a long checklist.
- followup_topic must be a NEW snake_case key not already in asked_topics.
- Prefer acknowledge only for pure greetings with no complaint yet.
- escalate for emergency/red-flag language.

Assessment hints (optional): themes only if present; never copy verbatim.

JSON schema:
{
  "action": "ask_followup|acknowledge|build_final_query|escalate|end",
  "spoken_utterance": "string",
  "allow_light_paraphrase": true,
  "followup_topic": "optional snake_case, required for ask_followup",
  "state_updates": {
    "new_facts": {},
    "corrections": {},
    "chief_complaint": "optional string",
    "clear_chief_complaint": false,
    "deny_complaints": ["optional list of rejected complaint labels"],
    "final_query_draft": "optional string",
    "phase": "optional gathering|ready|ended",
    "add_asked_topics": ["optional list of topics"]
  },
  "confidence": {"decision": 0.0},
  "reason": "short internal reason"
}
""".strip()


@dataclass
class SupervisorDecision:
    action: str
    spoken_utterance: str
    allow_light_paraphrase: bool
    followup_topic: str | None
    state_updates: dict[str, Any]
    confidence: float
    reason: str
    raw: dict[str, Any]


def _extract_json(text: str) -> dict[str, Any]:
    text = (text or "").strip()
    if not text:
        raise ValueError("empty supervisor response")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise
        return json.loads(match.group(0))


def parse_supervisor_decision(payload: dict[str, Any]) -> SupervisorDecision:
    action = str(payload.get("action", "")).strip().lower()
    if action not in ALLOWED_ACTIONS:
        raise ValueError(f"unsupported action: {action}")

    spoken = str(payload.get("spoken_utterance", "")).strip()
    allow_para = bool(payload.get("allow_light_paraphrase", True))
    followup_topic = payload.get("followup_topic")
    if followup_topic is not None:
        followup_topic = str(followup_topic).strip() or None

    state_updates = payload.get("state_updates") or {}
    if not isinstance(state_updates, dict):
        raise ValueError("state_updates must be an object")

    confidence_block = payload.get("confidence") or {}
    confidence = 0.0
    if isinstance(confidence_block, dict):
        try:
            confidence = float(confidence_block.get("decision", 0.0))
        except (TypeError, ValueError):
            confidence = 0.0

    reason = str(payload.get("reason", "")).strip()

    return SupervisorDecision(
        action=action,
        spoken_utterance=spoken,
        allow_light_paraphrase=allow_para,
        followup_topic=followup_topic,
        state_updates=state_updates,
        confidence=confidence,
        reason=reason,
        raw=payload,
    )


def _ms_since(t0: float) -> int:
    return int((time.monotonic() - t0) * 1000)


def _state_card(state: dict[str, Any]) -> dict[str, Any]:
    """Compact committed memory — transcript is in chat messages, not here."""
    return {
        "chief_complaint": state.get("chief_complaint"),
        "facts": state.get("facts") or {},
        "asked_topics": state.get("asked_topics") or [],
        "denied_complaints": state.get("denied_complaints") or [],
        "phase": state.get("phase"),
        "followup_count": state.get("followup_count", 0),
        "final_query_draft": state.get("final_query_draft"),
    }


def build_supervisor_messages(
    *,
    patient_turn: str,
    state: dict[str, Any],
    assessment_evidence: dict[str, Any] | None = None,
) -> list[dict[str, str]]:
    """system + prior transcript turns + final user payload with state card."""
    dialogue = list(state.get("recent_dialogue") or [])
    current = (patient_turn or "").strip()

    # Current patient line is already appended to the turn log before this call.
    prior = dialogue
    if (
        prior
        and prior[-1].get("role") == "patient"
        and (prior[-1].get("text") or "").strip() == current
    ):
        prior = prior[:-1]

    messages: list[dict[str, str]] = [{"role": "system", "content": _SYSTEM_PROMPT}]
    for entry in prior:
        text = (entry.get("text") or "").strip()
        if not text:
            continue
        role = entry.get("role")
        if role == "patient":
            messages.append({"role": "user", "content": text})
        elif role == "agent":
            messages.append({"role": "assistant", "content": text})

    payload: dict[str, Any] = {
        "patient_turn": current,
        "consultation_state": _state_card(state),
    }
    if assessment_evidence is not None:
        payload["assessment_evidence"] = assessment_evidence

    messages.append(
        {"role": "user", "content": json.dumps(payload, ensure_ascii=False)}
    )
    return messages


async def warm_supervisor(*, session_id: str) -> None:
    """Fire a tiny discarded supervisor call while greeting runs (cuts turn-1 TTFB)."""
    if not config.SUPERVISOR_ENABLED:
        return
    t0 = time.monotonic()
    log_event(
        "SUP",
        "warmup_start",
        session_id=session_id,
        turn_id="warmup",
        detail=f"+0ms model={config.SUPERVISOR_MODEL} provider=groq",
    )
    try:
        log_event(
            "SUP",
            "client_ready",
            session_id=session_id,
            turn_id="warmup",
            detail=f"+{_ms_since(t0)}ms note=groq",
        )
        await groq_json_completion(
            system=_SYSTEM_PROMPT,
            user='{"patient_turn":"hi","consultation_state":{"phase":"gathering","facts":{},"asked_topics":[]}}',
            model=config.SUPERVISOR_MODEL,
            temperature=config.SUPERVISOR_TEMPERATURE,
            max_tokens=64,
        )
        log_event(
            "SUP",
            "warmup_done",
            session_id=session_id,
            turn_id="warmup",
            detail=f"+{_ms_since(t0)}ms ok=true",
        )
    except Exception as exc:
        log_event(
            "SUP",
            "warmup_done",
            session_id=session_id,
            turn_id="warmup",
            detail=f"+{_ms_since(t0)}ms ok=false error={exc}",
        )


async def _generate_supervisor_text(
    *,
    messages: list[dict[str, str]],
    session_id: str,
    turn_id: str,
    t0: float,
) -> str:
    """Call Groq GPT-OSS for supervisor JSON."""
    log_event(
        "SUP",
        "request_sent",
        session_id=session_id,
        turn_id=turn_id,
        detail=(
            f"+{_ms_since(t0)}ms model={config.SUPERVISOR_MODEL} "
            f"mode=groq messages={len(messages)}"
        ),
    )
    text = await groq_json_completion(
        messages=messages,
        model=config.SUPERVISOR_MODEL,
        temperature=config.SUPERVISOR_TEMPERATURE,
    )
    log_event(
        "SUP",
        "first_token",
        session_id=session_id,
        turn_id=turn_id,
        detail=f"+{_ms_since(t0)}ms chars={len(text)} note=unary_same_as_complete",
    )
    log_event(
        "SUP",
        "response_complete",
        session_id=session_id,
        turn_id=turn_id,
        detail=f"+{_ms_since(t0)}ms chars={len(text)}",
    )
    return text


async def run_supervisor(
    *,
    patient_turn: str,
    state: dict[str, Any],
    session_id: str = "-",
    turn_id: str = "-",
    assessment_evidence: dict[str, Any] | None = None,
) -> SupervisorDecision:
    """Part 3A: Groq text LLM with real multi-turn messages from the turn log."""
    t0 = time.monotonic()
    log_event(
        "SUP",
        "request_start",
        session_id=session_id,
        turn_id=turn_id,
        detail=f"+0ms model={config.SUPERVISOR_MODEL} provider=groq",
    )

    messages = build_supervisor_messages(
        patient_turn=patient_turn,
        state=state,
        assessment_evidence=assessment_evidence,
    )

    log_event(
        "SUP",
        "client_ready",
        session_id=session_id,
        turn_id=turn_id,
        detail=f"+{_ms_since(t0)}ms note=groq messages={len(messages)}",
    )

    text = await _generate_supervisor_text(
        messages=messages,
        session_id=session_id,
        turn_id=turn_id,
        t0=t0,
    )

    payload = _extract_json(text)
    decision = parse_supervisor_decision(payload)
    log_event(
        "SUP",
        "json_parsed",
        session_id=session_id,
        turn_id=turn_id,
        detail=(
            f"+{_ms_since(t0)}ms action={decision.action} "
            f"utterance_chars={len(decision.spoken_utterance)}"
        ),
    )
    return decision
