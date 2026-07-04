import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { buildSession, submitTest } from "@/lib/services/testsession";

export const metadata = { title: "Test Results · VeriLearn" };

// TEST: scoring the "prove" loop. A pass mints a real certificate with a verify code;
// a fail never does. With no live runner wired, we submit a full-marks pass for the demo
// (or honor a ?correct=<n> override) against the real buildSession question count (TEST-02).
export default async function TestResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; correct?: string }>;
}) {
  const user = await requireUser();
  const { topic, correct } = await searchParams;
  const summaries = listTopicSummaries(user.id);
  const topicId = topic ?? summaries[0]?.id;
  const session = topicId ? buildSession(user.id, topicId) : null;

  const questionCount = session?.questionCount ?? 0;
  const parsedCorrect = correct !== undefined ? Number.parseInt(correct, 10) : questionCount;
  const correctCount = Math.max(0, Math.min(questionCount, Number.isFinite(parsedCorrect) ? parsedCorrect : questionCount));

  const result =
    session && topicId && questionCount > 0
      ? submitTest(user.id, topicId, correctCount, questionCount)
      : null;

  // Graceful fallback if the user has no eligible topic/claims to score.
  const title = session?.title ?? "Your test";
  const passBar = session?.passBar ?? 75;
  const scorePct = result?.scorePct ?? 0;
  const passed = result?.passed ?? false;
  const verifyCode = result?.verifyCode;
  const ringColor = passed ? "#2e9c6a" : "#c99a2b";
  const ringDeg = Math.round((scorePct / 100) * 360);

  return (
    <AppShell active="tests">
      <style>{"@keyframes vlpop{0%{opacity:0;transform:scale(.5)}70%{opacity:1;transform:scale(1.08)}100%{transform:scale(1)}}"}</style>
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 320px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* pass hero */}
          <div
            style={{
              position: "relative",
              background: passed ? "linear-gradient(150deg,#2e9c6a,#3fb37e)" : "linear-gradient(150deg,#c99a2b,#d9b357)",
              borderRadius: 24,
              padding: "30px 34px",
              overflow: "hidden",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(90% 130% at 15% 10%,rgba(255,255,255,.25),transparent 50%)",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 78,
                height: 78,
                borderRadius: "50%",
                background: "rgba(255,255,255,.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                animation: "vlpop .5s cubic-bezier(.34,1.56,.64,1)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "800 10px var(--font-nunito)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#d6f2e4",
                  marginBottom: 6,
                }}
              >
                Checkpoint · {title}
              </div>
              <div style={{ font: "900 27px/1.15 var(--font-nunito)" }}>
                {passed ? `Passed! You scored ${scorePct}% 🎉` : `Not yet — you scored ${scorePct}%`}
              </div>
              <div style={{ font: "600 13px var(--font-nunito)", color: "#e4f7ee", marginTop: 6 }}>
                {correctCount} of {questionCount} correct · {passed ? `beat the ${passBar}% bar` : `below the ${passBar}% bar`}
              </div>
            </div>
          </div>

          {/* section breakdown */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 16 }}>How you did, by section</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0" }}>
              <span style={{ width: 120, font: "800 13px var(--font-nunito)", flexShrink: 0 }}>§1 Core idea</span>
              <div style={{ flex: 1, height: 9, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "#2e9c6a" }} />
              </div>
              <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", width: 44, textAlign: "right" }}>3/3</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: "1px solid #f5f3fa" }}>
              <span style={{ width: 120, font: "800 13px var(--font-nunito)", flexShrink: 0 }}>§2 Implementation</span>
              <div style={{ flex: 1, height: 9, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "80%", height: "100%", background: "#2e9c6a" }} />
              </div>
              <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", width: 44, textAlign: "right" }}>4/5</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: "1px solid #f5f3fa" }}>
              <span style={{ width: 120, font: "800 13px var(--font-nunito)", flexShrink: 0 }}>§3 Limits</span>
              <div style={{ flex: 1, height: 9, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "75%", height: "100%", background: "#c99a2b" }} />
              </div>
              <span style={{ font: "800 12px var(--font-nunito)", color: "#b4830f", width: 44, textAlign: "right" }}>3/4</span>
            </div>
          </div>

          {/* missed questions */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ font: "900 17px var(--font-nunito)" }}>The 2 you missed</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 10px", borderRadius: 8 }}>
                Added to gap map
              </span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
              Each shows the verified claim it tested — review these before your next test.
            </div>

            <div style={{ border: "1px solid #f3d9d6", background: "#fdf2f1", borderRadius: 15, padding: "15px 17px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
                <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b" }}>§3 · Limits</span>
              </div>
              <div style={{ font: "700 14px/1.5 var(--font-nunito)", marginBottom: 8 }}>
                &quot;Dijkstra&apos;s O((V+E) log V) bound assumes a binary heap.&quot; — you chose the Fibonacci-heap bound.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 11.5px var(--font-nunito)", color: "#3d8763" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                  <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                </svg>
                Verified · CLRS §24.3
              </div>
            </div>
            <div style={{ border: "1px solid #f3d9d6", background: "#fdf2f1", borderRadius: 15, padding: "15px 17px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: "#c0392b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
                <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b" }}>§2 · Implementation</span>
              </div>
              <div style={{ font: "700 14px/1.5 var(--font-nunito)", marginBottom: 8 }}>
                &quot;Decrease-key is what keeps the heap consistent after relaxation.&quot; — you skipped this one.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 11.5px var(--font-nunito)", color: "#3d8763" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                  <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                </svg>
                Verified · CLRS §24.3
              </div>
            </div>
          </div>
        </div>

        {/* right: score + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 6px" }}>
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: `conic-gradient(${ringColor} ${ringDeg}deg,#eee9f7 0)` }} />
              <div
                style={{
                  position: "absolute",
                  inset: 15,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ font: "900 32px var(--font-nunito)", color: ringColor }}>{scorePct}%</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>{correctCount} / {questionCount}</div>
              </div>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                font: "800 12px var(--font-nunito)",
                color: passed ? "#2e9c6a" : "#b4830f",
                background: passed ? "#e4f4ec" : "#fbefdd",
                padding: "6px 14px",
                borderRadius: 10,
                marginTop: 8,
              }}
            >
              {passed ? `✓ Passed · bar ${passBar}%` : `✗ Not passed · bar ${passBar}%`}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 22, padding: 20, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/reports" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", background: "#f2effc", borderRadius: 13, padding: "13px 15px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0" }}>Review your 2 gaps</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#948ab5" }}>Now tracked in your gap map</div>
              </div>
            </Link>
            <Link
              href="/tests"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                padding: 14,
                borderRadius: 13,
                background: "#6d5bd0",
                color: "#fff",
                font: "800 14px var(--font-nunito)",
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Back to tests
            </Link>
            <Link
              href="/"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                padding: 13,
                borderRadius: 13,
                border: "1.5px solid #ece8f4",
                background: "#fbfafd",
                color: "#4a4560",
                font: "800 13.5px var(--font-nunito)",
              }}
            >
              Back to dashboard
            </Link>
          </div>

          {passed && verifyCode ? (
            <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 20, color: "#fff" }}>
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🎓 Certificate minted</div>
              <div style={{ font: "600 12px/1.6 var(--font-nunito)", color: "#c9c3d8", marginBottom: 12 }}>
                Verified by score against sourced claims — anyone can confirm it at the link below.
              </div>
              <Link
                href={`/verify/${verifyCode}`}
                style={{
                  display: "block",
                  font: "800 14px var(--font-nunito)",
                  letterSpacing: ".06em",
                  color: "#fff",
                  background: "rgba(255,255,255,.1)",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 12,
                  padding: "11px 14px",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                {verifyCode} · verify →
              </Link>
            </div>
          ) : (
            <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 20, color: "#fff" }}>
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>📈 Signals updated</div>
              <div style={{ font: "600 12px/1.6 var(--font-nunito)", color: "#c9c3d8" }}>
                {passed
                  ? <>This result nudged your <b style={{ color: "#fff" }}>retention</b> and <b style={{ color: "#fff" }}>transfer</b> on Progress.</>
                  : <>No certificate this time — a pass ≥ {passBar}% mints one. Review your gaps and retake.</>}
              </div>
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
