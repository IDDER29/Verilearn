"use client";

import { useEffect, useState } from "react";

/**
 * In-app offline indicator (A11Y-19). Listens to the browser's online/offline
 * events and shows a fixed, AT-announced banner while the connection is down —
 * so a learner knows why writes (create/verify/grade) aren't going through,
 * rather than seeing a silent failure. `role="status"`/`aria-live` announces the
 * state change; nothing renders while online. No network of its own — purely a
 * client signal, so it works even with the app's happy-path server actions.
 */
export default function OfflineBanner() {
  // Start "online": SSR has no navigator, and assuming offline would flash a
  // false banner on first paint. The effect corrects it immediately on mount.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <div role="status" aria-live="assertive" aria-atomic="true">
      {!online && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 9,
            background: "#221d2e",
            color: "#fff",
            font: "800 12.5px var(--font-nunito)",
            padding: "10px 18px",
            borderRadius: 12,
            boxShadow: "0 12px 30px -12px rgba(40,30,70,.7)",
          }}
        >
          <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: "#f0a99f", flexShrink: 0 }} />
          You&apos;re offline — changes won&apos;t save until you reconnect. Your entered text is kept.
        </div>
      )}
    </div>
  );
}
