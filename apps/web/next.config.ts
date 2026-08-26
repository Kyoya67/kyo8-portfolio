import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@kyo8/ui"],
  images: {
    remotePatterns: [
      // Zenn's article OGP images (synced into imageUrl by the API's Zenn RSS import).
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
