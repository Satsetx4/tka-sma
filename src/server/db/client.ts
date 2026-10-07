// P2.1 — Neon client, SERVER-ONLY. Jangan impor dari komponen client atau
// kode apa pun yang dibundel ke browser. Guard berlapis:
//   1. `server-only` → build error bila modul ini masuk client bundle.
//   2. `typeof window` → throw saat runtime bila tetap terbawa ke browser.
// Secret (DATABASE_URL) hanya dibaca di server, tidak pernah via variabel
// env yang terekspos ke browser.
import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

if (typeof window !== "undefined") {
  throw new Error("[db] src/server/db/* must never be imported from client-side code.");
}

export type Database = NeonHttpDatabase;

function getConnectionString(): string {
  const url = process.env["DATABASE_URL"];
  if (!url) {
    throw new Error(
      "[db] DATABASE_URL is not set. Set it in the shell (local: export from .env.local; production: Vercel project env). See docs/decisions/P2-neon-drizzle.md."
    );
  }
  return url;
}

let cachedDb: Database | undefined;

export function getDb(): Database {
  if (!cachedDb) {
    cachedDb = drizzle(getConnectionString());
  }
  return cachedDb;
}

// Ping koneksi tanpa menyentuh tabel apa pun. Dipakai untuk verifikasi
// status TERUJI (docs/decisions/P2-neon-drizzle.md). Tanpa DATABASE_URL
// asli fungsi ini tidak bisa lolos — itu sebabnya status saat ini BELUM TERUJI.
export async function checkConnection(): Promise<boolean> {
  const sql = neon(getConnectionString());
  const rows = (await sql`SELECT 1 AS ok`) as Array<{ ok: number }>;
  const first = rows[0];
  return first !== undefined && first.ok === 1;
}
