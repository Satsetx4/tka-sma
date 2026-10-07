/**
 * P4.3 + P4.4 — Koleksi soal CMS: GET daftar (filter/search) + POST buat draf.
 * SEMUA mutasi server-side + cek peran (editor boleh baca/tulis draf).
 * Payload CMS SENGAJA memuat is_correct (staf butuh kunci untuk review);
 * API practice siswa (P6.2, di luar cakupan) yang wajib menutupinya.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  difficulties,
  questionTypes,
} from "../../../../domain/question/publish-gate.ts";
import type {
  CmsStatus,
  QuestionFilter,
} from "../../../../server/repositories/question-model.ts";
import { cmsStatuses } from "../../../../server/repositories/question-model.ts";
import { getQuestionRepository } from "../../../../server/repositories/questions.ts";
import { peranCms, responsKesalahan, sesiApiCms } from "../_auth.ts";
import { parseDrafPenuh } from "../_validasi.ts";

export const dynamic = "force-dynamic";

function galatUnik(e: unknown): boolean {
  return e instanceof Error && /sudah dipakai|unique|23505/i.test(e.message);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await sesiApiCms(...peranCms);
    const param = request.nextUrl.searchParams;
    const ambil = (nama: string): string | undefined => {
      const v = (param.get(nama) ?? "").trim();
      return v === "" ? undefined : v;
    };
    const statusRaw = ambil("status");
    if (statusRaw !== undefined && !(cmsStatuses as readonly string[]).includes(statusRaw)) {
      return NextResponse.json({ error: `Status tidak dikenal: ${statusRaw}.` }, { status: 400 });
    }
    const difficultyRaw = ambil("difficulty");
    if (
      difficultyRaw !== undefined &&
      !(difficulties as readonly string[]).includes(difficultyRaw)
    ) {
      return NextResponse.json({ error: `Difficulty tidak dikenal: ${difficultyRaw}.` }, { status: 400 });
    }
    const typeRaw = ambil("type");
    if (typeRaw !== undefined && !(questionTypes as readonly string[]).includes(typeRaw)) {
      return NextResponse.json({ error: `Tipe soal tidak dikenal: ${typeRaw}.` }, { status: 400 });
    }
    const filter: QuestionFilter = {
      ...(statusRaw !== undefined ? { status: statusRaw as CmsStatus } : {}),
      ...(ambil("subject") !== undefined ? { subjectCode: ambil("subject") as string } : {}),
      ...(ambil("topic") !== undefined ? { topicCode: ambil("topic") as string } : {}),
      ...(difficultyRaw !== undefined
        ? { difficulty: difficultyRaw as QuestionFilter["difficulty"] }
        : {}),
      ...(typeRaw !== undefined
        ? { questionType: typeRaw as QuestionFilter["questionType"] }
        : {}),
      ...(ambil("search") !== undefined ? { search: ambil("search") as string } : {}),
    };
    const repo = await getQuestionRepository();
    const daftar = await repo.list(filter);
    return NextResponse.json({ questions: daftar });
  } catch (e) {
    return responsKesalahan(e);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const sesi = await sesiApiCms(...peranCms);
    const body: unknown = await request.json().catch(() => null);
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
    }
    const hasil = parseDrafPenuh(body);
    if (!hasil.ok) {
      return NextResponse.json(
        { error: "Struktur soal tidak valid.", errors: hasil.errors },
        { status: 422 },
      );
    }
    const repo = await getQuestionRepository();
    try {
      const baru = await repo.create(hasil.data, sesi.id);
      return NextResponse.json({ question: baru }, { status: 201 });
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
