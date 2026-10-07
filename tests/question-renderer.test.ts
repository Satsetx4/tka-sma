import { test } from "node:test";
import assert from "node:assert/strict";
import { klasifikasikanBlok } from "../src/components/question/block-guard.ts";

/**
 * Bukti P3.12: blok rusak TIDAK melempar — selalu terklasifikasi "invalid"
 * dengan pesan aman, termasuk input paling liar (null, string, Proxy).
 */

test("blok valid lolos sebagai kind valid", () => {
  const hasil = klasifikasikanBlok({ type: "text", content: "Halo TKA." });
  assert.equal(hasil.kind, "valid");
});

test("blok rusak (tipe tak dikenal) tidak throw, kind invalid + pesan aman", () => {
  let hasil: ReturnType<typeof klasifikasikanBlok> | undefined;
  assert.doesNotThrow(() => {
    hasil = klasifikasikanBlok({ type: "video", url: "https://x/y.mp4" });
  });
  assert.equal(hasil?.kind, "invalid");
  assert.match((hasil as { reason: string }).reason, /tidak valid|tidak dapat dibaca/);
});

test("blok rusak (latex kosong) tidak throw", () => {
  let hasil: ReturnType<typeof klasifikasikanBlok> | undefined;
  assert.doesNotThrow(() => {
    hasil = klasifikasikanBlok({ type: "math", latex: "   " });
  });
  assert.equal(hasil?.kind, "invalid");
});

test("input liar (null/undefined/string/array/number) tidak throw", () => {
  for (const liar of [null, undefined, "teks", 42, [], {}]) {
    let hasil: ReturnType<typeof klasifikasikanBlok> | undefined;
    assert.doesNotThrow(() => {
      hasil = klasifikasikanBlok(liar);
    }, `input ${String(liar)} melempar`);
    assert.equal(hasil?.kind, "invalid");
  }
});

test("Proxy jebakan yang throw saat diakses tidak menjatuhkan guard", () => {
  const jebakan = new Proxy(
    {},
    {
      get() {
        throw new Error("jebakan");
      },
    },
  );
  let hasil: ReturnType<typeof klasifikasikanBlok> | undefined;
  assert.doesNotThrow(() => {
    hasil = klasifikasikanBlok(jebakan);
  });
  assert.equal(hasil?.kind, "invalid");
});
