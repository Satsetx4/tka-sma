/**
 * P6.2 — Soal sesi latihan untuk murid (payload AMAN, tanpa kunci).
 * GET daftar soal sesi milik sendiri (strip isCorrect + explanation).
 * Sesi selesai → 410 (soal dikunci, lihat hasil/review saja).
 */
import { NextResponse } from "next/server";
import { getSession } from "../../../../../../server/auth/guard.ts";
import { getAttemptRepository } from "../../../../../../server/repositories/attempts.ts";
import { getQuestionRepository } from "../../../../../../server/repositories/questions.ts";
import { assertSafePayload, toSafeQuestions } from "../../../../../../domain/practice/safe-payload.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  const { id } = await params;
  const repo = await getAttemptRepository();
  const sesiLatihan = await repo.getSession(id);
  if (!sesiLatihan) return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 404 });
  if (sesiLatihan.userId !== sesi.id) {
    return NextResponse.json({ error: "Bukan sesi milikmu." }, { status: 403 });
  }
  if (sesiLatihan.finishedAt) {
    return NextResponse.json({ error: "Sesi sudah selesai. Lihat hasil/review." }, { status: 410 });
  }
  const repoSoal = await getQuestionRepository();
  const soal = [];
  for (const qid of sesiLatihan.questionIds) {
    const q = await repoSoal.getById(qid);
    if (q) soal.push(q);
  }
  const aman = toSafeQuestions(soal);
  assertSafePayload(aman);
  return NextResponse.json({ sessionId: sesiLatihan.id, questions: aman });
}
