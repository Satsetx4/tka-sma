// P2.2 — Barrel src/server/db. Satu-satunya jalan masuk aplikasi ke database
// (batas repository/service: docs/ARCHITECTURE.md). Hanya boleh diimpor dari
// route handler / server action / server component — JANGAN dari client.
export { getDb, checkConnection } from "./client";
export type { Database } from "./client";
export { runMigrations } from "./migrate";
export { schema } from "./schema";
