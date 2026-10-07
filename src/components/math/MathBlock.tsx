"use client";

/** Deklarasi impor CSS sisi klien (katex.min.css di bawah). */
declare module "*.css";

import { useMemo } from "react";
import * as katex from "katex";
import "katex/dist/katex.min.css";
import type { MathBlock as DataMath } from "../../domain/question/content-blocks.ts";

interface Props {
  block: DataMath;
  displayMode?: boolean;
}

/**
 * Render blok rumus KaTeX (P3.4).
 *
 * Rumus panjang scroll horizontal DI DALAM blok (overflow-x-auto + min-w-min)
 * sehingga halaman 320px tidak meluber. LaTeX tak-terbaca tidak melempar:
 * renderToString dipakai dengan throwOnError:false plus try/catch lapis kedua.
 * CSS KaTeX diimpor sekali di sini; renderer lain tidak mengimpor ulang.
 */
export function MathBlock({ block, displayMode = true }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(block.latex, { throwOnError: false, displayMode });
    } catch {
      return "";
    }
  }, [block.latex, displayMode]);

  if (!html) {
    return (
      <p
        role="alert"
        className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
      >
        Rumus tidak dapat ditampilkan.
      </p>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900"
      role="math"
      aria-label={block.latex}
      tabIndex={0}
    >
      <div
        className="min-w-min text-slate-900 dark:text-slate-50"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
