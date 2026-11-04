# Healia

Voice-first AI health consultation. Users describe symptoms, answer focused follow-ups, and get structured educational guidance — not a diagnosis.

The hard problem is running a **safe, interruptible voice consult** while a separate decision layer gathers facts, retrieves medical references, and only then produces guidance.

---

## Flow

```text
Sign in → Start consult → Live voice (follow-ups) → Processing → Results
```

Empty sessions do not invent guidance — the product stops if not enough was shared.

---

## Architecture

Voice, product API, and consultation logic are separate so each can ship and fail independently. The browser never talks to the model brain directly.

```text
┌──────────────────────┐
│  Client (React)      │
│  UI + LiveKit audio  │
└──────────┬───────────┘
           │ HTTPS              WebRTC
           ▼                       ▼
┌──────────────────┐    ┌─────────────────────┐
│  Product API     │    │  LiveKit Cloud      │
│  Auth · sessions │    │  rooms + dispatch   │
│  LiveKit tokens  │    └──────────┬──────────┘
└────────┬─────────┘               │
         │                         ▼
         │              ┌──────────────────────────────┐
         │              │  Consultation agent          │
         │              │  Voice I/O (realtime)        │
         │              │  Supervisor → next action    │
         │              │  RAG → grounded guidance     │
         │              └──────────────┬───────────────┘
         │                             │
         ▼                             ▼
   Auth + Postgres              Vectors + text LLM
```

### Control loop

```text
Patient turn → Supervisor (one JSON action) → validate state → speak approved line
                     ↓ when ready
              Retrieve references → generate guidance → results
```

Voice model is the mouth. Supervisor is the brain. Guidance is grounded in retrieval, not free recall.

---

## Ideas that matter

- **Split voice and reasoning** — realtime for presence; structured LLM for decisions  
- **Explicit consult state** — complaint, facts, asked topics; validated in code, not chat memory  
- **Fail closed** — empty or broken runs end cleanly instead of looping nonsense  

---

Educational guidance only — not a diagnosis or substitute for professional care.
