/**
 * Kontrak StorageService (docs/ARCHITECTURE.md).
 *
 * Kode aplikasi (terutama CMS) hanya boleh bergantung pada interface ini:
 * upload / delete / getUrl / validate. Implementasi V1 (`VercelBlobStorage`,
 * task P2.12) dilarang dibocorkan ke komponen CMS — SDK Blob hanya hidup di
 * implementasi interface ini, tidak tersebar di codebase.
 *
 * File ini murni kontrak + validasi aturan (tanpa SDK Blob, tanpa I/O),
 * sehingga batasan MIME/size/alt-text terdokumentasi di satu tempat.
 */

// MIME gambar yang diizinkan: format umum web + SVG untuk diagram kompleks.
export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
] as const;
export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

/** Ukuran maksimum satu file gambar: 5 MB. */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
/** Alt text minimal bermakna (selaras dengan publish gate soal). */
export const MIN_ALT_TEXT_LENGTH = 10;
export const MAX_ALT_TEXT_LENGTH = 500;

export type StorageErrorCode =
  | "UNSUPPORTED_MIME_TYPE"
  | "FILE_TOO_LARGE"
  | "INVALID_SIZE"
  | "MISSING_ALT_TEXT"
  | "ALT_TEXT_TOO_SHORT"
  | "INVALID_FILENAME"
  | "NOT_FOUND"
  | "UPLOAD_FAILED"
  | "DELETE_FAILED"
  | "CONFIG_MISSING";

export interface StorageError {
  code: StorageErrorCode;
  message: string;
  field?: string;
}

export interface UploadInput {
  data: Uint8Array;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  uploadedBy: string;
  width?: number;
  height?: number;
}

export interface StoredAsset {
  pathname: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  width?: number;
  height?: number;
}

export interface ValidationInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
}

export type StorageValidation = { ok: true } | { ok: false; error: StorageError };

export interface StorageService {
  /** Cek aturan MIME/size/alt-text/filename sebelum upload. Murni, tanpa I/O. */
  validate(input: ValidationInput): StorageValidation;
  /** Simpan byte gambar; gagal bila validate() tidak lolos. */
  upload(input: UploadInput): Promise<StoredAsset>;
  /** Hapus aset berdasarkan pathname. */
  delete(pathname: string): Promise<void>;
  /** URL publik baca aset (V1: bucket publik, sinkron tanpa signing). */
  getUrl(pathname: string): string;
}

/** Validasi aturan kontrak; dipakai implementasi maupun tes tanpa menyentuh Blob. */
export function validateUploadInput(input: ValidationInput): StorageValidation {
  const mime = input.mimeType.trim().toLowerCase();
  const allowed: readonly string[] = ALLOWED_IMAGE_MIME_TYPES;
  if (!allowed.includes(mime)) {
    return {
      ok: false,
      error: {
        code: "UNSUPPORTED_MIME_TYPE",
        message: `Tipe file ${input.mimeType} tidak didukung. Gunakan: ${allowed.join(", ")}.`,
        field: "mimeType",
      },
    };
  }
  if (!Number.isInteger(input.sizeBytes) || input.sizeBytes <= 0) {
    return {
      ok: false,
      error: { code: "INVALID_SIZE", message: "Ukuran file tidak valid.", field: "sizeBytes" },
    };
  }
  if (input.sizeBytes > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: `Ukuran file melebihi ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`,
        field: "sizeBytes",
      },
    };
  }
  const nama = input.filename.trim();
  if (nama.length === 0 || nama.includes("/") || nama.includes("\\") || !/\.[A-Za-z0-9]+$/.test(nama)) {
    return {
      ok: false,
      error: {
        code: "INVALID_FILENAME",
        message: "Nama file tidak valid (tanpa path, wajib berekstensi).",
        field: "filename",
      },
    };
  }
  const alt = input.altText.trim();
  if (alt.length === 0) {
    return {
      ok: false,
      error: { code: "MISSING_ALT_TEXT", message: "Alt text wajib diisi.", field: "altText" },
    };
  }
  if (alt.length < MIN_ALT_TEXT_LENGTH) {
    return {
      ok: false,
      error: {
        code: "ALT_TEXT_TOO_SHORT",
        message: `Alt text minimal ${MIN_ALT_TEXT_LENGTH} karakter yang bermakna.`,
        field: "altText",
      },
    };
  }
  return { ok: true };
}
