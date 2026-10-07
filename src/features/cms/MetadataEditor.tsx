/**
 * P4.5 — Editor metadata soal: taksonomi, tipe, difficulty, waktu, sumber.
 * Komponen terkontrol murni (tanpa fetch) — state milik QuestionEditor.
 */
"use client";

import type { CmsQuestionInput } from "../../server/repositories/question-model.ts";
import { difficulties, questionTypes, sourceTypes } from "../../domain/question/publish-gate.ts";

interface Props {
  nilai: CmsQuestionInput;
  ubah: (patch: Partial<CmsQuestionInput>) => void;
}

const LABEL_DIFFICULTY: Record<string, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sukar",
};
const LABEL_TIPE: Record<string, string> = {
  single_choice: "Pilihan tunggal",
  multiple_choice: "Pilihan ganda (kompleks)",
};
const LABEL_SUMBER: Record<string, string> = {
  official_reference: "Referensi resmi",
  original_internal: "Internal orisinal",
  licensed_partner: "Mitra berlisensi",
};

const inputCls =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";

export function MetadataEditor({ nilai, ubah }: Props) {
  return (
    <section aria-label="Metadata soal" className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-display text-base font-bold">Metadata</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Kode soal *</span>
          <input
            value={nilai.code}
            onChange={(e) => ubah({ code: e.target.value })}
            placeholder="cth. MAT-ALG-001"
            className={`${inputCls} font-mono`}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Estimasi waktu (detik)</span>
          <input
            type="number"
            min={0}
            max={7200}
            value={nilai.estimatedTimeSeconds}
            onChange={(e) => ubah({ estimatedTimeSeconds: Number(e.target.value) || 0 })}
            className={inputCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Subject</span>
          <input
            value={nilai.subjectCode}
            onChange={(e) => ubah({ subjectCode: e.target.value })}
            placeholder="cth. matematika"
            className={inputCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Topic</span>
          <input
            value={nilai.topicCode}
            onChange={(e) => ubah({ topicCode: e.target.value })}
            placeholder="cth. ALG"
            className={inputCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Subtopic</span>
          <input
            value={nilai.subtopicCode}
            onChange={(e) => ubah({ subtopicCode: e.target.value })}
            placeholder="cth. FUNC"
            className={inputCls}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Skill (pisahkan koma)</span>
          <input
            value={nilai.skillCodes.join(", ")}
            onChange={(e) =>
              ubah({
                skillCodes: e.target.value.split(",").map((s) => s.trim()).filter((s) => s !== ""),
              })
            }
            placeholder="cth. MATH.ALG.FUNC.QUAD.INTERPRET"
            className={`${inputCls} font-mono`}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Tipe soal</span>
          <select
            value={nilai.questionType}
            onChange={(e) =>
              ubah({ questionType: e.target.value as CmsQuestionInput["questionType"] })
            }
            className={inputCls}
          >
            {questionTypes.map((t) => (
              <option key={t} value={t}>
                {LABEL_TIPE[t] ?? t}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Difficulty</span>
          <select
            value={nilai.difficulty}
            onChange={(e) => ubah({ difficulty: e.target.value as CmsQuestionInput["difficulty"] })}
            className={inputCls}
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {LABEL_DIFFICULTY[d] ?? d}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-semibold">Tipe sumber</span>
          <select
            value={nilai.sourceType}
            onChange={(e) => ubah({ sourceType: e.target.value as CmsQuestionInput["sourceType"] })}
            className={inputCls}
          >
            {sourceTypes.map((s) => (
              <option key={s} value={s}>
                {LABEL_SUMBER[s] ?? s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-semibold">Referensi sumber (opsional)</span>
          <input
            value={nilai.sourceReference ?? ""}
            onChange={(e) => ubah({ sourceReference: e.target.value })}
            placeholder="cth. Buku paket hal. 42 / URL dokumen resmi"
            className={inputCls}
          />
        </label>
      </div>
    </section>
  );
}
