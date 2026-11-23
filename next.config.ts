import type { NextConfig } from "next";

const ASSET_ORIGIN = process.env.ASSET_ORIGIN || "https://puppy.instabizweb.com";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return {
      // Only used when a file is NOT in /public (e.g. before `npm run assets`
      // has been run): the request is transparently proxied to the reference site.
      fallback: [
        { source: "/media/:path*", destination: `${ASSET_ORIGIN}/media/:path*` },
        { source: "/brand/:path*", destination: `${ASSET_ORIGIN}/brand/:path*` },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
