/** P4.7 — Editor blok rumus: LaTeX mentah, bukan tangkapan layar. */
"use client";
import type { MathBlock } from "../../domain/question/content-blocks.ts";
const CLS = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";
export function MathBlockEditor({ blok, ubah }: { blok: MathBlock; ubah: (b: MathBlock) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-semibold">LaTeX</span>
      <textarea value={blok.latex} onChange={(e) => ubah({ ...blok, latex: e.target.value })} rows={2} placeholder="cth. f(x)=x^2-4x+3" dir="ltr" className={`${CLS} font-mono`} />
      <span className="mt-1 block text-xs text-slate-500">Simpan rumus sebagai LaTeX/teks — jangan unggah gambar rumus.</span>
    </label>
  );
}
