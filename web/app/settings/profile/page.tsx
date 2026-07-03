import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";

export const metadata = { title: "Profile · Settings · VeriLearn" };

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  font: "600 14px var(--font-nunito)",
  padding: "11px 13px",
  border: "1.5px solid #ece8f4",
  borderRadius: 12,
  background: "#fbfafd",
};

const selectRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  font: "600 14px var(--font-nunito)",
  padding: "11px 13px",
  border: "1.5px solid #ece8f4",
  borderRadius: 12,
  background: "#fbfafd",
} as const;

const labelStyle = { font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 } as const;

const chevron = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function SettingsProfilePage() {
  return (
    <AppShell active="settings">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "210px minmax(0,1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <SettingsNav active="profile" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20a8 8 0 0116 0" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Profile</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>Your identity across VeriLearn</div>
            </div>
          </div>

          {/* avatar row */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#f6d8e8,#efe4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, border: "3px solid #f3eefc", flexShrink: 0 }}>
              🧑‍🎨
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 16px var(--font-nunito)" }}>Adeline Watson</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>Verified Learner · joined Mar 2026</div>
            </div>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#4a4560", font: "800 12.5px var(--font-nunito)", padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>
              Change photo
            </button>
          </div>

          {/* fields */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={labelStyle}>Full name</div>
                <input type="text" defaultValue="Adeline Watson" style={inputStyle} />
              </div>
              <div>
                <div style={labelStyle}>Display name</div>
                <input type="text" defaultValue="Adeline" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={labelStyle}>Email</div>
              <input type="text" defaultValue="adeline@example.com" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={labelStyle}>Language</div>
                <div style={selectRow}>English (US){chevron}</div>
              </div>
              <div>
                <div style={labelStyle}>Timezone</div>
                <div style={selectRow}>GMT+3 · Riyadh{chevron}</div>
              </div>
            </div>
          </div>

          {/* save bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, background: "#fff", borderRadius: 20, padding: "16px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: "pointer" }}>Cancel</button>
            <button style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 24px", borderRadius: 13, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)" }}>Save changes</button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
