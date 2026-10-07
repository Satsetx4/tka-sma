/**
 * P4.5–P4.15 — Form editor soal lengkap (client component).
 *
 * Dipakai halaman /admin/baru (mode buat) dan /admin/[id] (mode ubah).
 * Simpan → POST/PATCH /api/cms/questions. Pratinjau memakai
 * QuestionRenderer YANG SAMA dengan aplikasi siswa (P4.15) —
 * tidak ada renderer kedua.
 */
"use client";

import { useMemo, useState } from "react";
import { QuestionRenderer } from "../../components/question/QuestionRenderer.tsx";
import type {
  CmsQuestion,
  CmsQuestionInput,
} from "../../server/repositories/question-model.ts";
import { ContentBlocksEditor } from "./ContentBlocksEditor.tsx";
import { ExplanationEditor } from "./ExplanationEditor.tsx";
import { MetadataEditor } from "./MetadataEditor.tsx";
import { OptionsEditor } from "./OptionsEditor.tsx";

interface HasilSimpan {
  ok: boolean;
  pesan: string;
  id?: string;
}

const AWAL: CmsQuestionInput = {
  code: "",
  subjectCode: "matematika",
  topicCode: "",
  subtopicCode: "",
  skillCodes: [],
  difficulty: "medium",
  questionType: "single_choice",
  contentBlocks: [{ type: "text", content: "" }],
  options: [
    { blocks: [{ type: "text", content: "" }], isCorrect: true },
    { blocks: [{ type: "text", content: "" }], isCorrect: false },
  ],
  explanation: { blocks: [{ type: "text", content: "" }] },
  sourceType: "original_internal",
  estimatedTimeSeconds: 120,
};

export function QuestionEditor({ awal }: { awal?: CmsQuestion | null }) {
  const [nilai, setNilai] = useState<CmsQuestionInput>(() =>
    awal
      ? {
          code: awal.code,
          subjectCode: awal.subjectCode,
          topicCode: awal.topicCode,
          subtopicCode: awal.subtopicCode,
          skillCodes: [...awal.skillCodes],
          difficulty: awal.difficulty,
          questionType: awal.questionType,
          contentBlocks: awal.contentBlocks,
          options: awal.options,
          explanation: awal.explanation,
          sourceType: awal.sourceType,
          ...(awal.sourceReference ? { sourceReference: awal.sourceReference } : {}),
          estimatedTimeSeconds: awal.estimatedTimeSeconds,
        }
      : AWAL,
  );
  const [tab, setTab] = useState<"tulis" | "pratinjau">("tulis");
  const [sibuk, setSibuk] = useState(false);
  const [hasil, setHasil] = useState<HasilSimpan | null>(null);

  const patch = (p: Partial<CmsQuestionInput>): void => {
    setNilai((lama) => ({ ...lama, ...p }));
  };

  const opsiPratinjau = useMemo(
    () =>
      nilai.options.map((o) => ({
        blocks: o.blocks.length > 0 ? o.blocks : [{ type: "text", content: "(opsi kosong)" }],
        isCorrect: o.isCorrect,
      })),
    [nilai.options],
  );

  async function simpan(): Promise<void> {
    setSibuk(true);
    setHasil(null);
    try {
      const url = awal ? `/api/cms/questions/${awal.id}` : "/api/cms/questions";
      const res = await fetch(url, {
        method: awal ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(nilai),
      });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        errors?: Array<{ field: string; message: string }>;
        question?: { id: string };
      } | null;
      if (!res.ok || !body?.question) {
        const rincian = (body?.errors ?? []).map((e) => `${e.field}: ${e.message}`).join("\n");
        setHasil({
          ok: false,
          pesan: `${body?.error ?? "Gagal menyimpan."}${rincian === "" ? "" : `\n${rincian}`}`,
        });
        return;
      }
      setHasil({ ok: true, pesan: "Tersimpan.", id: body.question.id });
    } catch {
      setHasil({ ok: false, pesan: "Gagal menyimpan (jaringan)." });
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-xl bg-slate-200 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="Mode editor">
          {(["tulis", "pratinjau"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={tab === m}
              onClick={() => setTab(m)}
              className={`rounded-lg px-4 py-1.5 font-semibold ${tab === m ? "bg-white shadow dark:bg-slate-900" : "text-slate-500"}`}
            >
              {m === "tulis" ? "Tulis" : "Pratinjau"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void simpan()}
          disabled={sibuk}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {sibuk ? "Menyimpan…" : awal ? "Simpan perubahan" : "Buat soal"}
        </button>
      </div>

      {hasil ? (
        <p
          role={hasil.ok ? "status" : "alert"}
          className={`whitespace-pre-line rounded-xl px-4 py-3 text-sm font-semibold ${hasil.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200" : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"}`}
        >
          {hasil.pesan}
          {hasil.ok && hasil.id && !awal ? (
            <>
              {" "}
              <a href={`/admin/${hasil.id}`} className="underline">Buka soal</a>
            </>
          ) : null}
        </p>
      ) : null}

      {tab === "pratinjau" ? (
        <section aria-label="Pratinjau soal" className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-3 text-xs text-slate-500">
            Pratinjau memakai QuestionRenderer yang sama dengan aplikasi siswa (mode review agar kunci + pembahasan terlihat).
          </p>
          <QuestionRenderer
            blocks={nilai.contentBlocks}
            options={opsiPratinjau}
            explanation={{
              blocks: nilai.explanation.blocks,
              commonMistake: nilai.explanation.commonMistake ?? [],
              solvingTip: nilai.explanation.solvingTip ?? [],
            }}
            mode="review"
          />
        </section>
      ) : (
        <div className="space-y-4">
          <MetadataEditor nilai={nilai} ubah={patch} />
          <ContentBlocksEditor
            judul="Isi soal"
            blok={nilai.contentBlocks}
            ubah={(contentBlocks) => patch({ contentBlocks })}
            idPrefix="isi"
          />
          <OptionsEditor opsi={nilai.options} ubah={(options) => patch({ options })} tipe={nilai.questionType} />
          <ExplanationEditor nilai={nilai.explanation} ubah={(explanation) => patch({ explanation })} />
        </div>
      )}
    </div>
  );
}
