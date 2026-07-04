"use client";

import { useState, useTransition } from "react";
import {
  signOutAllSessionsAction,
  signOutOtherSessionsAction,
  signOutSessionAction,
} from "@/app/session-actions";
import type { SessionView } from "@/lib/auth/service";

function relativeTime(ms: number, now: number): string {
  const diff = now - ms;
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export default function SessionsPanel({ initialSessions, now }: { initialSessions: SessionView[]; now: number }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [pending, startTransition] = useTransition();
  const [busyToken, setBusyToken] = useState<string | null>(null);

  function signOutOne(token: string) {
    setBusyToken(token);
    startTransition(async () => {
      const r = await signOutSessionAction(token);
      // A successful sign-out of the CURRENT session redirects server-side and never returns here.
      if (r.ok) setSessions((prev) => prev.filter((s) => s.token !== token));
      setBusyToken(null);
    });
  }

  function signOutOthers() {
    startTransition(async () => {
      await signOutOtherSessionsAction();
      setSessions((prev) => prev.filter((s) => s.current));
    });
  }

  const others = sessions.filter((s) => !s.current);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {sessions.map((s) => (
        <div
          key={s.token}
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "18px 22px",
            boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 13, background: s.current ? "#e8f7ee" : "#f3f1fa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.current ? "#2f9e5c" : "#6d5bd0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="11" rx="2" />
              <path d="M9 20h6M12 15v5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "800 14px var(--font-nunito)", display: "flex", alignItems: "center", gap: 8 }}>
              {s.device}
              {s.current && (
                <span style={{ font: "800 10px var(--font-nunito)", color: "#2f9e5c", background: "#e8f7ee", padding: "2px 8px", borderRadius: 999 }}>
                  This device
                </span>
              )}
            </div>
            <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
              Signed in {relativeTime(s.createdAt, now)}
            </div>
          </div>
          {!s.current && (
            <button
              type="button"
              disabled={pending && busyToken === s.token}
              onClick={() => signOutOne(s.token)}
              style={{ border: "1.5px solid #f0d5c9", background: "#fff", color: "#b4690e", font: "800 12.5px var(--font-nunito)", padding: "10px 16px", borderRadius: 12, cursor: "pointer", whiteSpace: "nowrap" }}
            >
              {pending && busyToken === s.token ? "Working…" : "Sign out"}
            </button>
          )}
        </div>
      ))}

      {others.length > 0 && (
        <button
          type="button"
          disabled={pending}
          onClick={signOutOthers}
          style={{ alignSelf: "flex-start", border: "1.5px solid #f3d9d6", background: "#fdf2f1", color: "#c0392b", font: "800 12.5px var(--font-nunito)", padding: "11px 18px", borderRadius: 12, cursor: "pointer" }}
        >
          Sign out {others.length} other {others.length === 1 ? "session" : "sessions"}
        </button>
      )}

      <form action={signOutAllSessionsAction} style={{ alignSelf: "flex-start" }}>
        <button
          type="submit"
          style={{ border: "1.5px solid #f3d9d6", background: "#fff", color: "#c0392b", font: "800 12.5px var(--font-nunito)", padding: "11px 18px", borderRadius: 12, cursor: "pointer" }}
        >
          Sign out everywhere, including this device
        </button>
      </form>
    </div>
  );
}
