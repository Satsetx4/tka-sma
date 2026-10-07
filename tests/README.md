# tests/

Baseline memakai `node:test` bawaan Node — tanpa dependensi baru, tanpa mengubah toolchain Vite/React.
Jalankan: `npm test` (`node --test tests/`). File tes: `*.test.ts`.
Awal: `smoke.test.ts` (assert `1 + 1`) sebagai bukti runner hidup; tes fitur menyusul per fase.
Tes di sini tidak diikutkan `tsc -b` (di luar `include` tsconfig) agar gerbang tetap ringan.
