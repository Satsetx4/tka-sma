/**
 * P4.6–P4.11 — Daftar blok konten: tambah (per tipe) + naik/turun +
 * hapus + delegasi ke editor spesifik. Dipakai untuk isi soal maupun
 * blok penjelasan (P4.14) agar bentuknya konsisten.
 */
"use client";

import type { ContentBlock } from "../../domain/question/content-blocks.ts";
import { BLOCK_LABELS, BLOCK_TYPES, defaultBlock, pindah, type BlockType } from "./blocks.ts";
import { TextBlockEditor } from "./TextBlockEditor.tsx";
import { MathBlockEditor } from "./MathBlockEditor.tsx";
import { ImageBlockEditor } from "./ImageBlockEditor.tsx";
import { TableBlockEditor } from "./TableBlockEditor.tsx";
import { ChartBlockEditor } from "./ChartBlockEditor.tsx";
import { GraphBlockEditor } from "./GraphBlockEditor.tsx";

const BTN = "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold dark:border-slate-700";

interface Props {
  judul: string;
  blok: ContentBlock[];
  ubah: (blok: ContentBlock[]) => void;
  idPrefix: string;
}

export function ContentBlocksEditor({ judul, blok, ubah, idPrefix }: Props) {
  return (
    <section aria-label={judul} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-base font-bold">{judul}</h2>
        <label className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500">+ Blok:</span>
          <select
            aria-label={`Tambah blok ke ${judul}`}
            defaultValue=""
            onChange={(e) => {
              const t = e.target.value as BlockType | "";
              if (t === "") return;
              ubah([...blok, defaultBlock(t)]);
              e.target.value = "";
            }}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="">Pilih tipe…</option>
            {BLOCK_TYPES.map((t) => (
              <option key={t} value={t}>{BLOCK_LABELS[t]}</option>
            ))}
          </select>
        </label>
      </div>
      {blok.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500 dark:border-slate-700">
          Belum ada blok. Tambahkan lewat pilihan tipe di atas.
        </p>
      ) : (
        <ol className="space-y-3">
          {blok.map((b, i) => (
            <li key={`${idPrefix}-${i}`} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {i + 1}. {BLOCK_LABELS[b.type as BlockType] ?? b.type}
                </span>
                <div className="flex gap-1">
                  <button type="button" className={BTN} aria-label={`Pindah blok ${i + 1} ke atas`} disabled={i === 0} onClick={() => ubah(pindah(blok, i, i - 1))}>↑</button>
                  <button type="button" className={BTN} aria-label={`Pindah blok ${i + 1} ke bawah`} disabled={i === blok.length - 1} onClick={() => ubah(pindah(blok, i, i + 1))}>↓</button>
                  <button type="button" className={BTN} aria-label={`Hapus blok ${i + 1}`} onClick={() => ubah(blok.filter((_, j) => j !== i))}>Hapus</button>
                </div>
              </div>
              {b.type === "text" ? (
                <TextBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : b.type === "math" ? (
                <MathBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : b.type === "image" ? (
                <ImageBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : b.type === "table" ? (
                <TableBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : b.type === "chart" ? (
                <ChartBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : b.type === "function_graph" ? (
                <GraphBlockEditor blok={b} ubah={(nb) => ubah(blok.map((x, j) => (j === i ? nb : x)))} />
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
