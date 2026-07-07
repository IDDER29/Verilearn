"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

/**
 * Root error boundary (App Router `global-error` convention). This catches an
 * error thrown in the **root layout** itself — the one place `error.tsx` can't
 * reach — so even a total render failure shows a branded page rather than a
 * white screen. It replaces the root layout when active, so it must define its
 * own `<html>`/`<body>` and can't rely on the app's fonts or global styles;
 * everything here is self-contained inline. `metadata` isn't supported in a
 * client component, so the title is set with React's `<title>`.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <title>Something went wrong · VeriLearn</title>
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
            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            color: "#221f2e",
          }}
        >
          <div style={{ fontSize: 40 }} aria-hidden>
            ⚠️
          </div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>Something went wrong</div>
          <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.6, color: "#8b8699", maxWidth: 440 }}>
            VeriLearn hit an unexpected error. Please try again — if it persists, come back in a moment.
          </div>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              marginTop: 6,
              border: "none",
              background: "#6d5bd0",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              padding: "13px 24px",
              borderRadius: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <div style={{ fontWeight: 600, fontSize: 11, color: "#a7a1b8", marginTop: 8 }}>
              Reference: <code>{error.digest}</code>
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
