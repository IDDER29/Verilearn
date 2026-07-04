import Link from "next/link";
import AppShell from "@/components/AppShell";
import DiscussPanel from "@/components/review/DiscussPanel";
import { requireUser } from "@/lib/auth/current";
import { getDiscussContext } from "@/lib/services/review";
import { TRUST_LABEL } from "@/lib/domain/types";

export const metadata = { title: "Discuss · VeriLearn" };

/**
 * Real Discuss screen (REVIEW-08): the claim, its live trust state, and its
 * source now come from the actual card the learner tapped "Discuss this
 * answer" on (`?card=`) — never a hardcoded Dijkstra example. "Raise a
 * conflict" and "Track as a gap" (DiscussPanel) call the same real conflicts/
 * review engines as the Conflicts tab and the live review session. The
 * Skeptic's reply below stays a sample — live sourced pushback needs the
 * Deferred LLM Skeptic — but everything about which claim is being discussed
 * is real.
 */
export default async function DiscussPage({ searchParams }: { searchParams: Promise<{ card?: string }> }) {
  const user = await requireUser();
  const { card } = await searchParams;
  const ctx = card ? getDiscussContext(user.id, card) : null;

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
              href="/review"
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

          {!ctx ? (
            <div style={{ background: "#fff", borderRadius: 22, padding: "32px 28px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
              <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 6 }}>Nothing to discuss right now</div>
              <div style={{ font: "600 13px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
                Open a review card and tap &quot;Discuss this answer&quot; to challenge a specific claim.
              </div>
              <Link href="/review" style={{ textDecoration: "none", display: "inline-block", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 22px", borderRadius: 13 }}>
                Back to review
              </Link>
            </div>
          ) : (
            <>
              {/* the card in question — real claim, real state, real source */}
              <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
                <div style={{ font: "800 10px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 8 }}>
                  The claim you&apos;re questioning · {ctx.topicTitle}
                </div>
                <div style={{ font: "800 16px/1.45 var(--font-nunito)", marginBottom: 12 }}>&quot;{ctx.claimText}&quot;</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#3d8763", background: "#e7f4ee", padding: "6px 11px", borderRadius: 10 }}>
                  {TRUST_LABEL[ctx.trustState].glyph} {TRUST_LABEL[ctx.trustState].label}
                  {ctx.source && ` · ${ctx.source.title}`}
                </div>
              </div>

              {/* discussion thread — the claim above is real; the Skeptic's reply is a sample pending the live model */}
              <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ font: "900 16px var(--font-nunito)" }}>Discussion with the Skeptic</div>
                  <div style={{ font: "700 10.5px var(--font-nunito)", color: "#a7a1b8" }}>sample reply</div>
                </div>

                {/* learner */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f6d8e8,#efe4ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🧑‍🎨</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ font: "800 12.5px var(--font-nunito)" }}>You</span>
                      <span style={{ font: "700 10.5px var(--font-nunito)", color: "#a7a1b8" }}>just now</span>
                    </div>
                    <div style={{ background: "#f2effc", borderRadius: "4px 14px 14px 14px", padding: "12px 15px", font: "600 13.5px/1.6 var(--font-nunito)", color: "#3a3550" }}>
                      I&apos;m not convinced this holds unconditionally — can you show what it depends on?
                    </div>
                  </div>
                </div>

                {/* skeptic */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "#221d2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🧐</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span style={{ font: "800 12.5px var(--font-nunito)", color: "#6d5bd0" }}>The Skeptic</span>
                      <span style={{ font: "700 10px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "2px 7px", borderRadius: 7 }}>AI · sample</span>
                    </div>
                    <div style={{ background: "#faf9fc", border: "1px solid #f0edf6", borderRadius: "4px 14px 14px 14px", padding: "13px 15px", font: "600 13.5px/1.65 var(--font-nunito)", color: "#3a3550" }}>
                      Live, sourced pushback from the Skeptic needs the real verifier model. For now, use the actions on the
                      right — raising a conflict or tracking a gap both act on this exact claim for real.
                    </div>
                  </div>
                </div>

                {/* reply box — kept as a sample composer; live back-and-forth needs the LLM Skeptic */}
                <div style={{ border: "1.5px solid #ece8f4", borderRadius: 16, padding: 14, background: "#fbfafd" }}>
                  <textarea
                    rows={2}
                    disabled
                    placeholder="Live back-and-forth with the Skeptic is coming soon…"
                    style={{ width: "100%", boxSizing: "border-box", border: "none", background: "none", font: "600 13.5px/1.6 var(--font-nunito)", color: "#a7a1b8", resize: "none" }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* right: actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {ctx && <DiscussPanel ctx={ctx} />}

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
