/** Runtime id/time helpers. Kept out of the pure domain modules (which take these
 * as parameters) so the domain stays deterministic and testable. */
import { randomUUID } from "node:crypto";

export const newId = (prefix: string) => `${prefix}_${randomUUID().slice(0, 12)}`;
export const now = () => Date.now();
