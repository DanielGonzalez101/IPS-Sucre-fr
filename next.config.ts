import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js necesita inline scripts para hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.wcx.cloud https://f.wcentrix.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
      // Supabase storage para imágenes/archivos
      `style-src 'self' 'unsafe-inline' https://f.wcentrix.com`,
      `img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""} https://wcentrix.net https://f.wcentrix.com`,
      `font-src 'self' https://f.wcentrix.com`,
      // Supabase API calls + WCentrix
      `connect-src 'self' ${process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""} wss://*.supabase.co https://api.wcx.cloud https://wcentrix.net https://f.wcentrix.com`,
      "frame-src 'self' https://www.google.com/maps/ https://f.wcentrix.com https://wcentrix.net",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gbciefdgpvoqirpsyfrv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
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

export default nextConfig;