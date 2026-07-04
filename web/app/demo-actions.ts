"use server";

import { resolveDemoConflict, type DemoSnapshot } from "@/lib/demo/scenario";
import { now } from "@/lib/ids";

/**
 * Resolve the guest-demo's disputed claim (TRUST-22). No auth, no persistence —
 * this runs the real trust-ledger engine on a fresh, throwaway instance each
 * call, so nothing here survives a reload and no guest state is ever stored.
 */
export async function resolveDemoConflictAction(): Promise<DemoSnapshot> {
  return resolveDemoConflict(now());
}
