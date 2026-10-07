"use client";

import {
  explanationSectionSchema,
  questionOptionSchema,
  type ExplanationSection,
  type QuestionOption,
} from "../../domain/question/content-blocks.ts";
import { BlockRenderer } from "./BlockRenderer.tsx";
import { ExplanationBlock } from "./ExplanationBlock.tsx";
import { InvalidBlockFallback } from "./InvalidBlockFallback.tsx";
import { OptionBlock, type StatusOpsi } from "./OptionBlock.tsx";

export type ModeRenderer = "practice" | "review";

export interface QuestionRendererProps {
  /** Stimulus mentah (JSONB/CMS) — tiap blok divalidasi via klasifikasikanBlok. */
  blocks: unknown[];
  /** Opsi mentah; tiap opsi divalidasi via questionOptionSchema. */
  options?: unknown[];
  /** Penjelasan mentah; hanya tampil di mode review. */
  explanation?: unknown;
  /** practice: opsi bisa dipilih; review: status benar/salah + pembahasan. */
  mode: ModeRenderer;
  onSelect?: (index: number) => void;
  selectedIndex?: number | null;
}

const HURUF_OPSI = ["A", "B", "C", "D", "E", "F", "G", "H"];

/** Zod safeParse tidak menangkap throw arbitrer (mis. Proxy jebakan) — bungkus. */
function parseOpsi(opt: unknown): QuestionOption | null {
  try {
    const hasil = questionOptionSchema.safeParse(opt);
    return hasil.success ? hasil.data : null;
  } catch {
    return null;
  }
}

function parsePenjelasan(input: unknown): ExplanationSection | null {
  try {
    const hasil = explanationSectionSchema.safeParse(input);
    return hasil.success ? hasil.data : null;
  } catch {
    return null;
  }
}

/**
 * Komposisi soal lengkap (P3.11) — SATU renderer untuk practice, tryout,
 * review, dan CMS preview. Blok/opsi/penjelasan rusak → fallback aman.
 */
export function QuestionRenderer({
  blocks,
  options,
  explanation,
  mode,
  onSelect,
  selectedIndex = null,
}: QuestionRendererProps) {
  const adaStimulus = Array.isArray(blocks) && blocks.length > 0;
  const adaOpsi = Array.isArray(options) && options.length > 0;

  return (
    <article aria-label="Soal" className="min-w-0 space-y-4">
      <div className="min-w-0 space-y-3">
        {adaStimulus ? (
          (blocks as unknown[]).map((blok, i) => <BlockRenderer key={i} data={blok} />)
        ) : (
          <InvalidBlockFallback reason="Konten belum memiliki blok untuk ditampilkan." />
        )}
      </div>

      {adaOpsi ? (
        <ol className="m-0 list-none space-y-2 p-0">
          {(options as unknown[]).map((opt, i) => {
            const parsed = parseOpsi(opt);
            if (!parsed) {
              return (
                <li key={i}>
                  <InvalidBlockFallback reason={`Opsi ${HURUF_OPSI[i] ?? i + 1} tidak valid.`} />
                </li>
              );
            }
            let status: StatusOpsi = "default";
            if (mode === "review") {
              if (parsed.isCorrect) status = "benar";
              else if (selectedIndex === i) status = "salah";
            } else if (selectedIndex === i) {
              status = "dipilih";
            }
            const bisa = mode === "practice" && typeof onSelect === "function";
            return (
              <li key={i}>
                <OptionBlock
                  blocks={parsed.blocks}
                  penanda={HURUF_OPSI[i] ?? String(i + 1)}
                  status={status}
                  bisaDipilih={bisa}
                  onPilih={bisa && onSelect ? () => onSelect(i) : undefined}
                />
              </li>
            );
          })}
        </ol>
      ) : null}

      {mode === "review" && explanation !== undefined ? (
        (() => {
          const parsed = parsePenjelasan(explanation);
          return parsed ? (
            <ExplanationBlock explanation={parsed} />
          ) : (
            <InvalidBlockFallback reason="Pembahasan tidak valid." />
          );
        })()
      ) : null}
    </article>
  );
}
