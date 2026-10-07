# Execution Backlog

This is the ordered implementation backlog.

Agents should pick the **first uncompleted task whose dependencies are satisfied**. Do not skip ahead unless explicitly instructed.

Status convention:
- [ ] not started
- [~] in progress
- [x] complete
- [!] blocked

## Autonomous execution metadata

Unless explicitly overridden, every task uses:

```
AUTO_CONTINUE = yes
HUMAN_GATE = no
STOP_CONDITION = task acceptance criteria fail, unresolved dependency, security/content risk, or scope-changing decision
NEXT = first uncompleted task whose dependencies are satisfied
```

Therefore an agent should **not stop after every task**. It should continue through eligible work until reaching one of the human gates below.

Authoritative gate details: `docs/HUMAN-GATES.md`.

Human gates:
- **HG1:** after Phase 0.
- **HG2:** after Phases 1–4.
- **HG3:** after Phases 5–9.
- **HG4:** after Phases 10–11, before public release.

Academic publication approval is handled continuously through the CMS reviewer workflow and is separate from these owner gates.

---

# Phase 0 — Foundation and Vite → Next.js Migration

## P0.1 Baseline and migration inventory
Dependency: none

Goal:
Document what from the Vite prototype must be preserved.

Tasks:
- [x] list existing screens/components/data flows
- [x] identify UX behaviors worth preserving
- [x] identify prototype-only code to retire
- [x] record current build/lint behavior

Acceptance:
- short migration note committed under `docs/decisions/`
- no production code changed yet

## P0.2 Create Next.js shell
Dependency: P0.1

Goal:
Replace Vite bootstrap with a minimal Next.js App Router shell.

Tasks:
- [ ] install/configure Next.js
- [ ] establish `src/app`
- [ ] preserve TypeScript strictness
- [ ] preserve Tailwind styling capability
- [ ] remove Vite-only bootstrap/config only after Next build works

Acceptance:
- dev server works
- production build works
- no secret/client issue

## P0.3 Port global visual foundation
Dependency: P0.2

Tasks:
- [ ] global styles
- [ ] light/dark theme behavior
- [ ] mobile width/layout primitives
- [ ] typography
- [ ] basic icons

Acceptance:
- visual foundation matches or improves prototype
- 320px mobile width usable

## P0.4 Port prototype home shell
Dependency: P0.3

Tasks:
- [ ] home page shell
- [ ] navigation structure
- [ ] retain only useful UX patterns
- [ ] no static learning logic hardcoded into final architecture

Acceptance:
- home renders in Next.js
- responsive on mobile

## P0.5 Establish project folders
Dependency: P0.2

Create:
- [ ] `src/components`
- [ ] `src/features`
- [ ] `src/domain`
- [ ] `src/server`
- [ ] `tests`

Acceptance:
- documented boundaries respected

## P0.6 Tooling gates
Dependency: P0.2

Tasks:
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test` baseline
- [ ] `npm run build`

Acceptance:
all commands pass.

## P0.7 Vercel verification
Dependency: P0.2, P0.6

Tasks:
- [ ] preview deploy succeeds
- [ ] production config remains valid
- [ ] no Blob/DB secret exposed client-side

Acceptance:
Vercel preview healthy.

Phase 0 exit gate:
- Next.js replaces Vite on canonical branch
- archived Vite prototype remains available
- build/lint/typecheck/tests pass

## HG1 — STOP: Foundation approval required

```
AUTO_CONTINUE = no
HUMAN_GATE = yes
STOP_CONDITION = Phase 0 exit gate passes
NEXT_AFTER_APPROVAL = Phase 1 and dependency-eligible Phase 2 work
```

The orchestrator must report migration/build/deploy evidence and request owner approval before proceeding beyond HG1.

---

# Phase 1 — Official Math Taxonomy

## P1.1 Collect official TKA Math references
Dependency: P0 complete

Tasks:
- [ ] record official URLs/docs and publication/update dates
- [ ] identify tested competency structure
- [ ] note official question forms

Acceptance:
references documented with provenance.

## P1.2 Draft Math topics
Dependency: P1.1

Acceptance:
topic list maps to official framework.

## P1.3 Draft Math subtopics
Dependency: P1.2

## P1.4 Draft Math skills
Dependency: P1.3

Each skill needs:
- stable code
- name
- description
- competency
- parent subtopic

## P1.5 Review taxonomy gaps/overlap
Dependency: P1.4

Acceptance:
no obvious duplicate skills; coverage traceable to framework.

## P1.6 Freeze taxonomy v1
Dependency: P1.5

Acceptance:
`docs/TKA-MATH-TAXONOMY.md` becomes implementation source.

---

# Phase 2 — Persistence, Auth, Roles, Storage

## P2.1 Configure Neon connection
Dependency: P0 complete

Acceptance:
server-only connection verified.

## P2.2 Configure Drizzle
Dependency: P2.1

Acceptance:
migration generate/apply workflow documented.

## P2.3 Create taxonomy tables
Dependency: P2.2, P1.6

Tables:
- [ ] subjects
- [ ] topics
- [ ] subtopics
- [ ] skills

## P2.4 Seed Math taxonomy
Dependency: P2.3

Acceptance:
repeatable idempotent seed.

## P2.5 Create question/content tables
Dependency: P2.2

Tables:
- [ ] stimuli
- [ ] questions
- [ ] question_options
- [ ] question_skills
- [ ] media_assets

## P2.6 Create learning tables
Dependency: P2.2

Tables:
- [ ] practice_sessions
- [ ] question_attempts
- [ ] skill_mastery
- [ ] mistake_queue

## P2.7 Create tryout tables
Dependency: P2.2

Tables:
- [ ] tryout_templates
- [ ] tryout_sessions
- [ ] tryout_answers

## P2.8 Select/authenticate users
Dependency: P0 complete

Goal:
choose the simplest robust server-compatible auth approach.

Acceptance:
decision documented before implementation.

## P2.9 Implement authentication
Dependency: P2.8

Acceptance:
session survives refresh and protects private routes.

## P2.10 Add role model
Dependency: P2.9

Roles:
- student
- editor
- reviewer
- admin

## P2.11 Implement StorageService interface
Dependency: P0 complete

## P2.12 Implement VercelBlobStorage
Dependency: P2.11

Acceptance:
authenticated server-side upload and delete.

## P2.13 Media validation
Dependency: P2.12

Tasks:
- [ ] MIME allowlist
- [ ] size limits
- [ ] dimensions/metadata where applicable
- [ ] alt text required at content layer

Phase 2 exit:
secure persistence, auth/roles, storage foundation ready.

---

# Phase 3 — Rich Question Domain and Renderer

## P3.1 Define ContentBlock TypeScript model
Dependency: P0 complete

Types:
- text
- math
- image
- table
- chart
- function_graph

## P3.2 Add Zod validation for blocks
Dependency: P3.1

## P3.3 Text renderer
Dependency: P3.1

## P3.4 Math/LaTeX renderer
Dependency: P3.1

Acceptance:
long formulas do not break mobile layout.

## P3.5 Image renderer
Dependency: P3.1

Acceptance:
responsive, alt text, lazy-loading.

## P3.6 Table renderer
Dependency: P3.1

Acceptance:
horizontal overflow handled on small screens.

## P3.7 Chart renderer
Dependency: P3.1

## P3.8 Function graph renderer
Dependency: P3.1

## P3.9 Option renderer
Dependency: P3.3–P3.8 as needed

Must support content blocks, not text only.

## P3.10 Explanation renderer
Dependency: P3.3–P3.8

## P3.11 Shared QuestionRenderer composition
Dependency: P3.3–P3.10

Acceptance:
usable by practice, tryout, review, CMS preview.

## P3.12 Invalid-block fallback
Dependency: P3.11

Acceptance:
bad content fails visibly/safely without crashing entire session.

## P3.13 Mobile renderer QA
Dependency: P3.11

Widths:
- 320
- 360
- 390
- tablet sanity check

---

# Phase 4 — CMS V1

## P4.1 Admin route shell
Dependency: P2.10

## P4.2 Admin authorization guard
Dependency: P4.1

## P4.3 Question list
Dependency: P2.5

## P4.4 Question filters/search
Dependency: P4.3

## P4.5 Question metadata editor
Dependency: P4.3

Fields:
taxonomy, type, difficulty, estimated time, source.

## P4.6 Text block editor
Dependency: P3.1

## P4.7 Math block editor
Dependency: P3.4

## P4.8 Image upload/editor
Dependency: P2.12, P3.5

## P4.9 Table editor
Dependency: P3.6

## P4.10 Chart editor
Dependency: P3.7

## P4.11 Function graph editor
Dependency: P3.8

## P4.12 Options editor
Dependency: P3.9

## P4.13 Correct-answer validation
Dependency: P4.12

## P4.14 Explanation editor
Dependency: P3.10

## P4.15 CMS preview
Dependency: P3.11

Must use same renderer as student app.

## P4.16 Workflow states
Dependency: P4.5

- draft
- in_review
- approved
- published
- archived

## P4.17 Reviewer approval rules
Dependency: P4.16, P2.10

## P4.18 Publish quality gate
Dependency: P4.13, P4.14, P4.17

Acceptance:
incomplete question cannot publish.

## HG2 — STOP: Taxonomy + Question Platform + CMS approval required

```
AUTO_CONTINUE = no
HUMAN_GATE = yes
STOP_CONDITION = Phases 1–4 are complete and their acceptance criteria pass
NEXT_AFTER_APPROVAL = Phase 5, then Phase 6+
```

Owner reviews taxonomy structure, rich question UX, CMS authoring flow, and content workflow. Math taxonomy/content must also have human academic review before being treated as final.

---

# Phase 5 — Initial Math Content

## P5.1 Create first 10 text/math questions
Dependency: P1.6, P4 complete

## P5.2 Add 5 table/chart questions
Dependency: P5.1

## P5.3 Add 5 function-graph questions
Dependency: P5.1

## P5.4 Add 5 image/diagram questions
Dependency: P5.1

## P5.5 Add multiple-choice-complex examples
Dependency: P5.1

## P5.6 Reach 30–50 reviewed questions
Dependency: P5.1–P5.5

Acceptance:
all renderer types exercised, taxonomy/difficulty coverage documented.

---

# Phase 6 — Practice Engine

## P6.1 Create practice session service
Dependency: P2.6, P5.6

## P6.2 Safe question payload API
Dependency: P6.1

Acceptance:
correct answer omitted from active payload.

## P6.3 Answer submission endpoint/action
Dependency: P6.2

## P6.4 Server-side answer validation
Dependency: P6.3

## P6.5 Persist question attempt
Dependency: P6.4

## P6.6 Show explanation after answer
Dependency: P6.4, P3.10

## P6.7 Quick Practice selector
Dependency: P6.1

## P6.8 Topic Practice selector
Dependency: P6.1

## P6.9 Session progress UI
Dependency: P6.2

## P6.10 Session result UI
Dependency: P6.5

## P6.11 Resume/interruption handling
Dependency: P6.1

## P6.12 End-to-end practice test
Dependency: P6.1–P6.11

Acceptance:
start → answer → persist → explanation → result works.

---

# Phase 7 — Mastery, Mistakes, Adaptive Practice

## P7.1 Implement mastery pure function
Dependency: P6.5

## P7.2 Mastery unit tests
Dependency: P7.1

Include low evidence, easy/medium/hard, recency.

## P7.3 Persist skill mastery
Dependency: P7.1

## P7.4 Implement mistake upsert
Dependency: P6.5

## P7.5 Implement mistake states
Dependency: P7.4

## P7.6 Implement mistake resolution rules
Dependency: P7.5

## P7.7 Recommendation ranking pure function
Dependency: P7.3, P7.6

## P7.8 Adaptive allocation selector
Dependency: P7.7

## P7.9 Duplicate/recent-question avoidance
Dependency: P7.8

## P7.10 Mistake Review mode
Dependency: P7.6, P6 core

## P7.11 Adaptive Practice mode
Dependency: P7.8, P6 core

## P7.12 End-to-end learning-loop test
Dependency: P7.1–P7.11

Scenario:
repeated skill failure → mastery decreases → priority rises → practice targets skill → improvement raises mastery.

---

# Phase 8 — Onboarding, Diagnostic, Dashboard, Progress

## P8.1 Student onboarding profile
Dependency: P2.9

## P8.2 Diagnostic template
Dependency: P1.6, P5 content

## P8.3 Diagnostic session execution
Dependency: P6 core, P8.2

## P8.4 Initialize mastery from diagnostic
Dependency: P7.3, P8.3

## P8.5 Diagnostic result page
Dependency: P8.4

## P8.6 Dashboard data service
Dependency: P7.7

## P8.7 Dashboard UI
Dependency: P8.6

Order:
daily target → continue → priority skill → recommended practice → recent progress.

## P8.8 Progress/mastery map
Dependency: P7.3

## P8.9 Recent activity summary
Dependency: P6.5

## P8.10 Simple daily target
Dependency: P6.5

## P8.11 Simple streak
Dependency: P6.5

---

# Phase 9 — Tryout

## P9.1 Tryout template model/service
Dependency: P2.7

## P9.2 Build locked question set
Dependency: P9.1, sufficient content

## P9.3 Persistent tryout session
Dependency: P9.2

## P9.4 Timer/countdown
Dependency: P9.3

## P9.5 Question navigation
Dependency: P9.3

## P9.6 Flagging
Dependency: P9.3

## P9.7 Answer autosave
Dependency: P9.3

## P9.8 Submit/finalize
Dependency: P9.7

## P9.9 Server scoring
Dependency: P9.8

Use raw practice metrics; do not claim official IRT unless justified.

## P9.10 Skill analysis
Dependency: P9.9

## P9.11 Wrong-answer review
Dependency: P9.9, P3.11

## P9.12 Tryout → mastery update policy
Dependency: P7.1, P9.9

Document/test how tryout evidence contributes.

## HG3 — STOP: Student learning-loop approval required

```
AUTO_CONTINUE = no
HUMAN_GATE = yes
STOP_CONDITION = Phases 5–9 complete and end-to-end learning loop passes
NEXT_AFTER_APPROVAL = Phase 10 and Phase 11
```

The owner should be able to test the complete flow from onboarding/diagnostic through adaptive practice and tryout analysis before approval.

---

# Phase 10 — Production Hardening

Small tasks:
- [ ] P10.1 authorization audit
- [ ] P10.2 secret exposure audit
- [ ] P10.3 content/XSS validation audit
- [ ] P10.4 upload abuse/rate-limit controls
- [ ] P10.5 DB indexes/query review
- [ ] P10.6 error boundaries
- [ ] P10.7 loading states
- [ ] P10.8 empty states
- [ ] P10.9 404/500 behavior
- [ ] P10.10 accessibility pass
- [ ] P10.11 mobile device QA
- [ ] P10.12 performance pass
- [ ] P10.13 analytics event plan
- [ ] P10.14 migration/backup recovery check

---

# Phase 11 — Math Beta Content

## P11.1 Reach 100 reviewed questions
Dependency: CMS stable

## P11.2 Coverage audit at 100
Dependency: P11.1

## P11.3 Reach 200 reviewed questions
Dependency: P11.2

## P11.4 Coverage/difficulty rebalance
Dependency: P11.3

## P11.5 Reach 200–300 beta target
Dependency: P11.4

Exit gate:
- content reviewed
- taxonomy coverage acceptable
- diagnostic/practice/mastery/mistake/adaptive/tryout all stable
- mobile UX passes QA
- production-hardening checks from Phase 10 have no unresolved release blocker

## HG4 — STOP: Math Beta / public release approval required

```
AUTO_CONTINUE = no
HUMAN_GATE = yes
STOP_CONDITION = Phase 10–11 release criteria pass
NEXT_AFTER_APPROVAL = public release and/or Phase 12 subject expansion
```

No agent may declare public release or bypass this gate.

---

# Phase 12 — Bahasa Indonesia, then Bahasa Inggris

Phase entry requires HG4 approval.

```
AUTO_CONTINUE = yes
HUMAN_GATE = no by default
STOP_CONDITION = a new locked product decision or content/release gate is required
```

For each subject:
1. official taxonomy research
2. taxonomy seed
3. 30–50 representative rich questions
4. identify genuinely missing renderer capability
5. add content, not new engines
6. validate full learning loop
7. expand bank

Architecture success criterion:
adding a subject is primarily taxonomy/content work, not a platform rewrite.
