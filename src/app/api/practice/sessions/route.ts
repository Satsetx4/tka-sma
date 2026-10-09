/**
 * P6.1 — API sesi latihan murid: GET daftar + POST mulai sesi.
 * Wajib login (semua peran boleh — murid = student).
 * Fail-closed: tanpa sesi → 401.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/auth/guard.ts";
import { BelumLogin } from "../../../../server/auth/roles.ts";
import { practiceModes } from "../../../../domain/practice/session-model.ts";
import { daftarSesiSaya, mulaiSesiLatihan } from "../../../../server/services/practice-service.ts";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  return NextResponse.json({ sessions: await daftarSesiSaya(sesi.id) });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  const mode = typeof b["mode"] === "string" ? b["mode"] : "";
  if (!(practiceModes as readonly string[]).includes(mode)) {
    return NextResponse.json({ error: `Mode tidak dikenal. Pilihan: ${practiceModes.join(", ")}.` }, { status: 400 });
  }
  const jumlah =
    typeof b["jumlahSoal"] === "number" && Number.isInteger(b["jumlahSoal"]) ? (b["jumlahSoal"] as number) : 10;
  const hasil = await mulaiSesiLatihan(sesi.id, {
    mode: mode as (typeof practiceModes)[number],
    ...(typeof b["subjectCode"] === "string" ? { subjectCode: b["subjectCode"] } : {}),
    ...(typeof b["topicCode"] === "string" ? { topicCode: b["topicCode"] } : {}),
    jumlahSoal: jumlah,
  });
  if (!hasil.ok || !hasil.sesi) {
    return NextResponse.json({ error: "Gagal memulai sesi.", errors: hasil.errors ?? [] }, { status: 422 });
  }
  void BelumLogin;
  return NextResponse.json({ session: hasil.sesi }, { status: 201 });
}
