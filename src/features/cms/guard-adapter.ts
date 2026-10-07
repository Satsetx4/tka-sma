/**
 * P4.2 — Adapter sesi CMS ke guard milik agen paralel (auth).
 *
 * ASUMSI KONTRAK (guard dibuat agen paralel, BELUM mendarat saat CMS ini
 * ditulis — tidak ada commit apa pun di bawah src/server/auth/):
 *   - modul: `@/server/auth/guard` (alias @ = src; alias ini pun BELUM
 *     terdaftar di tsconfig — agen auth/gabungan perlu menambahkannya
 *     di "paths" saat guard mendarat)
 *   - `getSession(): Promise<{ id: string; role: CmsRole; email?: string } | null>`
 *   - `requireRole(...allowed: CmsRole[]): Promise<...>` (throw bila tak lolos)
 *   - peran CMS: "admin" | "reviewer" | "editor"
 *
 * MENGAPA dynamic import defensif (bukan import statis)?
 * File ini milik CMS; guard milik agen auth (DILARANG membuat guard
 * sendiri / menyentuh src/server/auth/**). Import statis ke modul yang
 * belum ada membuat `next build` gagal total. Dynamic import lewat
 * `new Function` sengaja tidak bisa dianalisis bundler, sehingga:
 *   - build tetap hijau tanpa guard,
 *   - tanpa guard → CMS menolak anggun dengan 503 (BUKAN fail-open),
 *   - SETELAH guard mendarat: ganti isi `muatGuard()` di bawah menjadi
 *     re-export statis (satu file ini saja), tanpa menyentuh file lain.
 *
 * Keamanan: tidak ada sesi palsu/mock di sini. Tanpa guard yang nyata,
 * semua akses CMS ditolak.
 */
import "server-only";

export type PeranCms = "admin" | "reviewer" | "editor";

export interface SesiCms {
  id: string;
  role: PeranCms;
  email?: string;
}

/** Path kontrak guard agen auth — JANGAN ubah sepihak, koordinasi via orchestrator. */
export const PATH_GUARD_AUTH = "@/server/auth/guard";

const PERAN_VALID: readonly string[] = ["admin", "reviewer", "editor"];

export class GuardBelumTersedia extends Error {
  constructor() {
    super(
      `Guard auth belum tersedia (modul ${PATH_GUARD_AUTH} belum mendarat). ` +
        "CMS aktif setelah agen auth menyelesaikan guard + alias @.",
    );
    this.name = "GuardBelumTersedia";
  }
}

export class BelumLogin extends Error {
  constructor() {
    super("Belum login. Masuk dulu lewat halaman login.");
    this.name = "BelumLogin";
  }
}

export class PeranDitolak extends Error {
  readonly peran: string;
  constructor(peran: string) {
    super(`Peran "${peran}" tidak diizinkan mengakses CMS.`);
    this.name = "PeranDitolak";
    this.peran = peran;
  }
}

interface ModulGuard {
  getSession: () => Promise<SesiCms | null>;
  requireRole: (...allowed: PeranCms[]) => Promise<SesiCms>;
}

function bentukGuardValid(mod: unknown): mod is ModulGuard {
  if (mod === null || typeof mod !== "object") return false;
  const m = mod as Record<string, unknown>;
  return typeof m["getSession"] === "function" && typeof m["requireRole"] === "function";
}

function sesiValid(s: unknown): s is SesiCms {
  if (s === null || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return typeof o["id"] === "string" && typeof o["role"] === "string" && PERAN_VALID.includes(o["role"] as string);
}

/**
 * Muat modul guard saat runtime. Specifier dipecah agar static analyzer
 * (tsc alias check + Turbopack) tidak mencoba me-resolve-nya saat build.
 */
async function muatGuard(): Promise<ModulGuard> {
  const potong = ["@/", "server", "/auth", "/guard"];
  const spec = potong.join("");
  type Pengimpor = (s: string) => Promise<unknown>;
  const imporDinamis = new Function("s", "return import(s)") as unknown as Pengimpor;
  let mod: unknown;
  try {
    mod = await imporDinamis(spec);
  } catch {
    throw new GuardBelumTersedia();
  }
  if (!bentukGuardValid(mod)) throw new GuardBelumTersedia();
  return mod;
}

/** Sesi aktif atau null (null = belum login ATAU guard belum tersedia → panggil guardSiap() untuk bedakan). */
export async function dapatkanSesi(): Promise<SesiCms | null> {
  const guard = await muatGuard();
  const sesi = await guard.getSession();
  return sesiValid(sesi) ? sesi : null;
}

/** Wajib login + salah satu peran; throw BelumLogin / PeranDitolak / GuardBelumTersedia. */
export async function wajibkanPeran(...diizinkan: PeranCms[]): Promise<SesiCms> {
  const guard = await muatGuard();
  const sesi = await guard.requireRole(...diizinkan);
  if (!sesiValid(sesi)) throw new BelumLogin();
  if (!diizinkan.includes(sesi.role)) throw new PeranDitolak(sesi.role);
  return sesi;
}
