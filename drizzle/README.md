# drizzle/

Direktori output `drizzle-kit generate`. Berisi migrasi SQL berversi + snapshot
(`meta/`). Disiplin migrasi (docs/DATABASE.md):

- Semua perubahan skema lewat migrasi berversi (`npm run db:generate`).
- Tidak pernah edit skema produksi manual tanpa migrasi.
- Seed taxonomy terpisah dari sample/demo questions.
- File di sini di-generate — jangan edit manual. Perbaiki skema di
  `src/server/db/schema.ts` (mulai P2.3) lalu generate ulang.

Status P2.2: direktori ini SENGAJA KOSONG — migrasi pertama dibuat saat tabel
P2.3 didefinisikan (`npm run db:generate` akan membuat `0000_*.sql` pertama).
Alur lengkap: docs/decisions/P2-neon-drizzle.md.
