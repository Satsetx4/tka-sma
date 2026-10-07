/** P4.11 — Editor blok grafik fungsi: daftar ekspresi + rentang sumbu. */
"use client";
import type { FunctionGraphBlock } from "../../domain/question/content-blocks.ts";
const CLS = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";
const BTN = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700";
export function GraphBlockEditor({ blok, ubah }: { blok: FunctionGraphBlock; ubah: (b: FunctionGraphBlock) => void }) {
  const setEkspresi = (i: number, v: string) => {
    const expressions = [...blok.expressions];
    expressions[i] = v;
    ubah({ ...blok, expressions });
  };
  const setBatas = (k: "xMin" | "xMax" | "yMin" | "yMax", mentah: string) => {
    const t = mentah.trim();
    if (t === "") {
      const salin = { ...blok };
      delete salin[k];
      ubah(salin);
      return;
    }
    const v = Number(t);
    if (Number.isFinite(v)) ubah({ ...blok, [k]: v });
  };
  return (
    <div className="space-y-2 text-sm">
      <div className="space-y-1.5">
        <span className="block font-semibold">Ekspresi fungsi</span>
        {blok.expressions.map((e, i) => (
          <div key={i} className="flex gap-1.5">
            <input aria-label={`Ekspresi ${i + 1}`} value={e} onChange={(ev) => setEkspresi(i, ev.target.value)} placeholder="cth. y=x^2-4x+3" dir="ltr" className={`${CLS} font-mono`} />
            <button type="button" className={BTN} aria-label={`Hapus ekspresi ${i + 1}`} disabled={blok.expressions.length <= 1} onClick={() => ubah({ ...blok, expressions: blok.expressions.filter((_, j) => j !== i) })}>✕</button>
          </div>
        ))}
        <button type="button" className={BTN} onClick={() => ubah({ ...blok, expressions: [...blok.expressions, "y=x"] })}>+ Ekspresi</button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(["xMin", "xMax", "yMin", "yMax"] as const).map((k) => (
          <label key={k} className="block"><span className="mb-1 block font-semibold">{k}</span>
            <input value={blok[k] ?? ""} onChange={(e) => setBatas(k, e.target.value)} placeholder="auto" inputMode="decimal" className={CLS} />
          </label>
        ))}
      </div>
    </div>
  );
}
