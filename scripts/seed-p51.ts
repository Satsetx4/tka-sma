// P5.1 — Runner CLI seed 10 soal teks/math (env-driven).
//
// JANGAN hardcode secret: hanya DATABASE_URL + ADMIN_EMAIL dari environment.
// Prasyarat: migrasi applied + seed-taxonomy + seed-admin sudah jalan.
// Idempoten: aman dijalankan ulang (upsert by code, tanpa downgrade status).
//
// Jalankan (dari repo root, dengan env ter-export):
//   node --conditions=react-server scripts/seed-p51.ts
// Flag --conditions=react-server WAJIB: modul db memakai `server-only`.
import { checkConnection } from "../src/server/db/client.ts";
import { adminIdByEmail, seedP51 } from "../src/server/db/seed-p51.ts";

function wajibEnv(nama: string): string {
  const v = process.env[nama]?.trim();
  if (!v) {
    console.error(`[seed-p51] ${nama} belum diisi. Batal tanpa mengubah apa pun.`);
    process.exit(1);
  }
  return v;
}

try {
  const ok = await checkConnection();
  if (!ok) {
    console.error("[seed-p51] SELECT 1 gagal — periksa DATABASE_URL. Batal tanpa mengubah apa pun.");
    process.exit(1);
  }
} catch (e) {
  console.error(
    `[seed-p51] tidak bisa konek DB: ${e instanceof Error ? e.message : String(e)}. Batal tanpa mengubah apa pun.`,
  );
  process.exit(1);
}

const emailAdmin = wajibEnv("ADMIN_EMAIL").toLowerCase();
const adminId = await adminIdByEmail(emailAdmin);
const hasil = await seedP51(adminId);
console.log(
  `[seed-p51] OK: dibuat=${hasil.dibuat} diperbarui=${hasil.diperbarui} approved=${hasil.approved}/10 :: ${hasil.kode.join(", ")}`,
);
process.exit(0);
