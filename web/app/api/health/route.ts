import { NextResponse } from "next/server";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";

/**
 * Liveness + readiness probe for uptime monitoring and orchestrators
 * (load balancers, k8s). No auth — returns a small JSON status and never
 * leaks internals. `200 ok` means the process is up AND its data layer
 * responds; a store fault degrades to `503` so a monitor can react instead
 * of the app silently limping.
 *
 * `Cache-Control: no-store` so a proxy never serves a stale "ok".
 */
export async function GET() {
  let store: "ok" | "unavailable" = "ok";
  try {
    // Cheap readiness touch — the singleton is seeded lazily and idempotently.
    getDb();
  } catch {
    store = "unavailable";
  }

  const healthy = store === "ok";
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", store, timestamp: now() },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
