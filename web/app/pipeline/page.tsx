"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { BackButton, ProgressRing } from "@/components/ui";
import { pipelineInfoAction } from "@/app/topic-actions";

type Stage = {
  title: string;
  activeTitle: string;
  doneSub: string;
  activeSub: string;
  icon: React.ReactNode;
};

const STAGES: Stage[] = [
  {
    title: "Triage the topic",
    activeTitle: "Triaging the topic",
    doneSub: "Scoped to beginner · 4 sections planned",
    activeSub: "Scoping depth and sections…",
    icon: <path d="M3 6h18M6 12h12M10 18h4" />,
  },
  {
    title: "Retrieve trusted sources",
    activeTitle: "Retrieving trusted sources",
    doneSub: "4 sources gathered · CLRS, Skiena, sandbox, web",
    activeSub: "Gathering sources…",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </>
    ),
  },
  {
    title: "Write the lecture",
    activeTitle: "Writing the lecture",
    doneSub: "4 sections drafted",
    activeSub: "Drafting §2 Implementation…",
    icon: <path d="M4 6h16M4 12h10M4 18h13" />,
  },
  {
    title: "Verify each claim",
    activeTitle: "Verifying each claim",
    doneSub: "6 claims matched to sources",
    activeSub: "Match every claim to a source",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </>
    ),
  },
  {
    title: "Skeptic red-teams it",
    activeTitle: "Skeptic red-teaming it",
    doneSub: "1 claim disputed · flagged, not hidden",
    activeSub: "Stress-test claims & flag disputes",
    icon: (
      <>
        <path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" />
        <circle cx="12" cy="9.5" r="1.5" />
      </>
    ),
  },
];

const STEP_MS = 1400;

// Page stages → real pipeline stage keys (decompose runs but isn't shown as its own row).
const STAGE_KEYS = ["triage", "retrieve", "teach", "verify", "skeptic"] as const;

function PipelineInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [title, setTitle] = useState(params.get("topic") || "Merkle trees");
  const [realDetail, setRealDetail] = useState<Record<string, string>>({});

  const [stage, setStage] = useState(0); // index of the running stage; === STAGES.length when done
  const [seconds, setSeconds] = useState(0);
  const done = stage >= STAGES.length;
  const topic = title;

  useEffect(() => {
    if (!id) return;
    pipelineInfoAction(id).then((info) => {
      if (!info.ok) return;
      if (info.title) setTitle(info.title);
      const map: Record<string, string> = {};
      for (const s of info.stages ?? []) map[s.stage] = s.detail;
      setRealDetail(map);
    });
  }, [id]);

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [stage, done]);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [done]);

  const pct = Math.min(100, Math.round((stage / STAGES.length) * 100));

  return (
    <AppShell active="topics">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <style>{"@keyframes vlp{0%,100%{opacity:1}50%{opacity:.4}}"}</style>

        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BackButton href="/" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>New topic · {done ? "ready" : "verifying"}</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{topic}</div>
          </div>
          {done ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12.5px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "9px 15px", borderRadius: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Verified · done in {seconds}s
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "9px 15px", borderRadius: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0", animation: "vlp 1.1s ease-in-out infinite" }} />
              Verifying · {seconds}s
            </div>
          )}
        </div>

        {/* hero verifying banner */}
        <div style={{ position: "relative", background: "#211d2e", borderRadius: 24, padding: "32px 36px", overflow: "hidden", display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 150% at 88% 15%,rgba(139,120,232,.42),transparent 55%)" }} />
          <div style={{ flexShrink: 0 }}>
            <ProgressRing size={78} stroke={9} r={32} pct={pct} trackColor="rgba(255,255,255,.14)" ringColor={done ? "#4fd0a0" : "#8b78e8"} animate>
              <div style={{ font: "900 17px var(--font-nunito)", color: "#fff" }}>{pct}%</div>
            </ProgressRing>
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".12em", textTransform: "uppercase", color: "#b3a7f0", marginBottom: 6 }}>
              {done ? "Your verified lecture is ready" : "Building your verified lecture"}
            </div>
            <div style={{ font: "900 22px/1.25 var(--font-nunito)", color: "#fff" }}>
              {done ? "Every claim checked against real sources ✓" : "Checking every claim against real sources ✨"}
            </div>
            <div style={{ font: "600 13px/1.55 var(--font-nunito)", color: "#c9c3d8", marginTop: 8 }}>
              {done
                ? "1 claim came back disputed — it's flagged in the lecture, never hidden."
                : "You can leave this page — it keeps running, and the lecture lands in your library when it's done."}
            </div>
          </div>
        </div>

        {/* stage stepper */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ font: "900 18px var(--font-nunito)" }}>Verification pipeline</div>
            <div style={{ font: "800 12.5px var(--font-nunito)", color: "#8b8699" }}>{Math.min(stage, STAGES.length)} / {STAGES.length} stages</div>
          </div>

          {STAGES.map((s, i) => {
            const isDone = i < stage;
            const isActive = i === stage && !done;
            // Prefer the real pipeline detail for this stage when available (VERIFY-04).
            const doneSub = realDetail[STAGE_KEYS[i]] ?? s.doneSub;
            return (
              <div key={s.title}>
                {i > 0 && <div style={{ height: 1, background: "#f5f3fa" }} />}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 15,
                    padding: isActive ? "13px 12px" : "13px 0",
                    ...(isActive ? { background: "#f7f5fd", borderRadius: 14, margin: "2px -12px" } : {}),
                    opacity: !isDone && !isActive ? 0.55 : 1,
                    transition: "opacity .3s, background .3s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 13,
                      background: isDone ? "#e7f4ee" : isActive ? "#6d5bd0" : "#f1eff5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      ...(isActive ? { animation: "vlp 1.2s ease-in-out infinite" } : {}),
                    }}
                  >
                    {isDone ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#fff" : "#a7a1b8"} strokeWidth={isActive ? 2 : 1.9} strokeLinecap="round" strokeLinejoin="round">
                        {s.icon}
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 14.5px var(--font-nunito)", ...(isActive ? { color: "#6d5bd0" } : {}) }}>
                      {isActive ? s.activeTitle : s.title}
                    </div>
                    <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>{isDone ? doneSub : isActive ? s.activeSub : s.activeSub}</div>
                  </div>
                  {isDone ? (
                    <span style={{ font: "800 11.5px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 12px", borderRadius: 10 }}>Done</span>
                  ) : isActive ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, font: "800 11.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "6px 12px", borderRadius: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6d5bd0", animation: "vlp 1s ease-in-out infinite" }} />
                      Running
                    </span>
                  ) : (
                    <span style={{ font: "800 11.5px var(--font-nunito)", color: "#a7a1b8", background: "#f3f1f9", padding: "6px 12px", borderRadius: 10 }}>Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        {done ? (
          <Link
            href="/topics"
            style={{ alignSelf: "flex-start", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, borderRadius: 14, background: "#0e8c6b", color: "#fff", font: "800 14px var(--font-nunito)", padding: "13px 24px", boxShadow: "0 12px 26px -10px rgba(14,140,107,.6)" }}
          >
            Open the lecture
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        ) : (
          <div
            style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, borderRadius: 14, background: "#cdd8d3", color: "#fff", font: "800 14px var(--font-nunito)", padding: "13px 24px" }}
          >
            Open the lecture when ready
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        )}
      </main>
    </AppShell>
  );
}

export default function PipelinePage() {
  return (
    <Suspense fallback={null}>
      <PipelineInner />
    </Suspense>
  );
}
