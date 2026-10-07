# P2 — Skema P2.5/P2.6/P2.7 + Blob P2.12/P2.13

Branch: `feat/p3-renderers` (turunan `master` de6511d).
Kontrak field P2.5/P2.6: `docs/DATABASE.md`. Kontrak storage: `src/server/storage/storage.ts`.

## 1. Tabel dibuat (12, di `src/server/db/schema.ts`)

P2.5 — question/content (field persis DATABASE.md):
`stimuli`, `questions`, `question_options`, `question_skills`, `media_assets`.

P2.6 — learning (field persis DATABASE.md):
`practice_sessions`, `question_attempts`, `skill_mastery`, `mistake_queue`.

P2.7 — tryout (DATABASE.md hanya mendefinisikan PERAN, tanpa rincian field —
kolom di bawah desain V1 minimal):
`tryout_templates` (code, name, subject_composition JSONB, duration_seconds,
question_count, difficulty_distribution JSONB, scoring_profile JSONB, status),
`tryout_sessions` (template_id, user_id, status, locked_question_ids JSONB,
started_at, submitted_at, duration_seconds, score, correct_count),
`tryout_answers` (session_id, question_id, position, selected_answer JSONB,
is_flagged, is_correct nullable = belum dinilai, answered_at).

## 2. Keputusan FK / index

- FK HANYA antar tabel yang sudah ada di file ini (contoh: options→questions
  CASCADE, sessions→templates SET NULL, answers→sessions CASCADE).
- Referensi ke tabel yang BELUM ADA disimpan sebagai kolom TANPA constraint FK:
  `questions.subject_id`, `question_skills.skill_id`, `skill_mastery.skill_id`
  (tabel subjects/topics/subtopics/skills = P2.3 DITAHAN menunggu P1.6 freeze);
  semua `user_id` berupa teks tanpa FK (tabel users = P2.9+).
  FK menyusul di migrasi berikutnya saat tabel target lahir — orchestrator wajib
  memastikan migrasi penambah-FK itu dibuat di P2.3/P2.9, bukan dibiarkan hilang.
- `question_attempts.session_id` nullable + SET NULL dan
  `question_attempts.question_id` NO ACTION: riwayat belajar dipertahankan bila
  sesi/soal dihapus. Sebaliknya `question_options`/`question_skills` CASCADE:
  opsi adalah bagian tak terpisahkan dari soal.
- JSONB (content_blocks, explanation, selected_answer, komposisi tryout) SENGAJA
  tanpa CHECK constraint — validasi struktur milik layer domain Zod
  (`src/domain/question/`), bukan database.
- `is_correct` di `question_options` TIDAK BOLEH bocor ke payload sesi aktif
  (DATABASE.md) — penegakannya di repository/service (P-fase berikutnya), bukan
  di skema.
- Enum status: `content_status` mengikuti lifecycle CONTENT-POLICY.md
  (draft→in_review→approved→published→archived); `difficulty`/`practice_mode`/
  `mistake_status` persis DATABASE.md (+MASTERY.md); `question_type`/
  `source_type` selaras domain publish-gate; `media_status`, `tryout_template_*
  `, `tryout_session_status` adalah asumsi V1 (lihat §asumsi).
- Index: FK yang sering di-join + kolom filter utama (status, user_id,
  (user_id,status), (question_id,position) unique, (session_id,question_id)
  unique, code/pathname unique).

## 3. Status migrasi: GENERATED, BELUM APPLIED

- File: `drizzle/0000_*.sql` (+ `drizzle/meta/`) dari `npm run db:generate`
  (offline, exit 0 — 12 tabel terbaca drizzle-kit).
- `npm run db:migrate` SENGAJA TIDAK dijalankan: butuh DATABASE_URL asli
  (blocker sama seperti P2-neon-drizzle: CLI Vercel logout, tanpa `.env.local`).
- Cara apply (owner): isi `.env.local` dengan DATABASE_URL asli, export ke
  shell, lalu `npm run db:migrate`. JANGAN tandai TERUJI tanpa apply nyata +
  inspeksi tabel di Neon.

## 4. Status Blob: BELUM TERUJI live

- Implementasi: `src/server/storage/vercel-blob.ts` (`VercelBlobStorage`,
  server-only berlapis, satu-satunya pengimpor `@vercel/blob@2.8.1`).
  Token dari `process.env["BLOB_READ_WRITE_TOKEN"]` TANPA default;
  kosong → error CONFIG_MISSING. upload/delete selalu lewat `validate()` dulu.
- Unit test: `tests/storage-validate.test.ts` — 9 kasus, 9/9 pass
  (MIME ditolak ×2, size over, size nol, alt kosong, alt pendek, valid lolos,
  SVG lolos, filename buruk).
- Blocker uji-live: `BLOB_READ_WRITE_TOKEN` kemungkinan tidak tersedia di mesin
  ini + CLI Vercel logout (dilarang `vercel login` mandiri). Cara uji (owner):
  set token di shell, panggil `blobStorage.upload()` dari route handler dev
  dengan PNG kecil + alt ≥10 karakter, verifikasi URL publik 200, lalu
  `blobStorage.delete()` + pastikan 404.
- `VercelBlobStorage.getUrl()` V1 mengembalikan pathname apa adanya (bucket
  publik); URL penuh permanen disimpan ke `media_assets.blob_url` saat upload.

## 5. Bukti perintah

| Perintah | Hasil |
|---|---|
| `npm run db:generate` | exit 0, `drizzle/0000_*.sql` terbentuk (12 tabel) |
| `node --test tests/storage-validate.test.ts` | exit 0, 9/9 pass |
| `npm run lint` | exit 0 (lihat catatan §6) |
| `npm run typecheck` | BELUM exit 0 — 2 error di file milik agen renderer paralel (lihat §6) |
| `npm run build` (`next build`) | exit 0 |

## 6. Catatan untuk orchestrator (asumsi + blocker bersama)

- Asumsi P2.7 (DATABASE.md tak merinci field): kolom §1 + enum
  `tryout_template_status` (draft/active/archived) dan `tryout_session_status`
  (in_progress/submitted/expired). Bila owner ingin kosakata berbeda, ubah
  sebelum migrasi di-apply (setelah apply, perubahan enum = migrasi baru).
- Asumsi `media_status` (active/archived) dan `user_id` teks (bukan uuid +
  tanpa FK sampai P2.9 memutuskan model auth).
- Blocker bersama: `npm run typecheck` gagal karena 2 error di file agen
  PARALEL lain — `src/components/charts/function-eval.ts` (TS1294
  erasableSyntaxOnly) dan `src/components/question/block-guard.ts` (TS2307
  import path salah). File milik task ini (schema.ts, vercel-blob.ts,
  storage-validate.test.ts) BERSIH dari error. Jangan salahkan paket ini;
  teruskan 2 path itu ke agen renderer.
- `package.json`/`package-lock.json` bertambah `@vercel/blob@2.8.1` (satu-satunya
  dep baru, sesuai kepemilikan file). Tidak ada `git add/commit/push` dilakukan.
