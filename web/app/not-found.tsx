import Link from "next/link";

export const metadata = { title: "Page not found · VeriLearn" };

/**
 * Custom 404 (App Router `not-found` convention). Renders for an unmatched
 * route or a `notFound()` thrown in a segment. Branded, calm, and always
 * offers a way back — a production app never shows a raw framework 404.
 */
export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "40px 24px",
        textAlign: "center",
        background: "#f4f1fb",
        font: "var(--font-nunito)",
      }}
    >
      <div style={{ font: "900 64px var(--font-nunito)", color: "#6d5bd0", lineHeight: 1 }}>404</div>
      <div style={{ font: "900 22px var(--font-nunito)", color: "#221f2e" }}>We couldn&apos;t find that page</div>
      <div style={{ font: "600 14px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 420 }}>
        The link may be broken, or the page may have moved. Let&apos;s get you back to something that exists.
      </div>
      <Link
        href="/"
        style={{
          marginTop: 6,
          textDecoration: "none",
          background: "#6d5bd0",
          color: "#fff",
          font: "800 14px var(--font-nunito)",
          padding: "13px 24px",
          borderRadius: 14,
          boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
        }}
      >
        Back to VeriLearn
      </Link>
    </main>
  );
}
