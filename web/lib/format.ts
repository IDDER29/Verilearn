/**
 * Small presentation formatters shared between server actions and UI. Pure and
 * deterministic (no clock/locale surprises) so they can be unit-tested directly.
 */

/** Human label for an FSRS projected interval (in days), for a rating button (REVIEW-04). */
export function formatInterval(days: number): string {
  const minutes = days * 24 * 60;
  if (minutes < 60) return `< ${Math.max(1, Math.round(minutes))} min`;
  const hours = days * 24;
  if (hours < 24) return `${Math.round(hours)}h`;
  if (days < 30) return `${Math.round(days)} days`;
  if (days < 365) return `${Math.round(days / 30)} mo`;
  return `${Math.round(days / 365)} yr`;
}
