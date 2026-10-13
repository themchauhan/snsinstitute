import type { NextConfig } from "next";

/**
 * English lives at the root ("/courses"), Hindi under "/hi" ("/hi/courses").
 * Internally both are served by app/[lang]/…, so English URLs are rewritten to /en/….
 */
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Branded 404 for any unknown URL (the root layout lives under [lang]).
  experimental: {
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.svg", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        {
          // everything except /hi, /api, Next internals and files with an extension
          source: "/:path((?!hi(?:/|$)|en(?:/|$)|api/|_next/)[^.]+)",
          destination: "/en/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
