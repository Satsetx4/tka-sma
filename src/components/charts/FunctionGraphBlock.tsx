"use client";

import { useId } from "react";
import type { FunctionGraphBlock as DataGrafik } from "../../domain/question/content-blocks.ts";
import { sampelFungsi } from "./function-eval.ts";

interface Props {
  block: DataGrafik;
}

const LEBAR = 340;
const TINGGI = 240;
const PAD_KIRI = 36;
const PAD_KANAN = 8;
const PAD_ATAS = 10;
const PAD_BAWAH = 24;
const PALET = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#8b5cf6"];

function potong(teks: string, maks = 26): string {
  return teks.length > maks ? `${teks.slice(0, maks - 1)}…` : teks;
}

/**
 * Render blok grafik fungsi sebagai SVG statis (P3.8).
 * Ekspresi dievaluasi memakai evaluator aman function-eval (tanpa eval).
 * Rentang-y otomatis mengikuti data bila tidak diberikan; garis terputus
 * di titik tak-hingga (mis. 1/x di x=0).
 */
export function FunctionGraphBlock({ block }: Props) {
  const klipId = useId().replace(/:/g, "");

  let xAwal = block.xMin ?? -10;
  let xAkhir = block.xMax ?? 10;
  if (!Number.isFinite(xAwal) || !Number.isFinite(xAkhir) || !(xAkhir > xAwal)) {
    xAwal = -10;
    xAkhir = 10;
  }

  const sampel = block.expressions.map((ekspresi) => ({
    ekspresi,
    hasil: sampelFungsi(ekspresi, xAwal, xAkhir, 160),
  }));
  const semuaTitik = sampel.flatMap((s) => s.hasil.segments.flat());

  if (semuaTitik.length === 0) {
    const galat = sampel[0]?.hasil.error ?? "Fungsi tidak dapat dihitung.";
    return (
      <p role="alert" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Grafik tidak dapat digambar: {galat}
      </p>
    );
  }

  let yBawah: number;
  let yAtas: number;
  if (block.yMin !== undefined && block.yMax !== undefined && block.yMax > block.yMin) {
    yBawah = block.yMin;
    yAtas = block.yMax;
  } else {
    let min = Number.POSITIVE_INFINITY;
    let maks = Number.NEGATIVE_INFINITY;
    for (const t of semuaTitik) {
      if (t.y < min) min = t.y;
      if (t.y > maks) maks = t.y;
    }
    const rentang = maks - min || 1;
    yBawah = min - rentang * 0.15;
    yAtas = maks + rentang * 0.15;
  }

  const plotLebar = LEBAR - PAD_KIRI - PAD_KANAN;
  const plotTinggi = TINGGI - PAD_ATAS - PAD_BAWAH;
  const xKePiksel = (x: number) => PAD_KIRI + (plotLebar * (x - xAwal)) / (xAkhir - xAwal);
  const yKePiksel = (y: number) => PAD_ATAS + (plotTinggi * (yAtas - y)) / (yAtas - yBawah);
  const xTick = [0, 1, 2, 3, 4].map((i) => xAwal + ((xAkhir - xAwal) * i) / 4);
  const yTick = [0, 1, 2, 3].map((i) => yBawah + ((yAtas - yBawah) * i) / 3);
  const xNolTerlihat = xAwal <= 0 && 0 <= xAkhir;
  const yNolTerlihat = yBawah <= 0 && 0 <= yAtas;

  return (
    <div className="min-w-0 space-y-2">
      <svg
        viewBox={`0 0 ${LEBAR} ${TINGGI}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Grafik fungsi: ${block.expressions.join("; ")}`}
      >
        <defs>
          <clipPath id={klipId}>
            <rect x={PAD_KIRI} y={PAD_ATAS} width={plotLebar} height={plotTinggi} />
          </clipPath>
        </defs>
        <g className="text-slate-200 dark:text-slate-700" stroke="currentColor" strokeWidth={1}>
          {xTick.map((t, i) => (
            <line key={`x${i}`} x1={xKePiksel(t)} x2={xKePiksel(t)} y1={PAD_ATAS} y2={TINGGI - PAD_BAWAH} />
          ))}
          {yTick.map((t, i) => (
            <line key={`y${i}`} x1={PAD_KIRI} x2={LEBAR - PAD_KANAN} y1={yKePiksel(t)} y2={yKePiksel(t)} />
          ))}
        </g>
        {xNolTerlihat ? (
          <line x1={xKePiksel(0)} x2={xKePiksel(0)} y1={PAD_ATAS} y2={TINGGI - PAD_BAWAH} className="text-slate-400 dark:text-slate-500" stroke="currentColor" strokeWidth={1.25} />
        ) : null}
        {yNolTerlihat ? (
          <line x1={PAD_KIRI} x2={LEBAR - PAD_KANAN} y1={yKePiksel(0)} y2={yKePiksel(0)} className="text-slate-400 dark:text-slate-500" stroke="currentColor" strokeWidth={1.25} />
        ) : null}
        <g clipPath={`url(#${klipId})`}>
          {sampel.map((s, i) =>
            s.hasil.segments.map((seg, j) => (
              <polyline
                key={`${i}-${j}`}
                points={seg.map((p) => `${xKePiksel(p.x).toFixed(1)},${yKePiksel(p.y).toFixed(1)}`).join(" ")}
                fill="none"
                stroke={PALET[i % PALET.length] ?? "#10b981"}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <title>{s.ekspresi}</title>
              </polyline>
            )),
          )}
        </g>
        <g fontSize={9} className="fill-slate-500 dark:fill-slate-400">
          {xTick.map((t, i) => (
            <text key={`tx${i}`} x={xKePiksel(t)} y={TINGGI - 8} textAnchor="middle" fill="currentColor">
              {String(Math.round(t * 100) / 100)}
            </text>
          ))}
          {yTick.map((t, i) => (
            <text key={`ty${i}`} x={PAD_KIRI - 4} y={yKePiksel(t) + 3} textAnchor="end" fill="currentColor">
              {String(Math.round(t * 100) / 100)}
            </text>
          ))}
        </g>
      </svg>
      <ul className="m-0 flex flex-wrap gap-x-3 gap-y-1 p-0 text-xs text-slate-600 dark:text-slate-300">
        {sampel.map((s, i) => (
          <li key={i} className="flex min-w-0 items-center gap-1.5">
            <span aria-hidden="true" className="h-0.5 w-4 shrink-0 rounded-full" style={{ backgroundColor: PALET[i % PALET.length] ?? "#10b981" }} />
            <span className="truncate" title={s.ekspresi}>
              y = {potong(s.ekspresi.replace(/^(y|f\s*\(\s*x\s*\))\s*=/i, "").trim() || s.ekspresi)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
