/**
 * P6.1 — Selesaikan sesi latihan milik sendiri (POST { durasiDetik }).
 * Skor dihitung server dari attempts (bukan dari klaim client).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../../../../../../server/auth/guard.ts";
import { selesaikanSesiLatihan } from "../../../../../../server/services/practice-service.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  const { id } = await params;
  const body: unknown = await request.json().catch(() => ({}));
  const durasi =
    body !== null && typeof body === "object" && !Array.isArray(body) && typeof (body as Record<string, unknown>)["durasiDetik"] === "number"
      ? ((body as Record<string, unknown>)["durasiDetik"] as number)
      : null;
  const hasil = await selesaikanSesiLatihan(sesi.id, id, durasi);
  if (!hasil.ok || !hasil.sesi) {
    const milikOrang = (hasil.errors ?? []).some(
      (e: { field: string; message: string }) => e.field === "sessionId" && e.message.includes("milikmu"),
    );
    return NextResponse.json(
      { error: "Gagal menyelesaikan sesi.", errors: hasil.errors ?? [] },
      { status: milikOrang ? 403 : 404 },
    );
  }
  return NextResponse.json({ session: hasil.sesi, skor: hasil.skor });
}
