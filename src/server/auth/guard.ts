/**
 * P2.9/P2.10 — Guard auth server-only. KONTRAK yang dipenuhi untuk CMS
 * (lihat src/features/cms/guard-adapter.ts):
 *   - modul: `@/server/auth/guard` (alias @ = src)
 *   - `getSession(): Promise<{ id: string; role: CmsRole; email?: string } | null>`
 *   - `requireRole(...allowed: CmsRole[]): Promise<...>` (throw bila tak lolos)
 *   - peran CMS: "admin" | "reviewer" | "editor"
 *   - error `BelumLogin` (status 401) bila belum login,
 *     error `PeranDitolak` (status 403) bila peran tak diizinkan.
 *
 * GuardBelumTersedia TIDAK dipakai di guard asli — hanya milik adapter CMS
 * untuk masa transisi sebelum guard mendarat (sekarang sudah mendarat).
 */
import "server-only";
import { headers } from "next/headers";
import { getAuth } from "./auth.ts";
import {
  BelumLogin,
  PeranDitolak,
  normalkanSesi,
  putuskanAkses,
  type CmsRole,
  type SesiPengguna,
} from "./roles.ts";

if (typeof window !== "undefined") {
  throw new Error("[auth] src/server/auth/* must never be imported from client-side code.");
}

export { BelumLogin, PeranDitolak, type CmsRole, type SesiPengguna };
export { PERAN_CMS, SEMUA_PERAN, type PeranPengguna } from "./roles.ts";

/**
 * Sesi aktif dari cookie (via Better Auth, DB-backed) atau null bila
 * belum login. Tanpa sesi palsu/mock — null berarti benar-benar anonim.
 *
 * Fail-closed: kegagalan baca sesi (env/DB belum ada, cookie rusak)
 * dipetakan ke null = anonim → pemanggil menolak dengan 401/redirect,
 * BUKAN 500 dan BUKAN fail-open. Tanpa DB memang tak ada sesi valid.
 */
export async function getSession(): Promise<SesiPengguna | null> {
  try {
    const sesi = await getAuth().api.getSession({ headers: await headers() });
    return normalkanSesi(sesi);
  } catch (e) {
    console.error("[auth] getSession gagal (dianggap anonim):", e);
    return null;
  }
}

/**
 * Wajib login + salah satu peran diizinkan.
 * @throws BelumLogin (401) bila belum login.
 * @throws PeranDitolak (403) bila peran tak termasuk `allowed`.
 */
export async function requireRole(...allowed: CmsRole[]): Promise<SesiPengguna> {
  return putuskanAkses(await getSession(), ...allowed);
}

/**
 * Wajib login apa pun perannya (untuk area murid bila kelak butuh guard).
 * @throws BelumLogin (401) bila belum login.
 */
export async function requireLogin(): Promise<SesiPengguna> {
  return putuskanAkses(await getSession(), "student", "editor", "reviewer", "admin");
}
