import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
    // ✳️ ВАЖНО: добавляем это
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
