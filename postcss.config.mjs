// Pipeline CSS resmi Tailwind v4 untuk Next.js.
// Berkas ini HANYA dipakai oleh Next (next dev / next build).
// Build Vite tetap memakai plugin @tailwindcss/vite (vite.config.ts) —
// plugin PostCSS di bawah ini no-op untuk CSS yang sudah dikompilasi Vite.
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
