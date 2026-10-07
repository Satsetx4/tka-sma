/**
 * P4.16–P4.18 — Tombol aksi workflow per soal (client component).
 * Transisi legal dihitung dari status kini; tiap klik → POST workflow.
 * Penolakan: pesan + daftar field kurang (publish gate) tampil inline.
 */
"use client";

import { useState } from "react";
import type {
  CmsQuestion,
  CmsStatus,
} from "../../server/repositories/question-model.ts";
import { WORKFLOW_TRANSITIONS } from "../../server/repositories/question-model.ts";

const LABEL: Record<CmsStatus, string> = {
  draft: "Kembalikan ke draft",
  in_review: "Ajukan review",
  approved: "Setujui",
  published: "Publish",
  archived: "Arsipkan",
};

interface Galat {
  field: string;
  message: string;
}

export function WorkflowButtons({ soal: awal }: { soal: CmsQuestion }) {
  const [soal, setSoal] = useState(awal);
  const [sibuk, setSibuk] = useState<CmsStatus | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [kurang, setKurang] = useState<Galat[]>([]);

  const tujuan = WORKFLOW_TRANSITIONS[soal.status];

  async function jalan(to: CmsStatus): Promise<void> {
    setSibuk(to);
    setPesan(null);
    setKurang([]);
    try {
      const res = await fetch(`/api/cms/questions/${soal.id}/workflow`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: to }),
      });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        missing?: Galat[];
        question?: CmsQuestion;
      } | null;
      if (!res.ok || !body?.question) {
        setPesan(body?.error ?? "Transisi gagal.");
        if (body?.missing) setKurang(body.missing);
        return;
      }
      setSoal(body.question);
      setPesan(`Status kini: ${body.question.status}.`);
    } catch {
      setPesan("Transisi gagal (jaringan).");
    } finally {
      setSibuk(null);
    }
  }

  return (
    <section aria-label="Workflow soal" className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">
          Status: <strong>{soal.status}</strong>
        </span>
        {tujuan.map((to) => (
          <button
            key={to}
            type="button"
            disabled={sibuk !== null}
            onClick={() => void jalan(to)}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {sibuk === to ? "…" : LABEL[to]}
          </button>
        ))}
      </div>
      {pesan ? (
        <p role="status" className="mt-2 text-sm font-semibold">
          {pesan}
        </p>
      ) : null}
      {kurang.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-700 dark:text-red-300" aria-label="Field yang kurang untuk publish">
          {kurang.map((g, i) => (
            <li key={i}>
              <code className="font-mono">{g.field}</code>: {g.message}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-xs text-slate-500">
        Penyetujuan hanya oleh reviewer/admin; penulis tidak bisa menyetujui karyanya sendiri.
        {soal.reviewedBy ? ` Disetujui oleh: ${soal.reviewedBy}.` : ""}
      </p>
    </section>
  );
}
