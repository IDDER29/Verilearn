import type { NextConfig } from "next";

/**
 * Content-Security-Policy + hardening headers (SEC-19). The app is fully
 * self-hosted (Next-bundled fonts, inline styles, no third-party origins), so
 * everything locks to 'self'. Inline styles are used pervasively (style={{…}}),
 * and Next injects inline hydration scripts, so style-src/script-src allow
 * 'unsafe-inline' ('unsafe-eval' only in dev for Fast Refresh). Framing is
 * denied (clickjacking), object/base/form are locked down. A nonce-based strict
 * script-src is the further hardening step.
 */
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
