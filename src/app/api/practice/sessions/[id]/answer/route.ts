/**
 * P6.3 — Submit jawaban murid ke sesi milik sendiri.
 * POST { questionId, optionIndex | optionIndexes, durationSeconds? }.
 *
 * Checks (berurutan, fail-closed):
 * 1. login (401) → 2. sesi ada + milik sendiri (404/403) → 3. sesi belum
 *    selesai (410) → 4. soal ada di DALAM sesi ini (422) → 5. struktur
 *    jawaban valid utk tipe soal (422) → 6. simpan attempt (201).
 *
 * P6.3 menyimpan attempt dengan isCorrect=false SEMENTARA (belum dinilai —
 * penilaian server-side = P6.4). Respons TIDAK memuat kunci/pembahasan.
 * P6.4: attempt dinilai SERVER-SIDE via nilaiJawaban (single + multiple)
 * sebelum disimpan; respons tetap TANPA kunci/pembahasan (hanya benar/salah
 * milik sendiri — bukan kunci soalnya).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../../../../../../server/auth/guard.ts";
import { getAttemptRepository } from "../../../../../../server/repositories/attempts.ts";
import { getQuestionRepository } from "../../../../../../server/repositories/questions.ts";
import { validasiSubmit } from "../../../../../../domain/practice/submit-model.ts";
import { nilaiJawaban } from "../../../../../../domain/practice/grading.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
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
    return NextResponse.json({ error: "Sesi sudah selesai. Jawaban dikunci." }, { status: 410 });
  }

  const body: unknown = await request.json().catch(() => null);
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }
  const qid = (body as Record<string, unknown>)["questionId"];
  if (typeof qid !== "string" || qid.trim() === "") {
    return NextResponse.json({ error: "questionId wajib diisi." }, { status: 422 });
  }
  if (!sesiLatihan.questionIds.includes(qid)) {
    return NextResponse.json(
      { error: "Soal ini tidak ada di sesi ini." },
      { status: 422 },
    );
  }

  const repoSoal = await getQuestionRepository();
  const soal = await repoSoal.getById(qid);
  if (!soal) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });

  const cek = validasiSubmit(body, soal.questionType);
  if (!cek.ok || !cek.data) {
    return NextResponse.json({ error: "Jawaban tidak valid.", errors: cek.errors }, { status: 422 });
  }

  const benar = nilaiJawaban(
    soal.questionType,
    soal.options.map((o) => ({ isCorrect: o.isCorrect })),
    cek.data.selectedAnswer as { optionIndex: number } | { optionIndexes: number[] },
  );

  const simpan = await repo.recordAttempt({
    userId: sesi.id,
    sessionId: id,
    questionId: qid,
    selectedAnswer: cek.data.selectedAnswer,
    isCorrect: benar,
    durationSeconds: cek.data.durationSeconds,
    difficultySnapshot: soal.difficulty,
  });

  return NextResponse.json(
    {
      attempt: {
        id: simpan.id,
        sessionId: simpan.sessionId,
        questionId: simpan.questionId,
        isCorrect: simpan.isCorrect,
        durationSeconds: simpan.durationSeconds,
        answeredAt: simpan.answeredAt,
      },
    },
    { status: 201 },
  );
}
