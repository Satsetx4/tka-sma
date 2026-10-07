/**
 * P4.1 — Shell admin CMS (server component).
 *
 * Guard via adapter CMS → requireRole() guard agen auth (ASUMSI kontrak;
 * lihat src/features/cms/guard-adapter.ts). Tanpa guard → halaman
 * menjelaskan blocker (503-gaya), BUKAN redirect buta ke /login yang
 * juga milik agen auth dan mungkin belum ada.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import {
  BelumLogin,
  GuardBelumTersedia,
  PATH_GUARD_AUTH,
  PeranDitolak,
  wajibkanPeran,
  type SesiCms,
} from "../../features/cms/guard-adapter.ts";
import { getQuestionRepository } from "../../server/repositories/questions.ts";

export const dynamic = "force-dynamic";

const LABEL_PERAN: Record<string, string> = {
  admin: "Admin",
  reviewer: "Reviewer",
  editor: "Editor",
};

function HalamanBlokir({ judul, pesan }: { judul: string; pesan: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="font-display text-lg font-bold">{judul}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{pesan}</p>
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let sesi: SesiCms;
  try {
    sesi = await wajibkanPeran("admin", "reviewer", "editor");
  } catch (e) {
    if (e instanceof GuardBelumTersedia) {
      return (
        <HalamanBlokir
          judul="CMS belum aktif — guard auth belum tersedia"
          pesan={`Modul ${PATH_GUARD_AUTH} (milik agen auth paralel) belum mendarat di branch ini. Setelah guard + alias @ tersedia, halaman ini otomatis jalan tanpa perubahan CMS.`}
        />
      );
    }
    if (e instanceof BelumLogin) redirect("/login?next=/admin");
    if (e instanceof PeranDitolak) {
      return <HalamanBlokir judul="Akses ditolak" pesan={e.message} />;
    }
    throw e;
  }
  const repo = await getQuestionRepository();
  const semua = await repo.list();
  const hitung = (s: string): number => semua.filter((q) => q.status === s).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <Link href="/admin" className="font-display text-lg font-bold">
            CMS TKA SMA
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Navigasi CMS">
            <Link href="/admin" className="rounded-lg px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
              Daftar soal
            </Link>
            <Link
              href="/admin/baru"
              className="rounded-lg px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              + Soal baru
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
              {LABEL_PERAN[sesi.role] ?? sesi.role}
            </span>
            <span className="max-w-40 truncate">{sesi.email ?? sesi.id}</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <dl className="mb-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5" aria-label="Ringkasan antrean">
          {(
            [
              ["draft", "Draft"],
              ["in_review", "In review"],
              ["approved", "Approved"],
              ["published", "Published"],
              ["archived", "Archived"],
            ] as const
          ).map(([kode, label]) => (
            <div
              key={kode}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
            >
              <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
              <dd className="text-xl font-bold">{hitung(kode)}</dd>
            </div>
          ))}
        </dl>
        {children}
      </div>
    </div>
  );
}
