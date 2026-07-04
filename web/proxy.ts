import { NextResponse, type NextRequest } from "next/server";

/**
 * Coarse auth gate: unauthenticated requests (no session cookie) are redirected
 * to /login for everything except the auth pages and public assets. Full
 * cryptographic verification still happens per-page via requireUser() — this is
 * a cheap first gate (defense in depth), not the source of truth.
 */
const PUBLIC = new Set(["/login", "/signup"]);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.has(pathname)) return NextResponse.next();
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
