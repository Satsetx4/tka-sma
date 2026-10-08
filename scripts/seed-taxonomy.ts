// P2.4 — Runner CLI seed taksonomi TKA Matematika v1 (env-driven).
//
// JANGAN hardcode secret: hanya DATABASE_URL dari environment (lihat .env.example).
// Prasyarat: migrasi P2.4 sudah di-apply (docs/decisions/P2-taxonomy-seed.md).
// JANGAN jalankan tanpa DB — butuh koneksi Neon yang hidup.
//
// Jalankan (dari repo root, dengan DATABASE_URL ter-export):
//   node --conditions=react-server scripts/seed-taxonomy.ts
// Flag --conditions=react-server WAJIB: modul db memakai `server-only`
// (kosong di kondisi react-server, throw bila diimpor tanpa kondisi itu).
// Idempoten: aman dijalankan ulang (upsert by code).
import { checkConnection } from "../src/server/db/client.ts";
import { seedTaxonomy } from "../src/server/db/seed-taxonomy.ts";

try {
  const ok = await checkConnection();
  if (!ok) {
    console.error("[seed-taxonomy] SELECT 1 gagal — periksa DATABASE_URL. Batal tanpa mengubah apa pun.");
    process.exit(1);
  }
} catch (e) {
  console.error(
    `[seed-taxonomy] tidak bisa konek DB: ${e instanceof Error ? e.message : String(e)}. Batal tanpa mengubah apa pun.`,
  );
  process.exit(1);
}

const hasil = await seedTaxonomy();
console.log(
  `[seed-taxonomy] OK: ${hasil.subjects} subject + ${hasil.topics} topics + ${hasil.subtopics} subtopics + ${hasil.skills} skills (idempoten, upsert by code).`,
);
process.exit(0);
