import Link from "next/link";
import { publicVerify, type PublicVerifyResult } from "@/lib/services/certificates";

export const metadata = { title: "Verify a certificate · VeriLearn" };

const REASON_COPY: Record<string, string> = {
  unknown: "No certificate exists with this code. Check it was copied correctly.",
  revoked: "This certificate has been revoked and is no longer valid.",
};

/**
 * Public, unauthenticated certificate verification page (TEST-11). No
 * `requireUser()` gate — this is the human-readable surface a third party
 * (employer, LMS, badge viewer) lands on after following a verify code/link
 * printed on a certificate. Wraps the same fail-closed `publicVerify` used by
 * the JSON API (API-03): an unknown or revoked code never renders as valid,
 * and only the topic + pass evidence a third party legitimately needs is
 * shown — no learner name/email (PII-minimized by construction, at the data
 * layer, not just in this view).
 */
export default async function VerifyCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  // Fail-closed on an infra fault, mirroring the JSON API (API-03): never crash
  // to a generic error page and never render a partial/valid result — a genuine
  // lookup failure gets its own honest "try again" state, not a fabricated verdict.
  let result: PublicVerifyResult | null = null;
  try {
    result = publicVerify(code);
  } catch {
    result = null;
  }

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", padding: 26, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ width: 480, maxWidth: "100%", marginTop: 40, textAlign: "center" }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
            <div style={{ font: "900 19px var(--font-nunito)", marginBottom: 4 }}>Verification unavailable</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>
              We couldn&apos;t check this code right now — please try again shortly.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 26, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={{ width: 480, maxWidth: "100%", marginTop: 40 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", marginBottom: 24, justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#6d5bd0,#8b78e8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px -4px rgba(109,91,208,.6)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.7l.9-5.4-3.9-3.8 5.4-.8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9.3 12l1.9 1.9L15 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ font: "900 18px var(--font-nunito)", letterSpacing: "-.02em", color: "#221f2e" }}>VeriLearn</span>
        </Link>

        <div style={{ background: "#fff", borderRadius: 22, padding: "28px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
          {result.valid ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={{ font: "900 19px var(--font-nunito)", marginBottom: 4 }}>Valid certificate</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 20 }}>
                Verified by score against sourced claims.
              </div>
              <div style={{ background: "#f7f5fb", border: "1.5px solid #ece8f4", borderRadius: 16, padding: "16px 18px", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Topic</span>
                  <span style={{ font: "800 13px var(--font-nunito)" }}>{result.topicTitle}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #ece8f4" }}>
                  <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Score</span>
                  <span style={{ font: "800 13px var(--font-nunito)" }}>{result.testScorePct}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #ece8f4" }}>
                  <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Issued</span>
                  <span style={{ font: "800 13px var(--font-nunito)" }}>
                    {result.issuedAt ? new Date(result.issuedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: "1px solid #ece8f4" }}>
                  <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Code</span>
                  <span style={{ font: "800 13px var(--font-nunito)", letterSpacing: ".04em" }}>{result.verifyCode}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 10 }}>❌</div>
              <div style={{ font: "900 19px var(--font-nunito)", marginBottom: 4 }}>
                {result.reason === "revoked" ? "Certificate revoked" : "Not a valid certificate"}
              </div>
              <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
                {REASON_COPY[result.reason] ?? result.detail}
              </div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#a7a1b8", marginTop: 16, letterSpacing: ".04em" }}>{result.verifyCode}</div>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginTop: 18 }}>
          Learn something you can trust. <Link href="/signup" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>Sign up free</Link>
        </div>
      </div>
    </div>
  );
}
