import type { NextConfig } from "next";

// Konfigurasi minimal shell Next.js (P0.2, Vite dipensiunkan di P0.7).
// Belum ada secret, rewrites, atau headers — hanya shell statis.
// agentRules: false — cegah `next dev` menyuntik blok nextjs-agent-rules ke AGENTS.md.
const nextConfig: NextConfig = {
  agentRules: false,
};

export default nextConfig;
