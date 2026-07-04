import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import ProfileForm from "@/components/settings/ProfileForm";
import { requireUser } from "@/lib/auth/current";

export const metadata = { title: "Profile · Settings · VeriLearn" };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROLE_LABEL: Record<string, string> = { learner: "Verified Learner", instructor: "Instructor", sme_reviewer: "Subject-Matter Expert" };

export default async function SettingsProfilePage() {
  const user = await requireUser();
  const joined = new Date(user.createdAt);
  const joinedLabel = `${MONTHS[joined.getUTCMonth()]} ${joined.getUTCFullYear()}`;
  const roleLabel = ROLE_LABEL[user.role] ?? "Learner";
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
              <div style={{ font: "900 16px var(--font-nunito)" }}>{user.displayName}</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>{roleLabel} · joined {joinedLabel}</div>
            </div>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#4a4560", font: "800 12.5px var(--font-nunito)", padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>
              Change photo
            </button>
          </div>

          {/* editable identity (display name persists) */}
          <ProfileForm initialName={user.displayName} email={user.email} />
        </div>
      </main>
    </AppShell>
  );
}
