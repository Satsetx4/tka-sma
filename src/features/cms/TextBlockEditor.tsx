/** P4.6 — Editor blok teks (teks biasa, bukan HTML). */
"use client";
import type { TextBlock } from "../../domain/question/content-blocks.ts";
const CLS = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";
export function TextBlockEditor({ blok, ubah }: { blok: TextBlock; ubah: (b: TextBlock) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold">Isi teks</span>
      <textarea value={blok.content} onChange={(e) => ubah({ ...blok, content: e.target.value })} rows={3} placeholder="Tulis teks soal…" className={CLS} />
    </label>
  );
}
