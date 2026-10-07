/**
 * P4.8 — Upload gambar CMS lewat kontrak storage (tanpa SDK Blob di route).
 *
 * Alur: terima multipart (file + altText) → validateUploadInput() dulu
 * (400 + daftar galat bila MIME/size/nama/alt gagal) → upload ke
 * VercelBlobStorage (atau mock bila token belum ada). Batas request
 * 6 MB sedikit di atas batas file 5 MB agar pesan 413 tetap jelas.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  MAX_IMAGE_SIZE_BYTES,
  validateUploadInput,
} from "../../../../server/storage/storage.ts";
import { peranCms, responsKesalahan, sesiApiCms } from "../_auth.ts";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const BATAS_REQUEST_BYTES = 6 * 1024 * 1024;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const sesi = await sesiApiCms(...peranCms);
    const panjang = request.headers.get("content-length");
    if (panjang !== null && Number(panjang) > BATAS_REQUEST_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran request melebihi ${BATAS_REQUEST_BYTES / (1024 * 1024)} MB.`,
          errors: [{ field: "file", message: "File terlalu besar untuk diunggah." }],
        },
        { status: 413 },
      );
    }
    const form = await request.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Body multipart tidak valid." }, { status: 400 });
    }
    const berkas = form.get("file");
    const altText = String(form.get("altText") ?? "");
    if (!(berkas instanceof File)) {
      return NextResponse.json(
        {
          error: "Field file wajib diisi.",
          errors: [{ field: "file", message: "Tidak ada file yang diterima." }],
        },
        { status: 400 },
      );
    }
    if (berkas.size > BATAS_REQUEST_BYTES) {
      return NextResponse.json(
        {
          error: `Ukuran file melebihi ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`,
          errors: [{ field: "file", message: "File terlalu besar untuk diunggah." }],
        },
        { status: 413 },
      );
    }
    const nama = (berkas.name || "").trim() || "gambar-tanpa-nama.png";
    const valid = validateUploadInput({
      filename: nama,
      mimeType: berkas.type || "application/octet-stream",
      sizeBytes: berkas.size,
      altText,
    });
    if (!valid.ok) {
      return NextResponse.json(
        { error: valid.error.message, errors: [valid.error] },
        { status: 400 },
      );
    }
    const bytes = new Uint8Array(await berkas.arrayBuffer());
    const unik = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${nama}`;
    const hasil = await unggah({
      data: bytes,
      filename: unik,
      mimeType: berkas.type,
      sizeBytes: berkas.size,
      altText: altText.trim(),
      uploadedBy: sesi.id,
    });
    return NextResponse.json(
      { assetId: hasil.pathname, url: hasil.url, alt: hasil.altText },
      { status: 201 },
    );
  } catch (e) {
    const kode = (e as { storageError?: { code?: string } } | null)?.storageError?.code;
    if (kode === "CONFIG_MISSING") {
      return NextResponse.json(
        {
          error:
            "Upload gambar belum dikonfigurasi di server " +
            "(BLOB_READ_WRITE_TOKEN belum dipasang).",
        },
        { status: 503 },
      );
    }
    return responsKesalahan(e);
  }
}

interface UnggahInput {
  data: Uint8Array;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  uploadedBy: string;
}

/** Pilih storage nyata bila token ada, mock in-memory bila belum. */
async function unggah(masuk: UnggahInput): Promise<{ pathname: string; url: string; altText: string }> {
  if (!process.env["BLOB_READ_WRITE_TOKEN"]) {
    const pathname = `mock/${masuk.filename}`;
    return { pathname, url: `/mock-storage/${masuk.filename}`, altText: masuk.altText };
  }
  const { VercelBlobStorage } = await import("../../../../server/storage/vercel-blob.ts");
  const hasil = await new VercelBlobStorage().upload(masuk);
  return { pathname: hasil.pathname, url: hasil.url, altText: hasil.altText };
}
