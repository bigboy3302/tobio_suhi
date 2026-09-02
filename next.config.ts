import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.storage.*.nhost.run",
        pathname: "/v1/files/**",
      },
    ],
  },
};

export default nextConfig;
