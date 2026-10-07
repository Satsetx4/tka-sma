import { contentBlockSchema, type ContentBlock } from "../../domain/question/content-blocks.ts";

/**
 * Penjaga blok konten di sisi render (P3.12).
 *
 * Data blok datang dari JSONB/payload CMS sehingga bentuk runtime-nya tidak
 * bisa dipercaya — validasi ulang memakai skema Zod yang sama dengan kontrak
 * domain. Blok rusak TIDAK boleh melempar; ia diklasifikasikan sebagai
 * "invalid" agar lapisan UI menampilkan fallback aman.
 */

export interface BlokValid {
  kind: "valid";
  block: ContentBlock;
}

export interface BlokRusak {
  kind: "invalid";
  /** Pesan aman untuk siswa — tanpa detail internal. */
  reason: string;
}

export type BlokTerklasifikasi = BlokValid | BlokRusak;

/** Ambil nama tipe mentah untuk pesan diagnostik tanpa melempar. */
function namaTipe(raw: unknown): string {
  if (typeof raw === "object" && raw !== null && "type" in raw) {
    const t = (raw as { type?: unknown }).type;
    if (typeof t === "string" && t.length > 0) return t;
  }
  return "tak dikenal";
}

/** Klasifikasikan satu blok mentah: valid atau rusak (tidak pernah melempar). */
export function klasifikasikanBlok(raw: unknown): BlokTerklasifikasi {
  let hasil: ReturnType<typeof contentBlockSchema.safeParse>;
  try {
    hasil = contentBlockSchema.safeParse(raw);
  } catch {
    return { kind: "invalid", reason: `Blok bertipe "${namaTipe(raw)}" tidak dapat dibaca.` };
  }
  if (hasil.success) return { kind: "valid", block: hasil.data };
  const isu = hasil.error.issues[0];
  const detail = isu?.message ?? "format tidak dikenal.";
  return { kind: "invalid", reason: `Blok bertipe "${namaTipe(raw)}" tidak valid: ${detail}` };
}

/** Klasifikasikan daftar blok mentah (stimulus / opsi / penjelasan). */
export function klasifikasikanBlokList(input: unknown): BlokTerklasifikasi[] {
  if (!Array.isArray(input)) {
    return [{ kind: "invalid", reason: "Konten bukan daftar blok yang valid." }];
  }
  if (input.length === 0) {
    return [{ kind: "invalid", reason: "Konten belum memiliki blok untuk ditampilkan." }];
  }
  return input.map(klasifikasikanBlok);
}

/** True bila ada minimal satu blok rusak dalam daftar terklasifikasi. */
export function adaBlokRusak(daftar: readonly BlokTerklasifikasi[]): boolean {
  return daftar.some((item) => item.kind === "invalid");
}
