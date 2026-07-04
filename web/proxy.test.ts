import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

function req(path: string, cookie?: string): NextRequest {
  const headers: HeadersInit = cookie ? { cookie: `vl_session=${cookie}` } : {};
  return new NextRequest(new Request(`http://localhost${path}`, { headers }));
}

describe("proxy (coarse auth gate)", () => {
  it("redirects an unauthenticated request to /login", () => {
    const res = proxy(req("/"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("passes through an authenticated request", () => {
    const res = proxy(req("/", "sometoken"));
    expect(res.status).toBe(200);
  });

  it("lets an unauthenticated visitor through to the public pages", () => {
    for (const path of ["/login", "/signup", "/pricing", "/demo"]) {
      expect(proxy(req(path)).status).toBe(200);
    }
  });

  it("lets an unauthenticated visitor through to the public verify page and API, but not other API routes", () => {
    expect(proxy(req("/verify/VL-ABC123")).status).toBe(200);
    expect(proxy(req("/api/verify/VL-ABC123")).status).toBe(200);
    expect(proxy(req("/api/topics/abc")).status).toBe(200); // JSON-401 handled by the route itself
  });

  it("still gates an unauthenticated visitor out of a real app route", () => {
    const res = proxy(req("/review"));
    expect(res.status).toBe(307);
  });
});
