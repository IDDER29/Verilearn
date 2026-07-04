/**
 * COPPA/FERPA-aware age gate (SEC-11). Under-13 self-serve sign-up is blocked
 * pending verifiable parental consent; minors (13–17) get minor-safe defaults.
 * Only a coarse age band is retained downstream, never a precise DOB for minors.
 * Traces to: SEC-11, AUTH (onboarding), the R1 legal floor.
 */
import type { AgeBand } from "@/lib/store/entities";

export interface AgeGateResult {
  allowed: boolean;
  band: AgeBand;
  requiresParentalConsent: boolean;
  reason?: string;
  /** minor-safe defaults to apply to the account when band === "minor" */
  minorSafeDefaults: boolean;
}

const MS_PER_YEAR = 365.25 * 86_400_000;

/** Evaluate the gate from a birth year (kept coarse on purpose). */
export function ageGate(birthYear: number | undefined, now: number): AgeGateResult {
  if (!birthYear || !Number.isFinite(birthYear)) {
    return { allowed: false, band: "unknown", requiresParentalConsent: false, minorSafeDefaults: true, reason: "Date of birth is required." };
  }
  const currentYear = new Date(now).getUTCFullYear();
  const age = currentYear - birthYear;
  if (age < 0 || age > 120) {
    return { allowed: false, band: "unknown", requiresParentalConsent: false, minorSafeDefaults: true, reason: "Invalid date of birth." };
  }
  if (age < 13) {
    // COPPA: cannot collect personal data from an under-13 without verifiable parental consent.
    return { allowed: false, band: "minor", requiresParentalConsent: true, minorSafeDefaults: true, reason: "Parental consent required for under-13." };
  }
  if (age < 18) {
    return { allowed: true, band: "minor", requiresParentalConsent: false, minorSafeDefaults: true };
  }
  return { allowed: true, band: "adult", requiresParentalConsent: false, minorSafeDefaults: false };
}

export { MS_PER_YEAR };
