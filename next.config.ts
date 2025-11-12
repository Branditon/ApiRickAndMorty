// next.config.ts
import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["rickandmortyapi.com", "www.pngkey.com"],
  },
};

export default withBundleAnalyzer(nextConfig);
