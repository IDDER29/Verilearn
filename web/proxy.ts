import { NextResponse, type NextRequest } from "next/server";

/**
 * Coarse auth gate: unauthenticated requests (no session cookie) are redirected
 * to /login for everything except the auth pages and public assets. Full
 * cryptographic verification still happens per-page via requireUser() — this is
 * a cheap first gate (defense in depth), not the source of truth.
 */
// /pricing is a public, unauthenticated pricing view (BILL-03).
// /demo is the public, no-account guest showcase (TRUST-22).
const PUBLIC = new Set(["/login", "/signup", "/pricing", "/demo"]);
// The public certificate-verify JSON endpoint (API-03) and human-readable page
// (TEST-11) — no session required, by design: a third party (employer, LMS)
// confirming a printed code has no VeriLearn account.
const PUBLIC_PREFIXES = ["/api/verify/", "/verify/"];
// JSON API routes that DO require auth, but should fail with a JSON 401 from the
// route handler itself (via getCurrentUser()) rather than an HTML redirect to
// /login — the right shape for a fetch/API client (API-04).
const JSON_API_PREFIXES = ["/api/topics/"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    PUBLIC.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    JSON_API_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }
  const hasSession = req.cookies.has("vl_session");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, the favicon, and the logout route.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logout).*)"],
};
