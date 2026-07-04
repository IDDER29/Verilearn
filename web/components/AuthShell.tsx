import type { ReactNode } from "react";

/** Centered auth card on the lilac page — the front door shell for login/signup. */
export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 26 }}>
      <div style={{ width: 400, maxWidth: "100%", background: "#f4f2f8", borderRadius: 28, padding: 32, boxShadow: "0 30px 80px -40px rgba(80,60,140,.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#6d5bd0,#8b78e8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px -4px rgba(109,91,208,.6)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.7l.9-5.4-3.9-3.8 5.4-.8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9.3 12l1.9 1.9L15 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ font: "900 21px var(--font-nunito)", letterSpacing: "-.02em" }}>VeriLearn</span>
        </div>
        <div style={{ font: "900 23px var(--font-nunito)", letterSpacing: "-.02em" }}>{title}</div>
        <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", margin: "4px 0 22px" }}>{subtitle}</div>
        {children}
        <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", textAlign: "center", marginTop: 18 }}>{footer}</div>
      </div>
    </div>
  );
}

export const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1.5px solid #ece8f4",
  borderRadius: 13,
  padding: "12px 14px",
  font: "600 14px var(--font-nunito)",
  background: "#fff",
  outline: "none",
};

export const labelStyle: React.CSSProperties = { font: "700 12px var(--font-nunito)", color: "#6c6780", display: "block", margin: "0 0 6px 2px" };

export const submitStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: 13,
  background: "#6d5bd0",
  color: "#fff",
  font: "800 14.5px var(--font-nunito)",
  padding: 13,
  cursor: "pointer",
  boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
  marginTop: 4,
};

export function ErrorNote({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <div style={{ background: "#fbeceb", border: "1px solid #f4d5d1", color: "#c0392b", font: "700 12.5px var(--font-nunito)", borderRadius: 12, padding: "10px 13px", marginBottom: 14 }}>
      {error}
    </div>
  );
}
