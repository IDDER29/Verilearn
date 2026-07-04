import type { ReactNode } from "react";
import Sidebar, { type NavKey } from "./Sidebar";
import OfflineBanner from "./OfflineBanner";

/**
 * The VeriLearn app shell: centered lilac page, rounded shell card, and the
 * shared sidebar in the first grid column. `children` render as the <main>
 * content in the second column — each page supplies its own main layout.
 */
export default function AppShell({
  active,
  children,
}: {
  active?: NavKey;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 26,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <OfflineBanner />
      <div
        style={{
          width: 1340,
          flexShrink: 0,
          background: "#f4f2f8",
          borderRadius: 30,
          display: "grid",
          gridTemplateColumns: "248px 1fr",
          overflow: "hidden",
          boxShadow: "0 30px 80px -40px rgba(80,60,140,.4)",
        }}
      >
        <a href="#vl-main" className="vl-skip">Skip to main content</a>
        <Sidebar active={active} />
        <div id="vl-main" tabIndex={-1} style={{ minWidth: 0, outline: "none" }}>{children}</div>
      </div>
    </div>
  );
}
