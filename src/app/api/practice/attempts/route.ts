/**
 * P6.5 — Riwayat attempt murid: GET /api/practice/attempts?batas=N.
 * Wajib login. Hanya milik sendiri (userId dari sesi, bukan query).
 * Ringkasan: total, benar, akurasi, per-difficulty.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../../../../server/auth/guard.ts";
import { getAttemptRepository } from "../../../../server/repositories/attempts.ts";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  const raw = request.nextUrl.searchParams.get("batas");
  const batas = raw === null ? 50 : Number(raw);
  const n = Number.isInteger(batas) ? Math.max(1, Math.min(batas as number, 200)) : 50;
  const repo = await getAttemptRepository();
  const daftar = await repo.listAttemptsByUser(sesi.id, n);
  const total = daftar.length;
  const benar = daftar.filter((a) => a.isCorrect).length;
  const perDifficulty: Record<string, { total: number; benar: number }> = {};
  for (const a of daftar) {
    const d = a.difficultySnapshot ?? "unknown";
    const slot = perDifficulty[d] ?? { total: 0, benar: 0 };
    slot.total += 1;
    if (a.isCorrect) slot.benar += 1;
    perDifficulty[d] = slot;
  }
  return NextResponse.json({
    attempts: daftar.map((a) => ({
      id: a.id,
      sessionId: a.sessionId,
      questionId: a.questionId,
      isCorrect: a.isCorrect,
      durationSeconds: a.durationSeconds,
      difficultySnapshot: a.difficultySnapshot,
      answeredAt: a.answeredAt,
    })),
    ringkasan: {
      total,
      benar,
      akurasi: total > 0 ? Math.round((benar / total) * 100) : 0,
      perDifficulty,
    },
  });
}
