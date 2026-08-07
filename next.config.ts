import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static export for GitHub Pages — see node_modules/next/dist/docs/01-app/02-guides/static-exports.md
  output: "export",
  // project site lives at /river-on-record/ — prefix all assets and links
  basePath: "/river-on-record",
  images: { unoptimized: true },
};

export default nextConfig;
