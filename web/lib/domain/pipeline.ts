/**
 * The six-stage Verification Pipeline (Triage → Retrieve → Teach → Decompose →
 * Verify → Skeptic) over a {@link Verifier} port. This is the machinery that turns
 * a topic spec into a drafted trust ledger where every claim already carries a
 * source-traceable trust state before the learner reads a word.
 *
 * Traces to: PRD domain 22 (Topic Creation & the Verification Pipeline).
 *  - VERIFY-07 Triage: scope/level/feasibility; refuses unteachable/nonsense specs.
 *  - VERIFY-08 Retrieve: gathers a typed source pool later stages match against.
 *  - VERIFY-09 Teach: drafts sections pitched to the triaged level.
 *  - VERIFY-10 Decompose: breaks the lecture into atomic, individually-checkable claims.
 *  - VERIFY-11 Verify: matches each claim to a source → draft source-based state.
 *  - VERIFY-13 Skeptic: red-teams each claim → proposes Disputed / Interpretive.
 *  - VERIFY-16 source-hallucination guard: a citation to an unresolvable/fabricated
 *    source can NEVER be promoted to Verified·source — it fails closed to Unsupported.
 *  - VERIFY-19 prompt-injection defense: {@link sanitizeTopicInput} neutralizes
 *    embedded instructions so user text cannot direct the pipeline to auto-certify.
 *  - Authority boundaries: the pipeline may assign only draft source-based states;
 *    it cannot mint Verified·execution (sandbox only) — {@link pipelineAuthorityClamp}.
 *  - I1 epistemic firewall: every verdict is written through {@link TrustLedger.record},
 *    so a non-verifier actor (e.g. a learner) is rejected by the same firewall.
 *
 * Pure & deterministic: no Date.now / Math.random / new Date. Timestamps (`now`),
 * event ids (`ids`), and all model behavior arrive as parameters. The
 * {@link DeterministicVerifier} adapter is rule-based (verdicts derived from claim
 * text markers) so the pipeline runs locally with no LLM or network. The production
 * LLM-backed adapter is **Deferred** (needs API keys, a cost governor, and per-topic
 * model-version tagging per VERIFY-20) and is intentionally not implemented here.
 */

import type { Claim, Evidence, Source, TrustState, VerificationEvent } from "./types";
import { isVerified } from "./types";
import {
  DualControlError,
  EpistemicFirewallError,
  type TrustLedger,
  type VerificationActor,
} from "./trust";

// ----------------------------------------------------------------------------
// Pipeline vocabulary
// ----------------------------------------------------------------------------

/** The fixed, sequential six stages (VERIFY-04 / invariant: order never varies). */
export const PIPELINE_STAGES = [
  "triage",
  "retrieve",
  "teach",
  "decompose",
  "verify",
  "skeptic",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** The three-field topic spec of record (VERIFY-01). `title` is the field-1 topic. */
export interface TopicSpec {
  id: string;
  title: string;
  level: string;
  goal: string;
}

export interface TriageResult {
  /** false ⇒ too broad / unteachable / failed validation ⇒ "let's narrow this". */
  ok: boolean;
  levelAnchor: string;
  sectionCount: number;
  detail: string;
}

export interface LectureSection {
  id: string;
  title: string;
}

/** A verdict is a proposed trust state plus the evidence that grounds it. */
export interface Verdict {
  state: TrustState;
  evidence: Evidence;
}

/** Result of scrubbing user-supplied topic text for prompt-injection (VERIFY-19). */
export interface SanitizeResult {
  clean: string;
  flagged: boolean;
  markers: string[];
}

export interface StageResult {
  stage: PipelineStage;
  status: "done" | "failed";
  detail: string;
}

export interface PipelineRun {
  topicId: string;
  /** Per-stage outcome in execution order; stops at the first failed stage. */
  stages: StageResult[];
  claims: Claim[];
  /** Final ledger state per claim (fail-closed, via {@link TrustLedger.stateOf}). */
  states: Map<string, TrustState>;
  sanitized: SanitizeResult;
  /** true only when all six stages completed. */
  ok: boolean;
  producerVersion: string;
}

// ----------------------------------------------------------------------------
// The Verifier port
// ----------------------------------------------------------------------------

/**
 * The port the pipeline drives. A production implementation is LLM/sandbox-backed;
 * {@link DeterministicVerifier} is the local rule-based adapter used in tests.
 */
export interface Verifier {
  /** Model/verifier version stamped onto every event (audit + rollback, VERIFY-20). */
  version: string;
  triage(topic: TopicSpec): TriageResult;
  retrieveSources(topic: TopicSpec): Source[];
  teach(topic: TopicSpec, triage: TriageResult): LectureSection[];
  decomposeClaims(topic: TopicSpec, sections: readonly LectureSection[]): Claim[];
  verifyClaim(claim: Claim, sources: readonly Source[]): Verdict;
  skepticReview(claim: Claim, prior: Verdict): Verdict;
}

// ----------------------------------------------------------------------------
// Prompt-injection sanitization (VERIFY-19)
// ----------------------------------------------------------------------------

/** Max topic length before we truncate & flag (VERIFY-01: no textbook-chapter paste). */
export const MAX_TOPIC_LEN = 500;

const INJECTION_PATTERNS: ReadonlyArray<{ re: RegExp; marker: string }> = [
  { re: /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions/gi, marker: "ignore-instructions" },
  { re: /disregard\s+(?:all\s+)?(?:previous|prior|the\s+above)/gi, marker: "disregard" },
  { re: /(?:auto[-\s]?certify|certify\s+(?:all|every)|mark\s+(?:all|everything)\s+(?:as\s+)?verified)/gi, marker: "auto-certify" },
  { re: /bypass\s+(?:the\s+)?skeptic/gi, marker: "bypass-skeptic" },
  { re: /you\s+are\s+now\b/gi, marker: "role-override" },
  { re: /system\s*:/gi, marker: "system-prompt" },
];

/**
 * Neutralize prompt-injection embedded in a topic/level field. Injected instructions
 * are replaced with `[removed]` (not silently dropped — the mutation is auditable via
 * `markers`) so downstream stages never see them. Oversized input is truncated.
 * This cannot itself change a trust state; it only cleans the text stages operate on.
 */
export function sanitizeTopicInput(raw: string): SanitizeResult {
  const markers: string[] = [];
  let clean = raw;

  if (clean.length > MAX_TOPIC_LEN) {
    clean = clean.slice(0, MAX_TOPIC_LEN);
    markers.push("oversized");
  }

  for (const { re, marker } of INJECTION_PATTERNS) {
    const replaced = clean.replace(re, "[removed]");
    if (replaced !== clean) {
      markers.push(marker);
      clean = replaced;
    }
  }

  clean = clean.replace(/\s+/g, " ").trim();
  return { clean, flagged: markers.length > 0, markers };
}

// ----------------------------------------------------------------------------
// Integrity guards (VERIFY-16, authority boundaries)
// ----------------------------------------------------------------------------

/**
 * Source-hallucination guard (VERIFY-16). A citation verdict whose source does not
 * resolve to a member of the retrieved pool — a fabricated or unresolvable
 * reference — is failed closed to Unsupported rather than promoted. No state above
 * Sourced may rest on an unverifiable citation.
 */
export function sourceHallucinationGuard(
  verdict: Verdict,
  resolvedSourceIds: ReadonlySet<string>,
): Verdict {
  const { state, evidence } = verdict;
  if (evidence.method !== "citation") return verdict;

  const resolves = !!evidence.sourceId && resolvedSourceIds.has(evidence.sourceId);
  if (!resolves) {
    return {
      state: "unsupported",
      evidence: {
        method: "none",
        detail: `source-hallucination guard: citation "${evidence.sourceId ?? "∅"}" did not resolve to a retrieved source`,
        confidence: evidence.confidence,
        resolved: false,
      },
    };
  }
  // Resolves, but a Verified·source claim still requires resolved evidence.
  if (isVerified(state) && !evidence.resolved) {
    return { state: "unsupported", evidence: { ...evidence, resolved: false } };
  }
  return verdict;
}

/**
 * Authority clamp. The pipeline may assign only draft source-based states; it can
 * NEVER mint Verified·execution — that is the Execution Sandbox's exclusive right.
 * A stray execution verdict from the port is failed closed to Unsupported.
 */
export function pipelineAuthorityClamp(verdict: Verdict): Verdict {
  if (verdict.state === "verified_execution") {
    return {
      state: "unsupported",
      evidence: {
        method: "none",
        detail: "authority boundary: the pipeline cannot assign Verified·execution (sandbox only)",
        confidence: verdict.evidence.confidence,
        resolved: false,
      },
    };
  }
  return verdict;
}

// ----------------------------------------------------------------------------
// runPipeline
// ----------------------------------------------------------------------------

export interface RunPipelineArgs {
  topic: TopicSpec;
  verifier: Verifier;
  ledger: TrustLedger;
  /** Actor stamped on and authorized for every verification event (I1 firewall). */
  actor: VerificationActor;
  /** Caller-supplied timestamp for all events (keeps the run deterministic). */
  now: number;
  /** Caller-supplied unique-id generator for verification events. */
  ids: () => string;
}

/**
 * Execute the six stages sequentially. Records every verdict through the ledger so
 * the epistemic firewall, dual-control, and fail-closed rendering all apply. Stops
 * at the first failed stage ("we'd rather stop than guess"). Authorization failures
 * (a non-verifier actor) are NOT swallowed — they surface as the ledger's
 * {@link EpistemicFirewallError} / {@link DualControlError}.
 */
export function runPipeline(args: RunPipelineArgs): PipelineRun {
  const { topic, verifier, ledger, actor, now, ids } = args;
  const stages: StageResult[] = [];
  const sanitized = sanitizeTopicInput(topic.title);
  const cleanTopic: TopicSpec = { ...topic, title: sanitized.clean };

  let claims: Claim[] = [];

  const finish = (): PipelineRun => ({
    topicId: topic.id,
    stages,
    claims,
    states: ledger.snapshot(claims),
    sanitized,
    ok: stages.length === PIPELINE_STAGES.length && stages.every((s) => s.status === "done"),
    producerVersion: verifier.version,
  });

  // Wrap a stage: authorization errors propagate; anything else fails the stage cleanly.
  const stage = (name: PipelineStage, work: () => string): boolean => {
    try {
      const detail = work();
      stages.push({ stage: name, status: "done", detail });
      return true;
    } catch (err) {
      if (err instanceof EpistemicFirewallError || err instanceof DualControlError) throw err;
      stages.push({ stage: name, status: "failed", detail: err instanceof Error ? err.message : String(err) });
      return false;
    }
  };

  const record = (claim: Claim, verdict: Verdict): void => {
    const event: VerificationEvent = {
      id: ids(),
      claimId: claim.id,
      state: verdict.state,
      evidence: verdict.evidence,
      producedBy: actor.id,
      producerVersion: verifier.version,
      at: now,
    };
    ledger.record(actor, event);
  };

  // --- Stage 1: Triage (VERIFY-07) ---
  let triage: TriageResult | undefined;
  if (!stage("triage", () => {
    triage = verifier.triage(cleanTopic);
    if (!triage.ok) throw new Error(`triage refused: ${triage.detail}`);
    return triage.detail;
  })) {
    return finish();
  }

  // --- Stage 2: Retrieve (VERIFY-08) ---
  let sources: Source[] = [];
  let resolvedIds = new Set<string>();
  if (!stage("retrieve", () => {
    sources = verifier.retrieveSources(cleanTopic);
    resolvedIds = new Set(sources.map((s) => s.id));
    return `${sources.length} sources gathered`;
  })) {
    return finish();
  }

  // --- Stage 3: Teach (VERIFY-09) ---
  let sections: LectureSection[] = [];
  if (!stage("teach", () => {
    sections = verifier.teach(cleanTopic, triage!);
    return `${sections.length} sections drafted`;
  })) {
    return finish();
  }

  // --- Stage 4: Decompose (VERIFY-10) ---
  if (!stage("decompose", () => {
    claims = verifier.decomposeClaims(cleanTopic, sections);
    return `${claims.length} atomic claims`;
  })) {
    return finish();
  }

  // --- Stage 5: Verify (VERIFY-11) — draft source-based states, guards applied ---
  if (!stage("verify", () => {
    let matched = 0;
    for (const claim of claims) {
      let verdict = verifier.verifyClaim(claim, sources);
      verdict = pipelineAuthorityClamp(sourceHallucinationGuard(verdict, resolvedIds));
      record(claim, verdict);
      if (verdict.state === "verified_source" || verdict.state === "sourced") matched += 1;
    }
    return `${matched}/${claims.length} claims matched to sources`;
  })) {
    return finish();
  }

  // --- Stage 6: Skeptic (VERIFY-13) — proposes Disputed / Interpretive ---
  if (!stage("skeptic", () => {
    let disputed = 0;
    for (const claim of claims) {
      const latest = ledger.latest(claim.id);
      const prior: Verdict = latest
        ? { state: latest.state, evidence: latest.evidence }
        : { state: "unsupported", evidence: { method: "none", detail: "", confidence: 0, resolved: false } };
      let verdict = verifier.skepticReview(claim, prior);
      verdict = pipelineAuthorityClamp(sourceHallucinationGuard(verdict, resolvedIds));
      // Only write when the Skeptic actually changes the verdict.
      if (verdict.state !== prior.state) record(claim, verdict);
      if (verdict.state === "disputed") disputed += 1;
    }
    return `${disputed} claims disputed · flagged, not hidden`;
  })) {
    return finish();
  }

  return finish();
}

// ----------------------------------------------------------------------------
// DeterministicVerifier — the local, rule-based adapter (no LLM / no network)
// ----------------------------------------------------------------------------

export interface DeterministicVerifierOptions {
  version?: string;
  /**
   * Simulate a hallucinating model: emit citations to a source that is NOT in the
   * retrieved pool, so the source-hallucination guard has something to catch.
   */
  fabricateCitations?: boolean;
  /** Simulate a stalled Skeptic stage (VERIFY-13: fail cleanly rather than guess). */
  skepticStalls?: boolean;
}

/**
 * A pure, deterministic {@link Verifier}. Verdicts are derived from case-insensitive
 * markers in claim text (which flows from the sanitized topic title), so a given
 * input always yields the same ledger — reproducible in tests, no API keys, no cost.
 *
 * Markers (claim text):
 *  - "certify" / "mark all verified" → naive instruction-following: Verified·source
 *    citing a REAL source. This is what a prompt-injection would exploit if the topic
 *    were not sanitized first — it is the reason {@link sanitizeTopicInput} is load-bearing.
 *  - "@ghost"        → Verified·source citing a fabricated source (guard → Unsupported).
 *  - "@unsupported"  → Unsupported (no source found — honest).
 *  - "@verify"       → Verified·source citing a real source.
 *  - otherwise       → Sourced (cited, not independently proven).
 *
 * The production LLM/sandbox-backed adapter is Deferred (see module doc).
 */
export class DeterministicVerifier implements Verifier {
  readonly version: string;
  private readonly fabricate: boolean;
  private readonly skepticStalls: boolean;

  constructor(opts: DeterministicVerifierOptions = {}) {
    this.version = opts.version ?? "deterministic-v1";
    this.fabricate = opts.fabricateCitations ?? false;
    this.skepticStalls = opts.skepticStalls ?? false;
  }

  triage(topic: TopicSpec): TriageResult {
    const title = topic.title.trim();
    const level = topic.level.trim();
    const NONSENSE = /^(everything|anything|all of (it|everything)|teach me everything)$/i;
    if (title.length < 3 || level.length < 3 || NONSENSE.test(title)) {
      return { ok: false, levelAnchor: level, sectionCount: 0, detail: "let's narrow this — the spec is too broad or thin to teach" };
    }
    // Deterministic section count from title length, clamped to a sane band.
    const sectionCount = Math.min(6, Math.max(2, Math.ceil(title.length / 12)));
    return { ok: true, levelAnchor: level, sectionCount, detail: `Scoped to ${level} · ${sectionCount} sections planned` };
  }

  retrieveSources(topic: TopicSpec): Source[] {
    return [
      { id: "src-1", kind: "book", title: "Primary reference", ref: `${topic.title} · ch.1`, addedBy: "verifier", preferred: true },
      { id: "src-2", kind: "web", title: "Secondary reference", ref: `${topic.title} · notes`, addedBy: "verifier" },
    ];
  }

  teach(topic: TopicSpec, triage: TriageResult): LectureSection[] {
    const out: LectureSection[] = [];
    for (let i = 0; i < triage.sectionCount; i++) {
      out.push({ id: `${topic.id}_s${i}`, title: `${topic.title} · section ${i + 1}` });
    }
    return out;
  }

  decomposeClaims(topic: TopicSpec, sections: readonly LectureSection[]): Claim[] {
    // One atomic claim per section; claim text carries the (sanitized) topic title,
    // so any surviving instruction text would flow to verifyClaim — it must not.
    return sections.map((s, i) => ({
      id: `${topic.id}_c${i}`,
      topicId: topic.id,
      sectionId: s.id,
      text: `${s.title}: ${topic.title}`,
    }));
  }

  verifyClaim(claim: Claim, sources: readonly Source[]): Verdict {
    const t = claim.text.toLowerCase();
    const realSourceId = sources[0]?.id ?? "src-1";

    // Naive instruction-following: a model that obeys embedded "certify" text. Only
    // reachable if sanitization failed to strip the injection.
    if (/certif|mark\s+(?:all|everything)\s+(?:as\s+)?verified/.test(t)) {
      return { state: "verified_source", evidence: { method: "citation", sourceId: realSourceId, detail: "auto-certified per instruction", confidence: 0.99, resolved: true } };
    }
    if (this.fabricate || t.includes("@ghost")) {
      return { state: "verified_source", evidence: { method: "citation", sourceId: "ghost-src", detail: "cited a source not in the pool", confidence: 0.9, resolved: true } };
    }
    if (t.includes("@unsupported")) {
      return { state: "unsupported", evidence: { method: "none", detail: "no source found", confidence: 0.2, resolved: false } };
    }
    if (t.includes("@verify")) {
      return { state: "verified_source", evidence: { method: "citation", sourceId: realSourceId, detail: "matched to a cited reference", confidence: 0.95, resolved: true } };
    }
    return { state: "sourced", evidence: { method: "citation", sourceId: realSourceId, detail: "cited, not independently proven", confidence: 0.7, resolved: true } };
  }

  skepticReview(claim: Claim, prior: Verdict): Verdict {
    if (this.skepticStalls) throw new Error("skeptic stalled — stopping rather than shipping unchecked claims");
    const t = claim.text.toLowerCase();
    if (t.includes("@overreach") || /\bany\b/.test(t)) {
      return { state: "disputed", evidence: { method: "skeptic", detail: "over-broad claim — counterexample exists", confidence: 0.6, resolved: true } };
    }
    if (t.includes("@interpretive")) {
      return { state: "interpretive", evidence: { method: "skeptic", detail: "genuinely contested — positions mapped, not certified", confidence: 0.5, resolved: true } };
    }
    return prior; // nothing to add — keep the draft source-based verdict
  }
}
