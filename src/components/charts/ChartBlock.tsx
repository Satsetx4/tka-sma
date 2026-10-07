"use client";

import type { ChartBlock as DataChart } from "../../domain/question/content-blocks.ts";
import { fraksiPie, linearTicks, niceCeil, nilaiMaksimum, nilaiMinimum } from "./chart-scale.ts";

interface Props {
  block: DataChart;
}

const PALET = ["#10b981", "#0ea5e9", "#f59e0b", "#f43f5e", "#8b5cf6", "#14b8a6", "#f97316", "#64748b"];
const LEBAR = 340;
const TINGGI = 230;
const PAD_KIRI = 44;
const PAD_KANAN = 10;
const PAD_ATAS = 12;
const PAD_BAWAH = 30;

function warna(indeks: number): string {
  return PALET[indeks % PALET.length] ?? "#64748b";
}

function potongLabel(teks: string, maks = 8): string {
  return teks.length > maks ? `${teks.slice(0, maks - 1)}…` : teks;
}

function angkaBagus(nilai: number): string {
  return String(Math.round(nilai * 100) / 100);
}

function PesanChart({ teks }: { teks: string }) {
  return (
    <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      {teks}
    </p>
  );
}

function Legenda({ items }: { items: Array<{ label: string; warna: string; info?: string }> }) {
  return (
    <ul className="m-0 flex flex-wrap gap-x-3 gap-y-1 p-0 text-xs text-slate-600 dark:text-slate-300">
      {items.map((item, i) => (
        <li key={i} className="flex min-w-0 items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.warna }} />
          <span className="truncate">
            {item.label}
            {item.info ? <span className="text-slate-400"> · {item.info}</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface Bingkai {
  bawah: number;
  atas: number;
  ticks: number[];
  yKePiksel: (nilai: number) => number;
  plotLebar: number;
  plotTinggi: number;
}

/** Bingkai kartesius bersama untuk bar/line/scatter. */
function buatBingkai(bawah: number, atas: number): Bingkai {
  const span = atas - bawah > 0 ? atas - bawah : 1;
  const ticks =
    bawah === 0
      ? linearTicks(atas)
      : [0, 1, 2, 3, 4].map((i) => Math.round((bawah + (span * i) / 4) * 100) / 100);
  const plotLebar = LEBAR - PAD_KIRI - PAD_KANAN;
  const plotTinggi = TINGGI - PAD_ATAS - PAD_BAWAH;
  const yKePiksel = (nilai: number) => PAD_ATAS + (plotTinggi * (atas - nilai)) / span;
  return { bawah, atas, ticks, yKePiksel, plotLebar, plotTinggi };
}

function SumbuY({ bingkai }: { bingkai: Bingkai }) {
  return (
    <g className="text-slate-400 dark:text-slate-500" stroke="currentColor" strokeWidth={1}>
      {bingkai.ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD_KIRI} x2={LEBAR - PAD_KANAN} y1={bingkai.yKePiksel(t)} y2={bingkai.yKePiksel(t)} opacity={0.35} />
          <text
            x={PAD_KIRI - 5}
            y={bingkai.yKePiksel(t) + 3}
            textAnchor="end"
            fontSize={9}
            fill="currentColor"
            stroke="none"
          >
            {angkaBagus(t)}
          </text>
        </g>
      ))}
    </g>
  );
}

function DiagramBatang({ block }: Props) {
  const maks = nilaiMaksimum(block.datasets);
  const bawah = Math.min(0, nilaiMinimum(block.datasets));
  const atas = maks > 0 ? niceCeil(maks) : 1;
  const bingkai = buatBingkai(bawah, atas);
  const n = block.labels.length;
  const grupW = bingkai.plotLebar / n;
  const seri = block.datasets.length;
  const batangW = Math.max(4, Math.min(26, (grupW * 0.72) / seri));
  const yNol = bingkai.yKePiksel(0);

  return (
    <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="h-auto w-full" role="img" aria-label={`Diagram batang${block.title ? `: ${block.title}` : ""}`}>
      <SumbuY bingkai={bingkai} />
      {block.datasets.map((ds, s) =>
        ds.values.map((v, i) => {
          if (!Number.isFinite(v)) return null;
          const x = PAD_KIRI + grupW * i + (grupW - batangW * seri) / 2 + s * batangW;
          const yV = bingkai.yKePiksel(v);
          return (
            <rect
              key={`${s}-${i}`}
              x={x}
              y={Math.min(yV, yNol)}
              width={batangW}
              height={Math.max(1, Math.abs(yV - yNol))}
              rx={2}
              fill={warna(s)}
            >
              <title>{`${ds.label} · ${block.labels[i]}: ${v}`}</title>
            </rect>
          );
        }),
      )}
      {block.labels.map((label, i) => (
        <text
          key={i}
          x={PAD_KIRI + grupW * i + grupW / 2}
          y={TINGGI - 8}
          textAnchor="middle"
          fontSize={10}
          className="fill-slate-500 dark:fill-slate-400"
        >
          <title>{label}</title>
          {potongLabel(label)}
        </text>
      ))}
    </svg>
  );
}

function rentangLonggar(datasets: DataChart["datasets"]): { bawah: number; atas: number } {
  const lo = nilaiMinimum(datasets);
  const hi = nilaiMaksimum(datasets);
  const span = hi - lo || 1;
  return { bawah: lo - span * 0.1, atas: hi + span * 0.1 };
}

function DiagramGaris({ block }: Props) {
  const { bawah, atas } = rentangLonggar(block.datasets);
  const bingkai = buatBingkai(bawah, atas);
  const n = block.labels.length;
  const xKePiksel = (i: number) =>
    n === 1 ? PAD_KIRI + bingkai.plotLebar / 2 : PAD_KIRI + (bingkai.plotLebar * i) / (n - 1);

  return (
    <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="h-auto w-full" role="img" aria-label={`Diagram garis${block.title ? `: ${block.title}` : ""}`}>
      <SumbuY bingkai={bingkai} />
      {block.datasets.map((ds, s) => {
        const titik = ds.values
          .map((v, i) => (Number.isFinite(v) ? `${xKePiksel(i).toFixed(1)},${bingkai.yKePiksel(v).toFixed(1)}` : null))
          .filter((t): t is string => t !== null);
        if (titik.length === 0) return null;
        return (
          <g key={s}>
            <polyline points={titik.join(" ")} fill="none" stroke={warna(s)} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round">
              <title>{ds.label}</title>
            </polyline>
            {ds.values.map((v, i) =>
              Number.isFinite(v) ? (
                <circle key={i} cx={xKePiksel(i)} cy={bingkai.yKePiksel(v)} r={2.5} fill={warna(s)}>
                  <title>{`${ds.label} · ${block.labels[i]}: ${v}`}</title>
                </circle>
              ) : null,
            )}
          </g>
        );
      })}
      {block.labels.map((label, i) => (
        <text
          key={i}
          x={xKePiksel(i)}
          y={TINGGI - 8}
          textAnchor="middle"
          fontSize={10}
          className="fill-slate-500 dark:fill-slate-400"
        >
          <title>{label}</title>
          {potongLabel(label)}
        </text>
      ))}
    </svg>
  );
}

function DiagramPencar({ block }: Props) {
  const { bawah, atas } = rentangLonggar(block.datasets);
  const bingkai = buatBingkai(bawah, atas);
  const n = block.labels.length;
  const xKePiksel = (i: number) =>
    n === 1 ? PAD_KIRI + bingkai.plotLebar / 2 : PAD_KIRI + (bingkai.plotLebar * i) / (n - 1);

  return (
    <svg viewBox={`0 0 ${LEBAR} ${TINGGI}`} className="h-auto w-full" role="img" aria-label={`Diagram pencar${block.title ? `: ${block.title}` : ""}`}>
      <SumbuY bingkai={bingkai} />
      {block.datasets.map((ds, s) =>
        ds.values.map((v, i) =>
          Number.isFinite(v) ? (
            <circle key={`${s}-${i}`} cx={xKePiksel(i)} cy={bingkai.yKePiksel(v)} r={3.5} fill={warna(s)} opacity={0.85}>
              <title>{`${ds.label} · ${block.labels[i]}: ${v}`}</title>
            </circle>
          ) : null,
        ),
      )}
      {block.labels.map((label, i) => (
        <text
          key={i}
          x={xKePiksel(i)}
          y={TINGGI - 8}
          textAnchor="middle"
          fontSize={10}
          className="fill-slate-500 dark:fill-slate-400"
        >
          <title>{label}</title>
          {potongLabel(label)}
        </text>
      ))}
    </svg>
  );
}

function DiagramLingkaran({ block }: Props) {
  const ds = block.datasets[0];
  if (!ds) return <PesanChart teks="Data chart kosong." />;
  const fraksi = fraksiPie(ds.values);
  if (fraksi.every((f) => f === 0)) {
    return <PesanChart teks="Data chart kosong — tidak ada nilai positif untuk ditampilkan." />;
  }
  const R = 72;
  const cx = 92;
  const cy = 115;
  const busur = fraksi.reduce<Array<{ i: number; a0: number; a1: number; f: number }>>((ak, f, i) => {
    if (f <= 0) return ak;
    const awal = ak.length > 0 ? (ak[ak.length - 1]?.a1 ?? -Math.PI / 2) : -Math.PI / 2;
    return [...ak, { i, a0: awal, a1: awal + f * Math.PI * 2, f }];
  }, []);
  const potong = busur.map(({ i, a0, a1, f }) => {
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    return (
      <path key={i} d={`M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`} fill={warna(i)} strokeWidth={1} className="stroke-white dark:stroke-slate-900">
        <title>{`${block.labels[i]}: ${(f * 100).toFixed(1)}%`}</title>
      </path>
    );
  });

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox="0 0 340 230" className="h-auto w-full" role="img" aria-label={`Diagram lingkaran ${ds.label}`}>
        {potong}
      </svg>
      <Legenda
        items={block.labels.map((label, i) => ({
          label,
          warna: warna(i),
          info: `${((fraksi[i] ?? 0) * 100).toFixed(1)}%`,
        }))}
      />
    </div>
  );
}

/**
 * Render blok chart sebagai SVG statis (P3.7): bar/line/pie/scatter.
 * Skala memakai helper chart-scale; SVG viewBox responsif (w-full h-auto)
 * sehingga tidak meluber di 320px.
 */
export function ChartBlock({ block }: Props) {
  if (block.labels.length === 0 || block.datasets.length === 0) {
    return <PesanChart teks="Data chart kosong." />;
  }

  return (
    <div className="min-w-0 space-y-2">
      {block.title ? (
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{block.title}</p>
      ) : null}
      {block.chartType === "bar" ? <DiagramBatang block={block} /> : null}
      {block.chartType === "line" ? <DiagramGaris block={block} /> : null}
      {block.chartType === "scatter" ? <DiagramPencar block={block} /> : null}
      {block.chartType === "pie" ? (
        <DiagramLingkaran block={block} />
      ) : (
        <Legenda items={block.datasets.map((ds, i) => ({ label: ds.label, warna: warna(i) }))} />
      )}
    </div>
  );
}
