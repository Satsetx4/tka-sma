# src/server/repositories — QuestionRepository CMS (P4.3)

Direktori ini berisi implementasi QuestionRepository CMS:
- `question-model.ts` — tipe CmsQuestion + aturan murni (transisi
  workflow, eligibility approval, adaptor publish-gate). Tanpa I/O,
  aman diimpor dari mana saja termasuk tes.
- `questions.ts` — interface QuestionRepository +
  InMemoryQuestionRepository (tes + dev tanpa DB) + factory
  `getQuestionRepository()` (Drizzle bila DATABASE_URL tersedia).
- `drizzle-questions.ts` — implementasi Drizzle/Neon (SERVER-ONLY).
  Batas yang diketahui: subjectCode/topicCode/subtopicCode/skillCodes
  berbentuk kode taksonomi belum punya kolom/FK (tabel P2.3 DITAHAN);
  hanya nilai UUID yang dipetakan ke subject_id/skill. Full-fidelity
  taksonomi tersedia di mock in-memory untuk tes.

Aturan (batas: docs/ARCHITECTURE.md):
- Jangan panggil ORM langsung dari komponen React UI.
- Jangan bocorkan `is_correct` (question_options) ke payload sesi aktif.
- Jangan sebar SDK Blob — hanya lewat StorageService
  (`src/server/storage/storage.ts`).
