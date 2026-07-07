"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary (App Router `error` convention). Catches an
 * unexpected runtime error thrown while rendering a segment (below the root
 * layout) and shows a recoverable fallback instead of a blank screen.
 *
 * This Next version passes `unstable_retry` (not the older `reset`) to
 * re-attempt the failed render. In production the forwarded `error.message`
 * from a Server Component is a generic string with a `digest` that matches the
 * server-side log — we surface the digest so a user can quote it in support.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // In a real deployment this is where an error reporter (Sentry, etc.) hooks in.
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "40px 24px",
        textAlign: "center",
        background: "#f4f1fb",
      }}
    >
      <div style={{ fontSize: 40 }} aria-hidden>
        ⚠️
      </div>
      <div style={{ font: "900 22px var(--font-nunito)", color: "#221f2e" }}>Something went wrong</div>
      <div style={{ font: "600 14px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 440 }}>
        An unexpected error interrupted this page. You can try again — if it keeps happening, come back in a
        moment.
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            border: "none",
            background: "#6d5bd0",
            color: "#fff",
            font: "800 14px var(--font-nunito)",
            padding: "13px 24px",
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            border: "1.5px solid #ece8f4",
            background: "#fff",
            color: "#4a4560",
            font: "800 14px var(--font-nunito)",
            padding: "13px 24px",
            borderRadius: 14,
          }}
        >
          Back to home
        </Link>
      </div>
      {error.digest && (
        <div style={{ font: "600 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 8 }}>
          Reference: <code>{error.digest}</code>
        </div>
      )}
    </main>
  );
}
