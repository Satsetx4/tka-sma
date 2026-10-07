import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "../components/theme/theme-provider";
import "./globals.css";

// Bahasa Indonesia (lang="id"), mengikuti prototipe sebelumnya.
export const metadata: Metadata = {
  title: "TKA SMA — Latihan & Simulasi",
  description:
    "Latihan soal & simulasi TKA SMA — Matematika, Bahasa Indonesia, Bahasa Inggris. Timer, pembahasan, riwayat nilai. Tanpa login.",
};

// Viewport mobile (lebar perangkat + notch).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0f17",
};

// Skrip init tema anti-FOUC: jalan sebelum paint, default gelap, baca pilihan
// tersimpan key tka-sma:theme:v1 (disimpan sebagai JSON, cerminan store Vite).
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("tka-sma:theme:v1");var t=s?JSON.parse(s):"dark";if(t!=="light")t="dark";var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"#0b0f17":"#f1f5f9");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
