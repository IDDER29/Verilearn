import { afterEach, describe, expect, it, vi } from "vitest";
import { sessionSecret } from "./current";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sessionSecret (production hardening)", () => {
  it("uses the env secret when it is set", () => {
    vi.stubEnv("VERILEARN_SESSION_SECRET", "a-real-long-random-secret");
    expect(sessionSecret()).toBe("a-real-long-random-secret");
  });

  it("falls back to the dev default outside production", () => {
    vi.stubEnv("VERILEARN_SESSION_SECRET", "");
    vi.stubEnv("NODE_ENV", "development");
    expect(sessionSecret()).toContain("dev-only-insecure");
  });

  it("REFUSES the insecure fallback in production — throws instead of silently signing with a public constant", () => {
    vi.stubEnv("VERILEARN_SESSION_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => sessionSecret()).toThrow(/VERILEARN_SESSION_SECRET is not set/);
  });

  it("treats a blank/whitespace env secret as unset in production", () => {
    vi.stubEnv("VERILEARN_SESSION_SECRET", "   ");
    vi.stubEnv("NODE_ENV", "production");
    expect(() => sessionSecret()).toThrow();
  });
});
