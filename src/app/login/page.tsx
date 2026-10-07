/**
 * P2.10 — Halaman login (email+password, server action, tanpa enumerasi user).
 *
 * Pesan galat SENGAJA generik ("Email atau kata sandi salah") agar respons
 * tak membocorkan akun mana yang terdaftar. Param `next` divalidasi agar
 * hanya path internal (anti open-redirect).
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuth } from "../../server/auth/auth.ts";

function nextAman(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\")) return v;
  return "/admin";
}

async function masuk(formData: FormData): Promise<void> {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextMentah = formData.get("next");
  const next = nextAman(typeof nextMentah === "string" ? nextMentah : undefined);
  try {
    await getAuth().api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
  } catch {
    // Generik: jangan bedakan "email tak terdaftar" vs "sandi salah".
    redirect(`/login?galat=1&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const next = nextAman(sp["next"]);
  const galat = sp["galat"] === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="font-display text-lg font-bold">Masuk CMS TKA SMA</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Khusus staf (admin / reviewer / editor).
        </p>
        {galat ? (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">
            Email atau kata sandi salah.
          </p>
        ) : null}
        <form action={masuk} className="mt-4 space-y-3">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">
              Kata sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Masuk
          </button>
        </form>
      </main>
    </div>
  );
}
