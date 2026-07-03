import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Discuss · VeriLearn" };

export default function DiscussPage() {
  return (
    <AppShell>
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/review/reveal"
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Link>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Review · discuss</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Challenge this answer 💬</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "9px 14px", borderRadius: 12, whiteSpace: "nowrap" }}>
              ⚠️ You disagree
            </div>
          </div>

          {/* the card in question */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 10px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 8 }}>
              The claim you&apos;re questioning
            </div>
            <div style={{ font: "800 16px/1.45 var(--font-nunito)", marginBottom: 12 }}>
              &quot;Dijkstra finalises a node&apos;s distance the moment it&apos;s picked because every edge weight is non-negative.&quot;
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#3d8763", background: "#e7f4ee", padding: "6px 11px", borderRadius: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
              </svg>
              Verified · CLRS §24.3
            </div>
          </div>

          {/* discussion thread */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16 }}>Discussion with the Skeptic</div>

            {/* learner */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f6d8e8,#efe4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🧑‍🎨</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ font: "800 12.5px var(--font-nunito)" }}>You</span>
                  <span style={{ font: "700 10.5px var(--font-nunito)", color: "#a7a1b8" }}>just now</span>
                </div>
                <div style={{ background: "#f2effc", borderRadius: "4px 14px 14px 14px", padding: "12px 15px", font: "600 13.5px/1.6 var(--font-nunito)", color: "#3a3550" }}>
                  Isn&apos;t this only true for a <b>connected</b> graph? If a node is unreachable, its distance stays infinite — so &quot;the moment it&apos;s picked&quot; never happens for it.
                </div>
              </div>
            </div>

            {/* skeptic */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#221d2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🧐</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <span style={{ font: "800 12.5px var(--font-nunito)", color: "#6d5bd0" }}>The Skeptic</span>
                  <span style={{ font: "700 10px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "2px 7px", borderRadius: 7 }}>AI · verified</span>
                </div>
                <div style={{ background: "#faf9fc", border: "1px solid #f0edf6", borderRadius: "4px 14px 14px 14px", padding: "13px 15px", font: "600 13.5px/1.65 var(--font-nunito)", color: "#3a3550" }}>
                  Good catch — you&apos;re partly right. The <b>finalisation guarantee</b> holds for every node that&apos;s reachable; unreachable nodes are simply never dequeued and keep distance ∞. So the claim is accurate for the nodes it applies to, but it <i>could</i> be clearer that it&apos;s scoped to reachable nodes.
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #ece8f4", font: "700 12px var(--font-nunito)", color: "#3d8763" }}>📘 Supported by CLRS §24.3, Lemma 24.15</div>
                </div>
              </div>
            </div>

            {/* outcome chips */}
            <div style={{ background: "#eef7f1", border: "1px solid #cdeadd", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", marginBottom: 6 }}>✓ Where this leaves the claim</div>
              <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#3a3550" }}>
                The claim stays <b>verified</b>, but the Skeptic proposes a small clarification: scope it to &quot;reachable&quot; nodes. You decide what happens next.
              </div>
            </div>

            {/* reply box */}
            <div style={{ border: "1.5px solid #ece8f4", borderRadius: 16, padding: 14, background: "#fbfafd" }}>
              <textarea
                rows={2}
                placeholder="Add to the discussion, or push back further…"
                style={{ width: "100%", boxSizing: "border-box", border: "none", background: "none", font: "600 13.5px/1.6 var(--font-nunito)", color: "#221f2e", resize: "none" }}
              />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8" }}>The Skeptic replies with sources</span>
                <button style={{ border: "none", borderRadius: 11, background: "#6d5bd0", color: "#fff", font: "800 12.5px var(--font-nunito)", padding: "9px 18px", cursor: "pointer" }}>Send</button>
              </div>
            </div>
          </div>
        </div>

        {/* right: actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 6 }}>What do you want to do?</div>
            <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>Your decision updates the card &amp; its trust.</div>
            <Link href="/topics/conflicts" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", background: "#fbeceb", border: "1px solid #f3d9d6", borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 21V4M5 4h11l-2 3.5L16 11H5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#c0392b" }}>Raise a conflict</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#a96b64" }}>Escalate for the topic to resolve</div>
              </div>
            </Link>
            <Link href="/reports" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", background: "#f2effc", border: "1px solid #e3ddf6", borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0" }}>Track as a gap</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#948ab5" }}>Revisit until it&apos;s solid</div>
              </div>
            </Link>
            <Link href="/review/reveal" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", background: "#eef7f1", border: "1px solid #cdeadd", borderRadius: 14, padding: "13px 15px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#2e9c6a" }}>Accept &amp; continue</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#6ba888" }}>Back to your review</div>
              </div>
            </Link>
          </div>

          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 22, color: "#fff" }}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🛡️ Disagreement is welcome</div>
            <div style={{ font: "600 12px/1.6 var(--font-nunito)", color: "#c9c3d8" }}>
              Challenging a claim never breaks your streak. Good pushback that finds a real gap earns a calibration boost.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
