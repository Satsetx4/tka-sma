"use client";

import { useState } from "react";
import { QuestionRenderer } from "../../components/question/QuestionRenderer.tsx";
import { MobileContainer } from "../../components/layout/MobileContainer.tsx";

/**
 * Halaman demo QA mobile (P3.13) — BUKAN rute produksi.
 * Memuat SEMUA tipe blok + 1 blok rusak + rumus panjang + tabel lebar
 * agar Playwright memverifikasi: tanpa overflow di 320px dan nol error.
 */
export default function PreviewSoalPage() {
  const [mode, setMode] = useState<"practice" | "review">("practice");
  const [dipilih, setDipilih] = useState<number | null>(null);

  const stimulus = [
    { type: "text", content: "Perhatikan informasi berikut. Pilih satu jawaban yang paling tepat." },
    {
      type: "math",
      latex:
        "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\quad \\text{dan} \\quad \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2} \\quad \\text{serta} \\quad \\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}",
    },
    {
      type: "image",
      assetId: "https://picsum.photos/seed/tka-demo/640/360",
      alt: "Ilustrasi diagram eksperimen fisika",
      caption: "Gambar ilustrasi",
    },
    {
      type: "table",
      columns: ["No", "Variabel", "Nilai A", "Nilai B", "Satuan", "Keterangan tambahan"],
      rows: [
        ["1", "Massa", "12,5", "13,1", "kg", "Diukur tiga kali"],
        ["2", "Waktu", "0,45", "0,47", "s", "Rata-rata lima percobaan"],
      ],
    },
    {
      type: "chart",
      chartType: "bar",
      title: "Nilai rata-rata",
      labels: ["A", "B", "C"],
      datasets: [{ label: "Kelas", values: [7.5, 8.2, 6.9] }],
    },
    { type: "function_graph", expressions: ["y=x^2-4x+3", "y=2x-1"], xMin: -2, xMax: 6 },
    // 1 blok rusak: tipe tak dikenal → wajib tampil fallback, bukan throw.
    { type: "video", url: "https://contoh.invalid/v.mp4" },
    // Blok rusak kedua: skema math tanpa latex.
    { type: "math" },
  ];

  const opsi = [
    { blocks: [{ type: "text", content: "12,5 kg" }], isCorrect: false },
    { blocks: [{ type: "math", latex: "x=1 \\text{ atau } x=3" }], isCorrect: true },
    { blocks: [{ type: "text", content: "Tidak dapat ditentukan" }], isCorrect: false },
    // Opsi rusak: blok kosong → fallback per-opsi.
    { blocks: [], isCorrect: false },
  ];

  const penjelasan = {
    blocks: [
      { type: "text", content: "Faktorkan persamaan kuadrat: (x-1)(x-3)=0 sehingga x=1 atau x=3." },
      { type: "math", latex: "(x-1)(x-3)=0 \\Rightarrow x=1 \\lor x=3" },
    ],
    commonMistake: [{ type: "text", content: "Keliru tanda saat memfaktorkan konstanta positif." }],
    solvingTip: [{ type: "text", content: "Uji kembali dengan substitusi ke persamaan awal." }],
  };

  return (
    <MobileContainer hasBottomNav={false}>
      <main className="mx-auto w-full max-w-md space-y-4 p-4">
        <header className="space-y-2">
          <h1 className="text-lg font-bold">Pratinjau Soal (QA)</h1>
          <div className="flex gap-2" role="group" aria-label="Mode renderer">
            {(["practice", "review"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  mode === m
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </header>
        <QuestionRenderer
          blocks={stimulus}
          options={opsi}
          explanation={penjelasan}
          mode={mode}
          onSelect={setDipilih}
          selectedIndex={dipilih}
        />
      </main>
    </MobileContainer>
  );
}
