"use client";

import type { TableBlock as DataTabel } from "../../domain/question/content-blocks.ts";

interface Props {
  block: DataTabel;
}

/**
 * Render blok tabel (P3.6). Wrapper overflow-x-auto + header nowrap menjamin
 * tabel lebar scroll DI DALAM blok di viewport 320px. Wrapper focusable
 * (tabIndex 0, role region) agar bisa di-scroll via keyboard.
 */
export function TableBlock({ block }: Props) {
  return (
    <div
      className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"
      role="region"
      aria-label="Tabel data"
      tabIndex={0}
    >
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            {block.columns.map((kolom, i) => (
              <th
                key={i}
                scope="col"
                className="px-3 py-2 font-semibold whitespace-nowrap text-slate-700 dark:text-slate-200"
              >
                {kolom}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((baris, i) => (
            <tr
              key={i}
              className="border-t border-slate-200 odd:bg-white even:bg-slate-50 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-900/60"
            >
              {baris.map((sel, j) => (
                <td key={j} className="px-3 py-2 align-top break-words text-slate-700 dark:text-slate-200">
                  {sel}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
