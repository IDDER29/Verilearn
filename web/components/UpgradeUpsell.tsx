"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentPlanAction } from "@/app/prefs-actions";

/**
 * Sidebar "Go Verified Pro" upsell — a client island so the shared server/client
 * AppShell tree doesn't have to thread the plan. It hides itself for learners
 * already on a paid plan (SETTINGS-01): renders nothing until the plan loads
 * (no flash for Pro/Teams), then shows only for Free.
 */
export default function UpgradeUpsell() {
  const [plan, setPlan] = useState<"free" | "pro" | "team" | null>(null);

  useEffect(() => {
    currentPlanAction().then(setPlan);
  }, []);

  if (plan !== "free") return null; // null (loading) or paid → nothing

  return (
    <div
      style={{
        background: "linear-gradient(160deg,#ffffff,#f3f0fb)",
        border: "1px solid #ece8f4",
        borderRadius: 20,
        padding: "18px 16px",
        textAlign: "center",
        marginTop: 16,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          margin: "0 auto 12px",
          background: "radial-gradient(circle at 40% 35%,#3a3550,#17141f)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c4b8f5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" />
          <circle cx="12" cy="9.5" r="1.6" />
          <path d="M9.5 17c-1 .5-1.8 1.6-2 3 1.4-.2 2.5-1 3-2M14.5 17c1 .5 1.8 1.6 2 3-1.4-.2-2.5-1-3-2" />
        </svg>
      </div>
      <div style={{ font: "800 15px var(--font-nunito)" }}>Go Verified Pro</div>
      <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699", margin: "5px 0 14px" }}>
        Deeper checks &amp; the Skeptic on hard mode.
      </div>
      <Link
        href="/upgrade"
        style={{
          display: "block",
          textAlign: "center",
          textDecoration: "none",
          width: "100%",
          padding: 11,
          borderRadius: 13,
          background: "#221f2e",
          color: "#fff",
          font: "800 13px var(--font-nunito)",
        }}
      >
        Upgrade
      </Link>
    </div>
  );
}
