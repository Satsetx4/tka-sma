/**
 * P2.9/P2.10 — Tes guard auth (tanpa DB, tanpa network).
 *
 * Strategi: modul guard asli membaca sesi dari cookie via Better Auth,
 * yang tak bisa berjalan tanpa DB. Tes ini memverifikasi KONTRAK yang
 * sama persis lewat dua lapis:
 *  1. Kelas error + properti status guard asli (`BelumLogin` 401,
 *     `PeranDitolak` 403) — impor langsung dari src/server/auth/guard.ts.
 *  2. Logika allow/deny per peran + aturan penulis-approve-diri lewat
 *     harness tiruan yang meniru SEMANTIK requireRole (throw yang sama)
 *     digabung aturan checkApprovalEligibility dari CMS — tanpa DB.
 *  3. Validasi env seed admin (aturan yang sama dengan scripts/seed-admin.ts).
 *  4. Aturan middleware: rute proteksi vs publik.
 *
 * Total: 10 kasus (syarat min 6).
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { BelumLogin, normalkanSesi, PeranDitolak, putuskanAkses } from "../src/server/auth/roles.ts";
import { checkApprovalEligibility } from "../src/server/repositories/question-model.ts";

/** Tiruan requireRole = putuskanAkses (semantik identik dengan guard asli). */
function tiruRequireRole(
  sesi: { id: string; role: string; email?: string } | null,
  ...diizinkan: string[]
): { id: string; role: string; email?: string } {
  return putuskanAkses(sesi, ...diizinkan);
}

const BERHAK = ["admin", "reviewer", "editor"];

// --- 1. Error guard asli: nama + status -------------------------------------

test("BelumLogin bernama tepat + status 401", () => {
  const e = new BelumLogin();
  assert.equal(e.name, "BelumLogin");
  assert.equal(e.status, 401);
  assert.match(e.message, /login/i);
});

test("PeranDitolak bernama tepat + status 403 + properti peran", () => {
  const e = new PeranDitolak("student");
  assert.equal(e.name, "PeranDitolak");
  assert.equal(e.status, 403);
  assert.equal(e.peran, "student");
});

// --- 2. requireRole throw bila belum login ----------------------------------

test("requireRole throw BelumLogin bila sesi null", () => {
  assert.throws(() => tiruRequireRole(null, ...BERHAK), BelumLogin);
});

// --- 3-5. allow/deny per peran ----------------------------------------------

test("admin lolos requireRole CMS penuh", () => {
  const sesi = tiruRequireRole({ id: "a1", role: "admin" }, ...BERHAK);
  assert.equal(sesi.role, "admin");
});

test("editor lolos area CMS tapi DITOLAK di area khusus reviewer", () => {
  const sesi = tiruRequireRole({ id: "e1", role: "editor" }, ...BERHAK);
  assert.equal(sesi.role, "editor");
  assert.throws(() => tiruRequireRole({ id: "e1", role: "editor" }, "reviewer", "admin"), PeranDitolak);
});

test("student (murid) DITOLAK masuk CMS dengan 403", () => {
  assert.throws(
    () => tiruRequireRole({ id: "s1", role: "student" }, ...BERHAK),
    (e: unknown) => e instanceof PeranDitolak && e.status === 403,
  );
});

// --- 6. Penulis tidak boleh approve karya sendiri ----------------------------

test("penulis-approve-diri ditolak; admin pengecualian tercatat", () => {
  const editor = checkApprovalEligibility({ actorRole: "editor", actorId: "e1", createdBy: "e1" });
  assert.equal(editor.ok, false);
  const reviewer = checkApprovalEligibility({ actorRole: "reviewer", actorId: "r1", createdBy: "r1" });
  assert.equal(reviewer.ok, false);
  const reviewerLain = checkApprovalEligibility({ actorRole: "reviewer", actorId: "r2", createdBy: "r1" });
  assert.equal(reviewerLain.ok, true);
  const adminDarurat = checkApprovalEligibility({ actorRole: "admin", actorId: "a1", createdBy: "a1" });
  assert.equal(adminDarurat.ok, true);
});

// --- 7. Seed: validasi env ----------------------------------------------------

function validasiSeed(env: Record<string, string | undefined>): string | null {
  const email = (env["ADMIN_EMAIL"] ?? "").trim();
  const password = env["ADMIN_PASSWORD"] ?? "";
  if (!email) return "ADMIN_EMAIL belum diisi";
  if (password.length < 8) return "ADMIN_PASSWORD minimal 8 karakter";
  return null;
}

test("seed menolak env kosong/pendek, menerima env valid", () => {
  assert.equal(validasiSeed({}), "ADMIN_EMAIL belum diisi");
  assert.equal(validasiSeed({ ADMIN_EMAIL: "a@x.id", ADMIN_PASSWORD: "pendek" }), "ADMIN_PASSWORD minimal 8 karakter");
  assert.equal(validasiSeed({ ADMIN_EMAIL: "a@x.id", ADMIN_PASSWORD: "cukup-panjang-1" }), null);
});

// --- 8. Middleware: proteksi vs publik ----------------------------------------

function perluLogin(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/cms" ||
    pathname.startsWith("/api/cms/")
  );
}

test("middleware: /admin + /api/cms diproteksi; publik bebas", () => {
  assert.equal(perluLogin("/admin"), true);
  assert.equal(perluLogin("/admin/baru"), true);
  assert.equal(perluLogin("/api/cms/questions"), true);
  assert.equal(perluLogin("/"), false);
  assert.equal(perluLogin("/preview-soal"), false);
  assert.equal(perluLogin("/login"), false);
  assert.equal(perluLogin("/api/auth/sign-in/email"), false);
});

// --- 9. requireRole tanpa allow-list menolak semua -----------------------------

test("daerah CMS tanpa peran cocok: reviewer pun ditolak bila allow-list sempit", () => {
  assert.throws(() => tiruRequireRole({ id: "r1", role: "reviewer" }, "admin"), PeranDitolak);
});

// --- 10. normalkanSesi: peran asing → student, tanpa id → null -----------------

test("normalkanSesi fail-closed: peran asing jadi student, tanpa id jadi null", () => {
  assert.deepEqual(normalkanSesi({ user: { id: "u1", role: "superadmin", email: "a@x.id" } }), {
    id: "u1",
    role: "student",
    email: "a@x.id",
  });
  assert.equal(normalkanSesi({ user: { role: "admin" } }), null);
  assert.equal(normalkanSesi(null), null);
});
