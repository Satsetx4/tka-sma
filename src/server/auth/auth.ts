// P2.9 — Instance Better Auth, SERVER-ONLY. Jangan impor dari komponen
// client atau kode apa pun yang dibundel ke browser.
// Mengikuti docs/decisions/P2-auth-decision.md (Opsi B): email+password
// bawaan, sesi DB-backed di Neon via adapter Drizzle resmi, tanpa SaaS baru.
//
// Keamanan: hashing password ikut bawaan Better Auth (scrypt); cookie sesi
// httpOnly + secure (secure otomatis aktif saat baseURL https / produksi).
import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
import { getDb } from "../db/client.ts";
import { schema } from "../db/schema.ts";

if (typeof window !== "undefined") {
  throw new Error("[auth] src/server/auth/* must never be imported from client-side code.");
}

function wajibEnv(nama: string): string {
  const v = process.env[nama];
  if (!v) {
    throw new Error(
      `[auth] ${nama} belum diisi. Set di shell lokal (dari .env.local, gitignored) ` +
        "atau Vercel project env — jangan commit secret. Lihat docs/decisions/P2-auth-impl.md.",
    );
  }
  return v;
}

/** Email seed admin (dipakai validasi + seed script). */
export const ADMIN_ENV_VARS = ["ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_NAME"] as const;

function buatAuth() {
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      // Skema memakai key jamak (users/sessions/...) untuk model
      // user/session/account/verification — usePlural memetakan keduanya.
      usePlural: true,
      schema,
    }),
    emailAndPassword: {
      enabled: true,
      // Pendaftaran publik dimatikan di V1: akun dibuat via seed admin /
      // panel admin. Login tetap lewat /api/auth/sign-in/email.
      disableSignUp: true,
      autoSignIn: true,
    },
    session: {
      // Sliding expiration bawaan (refresh tiap updateAge detik).
      expiresIn: 60 * 60 * 24 * 7, // 7 hari
      updateAge: 60 * 60 * 24, // refresh bila idle > 1 hari
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // cache cookie 5 menit (mengurangi query sesi)
      },
    },
    advanced: {
      cookiePrefix: "tka-sma",
      useSecureCookies: process.env["NODE_ENV"] === "production",
    },
    user: {
      // Kolom tambahan di tabel users (selain bawaan Better Auth).
      // additionalFields: role dikelola plugin admin (defaultRole student).
      additionalFields: {},
    },
    databaseHooks: {
      user: {
        create: {
          // Tiap user baru otomatis dapat baris user_profiles
          // (docs/DATABASE.md: users/user_profiles).
          after: async (user) => {
            const db = getDb() as unknown as {
              insert: (t: unknown) => {
                values: (v: unknown) => Promise<unknown>;
              };
            };
            await db.insert(schema.userProfiles).values({
              userId: user.id,
              displayName: user.name,
            });
          },
        },
      },
    },
    plugins: [
      // Peran V1: student (default murid) + admin/reviewer/editor untuk CMS.
      // defaultRole=false agar seed script mengisi role eksplisit.
      admin({
        defaultRole: "student",
        adminRoles: ["admin"],
      }),
      // Wajib PALING AKHIR di daftar plugin (dok resmi Better Auth):
      // menulis Set-Cookie via Next.js cookies() agar sesi bertahan di RSC.
      nextCookies(),
    ],
    secret: wajibEnv("BETTER_AUTH_SECRET"),
    baseURL: process.env["BETTER_AUTH_URL"],
    trustedOrigins: process.env["BETTER_AUTH_TRUSTED_ORIGINS"]?.split(",").map((s) => s.trim()),
  });
}

type AuthInstance = ReturnType<typeof buatAuth>;

let cachedAuth: AuthInstance | undefined;

/**
 * Instance Better Auth (singleton malas). SENGAJA tidak dibuat di top-level
 * modul: `getDb()` + `wajibEnv()` throw bila env belum ada, dan evaluasi
 * top-level berjalan saat `next build` (collect page data) — build harus
 * hijau tanpa DB/secret. Instance baru terwujud saat request pertama masuk.
 */
export function getAuth(): AuthInstance {
  if (!cachedAuth) cachedAuth = buatAuth();
  return cachedAuth;
}

export type SesiAuth = AuthInstance["$Infer"]["Session"];
