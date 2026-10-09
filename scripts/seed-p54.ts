// P5.4 — Runner CLI seed 5 soal gambar/diagram (env-driven).
// Prasyarat: migrasi + seed-taxonomy + seed-admin sudah jalan. Idempoten.
// Jalankan: node --conditions=react-server scripts/seed-p54.ts
import { checkConnection } from "../src/server/db/client.ts";
import { adminIdByEmail, seedP54 } from "../src/server/db/seed-p54.ts";

function wajibEnv(nama: string): string {
  const v = process.env[nama]?.trim();
  if (!v) {
    console.error(`[seed-p54] ${nama} belum diisi. Batal tanpa mengubah apa pun.`);
    process.exit(1);
  }
  return v;
}

try {
  const ok = await checkConnection();
  if (!ok) {
    console.error("[seed-p54] SELECT 1 gagal — periksa DATABASE_URL. Batal tanpa mengubah apa pun.");
    process.exit(1);
  }
} catch (e) {
  console.error(
    `[seed-p54] tidak bisa konek DB: ${e instanceof Error ? e.message : String(e)}. Batal tanpa mengubah apa pun.`,
  );
  process.exit(1);
}

const emailAdmin = wajibEnv("ADMIN_EMAIL").toLowerCase();
const adminId = await adminIdByEmail(emailAdmin);
const hasil = await seedP54(adminId);
console.log(
  `[seed-p54] OK: dibuat=${hasil.dibuat} diperbarui=${hasil.diperbarui} approved=${hasil.approved}/5 :: ${hasil.kode.join(", ")}`,
);
process.exit(0);
