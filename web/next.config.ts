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
  // HSTS (production only): once a browser has seen this over HTTPS it refuses
  // to talk to the origin over plain HTTP for a year, defeating SSL-strip
  // downgrade attacks. Emitted only in production — over local http://localhost
  // it's a no-op the spec says to ignore, and we never want it pinned against a
  // dev box. `preload` is intentionally omitted: opting into the browser
  // preload list is a hard-to-reverse commitment the domain owner should make
  // deliberately, not a framework default.
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

/**
 * The one deliberate, narrow carve-out from app-wide anti-framing (API-15): a
 * public verify badge exists specifically to be embedded on a third-party
 * page (a resume site, a profile), so it needs to allow framing from any
 * origin. It carries no learner PII (enforced at the data layer by
 * `publicVerify`), so there is nothing sensitive to leak by allowing this.
 * Every other route keeps the strict `frame-ancestors 'none'` default above.
 *
 * Next applies matching `headers()` entries in order, and for the SAME header
 * key the LAST match wins — so this entry is listed after the catch-all,
 * overriding its Content-Security-Policy for this one route. `X-Frame-Options`
 * has no "allow any origin" value (only DENY/SAMEORIGIN), so the catch-all's
 * `DENY` is still technically present here too; per spec, browsers that
 * support CSP `frame-ancestors` treat it as authoritative over `X-Frame-
 * Options` when both are sent, so this override is still effective in every
 * evergreen browser.
 */
const badgeCsp = csp.replace("frame-ancestors 'none'", "frame-ancestors *");
const BADGE_HEADERS = [{ key: "Content-Security-Policy", value: badgeCsp }];

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/verify/:code/badge", headers: BADGE_HEADERS },
    ];
  },
};

export default nextConfig;
