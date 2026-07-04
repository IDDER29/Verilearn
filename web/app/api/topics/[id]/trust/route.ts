import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { trustReadModel } from "@/lib/services/sources";

/**
 * Read-only trust-state REST surface (API-04): the five-state per-claim trust
 * data (`Verified·execution/source`, `Sourced`, `Disputed`, `Unsupported`,
 * `Interpretive`) for one of the caller's OWN topics, with ledger versioning
 * via `?as_of=<epoch_ms>` (a genuine historical replay of the event-sourced
 * ledger, not an approximation) and an honest `pipeline_incomplete` status
 * while the topic's verification run hasn't finished.
 *
 * Auth: this is a JSON API route (`proxy.ts` JSON_API_PREFIXES), so a missing
 * session returns a `401` JSON body here rather than the app's usual HTML
 * redirect-to-login. There is no separate `trust:read` API-key/OAuth scope —
 * that needs the deferred credential infrastructure (API-01/02) — the
 * authenticated session + tenant-ownership check IS the scope for now.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { id } = await params;
  const asOfRaw = new URL(req.url).searchParams.get("as_of");
  let asOf: number | undefined;
  if (asOfRaw !== null) {
    asOf = Number(asOfRaw);
    if (!Number.isFinite(asOf)) {
      return NextResponse.json({ error: "`as_of` must be an epoch-millisecond timestamp." }, { status: 400 });
    }
  }

  const model = trustReadModel(user.id, id, { asOf });
  if (!model) {
    return NextResponse.json({ error: "Topic not found." }, { status: 404 });
  }
  return NextResponse.json(model);
}
