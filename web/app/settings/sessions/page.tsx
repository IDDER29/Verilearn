import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import SessionsPanel from "@/components/settings/SessionsPanel";
import { getCurrentToken, requireUser } from "@/lib/auth/current";
import { sessionsFor } from "@/lib/auth/service";
import { getDb } from "@/lib/store/db";
import { now as nowMs } from "@/lib/ids";

export const metadata = { title: "Sessions & devices · Settings · VeriLearn" };

export default async function SettingsSessionsPage() {
  const user = await requireUser();
  const now = nowMs();
  const token = (await getCurrentToken()) ?? "";
  const sessions = sessionsFor(getDb(), user.id, token, now);

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
        <SettingsNav active="sessions" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="11" rx="2" />
                <path d="M9 20h6M12 15v5" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Sessions &amp; devices</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>
                Every device currently signed in to your account
              </div>
            </div>
          </div>

          <SessionsPanel initialSessions={sessions} now={now} />
        </div>
      </main>
    </AppShell>
  );
}
