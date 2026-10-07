/**
 * P4.16–P4.18 — Transisi status soal (POST { status }).
 *
 * Semua aturan terpusat di resolveTransition (question-model.ts):
 * - jalur legal DRAFT → IN_REVIEW → APPROVED → PUBLISHED (→ ARCHIVED);
 * - approved: hanya reviewer/admin + bukan penulis sendiri;
 * - published: hanya reviewer/admin + lolos checkPublishGate.
 * Status 422 + missing[] bila publish gate tak lengkap (P4.18).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { CmsStatus } from "../../../../../../server/repositories/question-model.ts";
import {
  cmsStatuses,
  resolveTransition,
} from "../../../../../../server/repositories/question-model.ts";
import { getQuestionRepository } from "../../../../../../server/repositories/questions.ts";
import { peranCms, responsKesalahan, sesiApiCms } from "../../../_auth.ts";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Ctx): Promise<NextResponse> {
  try {
    const sesi = await sesiApiCms(...peranCms);
    const { id } = await params;
    const body: unknown = await request.json().catch(() => null);
    const tujuan =
      body !== null && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)["status"]
        : undefined;
    if (typeof tujuan !== "string" || !(cmsStatuses as readonly string[]).includes(tujuan)) {
      return NextResponse.json(
        { error: `Status tujuan tidak dikenal. Pilihan: ${cmsStatuses.join(", ")}.` },
        { status: 400 },
      );
    }
    const repo = await getQuestionRepository();
    const lama = await repo.getById(id);
    if (!lama) return NextResponse.json({ error: "Soal tidak ditemukan." }, { status: 404 });
    const rencana = resolveTransition(lama, tujuan as CmsStatus, {
      id: sesi.id,
      role: sesi.role,
    });
    if (!rencana.ok) {
      const kode = rencana.code ?? "ILLEGAL_TRANSITION";
      const statusHttp = kode === "PUBLISH_GATE_INCOMPLETE" || kode === "ILLEGAL_TRANSITION" ? 422 : 403;
      return NextResponse.json(
        {
          error: rencana.message,
          code: kode,
          ...(rencana.missing ? { missing: rencana.missing } : {}),
        },
        { status: statusHttp },
      );
    }
    const sudah = await repo.setStatus(id, tujuan as CmsStatus, sesi.id, {
      ...(tujuan === "approved" ? { reviewedBy: sesi.id } : {}),
      ...(tujuan === "draft" ? { reviewedBy: null } : {}),
    });
    return NextResponse.json({ question: sudah });
  } catch (e) {
    return responsKesalahan(e);
  }
}
