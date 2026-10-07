"use client";

import type { ContentBlock } from "../../domain/question/content-blocks.ts";
import { BlockRenderer } from "./BlockRenderer.tsx";

export type StatusOpsi = "default" | "dipilih" | "benar" | "salah";

interface Props {
  /** Blok konten opsi (sudah tervalidasi oleh QuestionRenderer). */
  blocks: ContentBlock[];
  /** Penanda huruf, mis. "A". */
  penanda: string;
  /** Status opsional: benar/salah untuk mode review, dipilih untuk practice. */
  status?: StatusOpsi;
  /** True bila opsi bisa diklik (mode practice + ada onPilih). */
  bisaDipilih?: boolean;
  onPilih?: () => void;
}

const GAYA_STATUS: Record<StatusOpsi, string> = {
  default: "border-slate-200 bg-white hover:border-sky-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-600",
  dipilih: "border-sky-500 bg-sky-50 ring-1 ring-sky-500 dark:border-sky-500 dark:bg-sky-950/40",
  benar: "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-500 dark:bg-emerald-950/40",
  salah: "border-rose-500 bg-rose-50 ring-1 ring-rose-500 dark:border-rose-500 dark:bg-rose-950/40",
};

const GAYA_LENCANA: Record<StatusOpsi, string> = {
  default: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  dipilih: "bg-sky-500 text-white",
  benar: "bg-emerald-500 text-white",
  salah: "bg-rose-500 text-white",
};

/**
 * Render satu opsi jawaban (P3.9): blok konten + penanda huruf + status
 * opsional benar/salah. Mode practice: tombol yang bisa dipilih;
 * mode review: div statis dengan penanda visual.
 */
export function OptionBlock({ blocks, penanda, status = "default", bisaDipilih = false, onPilih }: Props) {
  const isi = (
    <span className="flex min-w-0 items-start gap-2.5">
      <span aria-hidden="true" className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${GAYA_LENCANA[status]}`}>
        {penanda}
      </span>
      <span className="min-w-0 flex-1 space-y-2 text-left">
        {blocks.map((blok, i) => (
          <BlockRenderer key={i} data={blok} />
        ))}
      </span>
      {status === "benar" ? (
        <span aria-hidden="true" className="shrink-0 text-lg font-bold text-emerald-600 dark:text-emerald-400">✓</span>
      ) : null}
      {status === "salah" ? (
        <span aria-hidden="true" className="shrink-0 text-lg font-bold text-rose-600 dark:text-rose-400">✕</span>
      ) : null}
      <span className="sr-only">
        {status === "benar" ? " (jawaban benar)" : status === "salah" ? " (jawaban kurang tepat)" : ""}
      </span>
    </span>
  );

  if (bisaDipilih && onPilih) {
    return (
      <button
        type="button"
        onClick={onPilih}
        aria-pressed={status === "dipilih"}
        aria-label={`Opsi ${penanda}`}
        className={`block w-full rounded-2xl border p-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${GAYA_STATUS[status]}`}
      >
        {isi}
      </button>
    );
  }

  return (
    <div aria-label={`Opsi ${penanda}`} className={`w-full rounded-2xl border p-3 text-sm ${GAYA_STATUS[status]}`}>
      {isi}
    </div>
  );
}
