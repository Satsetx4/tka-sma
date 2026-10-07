"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

/** Tema visual aplikasi. Pengganti `store.theme` milik prototipe Vite — mandiri, tanpa impor store. */
export type Theme = "dark" | "light";

const STORAGE_KEY = "tka-sma:theme:v1";
const DEFAULT_THEME: Theme = "dark";

function bacaTemaTersimpan(): Theme {
  try {
    const mentah = localStorage.getItem(STORAGE_KEY);
    if (!mentah) return DEFAULT_THEME;
    // Nilai disimpan sebagai JSON (cerminan store Vite): "\"dark\"" / "\"light\"".
    return JSON.parse(mentah) === "light" ? "light" : "dark";
  } catch {
    return DEFAULT_THEME;
  }
}

function terapkanKeDokumen(theme: Theme) {
  const akar = document.documentElement;
  akar.classList.toggle("dark", theme === "dark");
  akar.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0b0f17" : "#f1f5f9");
}

interface KonteksTema {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<KonteksTema | null>(null);

/** Penyedia tema untuk shell Next.js — gantikan `useTheme` dari store Vite. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Nilai awal diderivasi saat render (lazy initializer, baca localStorage sekali).
  // Aman untuk SSR/prerender: guard `typeof window` agar snapshot server = default gelap.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME;
    return bacaTemaTersimpan();
  });

  // Terapkan ke <html> + simpan pilihan setiap kali tema berubah.
  useEffect(() => {
    terapkanKeDokumen(theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      // Storage penuh / mode privat: aplikasi tetap jalan.
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggle = useCallback(
    () => setThemeState((s) => (s === "dark" ? "light" : "dark")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook tema Next.js — API `{ theme, toggle }` kompatibel dengan `useTheme` Vite. */
export function useTheme(): KonteksTema {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme harus dipakai di dalam <ThemeProvider>.");
  return ctx;
}
