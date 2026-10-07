"use client";

import { klasifikasikanBlok } from "./block-guard.ts";
import { TextBlock } from "./TextBlock.tsx";
import { MathBlock } from "../math/MathBlock.tsx";
import { ImageBlock } from "./ImageBlock.tsx";
import { TableBlock } from "./TableBlock.tsx";
import { ChartBlock } from "../charts/ChartBlock.tsx";
import { FunctionGraphBlock } from "../charts/FunctionGraphBlock.tsx";
import { InvalidBlockFallback } from "./InvalidBlockFallback.tsx";

interface Props {
  /** Satu blok mentah (dari JSONB/payload CMS) — divalidasi dulu, tidak pernah throw. */
  data: unknown;
}

/**
 * SATU renderer blok bersama (ARCHITECTURE.md "Renderer reuse") untuk
 * stimulus, opsi, dan penjelasan — dipakai practice, tryout, review, CMS.
 * Blok rusak → InvalidBlockFallback, bukan throw.
 */
export function BlockRenderer({ data }: Props) {
  const hasil = klasifikasikanBlok(data);
  if (hasil.kind === "invalid") {
    return <InvalidBlockFallback reason={hasil.reason} />;
  }
  const blok = hasil.block;
  switch (blok.type) {
    case "text":
      return <TextBlock block={blok} />;
    case "math":
      return <MathBlock block={blok} />;
    case "image":
      return <ImageBlock block={blok} />;
    case "table":
      return <TableBlock block={blok} />;
    case "chart":
      return <ChartBlock block={blok} />;
    case "function_graph":
      return <FunctionGraphBlock block={blok} />;
  }
  return <InvalidBlockFallback reason="Tipe blok tidak didukung." />;
}
