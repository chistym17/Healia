# Healia — Project Showcase

**Voice-first AI health consultation assistant**  
*Educational guidance only — not a diagnosis or substitute for professional care.*

Use this document as section-by-section slides or speaker notes. Rough timing: **~10 minutes** total.

| Section | Topic | ~Time |
|---------|--------|-------|
| 1 | Opening — what Healia is | 1 min |
| 2 | Who it is for | 1 min |
| 3 | What the product includes | 1.5 min |
| 4 | End-to-end user flow | 2 min |
| 5 | How it works (under the hood, simply) | 2 min |
| 6 | Tools and infrastructure | 1.5 min |
| 7 | Why you can trust it as a helper | 1.5 min |
| 8 | Limits and close | 0.5 min |

---

## 1. Opening — What is Healia?

**One line:** Healia helps you describe how you feel, asks focused follow-up questions by voice, and delivers a **clear written health note** — summary, practical next steps, warning signs, and when to seek care.

**The problem we tackle:** When you feel unwell, you often need **direction**, not a long chat transcript or a generic search result. You also need something **calm and interruptible** — you can talk naturally, pause, and continue.

**What makes it different:**

- **Voice-first** — speak in everyday language; text is a fallback where supported.
- **Structured output** — a saved guidance page, not a messy conversation log.
- **Evidence-aware** — final guidance is prepared using **retrieved medical references**, not pure guesswork from memory.

**What it is not:** A doctor, clinic, emergency line, diagnosis, prescription, or replacement for in-person care.

---

## 2. Who it is for

**Good fit for Healia:**

- You feel unwell and want a calm sense of what to do next.
- You can describe when it started and what makes it better or worse.
- You want the written result saved so you can read it later.

**Not the right moment (get care now):**

- Trouble breathing, chest pain, fainting.
- Sudden severe headache, confusion, or one-sided weakness.
- Heavy bleeding, serious injury, or symptoms getting worse fast.

**Message for the audience:** Healia is a **decision-support helper** for non-emergency situations — honest about when to stop and call emergency services.

---

## 3. What the product includes (today)

| Area | What users get |
|------|----------------|
| **Account** | Sign up / sign in — consultations are private to your account. |
| **Live consultation** | Real-time voice session with adaptive follow-up questions (one at a time). |
| **Processing** | After the conversation, the system reviews symptoms, checks references, and prepares results. |
| **Guidance page** | Structured note: summary, what you can do now, warning signs, when to seek care, plus linked references where available. |
| **History** | Past consultations saved — reopen guidance anytime; manage/delete sessions from your account. |
| **Transparency** | About and privacy pages — limits of the product and how data is used (not sold for ads). |

**Guidance page sections (the deliverable):**

1. **Summary** — plain-language read of what you described and what it may suggest.  
2. **What you can do now** — practical steps for the next few hours.  
3. **Warning signs** — urgent symptoms called out clearly.  
4. **When to seek care** — whether it can wait or a clinician should see you.

---

## 4. End-to-end user flow

```text
Sign in → Start consultation → Live voice (follow-ups) → Processing → Results → (optional) History
```

**Step-by-step (demo narrative):**

1. **Start** — User opens Healia in the browser, signs in, and starts a new consultation.  
2. **Describe** — User talks about symptoms (e.g. dizziness for two days, worse when standing). No long forms required.  
3. **Consult** — Healia listens and asks **one careful question at a time** based on what was said (e.g. nausea, fever, vision changes).  
4. **Finish conversation** — Session ends when enough information is gathered or the user ends the call.  
5. **Processing** — User sees progress: reviewing symptoms → checking medical references → preparing results.  
6. **Results** — User gets the structured guidance page; it is **saved to their account**.  
7. **Return later** — Consultation history lists past sessions with status and dates.

**Fail-closed behavior (trust point):** If not enough was shared, Healia does **not** invent guidance — the product stops cleanly instead of outputting unreliable advice.

---

## 5. How it works (simple architecture story)

Tell this as three cooperating parts — no need to go deep on code.

```text
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│  Web app        │     │  Product API    │     │  Consultation agent     │
│  (React + mic)  │────▶│  Auth, sessions │────▶│  Voice + reasoning      │
└────────┬────────┘     └─────────────────┘     └───────────┬─────────────┘
         │                                                    │
         │              Real-time voice (WebRTC)              │
         └────────────────────────────────────────────────────┘
                              via LiveKit
```

**Core idea — split “mouth” and “brain”:**

| Role | Responsibility |
|------|----------------|
| **Voice layer** | Natural speech in real time — presence, listening, speaking approved lines. |
| **Supervisor (decision layer)** | Chooses the **next safe action** (e.g. ask a specific follow-up, end gathering, start guidance) using structured state — complaint, facts, what was already asked. |
| **Guidance layer** | When ready: **retrieve** relevant medical knowledge, then **generate** the structured note grounded in those references. |

**Control loop (one sentence):**  
Patient speaks → supervisor decides one validated step → agent speaks → repeat until ready → retrieve references → produce guidance → show results.

**Why this design matters for a showcase:**

- Safer than a single chatbot that freestyle-diagnoses.  
- Voice stays responsive; serious decisions are not left to improvisation alone.  
- Guidance is tied to **retrieval**, not only model recall.

---

## 6. Tools and infrastructure

High-level stack for stakeholders (adjust labels if your deployment differs).

| Layer | Technology / service | Role |
|-------|----------------------|------|
| **Client** | React (Vite), TypeScript, Tailwind | Web UI, consultation screens, results, history |
| **Voice in browser** | LiveKit (WebRTC), microphone | Real-time audio room; user talks from laptop or phone browser |
| **Voice + agent runtime** | LiveKit Agents | Runs the consultation agent in the cloud |
| **Realtime voice AI** | Gemini Live (via LiveKit Google integration) | Listen and speak during the session |
| **Speech (optional path)** | AssemblyAI (LiveKit plugin) | Speech-related capabilities where configured |
| **Text reasoning / guidance** | Groq-hosted LLMs | Supervisor decisions and guidance generation |
| **Medical knowledge search** | Qdrant (vector DB), hybrid retrieval + reranking | Find relevant reference material for grounded guidance |
| **API** | Python, FastAPI | Auth, sessions, tokens, consultation records |
| **Auth** | Supabase | User authentication |
| **Data** | PostgreSQL | Accounts, session history, stored guidance |
| **Security** | Cloudflare Turnstile (where enabled) | Bot protection on auth flows |

**Devices:** Any modern device with a **browser and microphone** — desktop, laptop, or mobile web. No native app required for the core flow.

**Deployment shape (conceptual):** Separate **web client**, **API**, and **agent worker** so voice, product logic, and reasoning can scale and fail independently; the browser does not talk directly to the full “medical brain.”

---

## 7. Why you can trust it as a helper

Use these as talking points — align with product copy and privacy stance.

| Theme | What we do |
|-------|------------|
| **Honest scope** | Educational guidance only; possible explanations, not diagnoses. |
| **Clear escalation** | Warning signs and “when to seek care” are first-class sections, not buried in prose. |
| **Evidence-aware output** | Guidance pipeline uses **retrieved references** (e.g. reputable health sources in the knowledge base) before shaping the final note. |
| **Structured consult state** | Facts and topics asked are tracked explicitly; decisions are validated in code, not only in chat memory. |
| **Fail closed** | Empty or broken runs end cleanly; no fabricated guidance when information is insufficient. |
| **Privacy posture** | Consultations belong to your account; saved for your review; **not used for advertising** (see Privacy page for full detail). |
| **Calm UX** | One question at a time, voice-first — built for someone who already feels unwell. |

**Principles (from the product):**

- **Calm and clear** — direction when you need it, not a noisy chatbot.  
- **Evidence-aware** — references inform practical next steps.  
- **Honest about limits** — helper for “what next,” not a clinician.

---

## 8. Limits and close

**Closing slide bullets:**

- Healia is a **showcase-ready product narrative**: voice consult → grounded guidance → saved history.  
- Built for **safety-minded architecture**: split voice/reasoning, retrieval-backed guidance, fail-closed behavior.  
- Always remind audiences: **emergency = local emergency services**, not Healia.

**Optional demo path (if live):** Home → Sign in → Start consultation → Short voice demo → Processing → Results → History.

**Related docs (technical):** See root `README.md` for engineering architecture and control-loop detail.

---

*Last updated for showcase use — product positioning matches in-app About, Privacy, and landing content.*