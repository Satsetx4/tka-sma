/**
 * Helper skala chart SVG (P3.7) — fungsi murni agar mudah diuji tanpa DOM.
 * Chart dirender sebagai SVG statis (tanpa recharts) supaya ringan di mobile.
 */

/** Bulatkan batas atas sumbu ke angka "rapi" 1/2/2.5/5 × 10^n. */
export function niceCeil(nilai: number): number {
  if (!Number.isFinite(nilai) || nilai <= 0) return 1;
  const pangkat = Math.floor(Math.log10(nilai));
  const basis = 10 ** pangkat;
  const ternormalisasi = nilai / basis;
  let bagus: number;
  if (ternormalisasi <= 1) bagus = 1;
  else if (ternormalisasi <= 2) bagus = 2;
  else if (ternormalisasi <= 2.5) bagus = 2.5;
  else if (ternormalisasi <= 5) bagus = 5;
  else bagus = 10;
  return bagus * basis;
}

/** Buat `jumlah+1` tick merata dari 0 sampai `maks` (inklusif). */
export function linearTicks(maks: number, jumlah = 4): number[] {
  const aman = Number.isFinite(maks) && maks > 0 ? maks : 1;
  const n = Math.max(1, Math.floor(jumlah));
  const hasil: number[] = [];
  for (let i = 0; i <= n; i += 1) {
    // Hindari derau floating point seperti 0.30000000000000004.
    hasil.push(Math.round((aman * i) / n * 1e10) / 1e10);
  }
  return hasil;
}

/** Jumlahkan deret nilai (abaikan non-finite demi ketahanan render). */
export function jumlahkan(nilai: readonly number[]): number {
  let total = 0;
  for (const v of nilai) {
    if (Number.isFinite(v)) total += v;
  }
  return total;
}

/**
 * Ubah nilai pie menjadi fraksi 0..1.
 * Total nol/negatif → semua nol (renderer menampilkan pesan data kosong,
 * bukan lingkaran menyesatkan).
 */
export function fraksiPie(nilai: readonly number[]): number[] {
  const total = jumlahkan(nilai);
  if (total <= 0) return nilai.map(() => 0);
  return nilai.map((v) => (Number.isFinite(v) && v > 0 ? v / total : 0));
}

/** Nilai maksimum di seluruh dataset (abaikan non-finite). */
export function nilaiMaksimum(datasets: readonly { values: readonly number[] }[]): number {
  let maks = 0;
  for (const ds of datasets) {
    for (const v of ds.values) {
      if (Number.isFinite(v) && v > maks) maks = v;
    }
  }
  return maks;
}

/** Nilai minimum di seluruh dataset (untuk line/scatter; abaikan non-finite). */
export function nilaiMinimum(datasets: readonly { values: readonly number[] }[]): number {
  let min = Number.POSITIVE_INFINITY;
  for (const ds of datasets) {
    for (const v of ds.values) {
      if (Number.isFinite(v) && v < min) min = v;
    }
  }
  return min === Number.POSITIVE_INFINITY ? 0 : min;
}
