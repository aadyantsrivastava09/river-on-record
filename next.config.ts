import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static export for GitHub Pages — see node_modules/next/dist/docs/01-app/02-guides/static-exports.md
  output: "export",
  // served at the root of riveronrecord.vantalynelabs.in via public/CNAME
  images: { unoptimized: true },
};

export default nextConfig;
