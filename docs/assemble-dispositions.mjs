#!/usr/bin/env node
// Assembles docs/dispositions/*.md into docs/PRD-DISPOSITIONS.md with a roll-up.
import { readFileSync, writeFileSync } from "node:fs";

const DIR = new URL("./dispositions/", import.meta.url).pathname;

// Roadmap order + counts (from the disposition sweep).
const ROWS = [
  ["AUTH", "Authentication, Onboarding & Identity", 24, 4, 11, 9],
  ["HOME", "Learner Home / Dashboard & Discovery", 22, 9, 12, 1],
  ["VERIFY", "Topic Creation & Verification Pipeline", 23, 12, 10, 1],
  ["LEARN", "Lecture & Active Listening", 23, 4, 18, 1],
  ["TASK", "Tasks & Rubric Assessment", 24, 9, 12, 3],
  ["TRUST", "Conflicts, Trust Ledger & Sources", 22, 11, 7, 4],
  ["REVIEW", "Review / FSRS, Confidence & Calibration", 24, 10, 13, 1],
  ["GAP", "Gap Map & Misconception Tracking", 23, 12, 9, 2],
  ["TEST", "Tests, Certificates & Verification", 23, 3, 17, 3],
  ["COMM", "Community, Contributions & Reputation", 24, 0, 14, 10],
  ["EVENT", "Events: Workshops, Groups & Challenges", 25, 0, 18, 7],
  ["NOTIF", "Notifications, Reminders & Messaging", 24, 4, 11, 9],
  ["ANALYTICS", "Progress, Reports & Analytics", 21, 6, 6, 9],
  ["SETTINGS", "Settings, Profile & Privacy", 23, 11, 9, 3],
  ["BILL", "Billing, Plans & Subscriptions", 23, 5, 6, 12],
  ["ORG", "Organization / Team Administration", 22, 0, 21, 1],
  ["ADMIN", "Platform Admin, Moderation & T&S", 23, 1, 12, 10],
  ["A11Y", "Accessibility, Mobile & Offline", 24, 0, 20, 4],
  ["API", "Integrations, API, Webhooks, SSO & LTI", 22, 1, 3, 18],
  ["SEC", "Security, Privacy Eng. & Compliance", 23, 2, 4, 17],
];

const sum = (i) => ROWS.reduce((a, r) => a + r[i], 0);
const T = { total: sum(2), done: sum(3), partial: sum(4), deferred: sum(5) };

const rollup = [
  "| Domain | Total | ✅ Done | 🟡 Partial | ⏭️ Deferred |",
  "|---|--:|--:|--:|--:|",
  ...ROWS.map((r) => `| ${r[0]} — ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]} |`),
  `| **TOTAL** | **${T.total}** | **${T.done}** | **${T.partial}** | **${T.deferred}** |`,
].join("\n");

const header = `# VeriLearn — User-Story Disposition (Roadmap Accounting)

Every one of the **462 PRD user stories** classified against the actual codebase. This is the
completion-criteria artifact: each story is **implemented, partially implemented, or deferred with
justification** — nothing is silently dropped.

## Legend
- ✅ **Done** — core behavior implemented and covered by a test, or wired to real data in the app.
- 🟡 **Partial** — meaningfully implemented but incomplete (engine done but UI not wired; faithful static
  screen without backend; happy-path only). The row says what's missing.
- ⏭️ **Deferred** — correct by design but needs external infrastructure, a vendor, or a business decision
  not available in this environment (real LLM verifier, KMS, Stripe, SSO/LTI, email, managed DB). Where a
  seam exists, an interface/adapter is already in place.
- 🚫 **Out-of-scope** — not appropriate for this build (none).

## Roll-up

${rollup}

**Interpretation.** The **thesis-critical spine is real and tested**: the trust ledger + epistemic firewall,
FSRS, calibration, rubric grading, gap auto-reopen, test eligibility/scoring, certificates, honest signals,
RBAC, and the verification pipeline are all implemented as pure, unit-tested logic (196 domain tests), and the
**create → verify → retain** loop is wired end-to-end on real data with auth, tenant scoping, and the Free-tier
cap. Most **Partial** items are faithful UI screens awaiting a service-wiring pass (the pattern is proven on the
core loop and repeats mechanically). **Deferred** items concentrate exactly where the PRD predicted the external
dependencies live — payments, enterprise identity (SSO/SCIM/LTI), the real LLM/sandbox, managed encryption, and
email — each behind a clean seam.

---
`;

const order = ROWS.map((r) => r[0]);
const body = order.map((idp) => readFileSync(DIR + idp + ".md", "utf8").trimEnd()).join("\n\n---\n\n");

writeFileSync(new URL("./PRD-DISPOSITIONS.md", import.meta.url).pathname, header + "\n" + body + "\n");
console.log(`Assembled ${order.length} domains → docs/PRD-DISPOSITIONS.md`);
console.log(`Totals: ${T.total} stories = ${T.done} done + ${T.partial} partial + ${T.deferred} deferred`);
