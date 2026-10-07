# AGENTS.md — TKA SMA

This file is the entry point for every coding/research agent working in this repository.

## Mission

Build a mobile-first TKA SMA learning platform whose core loop is:

Diagnostic → Mastery Profile → Recommendation → Practice → Explanation → Mastery Update → Mistake Review → Tryout → Analysis → New Recommendation.

The product is intentionally **non-AI**. Do not add OpenAI, Gemini, Claude, LLMs, embeddings, vector databases, AI tutoring, or AI-generated questions.

## Read order before doing work

1. `docs/CURRENT-STATE.md`
2. `docs/MASTER-PLAN.md`
3. `docs/ARCHITECTURE.md`
4. `docs/EXECUTION-BACKLOG.md`
5. Then the domain document relevant to your task:
   - `docs/QUESTION-SCHEMA.md`
   - `docs/DATABASE.md`
   - `docs/MASTERY.md`
   - `docs/CONTENT-POLICY.md`

## Locked product decisions

- TKA SMA.
- Mobile-first web/PWA.
- Mathematics is the first end-to-end vertical slice.
- Architecture must remain multi-subject; never hardcode Math into core engines.
- Next subjects: Bahasa Indonesia, then Bahasa Inggris.
- No AI.
- Neon PostgreSQL is the database.
- Vercel is deployment/server platform.
- Vercel Blob is media storage.
- Rich-content questions are required.
- Content should be original/internal or properly licensed, informed by official TKA framework.
- Mastery and recommendations are deterministic/rule-based.
- CMS is a first-class V1 capability.

## Current branch conventions

- Canonical branch: `master`.
- Archived Vite prototype: `archive/vite-prototype-2026-10-07`.
- Use small feature branches and small PRs.
- One PR should solve one concern.

Examples:
- `feat/p0-next-shell`
- `feat/p2-db-taxonomy`
- `feat/p3-math-renderer`
- `feat/p4-cms-image-upload`

Avoid mega-PRs such as `build-entire-app`.

## Autonomous execution and human gates

Default behavior is **continue autonomously**.

Read `docs/HUMAN-GATES.md` before starting work.

Unless a task explicitly overrides these values:

```
AUTO_CONTINUE = yes
HUMAN_GATE = no
STOP_CONDITION = acceptance failure, unresolved dependency, risk requiring human judgment, or a defined human gate
NEXT = first uncompleted task whose dependencies are satisfied
```

Do not ask the owner for confirmation after routine small tasks. Continue until a defined human gate or a genuine blocker is reached.

The four mandatory owner gates are:

1. **HG1** — after Phase 0: foundation/migration approval.
2. **HG2** — after Phases 1–4: Math taxonomy + question platform + CMS approval.
3. **HG3** — after Phases 5–9: complete student learning-loop approval.
4. **HG4** — after Phases 10–11: Math Beta/public-release approval.

At a gate, stop further gated work, summarize evidence, and request the specific approval. Do not bypass a gate.

Academic question publication still requires human reviewer approval as defined in `docs/CONTENT-POLICY.md`.

## Work discipline

Before coding:
- Identify the exact task ID from `docs/EXECUTION-BACKLOG.md`.
- Confirm dependencies are complete.
- Do not silently expand scope.
- Check whether the current task/phase is approaching a human gate.
- When no gate/blocker exists, continue to the next eligible task without asking permission.

Every completed task must include:
- implementation,
- tests where appropriate,
- lint/typecheck/build passing,
- error/loading/empty states where relevant,
- documentation updates if behavior or architecture changed.

## Forbidden without explicit owner decision

- AI features or AI APIs.
- Scraping/copying competitor question banks.
- Exposing database/storage secrets to the browser.
- Sending correct answers in active exam payloads.
- Arbitrary HTML from CMS content.
- New heavyweight dependencies without architectural need.
- Replacing the mastery algorithm without documenting the decision.
- Hardcoding Math-only database or engine concepts.
- Building social/battle/chat features before core V1 is complete.

## Source of truth

Repository documentation is the source of truth. If chat history, agent memory, or assumptions conflict with current repo docs, the latest approved repo docs win.
