"use client";

import type { ExplanationSection } from "../../domain/question/content-blocks.ts";
import { BlockRenderer } from "./BlockRenderer.tsx";

interface Props {
  explanation: ExplanationSection;
}

/** Render pembahasan (P3.10): langkah + kesalahan umum + tips. */
export function ExplanationBlock({ explanation }: Props) {
  return (
    <section aria-label="Pembahasan" className="min-w-0 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">Pembahasan</h3>
      <div className="space-y-2">
        {explanation.blocks.map((blok, i) => (
          <BlockRenderer key={i} data={blok} />
        ))}
      </div>
      {explanation.commonMistake && explanation.commonMistake.length > 0 ? (
        <div className="space-y-2 rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
          <h4 className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Kesalahan umum</h4>
          {explanation.commonMistake.map((blok, i) => (
            <BlockRenderer key={i} data={blok} />
          ))}
        </div>
      ) : null}
      {explanation.solvingTip && explanation.solvingTip.length > 0 ? (
        <div className="space-y-2 rounded-xl bg-sky-50 p-3 dark:bg-sky-950/30">
          <h4 className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Tips</h4>
          {explanation.solvingTip.map((blok, i) => (
            <BlockRenderer key={i} data={blok} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
