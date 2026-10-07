import { useEffect, useState } from "react";

/* ============ Tipe data inti ============ */

export type SubjectId = "matematika" | "bindo" | "binggris";

export interface Question {
  id: string;
  subject: SubjectId;
  topic: string;
  question: string;
  options: [string, string, string, string, string];
  answer: number; // indeks 0-4
  explanation: string;
}

export type ExamMode = "latihan" | "simulasi";

export interface Attempt {
  id: string;
  date: string; // ISO
  name: string;
  mode: ExamMode;
  subjects: SubjectId[];
  total: number;
  correct: number;
  score: number; // 0-100
  durationSec: number;
  perSubject: Record<string, { total: number; correct: number }>;
}

export interface Profile {
  name: string;
}

/* ============ Meta mapel ============ */

export const SUBJECTS: Record<
  SubjectId,
  { label: string; short: string; desc: string; color: string; dot: string }
> = {
  matematika: {
    label: "Matematika",
    short: "MTK",
    desc: "Eksponen, fungsi, trigonometri, limit, peluang",
    color: "emerald",
    dot: "bg-emerald-500",
  },
  bindo: {
    label: "Bahasa Indonesia",
    short: "BIN",
    desc: "Ide pokok, EYD, fakta-opini, evaluasi teks",
    color: "amber",
    dot: "bg-amber-500",
  },
  binggris: {
    label: "Bahasa Inggris",
    short: "BIG",
    desc: "Tenses, passive, conditional, reading",
    color: "sky",
    dot: "bg-sky-500",
  },
};

export const SUBJECT_IDS: SubjectId[] = ["matematika", "bindo", "binggris"];

/* ============ Storage (localStorage, fail-safe) ============ */

const K_PROFILE = "tka-sma:profile:v1";
const K_ATTEMPTS = "tka-sma:attempts:v1";
const K_THEME = "tka-sma:theme:v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // storage penuh / mode privat: app tetap jalan
  }
}

export const store = {
  profile: {
    load(): Profile {
      return read<Profile>(K_PROFILE, { name: "" });
    },
    save(p: Profile) {
      write(K_PROFILE, p);
    },
  },
  attempts: {
    load(): Attempt[] {
      const list = read<Attempt[]>(K_ATTEMPTS, []);
      return Array.isArray(list) ? list : [];
    },
    add(a: Attempt) {
      const list = store.attempts.load();
      list.unshift(a);
      write(K_ATTEMPTS, list.slice(0, 50)); // simpan 50 terakhir
    },
    clear() {
      write(K_ATTEMPTS, []);
    },
  },
  theme: {
    load(): "dark" | "light" {
      const t = read<string>(K_THEME, "dark");
      return t === "light" ? "light" : "dark";
    },
    save(t: "dark" | "light") {
      write(K_THEME, t);
    },
  },
};

/* ============ Theme hook ============ */

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0b0f17" : "#f1f5f9");
    store.theme.save(theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

/* ============ Helpers ============ */

export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export function scoreOf(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function gradeOf(score: number): { label: string; hint: string } {
  if (score >= 85) return { label: "Mantul!", hint: "Siap tempur TKA beneran." };
  if (score >= 70) return { label: "Bagus!", hint: "Sedikit lagi konsisten." };
  if (score >= 50) return { label: "Lumayan", hint: "Ulas pembahasan yang salah." };
  return { label: "Gas lagi", hint: "Fokus ke topik merah dulu." };
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Acak urutan soal (Fisher-Yates), tanpa ubah kunci jawaban. */
export function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
