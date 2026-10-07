import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Bahasa Indonesia mengikuti shell Vite (index.html lang="id").
export const metadata: Metadata = {
  title: "TKA SMA",
  description: "Latihan soal & simulasi TKA SMA — shell Next.js (migrasi dari Vite).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
