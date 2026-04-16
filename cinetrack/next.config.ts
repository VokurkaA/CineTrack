import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
    allowedDevOrigins: ['10.251.77.1'],
};

export default nextConfig;
