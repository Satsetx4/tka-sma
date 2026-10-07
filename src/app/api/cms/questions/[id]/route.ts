/**
 * P4.3 — Satu soal CMS: GET baca, PATCH ubah, DELETE hapus.
 * Aturan kunci: soal published/archived TIDAK bisa diubah langsung
 * (jalur revisi: published → archived → draft). Hapus hanya untuk
 * draft/archived agar riwayat publish tidak hilang diam-diam.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getQuestionRepository } from "../../../../../server/repositories/questions.ts";
import { peranCms, responsKesalahan, sesiApiCms } from "../../_auth.ts";
import { parseDrafPenuh } from "../../_validasi.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const FIELD_INPUT = [
  "code",
  "subjectCode",
  "topicCode",
  "subtopicCode",
  "skillCodes",
  "difficulty",
  "questionType",
  "contentBlocks",
  "options",
  "explanation",
  "sourceType",
  "sourceReference",
  "estimatedTimeSeconds",
] as const;

function galatUnik(e: unknown): boolean {
  return e instanceof Error && /sudah dipakai|unique|23505/i.test(e.message);
}

export async function GET(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  try {
    await sesiApiCms(...peranCms);
    const { id } = await params;
    const soal = await (await getQuestionRepository()).getById(id);
    if (!soal) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ question: soal });
  } catch (e) {
    return responsKesalahan(e);
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  try {
    const sesi = await sesiApiCms(...peranCms);
    const { id } = await params;
    const repo = await getQuestionRepository();
    const lama = await repo.getById(id);
    if (!lama) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
    if (lama.status === "published" || lama.status === "archived") {
      return NextResponse.json(
        {
          error:
            `Soal berstatus ${lama.status} tidak bisa diubah langsung. ` +
            "Arsipkan lalu kembalikan ke draft untuk revisi.",
        },
        { status: 409 },
      );
    }
    const mentah: unknown = await request.json().catch(() => null);
    if (mentah === null || typeof mentah !== "object" || Array.isArray(mentah)) {
      return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
    }
    const dasar: Record<string, unknown> = {
      code: lama.code,
      subjectCode: lama.subjectCode,
      topicCode: lama.topicCode,
      subtopicCode: lama.subtopicCode,
      skillCodes: lama.skillCodes,
      difficulty: lama.difficulty,
      questionType: lama.questionType,
      contentBlocks: lama.contentBlocks,
      options: lama.options,
      explanation: lama.explanation,
      sourceType: lama.sourceType,
      ...(lama.sourceReference ? { sourceReference: lama.sourceReference } : {}),
      estimatedTimeSeconds: lama.estimatedTimeSeconds,
    };
    const patch = mentah as Record<string, unknown>;
    for (const k of FIELD_INPUT) {
      if (k in patch) dasar[k] = patch[k];
    }
    const hasil = parseDrafPenuh(dasar);
    if (!hasil.ok) {
      return NextResponse.json(
        { error: "Struktur soal tidak valid.", errors: hasil.errors },
        { status: 422 },
      );
    }
    try {
      const jadi = await repo.update(id, hasil.data, sesi.id);
      if (!jadi) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
      return NextResponse.json({ question: jadi });
    } catch (e) {
      if (galatUnik(e)) {
        const pesan = e instanceof Error ? e.message : "Kode soal sudah dipakai.";
        return NextResponse.json({ error: pesan }, { status: 409 });
      }
      throw e;
    }
  } catch (e) {
    return responsKesalahan(e);
  }
}

export async function DELETE(_request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  try {
    await sesiApiCms(...peranCms);
    const { id } = await params;
    const repo = await getQuestionRepository();
    const lama = await repo.getById(id);
    if (!lama) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
    if (lama.status !== "draft" && lama.status !== "archived") {
      return NextResponse.json(
        {
          error:
            `Soal berstatus ${lama.status} tidak bisa dihapus. ` +
            "Tarik dulu ke draft/archived bila memang harus dibuang.",
        },
        { status: 409 },
      );
    }
    await repo.remove(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return responsKesalahan(e);
  }
}
