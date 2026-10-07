# TKA SMA — Master Plan

## Product objective

Build a mobile-first TKA SMA preparation platform that continuously converts student activity into actionable learning guidance.

Core loop:

```
DIAGNOSTIC
    ↓
MASTERY PROFILE
    ↓
RECOMMENDATION
    ↓
PRACTICE
    ↓
ANSWER
    ↓
EXPLANATION
    ↓
MASTERY UPDATE
    ↓
MISTAKE REVIEW
    ↓
TRYOUT
    ↓
ANALYSIS
    ↓
NEW RECOMMENDATION
    └──────────────↺
```

No AI is used anywhere in this loop.

## First vertical slice

Build the platform end-to-end with **Mathematics** first.

This does not mean building a Math-specific app. The engine, database, CMS, renderer, mastery, recommendation, and tryout layers must be subject-agnostic.

Expansion order:

```
Platform Core
    ↓
Mathematics
    ↓
End-to-end validation
    ↓
Bahasa Indonesia
    ↓
Bahasa Inggris
```

## V1 capabilities

Student side:
- auth/profile
- onboarding
- Math diagnostic
- dashboard
- quick practice
- topic practice
- adaptive practice
- rich-content question rendering
- explanations
- mistake review
- mastery map
- progress
- mini/full tryout
- result analysis
- simple daily target/streak

Admin/content side:
- subject/topic/subtopic/skill taxonomy
- question CRUD
- rich block editor
- formula input
- image upload
- table/chart/graph configuration
- answer configuration
- explanation editor
- mobile preview
- draft → review → approved → published workflow
- role-based access

## Non-goals for V1

Do not build:
- AI tutor
- generative question creation
- vector search
- battle 1v1
- chat/social feed
- complex leaderboard
- parent dashboard
- teacher marketplace
- video-course system
- referral system
- native Android/iOS

## Core product assets

Long-term defensibility should come from:
1. correct TKA taxonomy,
2. high-quality question bank,
3. rich-content rendering,
4. excellent explanations,
5. deterministic mastery engine,
6. adaptive practice rules,
7. strong mobile UX.

## Content strategy

Use official TKA framework/examples as blueprint/reference, subject to their usage terms.

Primary bank:
- original internal questions,
- licensed partner content if later added.

Do not scrape/copy competitor banks.

## Autonomous delivery model

Most implementation work is intended to be executed autonomously by agents.

The owner should not be required to approve every task. Agents continue while:
- dependencies are satisfied,
- acceptance criteria pass,
- work stays inside locked scope,
- no human gate has been reached.

See `docs/HUMAN-GATES.md` for the authoritative stop/continue rules.

### Human gates

```
Phase 0 complete
   ↓
HG1 — Foundation approval
   ↓
Phases 1–4 complete
   ↓
HG2 — Taxonomy + Question Platform + CMS approval
   ↓
Phases 5–9 complete
   ↓
HG3 — Student Learning Loop approval
   ↓
Phases 10–11 complete
   ↓
HG4 — Math Beta / Public Release approval
   ↓
Public release and/or Phase 12 expansion
```

Human academic review remains required for production question publication even between these gates.

## Milestones

### M0 — Foundation
Production app shell, Next.js migration, tooling, environment validation.

**Human Gate HG1 follows this milestone.**

### M1 — Taxonomy + persistence
Math taxonomy, Neon schema, auth, roles, storage abstraction.

### M2 — Rich question platform
ContentBlock schema, renderer, CMS, and authoring workflow.

**Human Gate HG2 occurs after taxonomy, persistence prerequisites, renderer, and CMS are complete (Phases 1–4).**

### M3 — Learning loop
Practice, attempts, explanations, mastery, mistakes, adaptive recommendation.

### M4 — Student journey
Onboarding, diagnostic, dashboard, progress.

### M5 — Tryout
Persistent tryout sessions, autosave, scoring, skill analysis.

**Human Gate HG3 follows completion of the full student learning loop (through Phase 9).**

### M6 — Math beta
200–300 reviewed Math questions, full mobile QA, production hardening.

**Human Gate HG4 is required before public release.**

### M7 — Multi-subject expansion
Bahasa Indonesia, then Bahasa Inggris, reusing the same core engines.

## Definition of V1 success

A student can:

```
register/login
 → diagnostic
 → see Math mastery profile
 → receive recommended practice
 → answer rich-content questions
 → read reviewed explanations
 → see mastery change
 → review mistakes
 → receive adaptive practice
 → take Math tryout
 → inspect skill-level analysis
 → receive a new recommendation
```

If adding Bahasa Indonesia later mostly means adding taxonomy/content rather than rewriting engines, the architecture has succeeded.
