"use client";

import { useState } from "react";
import type { ImageBlock as DataGambar } from "../../domain/question/content-blocks.ts";

interface Props {
  block: DataGambar;
  /** Pemeta assetId → URL. Default: assetId dipakai langsung sebagai URL/path. */
  resolveAssetUrl?: (assetId: string) => string;
}

/**
 * Render blok gambar (P3.5): responsif (w-full h-auto), loading lazy,
 * alt wajib diambil dari blok. Gambar gagal muat tidak melempar — tampil
 * placeholder ber-alt text agar siswa tetap dapat konteks.
 */
export function ImageBlock({ block, resolveAssetUrl }: Props) {
  const [gagal, setGagal] = useState(false);
  const src = resolveAssetUrl ? resolveAssetUrl(block.assetId) : block.assetId;

  if (gagal) {
    return (
      <div
        role="img"
        aria-label={block.alt}
        className="flex min-h-24 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
      >
        {block.alt}
      </div>
    );
  }

  return (
    <figure className="m-0">
      <img
        src={src}
        alt={block.alt}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-xl object-cover"
        onError={() => setGagal(true)}
      />
      {block.caption ? (
        <figcaption className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
