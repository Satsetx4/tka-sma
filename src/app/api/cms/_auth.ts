/**
 * P4.2 — Penegakan peran untuk API CMS (server-side, JSON 401/403/503).
 *
 * Sesi dibaca lewat adapter CMS (src/features/cms/guard-adapter.ts) yang
 * mendelegasikan ke guard agen auth (`@/server/auth/guard`, ASUMSI —
 * belum mendarat). Tanpa guard → 503 eksplisit, BUKAN fail-open.
 */
import { NextResponse } from "next/server";
import {
  BelumLogin,
  GuardBelumTersedia,
  PeranDitolak,
  wajibkanPeran,
  type PeranCms,
  type SesiCms,
} from "../../../features/cms/guard-adapter.ts";

/** Peran yang boleh membuka CMS (baca + tulis draf). */
export const peranCms: readonly PeranCms[] = ["admin", "reviewer", "editor"];

export class CmsAuthError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Sesi CMS valid, atau throw CmsAuthError (401/403/503). */
export async function sesiApiCms(...diizinkan: PeranCms[]): Promise<SesiCms> {
  const boleh: readonly PeranCms[] = diizinkan.length > 0 ? diizinkan : peranCms;
  try {
    return await wajibkanPeran(...boleh);
  } catch (e) {
    if (e instanceof GuardBelumTersedia) throw new CmsAuthError(503, e.message);
    if (e instanceof BelumLogin) throw new CmsAuthError(401, e.message);
    if (e instanceof PeranDitolak) throw new CmsAuthError(403, e.message);
    throw e;
  }
}

/** Petakan error route menjadi respons JSON (auth jadi 401/403/503, sisanya 500). */
export function responsKesalahan(asal: unknown): NextResponse {
  if (asal instanceof CmsAuthError) {
    return NextResponse.json({ error: asal.message }, { status: asal.status });
  }
  console.error("[cms] kesalahan tak terduga:", asal);
  return NextResponse.json({ error: "Kesalahan server." }, { status: 500 });
}
