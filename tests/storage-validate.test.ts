import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_IMAGE_SIZE_BYTES,
  validateUploadInput,
} from "../src/server/storage/storage.ts";

function dasar() {
  return {
    filename: "diagram-gaya-balok.png",
    mimeType: "image/png",
    sizeBytes: 100_000,
    altText: "Diagram gaya pada sebuah balok di bidang miring",
  };
}

test("validate: MIME ditolak (application/pdf)", () => {
  const hasil = validateUploadInput({ ...dasar(), mimeType: "application/pdf" });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "UNSUPPORTED_MIME_TYPE");
});

test("validate: MIME ditolak (image/gif tidak di allowlist)", () => {
  const hasil = validateUploadInput({ ...dasar(), mimeType: "image/gif" });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "UNSUPPORTED_MIME_TYPE");
});

test("validate: size over 5MB ditolak", () => {
  const hasil = validateUploadInput({ ...dasar(), sizeBytes: MAX_IMAGE_SIZE_BYTES + 1 });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "FILE_TOO_LARGE");
});

test("validate: size nol ditolak (INVALID_SIZE)", () => {
  const hasil = validateUploadInput({ ...dasar(), sizeBytes: 0 });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "INVALID_SIZE");
});

test("validate: alt kosong ditolak", () => {
  const hasil = validateUploadInput({ ...dasar(), altText: "   " });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "MISSING_ALT_TEXT");
});

test("validate: alt pendek (<10) ditolak", () => {
  const hasil = validateUploadInput({ ...dasar(), altText: "gambar 1" });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "ALT_TEXT_TOO_SHORT");
});

test("validate: input valid lolos", () => {
  const hasil = validateUploadInput(dasar());
  assert.deepEqual(hasil, { ok: true });
});

test("validate: SVG valid lolos (diagram kompleks)", () => {
  const hasil = validateUploadInput({
    ...dasar(),
    filename: "diagram-sirkuit.svg",
    mimeType: "image/svg+xml",
  });
  assert.deepEqual(hasil, { ok: true });
});

test("validate: filename tanpa ekstensi ditolak", () => {
  const hasil = validateUploadInput({ ...dasar(), filename: "tanpaekstensi" });
  assert.equal(hasil.ok, false);
  assert.equal(hasil.ok === false && hasil.error.code, "INVALID_FILENAME");
});
