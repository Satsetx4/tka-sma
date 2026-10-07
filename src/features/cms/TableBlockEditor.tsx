/** P4.9 — Editor blok tabel: kolom + baris, panjang baris = jumlah kolom. */
"use client";
import type { TableBlock } from "../../domain/question/content-blocks.ts";
const CLS = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";
const BTN = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold dark:border-slate-700";
export function TableBlockEditor({ blok, ubah }: { blok: TableBlock; ubah: (b: TableBlock) => void }) {
  const setKolom = (i: number, v: string) => {
    const columns = [...blok.columns];
    columns[i] = v;
    ubah({ ...blok, columns });
  };
  const setSel = (r: number, c: number, v: string) => {
    const rows = blok.rows.map((baris) => [...baris]);
    const baris = rows[r];
    if (baris) baris[c] = v;
    ubah({ ...blok, rows });
  };
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap gap-1.5">
        <button type="button" className={BTN} onClick={() => ubah({ ...blok, columns: [...blok.columns, `Kolom ${blok.columns.length + 1}`], rows: blok.rows.map((b) => [...b, ""]) })}>+ Kolom</button>
        <button type="button" className={BTN} disabled={blok.columns.length <= 1} onClick={() => ubah({ ...blok, columns: blok.columns.slice(0, -1), rows: blok.rows.map((b) => b.slice(0, -1)) })}>− Kolom</button>
        <button type="button" className={BTN} onClick={() => ubah({ ...blok, rows: [...blok.rows, blok.columns.map(() => "")] })}>+ Baris</button>
        <button type="button" className={BTN} disabled={blok.rows.length <= 1} onClick={() => ubah({ ...blok, rows: blok.rows.slice(0, -1) })}>− Baris</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {blok.columns.map((k, i) => (
                <th key={i} className="p-1"><input aria-label={`Nama kolom ${i + 1}`} value={k} onChange={(e) => setKolom(i, e.target.value)} className={CLS} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blok.rows.map((baris, r) => (
              <tr key={r}>
                {blok.columns.map((_, c) => (
                  <td key={c} className="p-1"><input aria-label={`Sel baris ${r + 1} kolom ${c + 1}`} value={baris[c] ?? ""} onChange={(e) => setSel(r, c, e.target.value)} className={CLS} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
