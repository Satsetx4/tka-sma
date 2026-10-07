import { defineConfig } from "drizzle-kit";

// P2.1 — drizzle-kit config. DATABASE_URL dibaca dari environment shell,
// BUKAN dari file yang di-commit. Untuk lokal: export dari .env.local
// (gitignored) ke shell sebelum menjalankan skrip db:*.
// Nilai produksi: dashboard Vercel → project tka-sma (tim sekawan)
// → Settings → Environment Variables. Lihat docs/decisions/P2-neon-drizzle.md.
const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error(
    "[drizzle] DATABASE_URL is not set. Export it in your shell (e.g. from .env.local) — never commit the real value. See docs/decisions/P2-neon-drizzle.md."
  );
}

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl
  }
});
