"use client";

import type { TextBlock as DataTeks } from "../../domain/question/content-blocks.ts";

interface Props {
  block: DataTeks;
}

/** Render blok teks polos (P3.3) — whitespace dijaga, tanpa HTML mentah. */
export function TextBlock({ block }: Props) {
  return (
    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-800 dark:text-slate-100">
      {block.content}
    </p>
  );
}
