/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/tools/audio-quality-checker",
        destination: "/tools/seo-growth-pack",
        permanent: true,
      },
      {
        source: "/tools/title-generator",
        destination: "/tools/free-podcast-title-generator",
        permanent: true,
      },
      {
        source: "/",
        has: [{ type: "query", key: "tab", value: "keyword" }],
        destination: "/tools/free-podcast-title-generator",
        permanent: true,
      },
      {
        source: "/downloads/pre-flight-checklist.md",
        destination: "/api/downloads/pre-flight-checklist",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
