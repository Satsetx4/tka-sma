/**
 * P2.9 — Middleware proteksi rute (server, edge-safe: tanpa DB, tanpa secret).
 *
 * Strategi: baca cookie sesi Better Auth (prefix tka-sma) sebagai sinyal
 * kasar kepemilikan sesi; otorisasi peran TETAP ditegakkan server di
 * layout/route (guard `requireRole`), bukan di sini. Middleware hanya
 * mengalihkan yang JELAS anonim ke /login agar UX cepat; keputusan
 * peran final milik server (docs/ARCHITECTURE.md: server validates auth/role).
 *
 * Rute publik: / /preview-soal /login (+ aset statis + /api/auth/*).
 * Rute proteksi: /admin/* + /api/cms/*.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PREFIX_KUKIS_SESI = "tka-sma.session_token";
// Varian nama cookie sesi Better Auth (lihat dist/cookies/index.mjs):
// "{prefix}.session_token" + varian secure "__Secure-{prefix}.session_token"
// (produksi https) + varian legacy "{prefix}-session_token".
const NAMA_KUKIS_SESI = [
  PREFIX_KUKIS_SESI,
  `__Secure-${PREFIX_KUKIS_SESI}`,
  "tka-sma-session_token",
  "__Secure-tka-sma-session_token",
];

function punyaKukisSesi(request: NextRequest): boolean {
  return NAMA_KUKIS_SESI.some((nama) => request.cookies.get(nama) !== undefined);
}

function tujuanLogin(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (punyaKukisSesi(request)) return NextResponse.next();

  // Proteksi halaman admin: anonim → /login (peran dicek di layout server).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return tujuanLogin(request);
  }

  // Proteksi API CMS: anonim → 401 JSON (konsisten dengan sesiApiCms).
  if (pathname === "/api/cms" || pathname.startsWith("/api/cms/")) {
    return NextResponse.json({ error: "Belum login. Masuk dulu lewat halaman login." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/cms", "/api/cms/:path*"],
};
