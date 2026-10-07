// P2.9 — Seed admin awal via Better Auth API (server, env-driven).
//
// JANGAN hardcode kredensial: baca dari environment.
//   ADMIN_EMAIL     — email admin (wajib)
//   ADMIN_PASSWORD  — kata sandi awal, min 8 karakter (wajib)
//   ADMIN_NAME      — nama tampilan (opsional, default "Admin TKA")
//
// Prasyarat: DATABASE_URL + BETTER_AUTH_SECRET sudah di-migrate
// (lihat docs/decisions/P2-auth-impl.md). Idempoten: bila email sudah
// terdaftar, peran dipastikan admin lalu keluar tanpa membuat duplikat.
//
// Jalankan:  ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed-admin.ts
// (atau: node --experimental-strip-types scripts/seed-admin.ts)
import "server-only";
import { getAuth } from "../src/server/auth/auth.ts";
import { getDb } from "../src/server/db/client.ts";
import { users } from "../src/server/db/schema.ts";
import { eq } from "drizzle-orm";

function wajibEnv(nama: string): string {
  const v = process.env[nama]?.trim();
  if (!v) {
    console.error(`[seed-admin] ${nama} belum diisi. Batal tanpa mengubah apa pun.`);
    process.exit(1);
  }
  return v;
}

const email = wajibEnv("ADMIN_EMAIL").toLowerCase();
const password = wajibEnv("ADMIN_PASSWORD");
if (password.length < 8) {
  console.error("[seed-admin] ADMIN_PASSWORD minimal 8 karakter. Batal tanpa mengubah apa pun.");
  process.exit(1);
}
const nama = process.env["ADMIN_NAME"]?.trim() || "Admin TKA";

const db = getDb();

// Idempoten: email sudah ada → pastikan peran admin, selesai.
const sudahAda = await db.select().from(users).where(eq(users.email, email)).limit(1);
if (sudahAda.length > 0) {
  const baris = sudahAda[0];
  if (baris && baris.role !== "admin") {
    await db.update(users).set({ role: "admin" }).where(eq(users.email, email));
    console.log(`[seed-admin] ${email} sudah terdaftar — peran dinaikkan ke admin.`);
  } else {
    console.log(`[seed-admin] ${email} sudah admin — tidak ada perubahan.`);
  }
  process.exit(0);
}

const hasil = await getAuth().api.signUpEmail({
  body: { email, password, name: nama },
});
const userId = (hasil as unknown as { user?: { id?: string } }).user?.id;
if (!userId) {
  console.error("[seed-admin] signUpEmail tidak mengembalikan user id. Batal.");
  process.exit(1);
}
await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
console.log(`[seed-admin] admin dibuat: ${email} (role=admin). Segera ganti kata sandi.`);
process.exit(0);
