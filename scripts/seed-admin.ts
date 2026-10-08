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
// Jalankan:  ADMIN_EMAIL=... ADMIN_PASSWORD=... node --conditions=react-server scripts/seed-admin.ts
// (atau: npx tsx scripts/seed-admin.ts)
// Flag --conditions=react-server WAJIB bila pakai node langsung: modul auth/db
// memakai `server-only` (kosong di kondisi react-server, throw tanpa kondisi itu).
import "server-only";
import { hashPassword } from "@better-auth/utils/password";
import { getDb } from "../src/server/db/client.ts";
import { accounts, userProfiles, users } from "../src/server/db/schema.ts";
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

function uid(prefix: string): string {
  const acak = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${acak}`;
}

const userId = uid("user");
// Hash via fungsi bawaan Better Auth (@better-auth/utils/password:
// scrypt N=16384/r=16/p=1, format "salt:hash") agar login /api/auth
// sign-in/email bisa verifikasi. signUpEmail API tidak dipakai karena
// disableSignUp=true (pendaftaran publik dimatikan di V1).
const passwordSimpan = await hashPassword(password);
await db.insert(users).values({ id: userId, name: nama, email, emailVerified: true, role: "admin" });
await db.insert(accounts).values({ id: uid("acc"), userId, accountId: userId, providerId: "credential", password: passwordSimpan });
await db.insert(userProfiles).values({ userId, displayName: nama });
console.log(`[seed-admin] admin dibuat: ${email} (role=admin). Segera ganti kata sandi.`);
process.exit(0);
