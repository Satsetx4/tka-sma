/**
 * P4.12 + P4.13 — Editor opsi jawaban: tiap opsi = blok konten kaya
 * (bukan teks saja) + penanda benar. Aturan benar ditegakkan ganda:
 * peringatan inline di sini DAN publish gate di server.
 */
"use client";

import type { QuestionType } from "../../domain/question/publish-gate.ts";
import type { CmsOption } from "../../server/repositories/question-model.ts";
import { ContentBlocksEditor } from "./ContentBlocksEditor.tsx";

const BTN = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700";
const HURUF = ["A", "B", "C", "D", "E", "F", "G", "H"];

interface Props {
  opsi: CmsOption[];
  ubah: (opsi: CmsOption[]) => void;
  tipe: QuestionType;
}

export function OptionsEditor({ opsi, ubah, tipe }: Props) {
  const jumlahBenar = opsi.filter((o) => o.isCorrect).length;
  const peringatan =
    tipe === "single_choice" && jumlahBenar !== 1
      ? "Pilihan tunggal wajib punya TEPAT SATU jawaban benar sebelum publish."
      : tipe === "multiple_choice" && jumlahBenar < 1
        ? "Pilihan ganda wajib punya MINIMAL SATU jawaban benar sebelum publish."
        : null;

  const tandai = (i: number, benar: boolean) => {
    if (tipe === "single_choice" && benar) {
      ubah(opsi.map((o, j) => ({ ...o, isCorrect: j === i })));
    } else {
      ubah(opsi.map((o, j) => (j === i ? { ...o, isCorrect: benar } : o)));
    }
  };

  return (
    <section aria-label="Opsi jawaban" className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base font-bold">Opsi jawaban ({opsi.length})</h2>
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          onClick={() => ubah([...opsi, { blocks: [{ type: "text", content: "" }], isCorrect: false }])}
        >
          + Opsi
        </button>
      </div>
      {peringatan ? (
        <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          {peringatan}
        </p>
      ) : null}
      <ol className="space-y-3">
        {opsi.map((o, i) => (
          <li key={i} className={`rounded-xl border-2 p-3 ${o.isCorrect ? "border-emerald-500" : "border-slate-200 dark:border-slate-700"}`}>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
                <input
                  type={tipe === "single_choice" ? "radio" : "checkbox"}
                  name="cms-benar"
                  checked={o.isCorrect}
                  onChange={(e) => tandai(i, e.target.checked)}
                />
                Opsi {HURUF[i] ?? i + 1}
                {o.isCorrect ? <span className="text-xs font-semibold text-emerald-600">✓ benar</span> : null}
              </label>
              <button type="button" className={BTN} disabled={opsi.length <= 2} onClick={() => ubah(opsi.filter((_, j) => j !== i))}>
                Hapus opsi
              </button>
            </div>
            <ContentBlocksEditor
              judul={`Konten opsi ${HURUF[i] ?? i + 1}`}
              blok={o.blocks}
              ubah={(blok) => ubah(opsi.map((x, j) => (j === i ? { ...x, blocks: blok } : x)))}
              idPrefix={`opsi-${i}`}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
