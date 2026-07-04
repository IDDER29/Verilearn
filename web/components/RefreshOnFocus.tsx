"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Reconcile counters when the learner returns to the tab (HOME-19). The Dashboard
 * is a server component whose due/conflict/task counts are computed from
 * source-of-truth on each render; this island calls `router.refresh()` on
 * visibility/focus regain so stale counts (e.g. after grading in another tab)
 * re-sync without a manual reload. Renders nothing.
 */
export default function RefreshOnFocus() {
  const router = useRouter();
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [router]);
  return null;
}
