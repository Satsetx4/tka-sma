/**
 * P6.6 — Review jawaban: soal + jawaban murid + pembahasan, SETELAH jawab.
 * GET /api/practice/sessions/[id]/review?questionId=...
 *
 * Checks (fail-closed): login 401 → sesi milik 404/403 → soal ada di sesi
 * 422 → murid SUDAH jawab soal ini (kalau belum → 409, buka dulu via answer).
 *
 * Payload: soal AMAN (tanpa isCorrect global) + jawaban murid + penanda
 * benar/salah milik sendiri + explanation (blocks/commonMistake/solvingTip).
 * Kunci soal lain TIDAK ikut — hanya status jawaban sendiri.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../../../../../../server/auth/guard.ts";
import { getAttemptRepository } from "../../../../../../server/repositories/attempts.ts";
import { getQuestionRepository } from "../../../../../../server/repositories/questions.ts";
import { toSafeQuestions } from "../../../../../../domain/practice/safe-payload.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const sesi = await getSession();
  if (!sesi) return NextResponse.json({ error: "Belum login. Masuk dulu." }, { status: 401 });
  const { id } = await params;

  const repo = await getAttemptRepository();
  const sesiLatihan = await repo.getSession(id);
  if (!sesiLatihan) return NextResponse.json({ error: "Sesi tidak ditemukan." }, { status: 404 });
  if (sesiLatihan.userId !== sesi.id) {
    return NextResponse.json({ error: "Bukan sesi milikmu." }, { status: 403 });
  }

  const qid = request.nextUrl.searchParams.get("questionId")?.trim() ?? "";
  if (qid === "") {
    return NextResponse.json({ error: "questionId wajib diisi (query param)." }, { status: 400 });
  }
  if (!sesiLatihan.questionIds.includes(qid)) {
    return NextResponse.json({ error: "Soal ini tidak ada di sesi ini." }, { status: 422 });
  }

  const upaya = await repo.listAttempts(id);
  const milikku = upaya.filter((a) => a.questionId === qid);
  if (milikku.length === 0) {
    return NextResponse.json(
      { error: "Kamu belum menjawab soal ini. Jawab dulu lewat endpoint answer." },
      { status: 409 },
    );
  }
  const terakhir = milikku[milikku.length - 1];

  const repoSoal = await getQuestionRepository();
  const soal = await repoSoal.getById(qid);
  if (!soal) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });

  const [aman] = toSafeQuestions([soal]);
  return NextResponse.json({
    sessionId: id,
    question: aman,
    jawabanku: {
      selectedAnswer: terakhir?.selectedAnswer,
      isCorrect: terakhir?.isCorrect,
      answeredAt: terakhir?.answeredAt,
    },
    explanation: soal.explanation,
  });
}
