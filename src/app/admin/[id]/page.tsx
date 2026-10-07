/**
 * P4.5–P4.18 — Halaman detail soal: info kunci, workflow, editor.
 * Catatan P4.17: validasi approval manusia tetap di luar sistem —
 * tombol "Setujui" hanya sah bila penekan adalah reviewer/admin dan
 * bukan penulis soal (ditegakkan di resolveTransition, bukan di UI).
 */
import { notFound } from "next/navigation";
import { QuestionEditor } from "../../../features/cms/QuestionEditor.tsx";
import { WorkflowButtons } from "../../../features/cms/WorkflowButtons.tsx";
import { getQuestionRepository } from "../../../server/repositories/questions.ts";

export const dynamic = "force-dynamic";

export default async function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const soal = await (await getQuestionRepository()).getById(id);
  if (!soal) notFound();

  return (
    <main className="space-y-4">
      <div>
        <p className="font-mono text-sm text-slate-500">{soal.code}</p>
        <h1 className="font-display text-xl font-bold">Edit soal</h1>
        <p className="text-xs text-slate-500">
          Dibuat oleh {soal.createdBy || "(tak dikenal)"}
          {soal.reviewedBy ? ` · disetujui oleh ${soal.reviewedBy}` : " · belum disetujui"}
          {soal.publishedAt ? ` · publish ${soal.publishedAt}` : ""}.
        </p>
      </div>
      <WorkflowButtons soal={soal} />
      <QuestionEditor awal={soal} />
    </main>
  );
}
