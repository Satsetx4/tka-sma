/**
 * Evaluator ekspresi fungsi aman untuk grafik (P3.8) — fungsi murni.
 *
 * SENGAJA tidak memakai eval()/Function() karena ekspresi berasal dari konten
 * CMS. Grammatik yang didukung:
 *   angka, variabel x, konstanta pi/e, operator + - * / ^ (pangkat asosiatif
 *   kanan), perkalian implisit ("2x", "3(x+1)"), tanda kurung, dan fungsi
 *   sin cos tan sqrt abs exp ln log (log = basis 10).
 * Awalan "y=" atau "f(x)=" boleh ditulis dan akan diabaikan.
 */

// ---- Token ----

type Token =
  | { kind: "angka"; nilai: number }
  | { kind: "x" }
  | { kind: "op"; op: "+" | "-" | "*" | "/" | "^" }
  | { kind: "kurungBuka" }
  | { kind: "kurungTutup" }
  | { kind: "fungsi"; nama: string };

const FUNGSI_DIDUKUNG = new Set(["sin", "cos", "tan", "sqrt", "abs", "exp", "ln", "log"]);
const KONSTANTA: Record<string, number> = { pi: Math.PI, e: Math.E };

function tokenisasi(sumber: string): Token[] {
  const token: Token[] = [];
  let i = 0;
  while (i < sumber.length) {
    const c = sumber[i];
    if (c === " " || c === "\t" || c === "\n") {
      i += 1;
      continue;
    }
    if ((c >= "0" && c <= "9") || c === ".") {
      let j = i;
      let titik = false;
      while (j < sumber.length && ((sumber[j] >= "0" && sumber[j] <= "9") || sumber[j] === ".")) {
        if (sumber[j] === ".") {
          if (titik) break;
          titik = true;
        }
        j += 1;
      }
      const teks = sumber.slice(i, j);
      const nilai = Number(teks);
      if (!Number.isFinite(nilai)) throw new Error(`Angka "${teks}" tidak valid.`);
      token.push({ kind: "angka", nilai });
      i = j;
      continue;
    }
    if (c === "+" || c === "-" || c === "*" || c === "/" || c === "^") {
      token.push({ kind: "op", op: c });
      i += 1;
      continue;
    }
    if (c === "(") {
      token.push({ kind: "kurungBuka" });
      i += 1;
      continue;
    }
    if (c === ")") {
      token.push({ kind: "kurungTutup" });
      i += 1;
      continue;
    }
    if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
      let j = i;
      while (j < sumber.length && ((sumber[j] >= "a" && sumber[j] <= "z") || (sumber[j] >= "A" && sumber[j] <= "Z"))) j += 1;
      const nama = sumber.slice(i, j).toLowerCase();
      if (nama === "x") token.push({ kind: "x" });
      else if (nama in KONSTANTA) token.push({ kind: "angka", nilai: KONSTANTA[nama] });
      else if (FUNGSI_DIDUKUNG.has(nama)) token.push({ kind: "fungsi", nama });
      else throw new Error(`Nama "${nama}" tidak dikenal. Gunakan x, pi, e, atau fungsi sin cos tan sqrt abs exp ln log.`);
      i = j;
      continue;
    }
    throw new Error(`Karakter "${c}" tidak didukung dalam ekspresi fungsi.`);
  }
  return token;
}

// ---- Parser (menghasilkan fungsi evaluasi) ----

type Fn = (x: number) => number;

function terapkanFungsi(nama: string, arg: number): number {
  switch (nama) {
    case "sin": return Math.sin(arg);
    case "cos": return Math.cos(arg);
    case "tan": return Math.tan(arg);
    case "sqrt": return arg < 0 ? NaN : Math.sqrt(arg);
    case "abs": return Math.abs(arg);
    case "exp": return Math.exp(arg);
    case "ln": return arg <= 0 ? NaN : Math.log(arg);
    case "log": return arg <= 0 ? NaN : Math.log10(arg);
    default: return NaN;
  }
}

class Parser {
  private pos = 0;
  private token: Token[];
  constructor(token: Token[]) {
    this.token = token;
  }

  parse(): Fn {
    const fn = this.parseTambahKurang();
    if (this.pos < this.token.length) throw new Error("Ada sisa ekspresi yang tidak dapat dibaca di akhir.");
    return fn;
  }

  private lihat(): Token | undefined {
    return this.token[this.pos];
  }

  private parseTambahKurang(): Fn {
    let kiri = this.parseKaliBagi();
    for (;;) {
      const t = this.lihat();
      if (t?.kind === "op" && (t.op === "+" || t.op === "-")) {
        this.pos += 1;
        const kanan = this.parseKaliBagi();
        const l = kiri;
        kiri = t.op === "+" ? ((x) => l(x) + kanan(x)) : ((x) => l(x) - kanan(x));
      } else return kiri;
    }
  }

  private parseKaliBagi(): Fn {
    let kiri = this.parseUner();
    for (;;) {
      const t = this.lihat();
      if (t?.kind === "op" && (t.op === "*" || t.op === "/")) {
        this.pos += 1;
        const kanan = this.parseUner();
        const l = kiri;
        kiri = t.op === "*" ? ((x) => l(x) * kanan(x)) : ((x) => {
          const penyebut = kanan(x);
          return penyebut === 0 ? NaN : l(x) / penyebut;
        });
      } else if (t && (t.kind === "angka" || t.kind === "x" || t.kind === "kurungBuka" || t.kind === "fungsi")) {
        // Perkalian implisit: "2x", "3(x+1)", "x sin(x)".
        const kanan = this.parseUner();
        const l = kiri;
        kiri = (x) => l(x) * kanan(x);
      } else return kiri;
    }
  }

  private parseUner(): Fn {
    const t = this.lihat();
    if (t?.kind === "op" && t.op === "-") {
      this.pos += 1;
      const dalam = this.parseUner();
      return (x) => -dalam(x);
    }
    if (t?.kind === "op" && t.op === "+") {
      this.pos += 1;
      return this.parseUner();
    }
    return this.parsePangkat();
  }

  private parsePangkat(): Fn {
    const basis = this.parsePrimer();
    const t = this.lihat();
    if (t?.kind === "op" && t.op === "^") {
      this.pos += 1;
      const pangkat = this.parseUner(); // asosiatif kanan, izinkan pangkat negatif
      return (x) => basis(x) ** pangkat(x);
    }
    return basis;
  }

  private parsePrimer(): Fn {
    const t = this.lihat();
    if (!t) throw new Error("Ekspresi berakhir tiba-tiba; periksa tanda kurung atau operator.");
    if (t.kind === "angka") {
      this.pos += 1;
      return () => t.nilai;
    }
    if (t.kind === "x") {
      this.pos += 1;
      return (x) => x;
    }
    if (t.kind === "fungsi") {
      this.pos += 1;
      const buka = this.lihat();
      if (buka?.kind !== "kurungBuka") throw new Error(`Fungsi "${t.nama}" wajib diikuti tanda kurung, mis. ${t.nama}(x).`);
      this.pos += 1;
      const arg = this.parseTambahKurang();
      const tutup = this.lihat();
      if (tutup?.kind !== "kurungTutup") throw new Error(`Kurung tutup fungsi "${t.nama}" tidak ditemukan.`);
      this.pos += 1;
      const nama = t.nama;
      return (x) => terapkanFungsi(nama, arg(x));
    }
    if (t.kind === "kurungBuka") {
      this.pos += 1;
      const dalam = this.parseTambahKurang();
      const tutup = this.lihat();
      if (tutup?.kind !== "kurungTutup") throw new Error("Kurung tutup tidak ditemukan.");
      this.pos += 1;
      return dalam;
    }
    throw new Error("Bagian ekspresi ini tidak dapat dibaca; periksa operator atau tanda kurung.");
  }
}

/** Buang awalan "y=" / "f(x)=" bila ada; kembalikan isi + penanda. */
function kupasAwalan(ekspresi: string): string {
  const rapi = ekspresi.trim().replace(/^f\s*\(\s*x\s*\)\s*=/i, "").replace(/^y\s*=/i, "").trim();
  return rapi;
}

/**
 * Kompilasi ekspresi menjadi fungsi evaluasi.
 * Melempar Error berbahasa Indonesia bila ekspresi tidak didukung.
 */
export function kompilasiEkspresi(ekspresi: string): Fn {
  const isi = kupasAwalan(ekspresi);
  if (!isi) throw new Error("Ekspresi fungsi kosong.");
  const token = tokenisasi(isi);
  if (token.length === 0) throw new Error("Ekspresi fungsi kosong.");
  return new Parser(token).parse();
}

export interface TitikGrafik {
  x: number;
  y: number;
}

export interface HasilSampel {
  /** Segmen polyline terputus (NaN/Infinity memutus garis, mis. 1/x di x=0). */
  segments: TitikGrafik[][];
  error?: string;
}

/** Sampel ekspresi pada rentang x; nilai non-finite memutus garis. */
export function sampelFungsi(
  ekspresi: string,
  xMin: number,
  xMax: number,
  jumlahTitik = 160,
): HasilSampel {
  let fn: Fn;
  try {
    fn = kompilasiEkspresi(ekspresi);
  } catch (e) {
    return { segments: [], error: e instanceof Error ? e.message : "Ekspresi tidak dapat dibaca." };
  }
  const n = Math.max(8, Math.min(400, Math.floor(jumlahTitik)));
  const segments: TitikGrafik[][] = [];
  let aktif: TitikGrafik[] = [];
  let adaHingga = false;
  for (let i = 0; i < n; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / (n - 1);
    let y: number;
    try {
      y = fn(x);
    } catch {
      y = NaN;
    }
    if (!Number.isFinite(y)) {
      if (aktif.length > 1) segments.push(aktif);
      else if (aktif.length === 1) segments.push(aktif);
      aktif = [];
      continue;
    }
    // Putuskan garis pada lompatan vertikal ekstrem (asimtot) agar tidak
    // menggambar garis tegak menyesatkan.
    const terakhir = aktif[aktif.length - 1];
    if (terakhir !== undefined && Math.abs(y - terakhir.y) > Math.abs(xMax - xMin) * 4) {
      if (aktif.length > 0) segments.push(aktif);
      aktif = [];
    }
    aktif.push({ x, y });
    adaHingga = true;
  }
  if (aktif.length > 0) segments.push(aktif);
  if (!adaHingga) return { segments: [], error: "Fungsi tidak punya nilai hingga pada rentang ini." };
  return { segments };
}
