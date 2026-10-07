/**
 * P4.8 — Editor blok gambar + upload via POST /api/cms/upload.
 * File → FormData(file, altText) → assetId terisi dari pathname hasil.
 * Alt text wajib bermakna (kontrak storage, min 10 karakter).
 */
"use client";

import { useState } from "react";
import type { ImageBlock } from "../../domain/question/content-blocks.ts";

const CLS =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800";

interface Props {
  blok: ImageBlock;
  ubah: (b: ImageBlock) => void;
}

export function ImageBlockEditor({ blok, ubah }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  async function unggah(berkas: File | undefined): Promise<void> {
    if (!berkas) return;
    setSibuk(true);
    setStatus(null);
    try {
      const form = new FormData();
      form.append("file", berkas);
      form.append("altText", blok.alt);
      const res = await fetch("/api/cms/upload", { method: "POST", body: form });
      const body = (await res.json().catch(() => null)) as {
        error?: string;
        assetId?: string;
        url?: string;
      } | null;
      if (!res.ok || !body?.assetId) {
        setStatus(body?.error ?? "Upload gagal.");
        return;
      }
      ubah({ ...blok, assetId: body.assetId });
      setStatus(`Terunggah: ${body.assetId}`);
    } catch {
      setStatus("Upload gagal (jaringan).");
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="space-y-2 text-sm">
      <label className="block">
        <span className="mb-1 block font-semibold">Upload gambar (PNG/JPG/WebP/SVG, maks 5 MB)</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          disabled={sibuk}
          onChange={(e) => void unggah(e.target.files?.[0])}
          className="block w-full text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-semibold">assetId (pathname hasil upload)</span>
        <input
          value={blok.assetId}
          onChange={(e) => ubah({ ...blok, assetId: e.target.value })}
          placeholder="mock/… atau pathname Blob"
          dir="ltr"
          className={`${CLS} font-mono`}
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-semibold">Alt text (wajib, bermakna, min 10 karakter)</span>
        <textarea
          value={blok.alt}
          onChange={(e) => ubah({ ...blok, alt: e.target.value })}
          rows={2}
          placeholder="cth. Diagram gaya pada sebuah balok di bidang miring"
          className={CLS}
        />
      </label>
      <label className="block">
        <span className="mb-1 block font-semibold">Caption (opsional)</span>
        <input
          value={blok.caption ?? ""}
          onChange={(e) => ubah({ ...blok, caption: e.target.value })}
          className={CLS}
        />
      </label>
      {status ? (
        <p role="status" className="text-xs text-slate-600 dark:text-slate-300">
          {status}
        </p>
      ) : null}
    </div>
  );
}
