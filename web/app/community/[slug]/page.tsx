import Link from "next/link";
import AppShell from "@/components/AppShell";
import ShareButton from "@/components/community/ShareButton";
import ThreadVote from "@/components/community/ThreadVote";

export const metadata = { title: "Thread · Community · VeriLearn" };

const REPLIES = [
  {
    emoji: "🧑‍🏫",
    bg: "linear-gradient(135deg,#d7f0e2,#e9f7ef)",
    name: "Marcus P.",
    when: "1h ago",
    body:
      'This is the crux — "unqualified" is exactly right. I\'d add: the original wording isn\'t harmful in a beginner context, but it fails the moment you meet a routing problem with rebates/penalties as negative edges.',
    likes: 42,
    border: true,
  },
  {
    emoji: "🧑",
    bg: "#fbeadf",
    name: "Dev K.",
    when: "44m ago",
    body:
      "Resolved mine the same way in the Conflicts tab — added the non-negative constraint and it flipped the claim back to verified. 👌",
    likes: 12,
    border: false,
  },
];

export default function CommunityThreadPage() {
  return (
    <AppShell active="community">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/community"
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
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Community · Dijkstra&apos;s algorithm</div>
              <h1 style={{ margin: 0, font: "900 22px/1.2 var(--font-nunito)", letterSpacing: "-.02em" }}>
                Is the &quot;works on any graph&quot; claim actually wrong, or just imprecise?
              </h1>
            </div>
          </div>

          {/* OP */}
          <article aria-label="Original post" style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#cfe4ff,#e4ecff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                🧑‍💻
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>
                  Priya N.{" "}
                  <span style={{ font: "800 9px var(--font-nunito)", color: "#6d5bd0", background: "#f1eefb", padding: "2px 7px", borderRadius: 7, marginLeft: 4 }}>
                    Verified Learner
                  </span>
                </div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>2 hours ago</div>
              </div>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "5px 11px", borderRadius: 9 }}>
                Disputed claim
              </span>
            </div>
            <div style={{ font: "600 14.5px/1.75 var(--font-nunito)", color: "#3a3550" }}>
              The lecture originally said Dijkstra &quot;works on any weighted graph,&quot; and the Skeptic flagged it. But is the claim <i>wrong</i>, or
              just missing the &quot;non-negative&quot; qualifier? I keep seeing both framings and want to get it right before my checkpoint.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, paddingTop: 14, borderTop: "1px solid #f0edf6", font: "800 12px var(--font-nunito)", color: "#8b8699" }}>
              <ThreadVote initialCount={128} label="Upvote this question" />
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>💬 34 replies</span>
              <div style={{ marginLeft: "auto" }}>
                <ShareButton />
              </div>
            </div>
          </article>

          {/* best answer */}
          <h2 style={{ margin: 0, font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#2e9c6a" }}>✓ Verified answer</h2>
          <article aria-label="Verified answer from the Skeptic" style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", border: "1.5px solid #cdeadd" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#221d2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
                🧐
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", color: "#6d5bd0" }}>
                  The Skeptic{" "}
                  <span style={{ font: "800 9px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "2px 7px", borderRadius: 7 }}>AI · sourced</span>
                </div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Endorsed by 2 instructors</div>
              </div>
            </div>
            <div style={{ font: "600 14px/1.75 var(--font-nunito)", color: "#3a3550" }}>
              Both framings point at the same fact: the correctness proof relies on the <b>cut property</b>, which only holds when edge weights are
              non-negative. So it&apos;s not &quot;wrong&quot; so much as <b>unqualified</b> — the precise claim is &quot;Dijkstra works on any graph with
              non-negative edge weights.&quot; With a negative edge, use Bellman-Ford.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid #d6ecdf", font: "700 12px var(--font-nunito)", color: "#3d8763" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
              </svg>
              Sourced from CLRS §24.3 · Lemma 24.15
            </div>
          </article>

          {/* replies */}
          <h2 style={{ margin: 0, font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8" }}>34 replies</h2>
          <ul style={{ listStyle: "none", margin: 0, background: "#fff", borderRadius: 22, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {REPLIES.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: 12, padding: "16px 0", ...(r.border ? { borderBottom: "1px solid #f5f3fa" } : {}) }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }} aria-hidden>
                  {r.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ font: "800 12.5px var(--font-nunito)" }}>{r.name}</span>
                    <span style={{ font: "700 10.5px var(--font-nunito)", color: "#a7a1b8" }}>{r.when}</span>
                  </div>
                  <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#3a3550" }}>{r.body}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8, font: "800 11px var(--font-nunito)", color: "#8b8699" }}>
                    <ThreadVote initialCount={r.likes} label={`Upvote ${r.name}'s reply`} />
                    <a href="#reply-box" style={{ color: "inherit", textDecoration: "none", font: "800 11px var(--font-nunito)" }}>
                      Reply
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: 20, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <label htmlFor="reply-box" style={{ display: "block", font: "900 15px var(--font-nunito)", marginBottom: 12 }}>
              Add your reply
            </label>
            <textarea
              id="reply-box"
              rows={4}
              placeholder="Share your take…"
              style={{
                width: "100%",
                border: "1.5px solid #ece8f4",
                borderRadius: 13,
                padding: "12px 14px",
                font: "600 13.5px/1.6 var(--font-nunito)",
                background: "#fbfafd",
                resize: "none",
                marginBottom: 12,
              }}
            />
            <button
              type="button"
              style={{
                width: "100%",
                border: "none",
                borderRadius: 13,
                background: "#6d5bd0",
                color: "#fff",
                font: "800 13.5px var(--font-nunito)",
                padding: 13,
                cursor: "pointer",
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Post reply
            </button>
          </div>

          <div style={{ background: "#fff", borderRadius: 22, padding: 20, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 12 }}>Linked claim</div>
            <Link
              href="/topics/conflicts"
              style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", color: "inherit", background: "#faf9fc", borderRadius: 14, padding: "13px 15px" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🧭</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>Dijkstra&apos;s algorithm</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#c0392b" }}>Open conflict · resolve →</div>
              </div>
            </Link>
          </div>

          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 20, color: "#fff" }}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🛡️ Verified answers</div>
            <div style={{ font: "600 12px/1.6 var(--font-nunito)", color: "#c9c3d8" }}>
              The Skeptic&apos;s answer is checked against sources — but keep debating; good pushback can promote a reply to a topic&apos;s sources.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
