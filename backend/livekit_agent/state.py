from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

_MAX_RECENT_DIALOGUE = 12


@dataclass
class ConsultationState:
    """Mutable consultation state committed only after Python validation."""

    session_id: str
    chief_complaint: str | None = None
    facts: dict[str, Any] = field(default_factory=dict)
    asked_topics: list[str] = field(default_factory=list)
    denied_complaints: list[str] = field(default_factory=list)
    phase: str = "gathering"
    final_query_draft: str | None = None
    followup_count: int = 0
    # Last agent/patient utterances so supervisor does not re-ask or reset.
    recent_dialogue: list[dict[str, str]] = field(default_factory=list)
    last_agent_utterance: str | None = None

    def snapshot(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "chief_complaint": self.chief_complaint,
            "facts": dict(self.facts),
            "asked_topics": list(self.asked_topics),
            "denied_complaints": list(self.denied_complaints),
            "phase": self.phase,
            "final_query_draft": self.final_query_draft,
            "followup_count": self.followup_count,
            "recent_dialogue": list(self.recent_dialogue),
            "last_agent_utterance": self.last_agent_utterance,
        }

    def record_patient_turn(self, text: str) -> None:
        cleaned = (text or "").strip()
        if not cleaned:
            return
        self.recent_dialogue.append({"role": "patient", "text": cleaned[:500]})
        if len(self.recent_dialogue) > _MAX_RECENT_DIALOGUE:
            self.recent_dialogue = self.recent_dialogue[-_MAX_RECENT_DIALOGUE:]

    def record_agent_utterance(self, text: str) -> None:
        cleaned = (text or "").strip()
        if not cleaned:
            return
        self.last_agent_utterance = cleaned[:500]
        self.recent_dialogue.append({"role": "agent", "text": cleaned[:500]})
        if len(self.recent_dialogue) > _MAX_RECENT_DIALOGUE:
            self.recent_dialogue = self.recent_dialogue[-_MAX_RECENT_DIALOGUE:]

    def deny_complaint(self, complaint: str) -> None:
        text = (complaint or "").strip()
        if not text:
            return
        key = text.lower()
        if not any(d.lower() == key for d in self.denied_complaints):
            self.denied_complaints.append(text)
        if (self.chief_complaint or "").strip().lower() == key:
            self.chief_complaint = None
        # Drop facts that clearly encode the denied complaint label.
        drop_keys = [
            k
            for k, v in self.facts.items()
            if key in str(k).lower() or key in str(v).lower()
        ]
        for k in drop_keys:
            self.facts.pop(k, None)

    def apply_updates(
        self,
        *,
        new_facts: dict[str, Any] | None = None,
        corrections: dict[str, Any] | None = None,
        chief_complaint: str | None = None,
        clear_chief_complaint: bool = False,
        deny_complaints: list[str] | None = None,
        final_query_draft: str | None = None,
        phase: str | None = None,
        add_asked_topics: list[str] | None = None,
    ) -> None:
        for item in deny_complaints or []:
            self.deny_complaint(str(item))

        if clear_chief_complaint:
            self.chief_complaint = None

        if chief_complaint is not None:
            text = str(chief_complaint).strip()
            if text:
                # Never re-adopt a denied complaint.
                if not any(d.lower() == text.lower() for d in self.denied_complaints):
                    self.chief_complaint = text
            else:
                self.chief_complaint = None

        for key, value in (new_facts or {}).items():
            if value is not None and value != "":
                self.facts[key] = value
        for key, value in (corrections or {}).items():
            if value is None or value == "":
                self.facts.pop(str(key), None)
            else:
                self.facts[key] = value
        if final_query_draft:
            self.final_query_draft = final_query_draft
        if phase:
            self.phase = phase
        for topic in add_asked_topics or []:
            topic = (topic or "").strip()
            if topic and topic not in self.asked_topics:
                self.asked_topics.append(topic)
