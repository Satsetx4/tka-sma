/**
 * P2.12 — Implementasi StorageService di atas Vercel Blob. SERVER-ONLY.
 *
 * - Satu-satunya file yang boleh mengimpor `@vercel/blob` (ARCHITECTURE.md:
 *   jangan sebar SDK Blob di luar implementasi interface ini).
 * - Token dibaca dari `process.env["BLOB_READ_WRITE_TOKEN"]` TANPA nilai
 *   default; kosong → throw CONFIG_MISSING (tidak pernah dilempar ke client).
 * - Setiap upload/delete selalu lewat `validate()` dulu (P2.13: MIME allowlist,
 *   batas 5MB, alt text wajib bermakna).
 */
import "server-only";
import { del, put } from "@vercel/blob";
import type {
  StorageError,
  StorageService,
  StorageValidation,
  StoredAsset,
  UploadInput,
  ValidationInput,
} from "./storage.ts";
import { validateUploadInput } from "./storage.ts";

if (typeof window !== "undefined") {
  throw new Error(
    "[storage] src/server/storage/* must never be imported from client-side code.",
  );
}

function getToken(): string {
  const token = process.env["BLOB_READ_WRITE_TOKEN"];
  if (!token) {
    const error = new Error(
      "[storage] BLOB_READ_WRITE_TOKEN is not set. Set it in the shell (local: .env.local, gitignored) or Vercel project env. Live upload/delete cannot run without it — see docs/decisions/P2-schema-and-blob.md.",
    ) as Error & { storageError: StorageError };
    error.storageError = {
      code: "CONFIG_MISSING",
      message: "Token Vercel Blob belum dikonfigurasi di server.",
    };
    throw error;
  }
  return token;
}

/** Prefix path agar aset CMS tidak bercampur dengan aset lain di store. */
const ASSET_PREFIX = "tka-sma/cms/";

export class VercelBlobStorage implements StorageService {
  validate(input: ValidationInput): StorageValidation {
    return validateUploadInput(input);
  }

  async upload(input: UploadInput): Promise<StoredAsset> {
    const valid = this.validate({
      filename: input.filename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      altText: input.altText,
    });
    if (!valid.ok) {
      const error = new Error(`[storage] upload ditolak: ${valid.error.message}`) as Error & {
        storageError: StorageError;
      };
      error.storageError = valid.error;
      throw error;
    }
    const token = getToken();
    // Salin ke ArrayBuffer baru agar tipenya Uint8Array<ArrayBuffer> (BlobPart).
    const salinan = new Uint8Array(input.data.length);
    salinan.set(input.data);
    const blob = await put(`${ASSET_PREFIX}${input.filename}`, new Blob([salinan], { type: input.mimeType }), {
      access: "public",
      contentType: input.mimeType,
      token,
    }).catch((cause: unknown) => {
      const error = new Error(
        `[storage] upload gagal: ${cause instanceof Error ? cause.message : String(cause)}`,
      ) as Error & { storageError: StorageError };
      error.storageError = { code: "UPLOAD_FAILED", message: error.message };
      throw error;
    });
    return {
      pathname: blob.pathname,
      url: blob.url,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      altText: input.altText.trim(),
      width: input.width,
      height: input.height,
    };
  }

  async delete(pathname: string): Promise<void> {
    const nama = pathname.trim();
    if (nama.length === 0) {
      const error = new Error("[storage] pathname hapus tidak boleh kosong.") as Error & {
        storageError: StorageError;
      };
      error.storageError = {
        code: "NOT_FOUND",
        message: "Pathname aset tidak boleh kosong.",
        field: "pathname",
      };
      throw error;
    }
    const token = getToken();
    await del(nama, { token }).catch((cause: unknown) => {
      const error = new Error(
        `[storage] delete gagal: ${cause instanceof Error ? cause.message : String(cause)}`,
      ) as Error & { storageError: StorageError };
      error.storageError = { code: "DELETE_FAILED", message: error.message };
      throw error;
    });
  }

  getUrl(pathname: string): string {
    // V1: bucket publik — pathname cukup; URL penuh dibentuk dari pathname.
    // Bila store memakai domain kustom, panggil upload() dan simpan blob.url
    // ke media_assets.blob_url (jangan re-konstruksi manual di CMS).
    return pathname;
  }
}

/** Singleton default — satu instance dipakai route handler / server action CMS. */
export const blobStorage = new VercelBlobStorage();
