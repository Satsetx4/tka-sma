/**
 * P4.14 — Editor penjelasan: blok langkah + kesalahan umum + tips.
 * Semuanya terstruktur (ContentBlocksEditor), tanpa HTML bebas.
 * commonMistake + solvingTip wajib sebelum publish (publish gate).
 */
"use client";

import type { CmsExplanation } from "../../server/repositories/question-model.ts";
import { ContentBlocksEditor } from "./ContentBlocksEditor.tsx";

interface Props {
  nilai: CmsExplanation;
  ubah: (e: CmsExplanation) => void;
}

export function ExplanationEditor({ nilai, ubah }: Props) {
  return (
    <div className="space-y-3">
      <ContentBlocksEditor
        judul="Langkah pembahasan"
        blok={nilai.blocks}
        ubah={(blocks) => ubah({ ...nilai, blocks })}
        idPrefix="ekspl"
      />
      <ContentBlocksEditor
        judul="Kesalahan umum (wajib sebelum publish)"
        blok={nilai.commonMistake ?? []}
        ubah={(commonMistake) => ubah({ ...nilai, commonMistake })}
        idPrefix="salah"
      />
      <ContentBlocksEditor
        judul="Tips penyelesaian (wajib sebelum publish)"
        blok={nilai.solvingTip ?? []}
        ubah={(solvingTip) => ubah({ ...nilai, solvingTip })}
        idPrefix="tips"
      />
    </div>
  );
}
