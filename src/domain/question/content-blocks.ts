import { z } from "zod";

/**
 * Model blok konten terstruktur untuk soal, stimulus, opsi, dan penjelasan.
 *
 * Aturan kontrak (docs/QUESTION-SCHEMA.md, docs/ARCHITECTURE.md):
 * - Tipe blok V1: text, math, image, table, chart, function_graph.
 * - Arbitrary HTML dilarang; rumus disimpan sebagai LaTeX/teks, bukan gambar.
 * - File ini domain murni: tanpa I/O, tanpa React/Next, boleh dipakai client & server.
 */

// Batas wajar agar payload JSONB tetap kecil dan renderer tidak terbebani.
export const MAX_TEXT_CONTENT_LENGTH = 20_000;
export const MAX_LATEX_LENGTH = 5_000;
export const MAX_ASSET_ID_LENGTH = 200;
export const MAX_CAPTION_LENGTH = 500;
export const MAX_TABLE_COLUMNS = 24;
export const MAX_TABLE_ROWS = 200;
export const MAX_CELL_LENGTH = 2_000;
export const MAX_CHART_LABELS = 64;
export const MAX_CHART_DATASETS = 12;
export const MAX_GRAPH_EXPRESSIONS = 8;
export const MAX_EXPRESSION_LENGTH = 500;

export const textBlockSchema = z.object({
  type: z.literal("text"),
  content: z
    .string()
    .trim()
    .min(1, { error: "Isi teks tidak boleh kosong." })
    .max(MAX_TEXT_CONTENT_LENGTH, { error: "Isi teks melebihi batas." }),
});

export const mathBlockSchema = z.object({
  type: z.literal("math"),
  latex: z
    .string()
    .trim()
    .min(1, { error: "LaTeX tidak boleh kosong; simpan rumus sebagai LaTeX, bukan tangkapan layar." })
    .max(MAX_LATEX_LENGTH, { error: "LaTeX melebihi batas." }),
});

export const imageBlockSchema = z.object({
  type: z.literal("image"),
  assetId: z
    .string()
    .trim()
    .min(1, { error: "assetId gambar wajib diisi." })
    .max(MAX_ASSET_ID_LENGTH, { error: "assetId gambar melebihi batas." }),
  alt: z.string().trim().min(1, { error: "Alt text gambar wajib diisi." }),
  caption: z.string().trim().max(MAX_CAPTION_LENGTH, { error: "Caption melebihi batas." }).nullable().optional(),
});

export const tableBlockSchema = z
  .object({
    type: z.literal("table"),
    columns: z
      .array(z.string().trim().min(1, { error: "Nama kolom tidak boleh kosong." }))
      .min(1, { error: "Tabel wajib punya minimal satu kolom." })
      .max(MAX_TABLE_COLUMNS, { error: "Kolom tabel melebihi batas." }),
    rows: z
      .array(z.array(z.string().max(MAX_CELL_LENGTH, { error: "Sel tabel melebihi batas." })).min(1))
      .min(1, { error: "Tabel wajib punya minimal satu baris." })
      .max(MAX_TABLE_ROWS, { error: "Baris tabel melebihi batas." }),
  })
  .superRefine((blok, ctx) => {
    blok.rows.forEach((baris, indeks) => {
      if (baris.length !== blok.columns.length) {
        ctx.addIssue({
          code: "custom",
          message: `Baris ${indeks + 1} punya ${baris.length} sel, harus ${blok.columns.length} mengikuti jumlah kolom.`,
          path: ["rows", indeks],
        });
      }
    });
  });

export const chartTypes = ["bar", "line", "pie", "scatter"] as const;
export type ChartType = (typeof chartTypes)[number];

export const chartBlockSchema = z
  .object({
    type: z.literal("chart"),
    chartType: z.enum(chartTypes, { error: "Jenis chart tidak dikenal." }),
    title: z.string().trim().min(1).max(200).optional(),
    labels: z
      .array(z.string().trim().min(1, { error: "Label chart tidak boleh kosong." }))
      .min(1, { error: "Chart wajib punya minimal satu label." })
      .max(MAX_CHART_LABELS, { error: "Label chart melebihi batas." }),
    datasets: z
      .array(
        z.object({
          label: z.string().trim().min(1, { error: "Label dataset tidak boleh kosong." }),
          values: z.array(z.number().finite({ error: "Nilai chart harus angka." })).min(1),
        }),
      )
      .min(1, { error: "Chart wajib punya minimal satu dataset." })
      .max(MAX_CHART_DATASETS, { error: "Dataset chart melebihi batas." }),
  })
  .superRefine((blok, ctx) => {
    blok.datasets.forEach((dataset, indeks) => {
      if (dataset.values.length !== blok.labels.length) {
        ctx.addIssue({
          code: "custom",
          message: `Dataset "${dataset.label}" punya ${dataset.values.length} nilai, harus ${blok.labels.length} mengikuti jumlah label.`,
          path: ["datasets", indeks, "values"],
        });
      }
    });
  });

export const functionGraphBlockSchema = z
  .object({
    type: z.literal("function_graph"),
    expressions: z
      .array(
        z
          .string()
          .trim()
          .min(1, { error: "Ekspresi fungsi tidak boleh kosong." })
          .max(MAX_EXPRESSION_LENGTH, { error: "Ekspresi fungsi melebihi batas." }),
      )
      .min(1, { error: "Grafik fungsi wajib punya minimal satu ekspresi." })
      .max(MAX_GRAPH_EXPRESSIONS, { error: "Ekspresi grafik melebihi batas." }),
    xMin: z.number().finite().optional(),
    xMax: z.number().finite().optional(),
    yMin: z.number().finite().optional(),
    yMax: z.number().finite().optional(),
  })
  .superRefine((blok, ctx) => {
    if (blok.xMin !== undefined && blok.xMax !== undefined && blok.xMin >= blok.xMax) {
      ctx.addIssue({ code: "custom", message: "xMin harus lebih kecil dari xMax.", path: ["xMin"] });
    }
    if (blok.yMin !== undefined && blok.yMax !== undefined && blok.yMin >= blok.yMax) {
      ctx.addIssue({ code: "custom", message: "yMin harus lebih kecil dari yMax.", path: ["yMin"] });
    }
  });

export const contentBlockSchema = z.discriminatedUnion("type", [
  textBlockSchema,
  mathBlockSchema,
  imageBlockSchema,
  tableBlockSchema,
  chartBlockSchema,
  functionGraphBlockSchema,
]);

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type TextBlock = z.infer<typeof textBlockSchema>;
export type MathBlock = z.infer<typeof mathBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type TableBlock = z.infer<typeof tableBlockSchema>;
export type ChartBlock = z.infer<typeof chartBlockSchema>;
export type FunctionGraphBlock = z.infer<typeof functionGraphBlockSchema>;

/** Opsi jawaban: blok konten kaya (kolom content_blocks) + penanda benar (kolom is_correct). */
export const questionOptionSchema = z.object({
  blocks: z
    .array(contentBlockSchema)
    .min(1, { error: "Setiap opsi wajib punya minimal satu blok konten." }),
  isCorrect: z.boolean(),
});
export type QuestionOption = z.infer<typeof questionOptionSchema>;

/** Penjelasan editorial: blok langkah + kesalahan umum + tips (semuanya terstruktur, bukan HTML). */
export const explanationSectionSchema = z.object({
  blocks: z
    .array(contentBlockSchema)
    .min(1, { error: "Penjelasan wajib punya minimal satu blok." }),
  commonMistake: z.array(contentBlockSchema).optional(),
  solvingTip: z.array(contentBlockSchema).optional(),
});
export type ExplanationSection = z.infer<typeof explanationSectionSchema>;

/** Ambil semua blok gambar dari daftar blok (untuk cek alt text di publish gate). */
export function findImageBlocks(bloks: readonly ContentBlock[]): ImageBlock[] {
  return bloks.filter((blok): blok is ImageBlock => blok.type === "image");
}

/** Validasi array blok mentah (mis. dari JSONB DB atau payload CMS). */
export function parseContentBlocks(input: unknown) {
  return z.array(contentBlockSchema).safeParse(input);
}
