// P2.2 — Schema index. SENGAJA KOSONG: tabel P2.3+ (subjects, topics,
// subtopics, skills, stimuli, questions, question_options, question_skills,
// media_assets, practice_sessions, question_attempts, skill_mastery,
// mistake_queue, tryout_*, users) didefinisikan di task P2.3 — satu file per
// domain tabel — lalu didaftarkan ulang dari file ini.
// Disiplin migrasi (docs/DATABASE.md): semua perubahan skema lewat migrasi
// berversi (`npm run db:generate` + `npm run db:migrate`), tidak pernah edit
// manual skema produksi; seed taxonomy terpisah dari sample/demo.
export const schema = {
  // P2.3+: ...subjects, ...topics, dst.
};
