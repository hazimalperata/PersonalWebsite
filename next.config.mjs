/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Old section and project URLs from the previous site.
const legacy = [
  ["/about", "/#about"],
  ["/work", "/#work"],
  ["/earth", "/work/the-pale-blue-dot"],
];

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { globalNotFound: true },
  async redirects() {
    return legacy.flatMap(([from, to]) => [
      { source: from, destination: to, permanent: true },
      { source: `/tr${from}`, destination: `/tr${to.startsWith("/#") ? to.slice(1) : to}`, permanent: true },
    ]);
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};
export default withNextIntl(nextConfig);
