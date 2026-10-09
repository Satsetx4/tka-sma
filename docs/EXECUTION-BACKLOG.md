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
- [x] install/configure Next.js
- [x] establish `src/app`
- [x] preserve TypeScript strictness
- [x] preserve Tailwind styling capability
- [ ] remove Vite-only bootstrap/config only after Next build works

Acceptance:
- dev server works
- production build works
- no secret/client issue

QA (orchestrator, 2026-10-07): dev HTTP 200, build:next exit 0, build:vite exit 0 (identical output), typecheck/test/lint green, no secret, Vite kept until P0.7. Fix: agentRules false (stop next dev injecting AGENTS.md); Turbopack panic fixed via clean .next.

## P0.3 Port global visual foundation
Dependency: P0.2

Tasks:
- [x] global styles
- [x] light/dark theme behavior
- [x] mobile width/layout primitives
- [x] typography
- [x] basic icons

Acceptance:
- visual foundation matches or improves prototype
- 320px mobile width usable

QA (orchestrator, 2026-10-07): token Vite diport 1:1 (font display, dark variant, scrollbar, reduced-motion); anti-FOUC default dark key tka-sma:theme:v1; 167 selektor .dark di bundle; light mode verified via screenshot (teks terbaca, nol defect). Fix QA: theme-provider lazy initializer (warning set-state-in-effect hilang).

## P0.4 Port prototype home shell
Dependency: P0.3

Tasks:
- [x] home page shell
- [x] navigation structure
- [x] retain only useful UX patterns
- [x] no static learning logic hardcoded into final architecture

Acceptance:
- home renders in Next.js
- responsive on mobile

QA (orchestrator, 2026-10-07): parity penuh (hero + nama + 2 kartu mode + strip mapel + statistik + bedah + grade); 320px + 390px tanpa overflow, console NIHIL; screenshot dark + light dicek manual; page TIDAK impor QUESTIONS/kunci; tombol ujian disabled "Segera hadir" (Fase 6). UTANG TERCATAT: page masih impor store/scoreOf/gradeOf/SUBJECTS dari Vite (tampilan saja) — wajib dilepas di P1-P2.

## P0.5 Establish project folders
Dependency: P0.2

Create:
- [x] `src/components`
- [x] `src/features`
- [x] `src/domain`
- [x] `src/server`
- [x] `tests`

Acceptance:
- documented boundaries respected

QA (orchestrator, 2026-10-07): 5 READMEs in Indonesian, boundaries per ARCHITECTURE.md.

## P0.6 Tooling gates
Dependency: P0.2

Tasks:
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run test` baseline
- [x] `npm run build`

Acceptance:
all commands pass.

QA (orchestrator, 2026-10-07): lint exit 0 (2 non-blocking warnings), typecheck exit 0, test pass 1 (node:test smoke), build:next + build:vite exit 0.

## P0.7 Vercel verification
Dependency: P0.2, P0.6

Tasks:
- [x] preview deploy succeeds
- [x] production config remains valid
- [x] no Blob/DB secret exposed client-side

Acceptance:
Vercel preview healthy.

QA (orchestrator, 2026-10-07): preview + production sempat failure — bukan salah kode (build Next.js sukses di log) melainkan setting dashboard warisan Vite (framework: vite, outputDirectory: dist). Diperbaiki via PATCH /v9/projects/tka-sma (framework: nextjs, build/output: null) memakai CLI login tvtclard-9052 yang di-approve owner via device flow. Redeploy (commit 4e88fc9) success; live tka-sma-umber.vercel.app 200 berisi Home Next.js (title + "Cockpit Ujian Presisi"). No-secret: nol env/secret di repo maupun config. Phase 0 exit gate terpenuhi — NEXT: HG1 approval.

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

**HG1 APPROVED by owner 2026-10-08 (chat: "ACC").** Proceeding to Phase 1 and dependency-eligible Phase 2 work on branch `feat/p1-p2-kickoff`.

---

# Phase 1 — Official Math Taxonomy

## P1.1 Collect official TKA Math references
Dependency: P0 complete

Tasks:
- [x] record official URLs/docs and publication/update dates
- [x] identify tested competency structure
- [x] note official question forms

Acceptance:
references documented with provenance.

QA (orchestrator, 2026-10-08): R1 Perkaban BSKAP 045/H/AN/2025 (14 Jul 2025, dibaca via salinan bintangpelajar — WAJIB verifikasi ke pusmendik sebelum freeze) + R2 matriks Pusmendik + R2 sekunder. 5 elemen, 3 level kognitif L1-L3, 3 bentuk soal objektif. Nol soal disalin.

## P1.2 Draft Math topics
Dependency: P1.1

Acceptance:
topic list maps to official framework.

QA: [x] 5 topics 1:1 elemen resmi (MATH.BIL/ALG/GEO/TRG/DAT), status draft.

## P1.3 Draft Math subtopics
Dependency: P1.2

QA: [x] 10 subtopics 1:1 sub-elemen resmi + batasan R1 dicatat.

## P1.4 Draft Math skills
Dependency: P1.3

QA: [x] 32 skills (code stabil + name + description + competency + parent + rentang L1-L3).

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

QA: [x] tabel traceability 10/10 penuh + 9 keputusan deduplikasi. P1.6 freeze DITAHAN — butuh review akademik manusia (§7 file taksonomi).

## P1.6 Freeze taxonomy v1
Dependency: P1.5

Acceptance:
`docs/TKA-MATH-TAXONOMY.md` becomes implementation source.

QA (orchestrator, 2026-10-08): [x] FROZEN v1 atas PASS akademik owner (chat). Isi TIDAK diubah selain header status (diff diverifikasi: hanya 6 baris header).

---

# Phase 2 — Persistence, Auth, Roles, Storage

## P2.1 Configure Neon connection
Dependency: P0 complete

Acceptance:
server-only connection verified.

QA (orchestrator, 2026-10-08): [x] client server-only berlapis (server-only + window guard) + checkConnection (SELECT 1). UPDATE 2026-10-09: TERUJI-live — `SELECT 1 → ok: 1` ke Neon `neon-rose-ladder` (integration `vercel integration add neon` + `env pull` setelah owner approve terms). Blocker kredensial DICABUT.
## P2.2 Configure Drizzle
Dependency: P2.1

Acceptance:
migration generate/apply workflow documented.

QA: [x] drizzle-orm 0.45.3 + serverless 1.2.0 + kit 0.31.11; drizzle.config.ts; scripts db:generate/migrate/studio; schema SENGAJA KOSONG (tabel di P2.3+).

## P2.3 Create taxonomy tables
Dependency: P2.2, P1.6

Tables:
- [x] subjects
- [x] topics
- [x] subtopics
- [x] skills

QA (orchestrator, 2026-10-08): [x] + enum taxonomy_status + FK cascade + registry; migrasi drizzle/0002_taxonomy.sql generated (4 CREATE TABLE). FK balik P2.5/P2.6 sengaja pending (terdokumentasi).

## P2.4 Seed Math taxonomy
Dependency: P2.3

Acceptance:
repeatable idempotent seed.

QA: [x] 1/5/10/32 persis FROZEN (verifikasi regex independen: 32/32 skills, 10/10 subtopics, 5/5 topics MATCH). Upsert-by-code idempoten. UPDATE 2026-10-09: TERUJI-live — `db:migrate` sukses + seed live OK 1/5/10/32 + `SELECT COUNT(*)` terverifikasi di Neon (subjects 1, topics 5, subtopics 10, skills 32; MATH active).

## P2.5 Create question/content tables
Dependency: P2.2

Tables:
- [x] stimuli
- [x] questions
- [x] question_options
- [x] question_skills
- [x] media_assets

QA (orchestrator, 2026-10-08): [x] field persis DATABASE.md; migrasi drizzle/0000_cool_hiroim.sql generated (12 CREATE TABLE). UPDATE 2026-10-09: APPLIED-live — 0000+0001+0002 applied ke Neon `neon-rose-ladder` ("migrations applied successfully!"). FK antar-tabel-ada saja; subject/skill/user FK menyusul P2.3/P2.9.

## P2.6 Create learning tables
Dependency: P2.2

Tables:
- [x] practice_sessions
- [x] question_attempts
- [x] skill_mastery
- [x] mistake_queue

QA: [x] lihat catatan P2.5 di atas.

## P2.7 Create tryout tables
Dependency: P2.2

Tables:
- [x] tryout_templates
- [x] tryout_sessions
- [x] tryout_answers

QA: [x] kolom P2.7 + enum media/tryout_status asumsi V1 (DATABASE.md tak merinci) — konfirmasi sebelum apply migrasi.

## P2.8 Select/authenticate users
Dependency: P0 complete

Goal:
choose the simplest robust server-compatible auth approach.

Acceptance:
decision documented before implementation.

QA: [x] KEPUTUSAN: Better Auth + sesi DB di Neon via adapter Drizzle (docs/decisions/P2-auth-decision.md). Auth.js v5/kustom/SaaS ditolak beralasan. Implementasi di P2.9/P2.10.

## P2.9 Implement authentication
Dependency: P2.8

Acceptance:
session survives refresh and protects private routes.

QA (orchestrator, 2026-10-08): [x] Better Auth 1.7.7 server-only (email+password, sesi DB 7 hari + sliding 1 hari, cookie tka-sma, plugin admin+nextCookies; singleton malas agar build hijau tanpa env) + /api/auth/[...all] (503 JSON rapi tanpa env) + middleware (admin→307 /login?next, api/cms→401 JSON; edge-safe cek cookie) + login (server action, pesan generik, anti open-redirect) + unauthorized 403. LIVE: API 401 pesan login (bukan 503), admin→login 200 form email+kata sandi. UPDATE 2026-10-09: TERUJI-live — sign-in live 200 role admin, cookie sesi terpasang, baris sessions di Neon bertambah (DB-backed), CMS dengan sesi 200 `{questions:[]}`, /admin dengan sesi 200, tanpa sesi tetap 401/307 (fail-closed).

## P2.10 Add role model
Dependency: P2.9

Roles:
- student
- editor
- reviewer
- admin

QA: [x] kolom role + roles.ts murni (BelumLogin 401/PeranDitolak 403, normalkanSesi, putuskanAkses) + guard.ts kontrak-taat-CMS (getSession fail-closed null/requireRole/requireLogin) + adapter CMS jadi re-export statis + alias @ (tsconfig.app; adapter pakai path relatif karena Turbopack abaikan paths tsconfig.app) + seed admin env-driven idempoten (ADMIN_EMAIL/PASSWORD min-8/NAME; nol hardcode). 11 test auth, total 51/51 pass.

## P2.11 Implement StorageService interface
Dependency: P0 complete

QA: [x] interface upload/delete/getUrl/validate + kontrak (MIME allowlist, 5MB, alt-text min 10) di src/server/storage/ — tanpa SDK Blob (implementasi di P2.12).

## P2.12 Implement VercelBlobStorage
Dependency: P2.11

Acceptance:
authenticated server-side upload and delete.

QA: [x] kode + 9 unit test validate lolos. UPDATE 2026-10-09: TERUJI-live — round-trip PUT png 1px → URL publik GET 200 → DEL → GET 404 (token BLOB_READ_WRITE_TOKEN dari env pull).

## P2.13 Media validation
Dependency: P2.12

Tasks:
- [x] MIME allowlist
- [x] size limits
- [x] dimensions/metadata where applicable
- [x] alt text required at content layer

QA: [x] kontrak di storage.ts (png/jpeg/webp/svg, 5MB, alt min 10) + validateUploadInput.

Phase 2 exit:
secure persistence, auth/roles, storage foundation ready.

---

# Phase 3 — Rich Question Domain and Renderer

## P3.1 Define ContentBlock TypeScript model
Dependency: P0 complete

QA: [x] 6 tipe (text/math/image/table/chart/function_graph) + opsi + explanation di src/domain/question/ (domain murni, tanpa I/O).

Types:
- text
- math
- image
- table
- chart
- function_graph

## P3.2 Add Zod validation for blocks
Dependency: P3.1

QA: [x] Zod v4 schemas + validator publish-gate + 15 test (valid + malformed ditolak), 16/16 pass.

## P3.3 Text renderer
Dependency: P3.1

QA: [x] TextBlock + halaman demo /preview-soal.

## P3.4 Math/LaTeX renderer
Dependency: P3.1

Acceptance:
long formulas do not break mobile layout.

QA: [x] KaTeX 0.19.0 (tipe bawaan, MathJax ditolak karena berat); rumus panjang scroll dalam blok (overflow-x-auto); LaTeX rusak → pesan aman, tidak throw.

## P3.5 Image renderer
Dependency: P3.1

Acceptance:
responsive, alt text, lazy-loading.

QA: [x] responsive + lazy + alt wajib dari blok (terverifikasi visual 320px).

## P3.6 Table renderer
Dependency: P3.1

Acceptance:
horizontal overflow handled on small screens.

QA: [x] wrapper overflow-x-auto; tabel 482px scroll dalam blok 284px di 320px, dokumen tetap 320 (bukan defect — desain).

## P3.7 Chart renderer
Dependency: P3.1

QA: [x] custom SVG (bar/line/pie/scatter via chart-scale; recharts ditolak — custom cukup).

## P3.8 Function graph renderer
Dependency: P3.1

QA: [x] custom SVG via function-eval (parser ekspresi sendiri).

## P3.9 Option renderer
Dependency: P3.3–P3.8 as needed

Must support content blocks, not text only.

QA: [x] OptionBlock dukung blocks + status benar/salah via props.

## P3.10 Explanation renderer
Dependency: P3.3–P3.8

QA: [x] ExplanationBlock (tampil di mode review).

## P3.11 Shared QuestionRenderer composition
Dependency: P3.3–P3.10

Acceptance:
usable by practice, tryout, review, CMS preview.

QA: [x] SATU QuestionRenderer (props: blocks/options/explanation/mode/onSelect/selectedIndex); validasi via block-guard; build route /preview-soal prerender OK.

## P3.12 Invalid-block fallback
Dependency: P3.11

Acceptance:
bad content fails visibly/safely without crashing entire session.

QA: [x] 3 fallback terbukti di DOM (tipe video tak dikenal, math tanpa latex, opsi rusak) + pageerror NIHIL.

## P3.13 Mobile renderer QA
Dependency: P3.11

Widths:
- 320
- 360
- 390
- tablet sanity check

QA: [x] 320/360/390/768: scrollWidth = viewport (nol overflow), console + page error NIHIL; screenshot dark 320 + 768 dicek manual.

---

# Phase 4 — CMS V1

QA BATCH (orchestrator, 2026-10-08): P4.1–P4.18 SELESAI + LULUS QA (40/40 test, build hijau 8 route CMS, API tanpa guard → 503 eksplisit BUKAN fail-open — diverifikasi live). Guard auth (`@/server/auth/guard`) BELUM mendarat (agen auth gagal tanpa summary; deps better-auth 1.7.7 sudah terinstall) — CMS terkunci aman sampai redelegasi auth selesai.

## P4.1 Admin route shell
Dependency: P2.10

QA: [x] /admin layout + dashboard + /baru + /[id]; tanpa guard → halaman penjelasan (bukan fail-open).

## P4.2 Admin authorization guard
Dependency: P4.1

QA: [x] guard-adapter (dynamic import tak-teranalisis-bundler) + _auth.ts (401/403/503) — kontrak PATH @/server/auth/guard menunggu agen auth.

## P4.3 Question list
Dependency: P2.5

QA: [x] + P4.4 filter/search (status/subject/topic/difficulty/tipe/teks).

## P4.4 Question filters/search
Dependency: P4.3

QA: [x] lihat P4.3.

## P4.5 Question metadata editor
Dependency: P4.3

QA: [x] MetadataEditor (taxonomy/type/difficulty/time/source).

Fields:
taxonomy, type, difficulty, estimated time, source.

## P4.6 Text block editor
Dependency: P3.1

QA: [x] + P4.7–P4.14 semua editor blok (text/math/image-upload/table/chart/graph/options+correct-answer/explanation) di src/features/cms/.

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

QA: [x] preview pakai QuestionRenderer yang SAMA (tanpa renderer kedua).

## P4.16 Workflow states
Dependency: P4.5

QA: [x] 5 status + tombol transisi legal/ilegal (test).

- draft
- in_review
- approved
- published
- archived

## P4.17 Reviewer approval rules
Dependency: P4.16, P2.10

QA: [x] hanya reviewer/admin boleh approve+publish; editor 403; penulis tak boleh approve sendiri (kecuali admin darurat tercatat).

## P4.18 Publish quality gate
Dependency: P4.13, P4.14, P4.17

Acceptance:
incomplete question cannot publish.

QA: [x] gagal → 422 + missing[]; validasi akademik manusia tetap di luar sistem.

## HG2 — APPROVED oleh owner 2026-10-09 ("APPROVE HG2")

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
