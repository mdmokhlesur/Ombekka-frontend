import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://ombekka-backend.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
