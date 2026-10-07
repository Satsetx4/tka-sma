/**
 * P2.10 — Halaman 403: peran sesi aktif tak diizinkan membuka CMS.
 * Dituju dari layout admin saat guard melempar PeranDitolak.
 */
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="font-display text-lg font-bold">Akses ditolak</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Akun Anda tidak memiliki peran yang diizinkan membuka CMS. Hubungi admin bila
          seharusnya punya akses.
        </p>
        <div className="mt-4 flex gap-2 text-sm">
          <Link
            href="/"
            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold dark:border-slate-700"
          >
            Beranda
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            Ganti akun
          </Link>
        </div>
      </main>
    </div>
  );
}
