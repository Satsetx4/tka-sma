/**
 * Pabrik + label blok konten untuk editor CMS (client-safe, tanpa I/O).
 * Bentuk blok mengikuti skema domain (src/domain/question/) — editor
 * hanya memproduksi data terstruktur, tidak pernah HTML bebas.
 */
import type {
  ChartType,
  ContentBlock,
} from "../../domain/question/content-blocks.ts";

export const BLOCK_TYPES = [
  "text",
  "math",
  "image",
  "table",
  "chart",
  "function_graph",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const BLOCK_LABELS: Record<BlockType, string> = {
  text: "Teks",
  math: "Rumus (LaTeX)",
  image: "Gambar",
  table: "Tabel",
  chart: "Chart",
  function_graph: "Grafik fungsi",
};

export const CHART_TYPES: readonly ChartType[] = ["bar", "line", "pie", "scatter"];

export function defaultBlock(tipe: BlockType): ContentBlock {
  switch (tipe) {
    case "text":
      return { type: "text", content: "" };
    case "math":
      return { type: "math", latex: "" };
    case "image":
      return { type: "image", assetId: "", alt: "" };
    case "table":
      return { type: "table", columns: ["Kolom 1"], rows: [[""]] };
    case "chart":
      return {
        type: "chart",
        chartType: "bar",
        labels: ["A", "B"],
        datasets: [{ label: "Nilai", values: [0, 0] }],
      };
    case "function_graph":
      return { type: "function_graph", expressions: ["y=x"] };
  }
}

/** Pindah item dalam array (untuk tombol naik/turun). */
export function pindah<T>(daftar: readonly T[], dari: number, ke: number): T[] {
  if (ke < 0 || ke >= daftar.length) return [...daftar];
  const salin = [...daftar];
  const [item] = salin.splice(dari, 1);
  if (item === undefined) return salin;
  salin.splice(ke, 0, item);
  return salin;
}
