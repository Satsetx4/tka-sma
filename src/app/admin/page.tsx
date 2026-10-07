/**
 * P4.3 + P4.4 — Daftar soal CMS (server component, query dari URL).
 * Filter: status, subject, topic, difficulty, tipe, search.
 * Tautan "Filter" mengubah URL (tanpa JS) + form search sederhana.
 */
import Link from "next/link";
import { getQuestionRepository } from "../../server/repositories/questions.ts";
import type { QuestionFilter } from "../../server/repositories/questions.ts";
import { cmsStatuses } from "../../server/repositories/question-model.ts";
import { difficulties, questionTypes } from "../../domain/question/publish-gate.ts";

export const dynamic = "force-dynamic";

type Params = { [k: string]: string | string[] | undefined };

const LABEL_STATUS: Record<string, string> = {
  draft: "Draft",
  in_review: "In review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

function satu(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function AdminDaftarPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const status = satu(sp["status"]);
  const subject = satu(sp["subject"]).trim();
  const topic = satu(sp["topic"]).trim();
  const difficulty = satu(sp["difficulty"]);
  const tipe = satu(sp["type"]);
  const search = satu(sp["search"]).trim();

  const filter: QuestionFilter = {
    ...(status !== "" ? { status: status as QuestionFilter["status"] } : {}),
    ...(subject !== "" ? { subjectCode: subject } : {}),
    ...(topic !== "" ? { topicCode: topic } : {}),
    ...(difficulty !== "" ? { difficulty: difficulty as QuestionFilter["difficulty"] } : {}),
    ...(tipe !== "" ? { questionType: tipe as QuestionFilter["questionType"] } : {}),
    ...(search !== "" ? { search } : {}),
  };
  const daftar = await (await getQuestionRepository()).list(filter);

  const tautan = (nama: string, nilai: string): string => {
    const p = new URLSearchParams();
    const semua: Record<string, string> = { status, difficulty, type: tipe, search };
    if (subject !== "") semua["subject"] = subject;
    if (topic !== "") semua["topic"] = topic;
    for (const [k, v] of Object.entries(semua)) {
      if (v !== "") p.set(k, v);
    }
    if (nilai === "") p.delete(nama);
    else p.set(nama, nilai);
    const s = p.toString();
    return s === "" ? "/admin" : `/admin?${s}`;
  };

  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold">Daftar soal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {daftar.length} soal{Object.keys(filter).length > 0 ? " (terfilter)" : ""}.
          </p>
        </div>
        <Link
          href="/admin/baru"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Soal baru
        </Link>
      </div>

      <form
        method="get"
        action="/admin"
        className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
        role="search"
        aria-label="Cari soal"
      >
        {status !== "" ? <input type="hidden" name="status" value={status} /> : null}
        {difficulty !== "" ? <input type="hidden" name="difficulty" value={difficulty} /> : null}
        {tipe !== "" ? <input type="hidden" name="type" value={tipe} /> : null}
        <label className="sr-only" htmlFor="cms-search">
          Cari kode atau isi soal
        </label>
        <input
          id="cms-search"
          name="search"
          defaultValue={search}
          placeholder="Cari kode / isi soal…"
          className="min-w-52 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
        >
          Cari
        </button>
        {Object.keys(filter).length > 0 ? (
          <Link
            href="/admin"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
          >
            Reset
          </Link>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-1.5 text-xs" aria-label="Filter status">
        <Link
          href={tautan("status", "")}
          aria-current={status === "" ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 font-semibold ${status === "" ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"}`}
        >
          Semua
        </Link>
        {cmsStatuses.map((s) => (
          <Link
            key={s}
            href={tautan("status", s)}
            aria-current={status === s ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 font-semibold ${status === s ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"}`}
          >
            {LABEL_STATUS[s]}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs" aria-label="Filter difficulty dan tipe">
        <label className="flex items-center gap-1.5">
          <span className="text-slate-500">Sulit:</span>
          <span className="flex gap-1">
            <Link href={tautan("difficulty", "")} className={difficulty === "" ? "font-bold underline" : "underline"}>Semua</Link>
            {difficulties.map((d) => (
              <Link key={d} href={tautan("difficulty", d)} className={difficulty === d ? "font-bold underline" : "underline"}>{d}</Link>
            ))}
          </span>
        </label>
        <label className="flex items-center gap-1.5">
          <span className="text-slate-500">Tipe:</span>
          <span className="flex gap-1">
            <Link href={tautan("type", "")} className={tipe === "" ? "font-bold underline" : "underline"}>Semua</Link>
            {questionTypes.map((t) => (
              <Link key={t} href={tautan("type", t)} className={tipe === t ? "font-bold underline" : "underline"}>{t}</Link>
            ))}
          </span>
        </label>
      </div>

      {daftar.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">
          Belum ada soal{Object.keys(filter).length > 0 ? " yang cocok dengan filter" : ""}.{" "}
          <Link href="/admin/baru" className="font-semibold underline">
            Buat soal pertama
          </Link>
          .
        </p>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {daftar.map((q) => (
            <li
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-2">
                <Link href={`/admin/${q.id}`} className="min-w-0">
                  <p className="truncate font-mono text-sm font-bold">{q.code}</p>
                  <p className="truncate text-xs text-slate-500">
                    {[q.subjectCode, q.topicCode, q.difficulty, q.questionType]
                      .filter((x) => x !== "")
                      .join(" · ")}
                  </p>
                </Link>
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {LABEL_STATUS[q.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
