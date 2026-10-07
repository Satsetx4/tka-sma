/**
 * P2.9 — Aturan peran auth MURNI (tanpa I/O, tanpa DB, tanpa Next).
 *
 * File ini SENGAJA tidak mengimpor modul server-only agar aman dipakai
 * di tes `node --test` (mengikuti pola question-model.ts / questions.ts).
 * guard.ts (server-only) memakai fungsi + error dari sini.
 */

/** Peran CMS V1: admin (semua) + reviewer (setujui) + editor (tulis). */
export const PERAN_CMS = ["admin", "reviewer", "editor"] as const;
export type CmsRole = (typeof PERAN_CMS)[number];

/** Peran penuh V1 (CMS + murid). Student = default untuk akun murid. */
export const SEMUA_PERAN = ["student", "admin", "reviewer", "editor"] as const;
export type PeranPengguna = (typeof SEMUA_PERAN)[number];

export interface SesiPengguna {
  id: string;
  role: string;
  email?: string;
}

/** Error 401 — belum login (nama sesuai kontrak guard-adapter CMS). */
export class BelumLogin extends Error {
  readonly status = 401;
  constructor() {
    super("Belum login. Masuk dulu lewat halaman login.");
    this.name = "BelumLogin";
  }
}

/** Error 403 — peran tidak diizinkan (nama sesuai kontrak guard-adapter CMS). */
export class PeranDitolak extends Error {
  readonly status = 403;
  readonly peran: string;
  constructor(peran: string) {
    super(`Peran "${peran}" tidak diizinkan mengakses halaman ini.`);
    this.name = "PeranDitolak";
    this.peran = peran;
  }
}

const PERAN_VALID: readonly string[] = [...SEMUA_PERAN];

/**
 * Normalkan sesi mentah Better Auth → SesiPengguna | null.
 * Peran tak dikenal dinormalkan ke "student" (fail-closed, bukan throw).
 */
export function normalkanSesi(raw: unknown): SesiPengguna | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as { user?: unknown };
  const u = o.user;
  if (u === null || typeof u !== "object") return null;
  const user = u as { id?: unknown; role?: unknown; email?: unknown };
  if (typeof user.id !== "string" || user.id === "") return null;
  const role = typeof user.role === "string" && PERAN_VALID.includes(user.role) ? user.role : "student";
  const sesi: SesiPengguna = { id: user.id, role };
  if (typeof user.email === "string" && user.email !== "") sesi.email = user.email;
  return sesi;
}

/**
 * Keputusan akses murni (dipakai guard.ts + tes).
 * @throws BelumLogin bila sesi null. @throws PeranDitolak bila peran tak diizinkan.
 */
export function putuskanAkses(
  sesi: SesiPengguna | null,
  ...diizinkan: string[]
): SesiPengguna {
  if (!sesi) throw new BelumLogin();
  if (!diizinkan.includes(sesi.role)) throw new PeranDitolak(sesi.role);
  return sesi;
}
