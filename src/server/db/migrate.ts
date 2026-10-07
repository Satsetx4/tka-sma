// P2.2 — Programmatic migration runner (dipakai dari konteks deploy/server,
// bukan dari CLI; CLI memakai `npm run db:migrate` → `drizzle-kit migrate`).
// Jalankan dari repo root agar path `drizzle/` resolve dengan benar.
import "server-only";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { getDb } from "./client";

export async function runMigrations(): Promise<void> {
  await migrate(getDb(), { migrationsFolder: "drizzle" });
}
