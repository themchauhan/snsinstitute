import type { NextConfig } from "next";

/**
 * English lives at the root ("/courses"), Hindi under "/hi" ("/hi/courses").
 * Internally both are served by app/[lang]/…, so English URLs are rewritten to /en/….
 */
const nextConfig: NextConfig = {
  // Keystatic's GitHub login redirects local dev to 127.0.0.1 – allow it (dev only).
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Branded 404 for any unknown URL (the site has two root layouts: [lang] and keystatic).
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
          // everything except /hi, /keystatic, /api, Next internals and files with an extension
          source: "/:path((?!hi(?:/|$)|en(?:/|$)|keystatic|api/|_next/)[^.]+)",
          destination: "/en/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
