/**
 * P4.2 → P2.9: guard auth sudah mendarat (`src/server/auth/guard.ts`).
 * File ini sekarang re-export statis + alias nama lama agar pemakai CMS
 * (`src/app/admin/layout.tsx`, `src/app/api/cms/_auth.ts`) tetap jalan
 * tanpa perubahan.
 *
 * GuardBelumTersedia dipertahankan sebagai kelas error (tak lagi dilempar
 * dari sini) agar impor eksisting di CMS tidak rusak; kode baru sebaiknya
 * impor langsung dari `@/server/auth/guard`.
 */
import "server-only";

// Re-export statis guard asli. Path relatif dipakai (bukan alias @) karena
// Turbopack/Next hanya membaca paths dari tsconfig.json root; alias @ tetap
// terdaftar di tsconfig.app.json untuk tsc (lihat P2-auth-impl.md).
export {
  BelumLogin,
  PeranDitolak,
  getSession,
  getSession as dapatkanSesi,
  requireRole,
  requireRole as wajibkanPeran,
  type CmsRole,
  type SesiPengguna as SesiCms,
} from "../../server/auth/guard.ts";

/** Alias nama lama untuk kompatibilitas impor CMS eksisting. */
export type { CmsRole as PeranCms } from "../../server/auth/guard.ts";

/** Path kontrak guard auth (sudah mendarat — dipertahankan untuk referensi). */
export const PATH_GUARD_AUTH = "@/server/auth/guard";

/**
 * Kelas error transisi (dulu dilempar saat guard belum mendarat; kini
 * tidak lagi dipakai karena guard sudah ada — dipertahankan agar impor
 * CMS lama tidak rusak).
 */
export class GuardBelumTersedia extends Error {
  constructor() {
    super(
      `Guard auth sudah tersedia di ${PATH_GUARD_AUTH}. ` +
        "Error ini tidak lagi dilempar; lihat docs/decisions/P2-auth-impl.md.",
    );
    this.name = "GuardBelumTersedia";
  }
}
