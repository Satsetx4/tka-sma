# P2 — Seed Taksonomi Math v1 (P2.3 tabel + P2.4 seed)

Status implementasi: **TERUJI-live 2026-10-09** — typecheck/lint/test/build +
`db:generate` exit 0, migrasi applied ke Neon `neon-rose-ladder`, seed live
terverifikasi `SELECT COUNT(*)` → 1/5/10/32 (status lama TERUJI-offline/
BELUM-live resmi dicabut).
Branch: `feat/p16-freeze-p23-seed`. Sumber isi: `docs/TKA-MATH-TAXONOMY.md`
v1 (FROZEN — jangan ubah file itu; seed adalah turunan terverifikasi).

## 1. Yang dibangun

| Lapisan | Objek | Jumlah |
|---|---|---|
| `subjects` | `MATH` (Matematika, active) | 1 |
| `topics` | `MATH.BIL/ALG/GEO/TRG/DAT` (draft) | 5 |
| `subtopics` | `REAL, LIN, FUNC, SEQ, OBJ, TRANS, MEAS, RATIO, DATA, PROB` (draft) | 10 |
| `skills` | 32 skill FROZEN §4, competency + rentang `[Lx–Ly]` (draft) | 32 |

Keputusan status: subject Matematika `active` (slice vertikal pertama,
`docs/DATABASE.md`), topics/subtopics/skills `draft` (ikut file FROZEN
§2–§4, yang masih `draft` semua menunggu review akademik).

## 2. File

- `src/server/db/schema.ts` — TAMBAH: `taxonomyStatusEnum`
  (`draft|active|archived`) + tabel `subjects/topics/subtopics/skills`
  (FK cascade induk→anak, index FK, unique `code`) + registry.
- `src/server/db/taxonomy-data.ts` — BARU: data seed 1/5/10/32 (murni,
  tanpa server-only/drizzle/I-O) + `validateTaxonomy()` +
  `buildUpsertPlan()`.
- `src/server/db/seed-taxonomy.ts` — BARU: eksekutor `seedTaxonomy()`
  (SERVER-ONLY, `INSERT ... ON CONFLICT (code) DO UPDATE`).
- `scripts/seed-taxonomy.ts` — BARU: runner CLI
  (`node --conditions=react-server scripts/seed-taxonomy.ts`).
- `tests/seed-taxonomy.test.ts` — BARU: 7 kasus, tanpa DB.
- `drizzle/0002_taxonomy.sql` + snapshot — GENERATED (`db:generate`).

Tidak disentuh (larangan task): `docs/TKA-MATH-TAXONOMY.md`,
`src/server/auth/**`, `middleware.ts`, `src/app/**`, `src/features/**`,
`src/components/**`, `src/domain/**`, `package.json`,
`docs/EXECUTION-BACKLOG.md`, `docs/CURRENT-STATE.md`.

## 3. Yang SENGAJA belum (batas cakupan)

FK balik `questions.subject_id`, `question_skills.skill_id`,
`skill_mastery.skill_id`, `practice_sessions.subject_id` belum dipasang —
kolom-kolom itu lahir tanpa FK ("menyusul P2.3"); pemasangan butuh
migrasi lanjutan + penyesuaian repository (lihat header komentar di
`schema.ts`). `drizzle-questions.ts` tetap pada perilaku UUID-or-null
sampai pemetaan kode↔id dikerjakan.

## 4. Cara migrate + seed (persis)

```sh
cp .env.example .env.local   # isi DATABASE_URL asli (sekali saja, jangan commit)
export $(cat .env.local | xargs)
npm run db:migrate                                  # apply drizzle/0002_taxonomy.sql ke Neon
node --conditions=react-server scripts/seed-taxonomy.ts   # seed (idempoten, aman diulang)
```

Verifikasi (dengan DB hidup):

```sql
SELECT (SELECT COUNT(*) FROM subjects)  AS subjects,   -- ekspektasi 1
       (SELECT COUNT(*) FROM topics)    AS topics,     -- ekspektasi 5
       (SELECT COUNT(*) FROM subtopics) AS subtopics,  -- ekspektasi 10
       (SELECT COUNT(*) FROM skills)    AS skills;     -- ekspektasi 32
SELECT code, status FROM subjects WHERE code = 'MATH';  -- ekspektasi active
```

## 5. Bukti perintah + status

| Perintah | Hasil |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0 |
| `npm test` | exit 0 (58 tes, 7 baru seed-taxonomy) |
| `npm run build` | exit 0 |
| `DATABASE_URL=<dummy> npm run db:generate` | exit 0 (`drizzle/0002_taxonomy.sql`) |

Status **TERUJI-live 2026-10-09**: `npm run db:migrate` sukses (0000+0001+0002
applied ke Neon `neon-rose-ladder`); seed live via
`node --conditions=react-server scripts/seed-taxonomy.ts` → OK 1/5/10/32;
verifikasi `SELECT COUNT(*)` → subjects 1, topics 5, subtopics 10, skills 32;
`SELECT code,status FROM subjects WHERE code='MATH'` → active.
Blocker lama (DATABASE_URL — Vercel CLI logout) RESMI DICABUT via
`vercel integration add neon` + `env pull` (owner approve terms di browser).
