/**
 * A fixed, ephemeral guest-demo pipeline run (VERIFY-22): executes the REAL
 * six-stage `runPipeline` engine (`lib/domain/pipeline.ts`) over a hardcoded
 * topic spec with a fresh, throwaway `TrustLedger` — genuine stage-by-stage
 * output (the same `DeterministicVerifier` a real signed-in `createTopic`
 * uses), just never persisted to `db` and not tied to any account.
 */
import { DeterministicVerifier, runPipeline, type PipelineRun } from "@/lib/domain/pipeline";
import { TrustLedger, type VerificationActor } from "@/lib/domain/trust";

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

export const DEMO_PIPELINE_TOPIC = { title: "Merkle trees", level: "Beginner", goal: "Use it in practice" };

/** Run the real pipeline over the fixed demo topic. Deterministic: same input, same output every time. */
export function demoPipelineRun(): PipelineRun {
  const topicId = "demo_pipeline";
  let n = 0;
  return runPipeline({
    topic: { id: topicId, ...DEMO_PIPELINE_TOPIC },
    verifier: new DeterministicVerifier(),
    ledger: new TrustLedger(),
    actor: SYSTEM,
    now: 1_000,
    ids: () => `${topicId}_ve${(n += 1)}`,
  });
}
