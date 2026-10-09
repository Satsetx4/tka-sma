// P5.6 — Runner CLI seed 3 soal Trigonometri (env-driven).
// Prasyarat: migrasi + seed-taxonomy + seed-admin sudah jalan. Idempoten.
// Jalankan: node --conditions=react-server scripts/seed-p56.ts
import { checkConnection } from "../src/server/db/client.ts";
import { adminIdByEmail, seedP56 } from "../src/server/db/seed-p56.ts";

function wajibEnv(nama: string): string {
  const v = process.env[nama]?.trim();
  if (!v) {
    console.error(`[seed-p56] ${nama} belum diisi. Batal tanpa mengubah apa pun.`);
    process.exit(1);
  }
  return v;
}

try {
  const ok = await checkConnection();
  if (!ok) {
    console.error("[seed-p56] SELECT 1 gagal — periksa DATABASE_URL. Batal tanpa mengubah apa pun.");
    process.exit(1);
  }
} catch (e) {
  console.error(
    `[seed-p56] tidak bisa konek DB: ${e instanceof Error ? e.message : String(e)}. Batal tanpa mengubah apa pun.`,
  );
  process.exit(1);
}

const emailAdmin = wajibEnv("ADMIN_EMAIL").toLowerCase();
const adminId = await adminIdByEmail(emailAdmin);
const hasil = await seedP56(adminId);
console.log(
  `[seed-p56] OK: dibuat=${hasil.dibuat} diperbarui=${hasil.diperbarui} approved=${hasil.approved}/3 :: ${hasil.kode.join(", ")}`,
);
process.exit(0);
