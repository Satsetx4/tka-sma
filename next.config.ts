import type { NextConfig } from "next";

// Konfigurasi minimal shell P0.2: App Router berdampingan dengan Vite.
// Belum ada secret, rewrites, atau headers — hanya shell statis.
// agentRules: false — cegah `next dev` menyuntik blok nextjs-agent-rules ke AGENTS.md.
const nextConfig: NextConfig = {
  agentRules: false,
};

export default nextConfig;
