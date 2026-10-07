// P2.9 — Route handler Better Auth (login/logout/sesi via /api/auth/*).
// Dipasang lewat toNextJsHandler agar cookie sesi ditulis via Next.js cookies().
// Handler dibuat MALAS per-request: getAuth() throw bila env/DB belum ada, dan
// evaluasi top-level berjalan saat `next build` (collect) — pemanggilan per
// fungsi memastikan build hijau tanpa DB/secret.
import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { getAuth } from "../../../../server/auth/auth.ts";

export const dynamic = "force-dynamic";

function handler(): {
  GET: (req: NextRequest) => Promise<Response>;
  POST: (req: NextRequest) => Promise<Response>;
} {
  return toNextJsHandler(getAuth()) as unknown as {
    GET: (req: NextRequest) => Promise<Response>;
    POST: (req: NextRequest) => Promise<Response>;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    return await handler().GET(req);
  } catch (e) {
    console.error("[auth] handler GET gagal:", e);
    return Response.json({ error: "Layanan auth belum siap (konfigurasi server belum lengkap)." }, { status: 503 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    return await handler().POST(req);
  } catch (e) {
    console.error("[auth] handler POST gagal:", e);
    return Response.json({ error: "Layanan auth belum siap (konfigurasi server belum lengkap)." }, { status: 503 });
  }
}
