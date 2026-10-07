# src/server/repositories — placeholder batas repository/service

Direktori ini SENGAJA KOSONG sampai fase repository/service tiba
(batas: docs/ARCHITECTURE.md — QuestionRepository, TaxonomyRepository,
AttemptRepository, MasteryRepository, TryoutRepository, MediaRepository).

Aturan:
- Jangan panggil ORM langsung dari komponen React UI.
- Jangan bocorkan `is_correct` (question_options) ke payload sesi aktif.
- Jangan sebar SDK Blob — hanya lewat StorageService
  (`src/server/storage/storage.ts`).
