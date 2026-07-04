import { publicVerify } from "@/lib/services/certificates";

export const metadata = { title: "Verify · VeriLearn" };

/**
 * Embeddable verify badge (API-15): a compact, iframe-able summary of the same
 * fail-closed `publicVerify` result the full `/verify/[code]` page and the
 * JSON API (API-03) use — a third party (a resume site, a profile page) can
 * embed this directly. Framing is denied app-wide by default (`next.config.ts`,
 * clickjacking hardening); this route is the one deliberate, narrow carve-out,
 * since a public verification badge exists specifically to be embedded
 * elsewhere. No learner PII is in the response (enforced at the data layer),
 * so there's nothing sensitive to leak by allowing the frame.
 */
export default async function VerifyBadgePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  let result;
  try {
    result = publicVerify(code);
  } catch {
    result = null;
  }

  const ok = result?.valid === true;
  const tone = ok ? { color: "#0e8c6b", bg: "#e7f4ee", border: "#cdeadd" } : { color: "#c0392b", bg: "#fbeceb", border: "#f3d4cf" };

  return (
    <a
      href={`/verify/${code}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "fit-content",
        maxWidth: 320,
        padding: "10px 14px",
        borderRadius: 12,
        border: `1.5px solid ${tone.border}`,
        background: tone.bg,
        textDecoration: "none",
        color: "#221f2e",
        font: "600 12px var(--font-nunito, sans-serif)",
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }} aria-hidden>
        {ok ? "✅" : "❌"}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 800, color: tone.color }}>{ok ? "Verified by VeriLearn" : "Not a valid certificate"}</span>
        <span style={{ display: "block", color: "#8b8699", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {ok ? `${result!.topicTitle} · ${result!.testScorePct}%` : code}
        </span>
      </span>
    </a>
  );
}
