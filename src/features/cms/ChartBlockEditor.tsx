/** P4.10 — Editor blok chart: jenis, label, dataset + nilai per label. */
"use client";
import type { ChartBlock } from "../../domain/question/content-blocks.ts";
import { CHART_TYPES } from "./blocks.ts";
const CLS = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";
const BTN = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700";
export function ChartBlockEditor({ blok, ubah }: { blok: ChartBlock; ubah: (b: ChartBlock) => void }) {
  const setLabel = (i: number, v: string) => {
    const labels = [...blok.labels];
    labels[i] = v;
    ubah({ ...blok, labels });
  };
  const tambahLabel = () => {
    const labels = [...blok.labels, `L${blok.labels.length + 1}`];
    ubah({ ...blok, labels, datasets: blok.datasets.map((d) => ({ ...d, values: [...d.values, 0] })) });
  };
  const hapusLabel = () => {
    if (blok.labels.length <= 1) return;
    ubah({ ...blok, labels: blok.labels.slice(0, -1), datasets: blok.datasets.map((d) => ({ ...d, values: d.values.slice(0, -1) })) });
  };
  const setNilai = (di: number, vi: number, v: number) => {
    const datasets = blok.datasets.map((d, i) => {
      if (i !== di) return d;
      const values = [...d.values];
      values[vi] = Number.isFinite(v) ? v : 0;
      return { ...d, values };
    });
    ubah({ ...blok, datasets });
  };
  return (
    <div className="space-y-2 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block"><span className="mb-1 block font-semibold">Jenis chart</span>
          <select value={blok.chartType} onChange={(e) => ubah({ ...blok, chartType: e.target.value as ChartBlock["chartType"] })} className={CLS}>
            {CHART_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </label>
        <label className="block"><span className="mb-1 block font-semibold">Judul (opsional)</span>
          <input value={blok.title ?? ""} onChange={(e) => ubah({ ...blok, title: e.target.value })} className={CLS} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="font-semibold">Label:</span>
        {blok.labels.map((l, i) => (
          <input key={i} aria-label={`Label ${i + 1}`} value={l} onChange={(e) => setLabel(i, e.target.value)} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
        ))}
        <button type="button" className={BTN} onClick={tambahLabel}>+ Label</button>
        <button type="button" className={BTN} disabled={blok.labels.length <= 1} onClick={hapusLabel}>− Label</button>
      </div>
      {blok.datasets.map((d, di) => (
        <fieldset key={di} className="rounded-xl border border-slate-200 p-2 dark:border-slate-700">
          <legend className="px-1 text-xs font-semibold">Dataset {di + 1}</legend>
          <input aria-label={`Nama dataset ${di + 1}`} value={d.label} onChange={(e) => ubah({ ...blok, datasets: blok.datasets.map((x, i) => (i === di ? { ...x, label: e.target.value } : x)) })} className={CLS} />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {blok.labels.map((_, vi) => (
              <input key={vi} type="number" aria-label={`Nilai ${blok.labels[vi]}`} value={d.values[vi] ?? 0} onChange={(e) => setNilai(di, vi, Number(e.target.value))} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800" />
            ))}
          </div>
        </fieldset>
      ))}
      <div className="flex gap-1.5">
        <button type="button" className={BTN} onClick={() => ubah({ ...blok, datasets: [...blok.datasets, { label: `Data ${blok.datasets.length + 1}`, values: blok.labels.map(() => 0) }] })}>+ Dataset</button>
        <button type="button" className={BTN} disabled={blok.datasets.length <= 1} onClick={() => ubah({ ...blok, datasets: blok.datasets.slice(0, -1) })}>− Dataset</button>
      </div>
    </div>
  );
}
