import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";

export const metadata = { title: "Privacy · Settings · VeriLearn" };

export default function SettingsPrivacyPage() {
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
        <SettingsNav active="privacy" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 018 0v3" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Privacy</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>What we store and what you control</div>
            </div>
          </div>

          {/* what's stored */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>What VeriLearn stores</div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Your topics, lectures &amp; the claim ledger
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Review history &amp; FSRS schedule
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Gap map &amp; discussion threads
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)", color: "#8b8699" }}>
              <span style={{ flexShrink: 0 }}>✕</span>We never sell your data or train public models on it
            </div>
          </div>

          {/* toggles */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Anonymous usage analytics</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Help improve VeriLearn with de-identified data</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#6d5bd0", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Show my profile in Community</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Others can see your name on threads</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#6d5bd0", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3 }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Product emails</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Occasional tips &amp; feature news</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#dcd7ea", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, left: 3 }} />
              </div>
            </div>
          </div>

          {/* export */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px var(--font-nunito)" }}>Export your data</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Download everything as JSON — topics, reviews, gaps</div>
            </div>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#4a4560", font: "800 12.5px var(--font-nunito)", padding: "10px 18px", borderRadius: 12, cursor: "pointer" }}>Request export</button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
