import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Events · VeriLearn" };

const DETAIL_HREF = "/events/live-workshop";

type UpcomingItem = {
  day: string;
  date: string;
  dateBg: string;
  dateColor: string;
  title: string;
  meta: string;
  tag: string;
  tagColor: string;
  tagBg: string;
};

const UPCOMING: UpcomingItem[] = [
  {
    day: "Sun",
    date: "13",
    dateBg: "#eef2fb",
    dateColor: "#3a63b0",
    title: "Study group · Binary search edge cases",
    meta: "10:00 AM · 12 going · hosted by Adeline W.",
    tag: "Group",
    tagColor: "#6d5bd0",
    tagBg: "#f1eefb",
  },
  {
    day: "Wed",
    date: "16",
    dateBg: "#fbf3e4",
    dateColor: "#b4830f",
    title: "7-day retention challenge starts",
    meta: "Keep your streak · 340 learners joined",
    tag: "Challenge",
    tagColor: "#b4830f",
    tagBg: "#fbefdd",
  },
  {
    day: "Fri",
    date: "18",
    dateBg: "#eef7f1",
    dateColor: "#2e9c6a",
    title: "AMA: How the Skeptic red-teams a claim",
    meta: "3:00 PM · with the VeriLearn team",
    tag: "Talk",
    tagColor: "#3a63b0",
    tagBg: "#e3ecfb",
  },
];

export default function EventsPage() {
  return (
    <AppShell active="events">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Events 📅</div>
            <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              Live sessions, study groups and challenges.
            </div>
          </div>

          {/* featured event */}
          <div
            style={{
              position: "relative",
              background: "#211d2e",
              borderRadius: 22,
              padding: "28px 30px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(120% 140% at 88% 15%,rgba(139,120,232,.42),transparent 55%)",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 78,
                height: 82,
                borderRadius: 16,
                background: "rgba(255,255,255,.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ font: "800 11px var(--font-nunito)", color: "#b3a7f0", textTransform: "uppercase" }}>Sat</span>
              <span style={{ font: "900 30px var(--font-nunito)", color: "#fff", lineHeight: 1 }}>12</span>
              <span style={{ font: "700 10px var(--font-nunito)", color: "#c9c3d8" }}>Jul</span>
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  font: "800 10px var(--font-nunito)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#211d2e",
                  background: "#8b78e8",
                  padding: "4px 10px",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              >
                🔴 Live workshop
              </div>
              <Link
                href={DETAIL_HREF}
                style={{ textDecoration: "none", color: "#fff", font: "900 20px/1.25 var(--font-nunito)" }}
              >
                Graph algorithms, verified: a live claim-check
              </Link>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#c9c3d8", marginTop: 7 }}>
                2:00 PM · 45 min · with the Skeptic on hard mode
              </div>
            </div>
            <Link
              href={DETAIL_HREF}
              style={{
                position: "relative",
                textDecoration: "none",
                borderRadius: 13,
                background: "#fff",
                color: "#221f2e",
                font: "800 13px var(--font-nunito)",
                padding: "12px 20px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Register
            </Link>
          </div>

          {/* upcoming list */}
          <div
            style={{
              font: "800 11px var(--font-nunito)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "#a7a1b8",
            }}
          >
            Upcoming
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {UPCOMING.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "16px 18px",
                  boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 56,
                    borderRadius: 14,
                    background: item.dateBg,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ font: "800 9px var(--font-nunito)", color: item.dateColor, textTransform: "uppercase" }}>
                    {item.day}
                  </span>
                  <span style={{ font: "900 20px var(--font-nunito)", color: item.dateColor, lineHeight: 1 }}>
                    {item.date}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 14.5px var(--font-nunito)" }}>{item.title}</div>
                  <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>{item.meta}</div>
                </div>
                <span
                  style={{
                    font: "800 11px var(--font-nunito)",
                    color: item.tagColor,
                    background: item.tagBg,
                    padding: "6px 12px",
                    borderRadius: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 22,
              textAlign: "center",
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            }}
          >
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 6, textAlign: "left" }}>Your challenge</div>
            <div style={{ position: "relative", width: 120, height: 120, margin: "8px auto 0" }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "conic-gradient(#b4830f 220deg,#f4ecda 0)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 14,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ font: "900 22px var(--font-nunito)" }}>6/7</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>days</div>
              </div>
            </div>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699", marginTop: 10 }}>
              One more day to complete the retention challenge!
            </div>
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            }}
          >
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 12 }}>Registered</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: "#efe9ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                🎓
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>Live claim-check</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Sat · 2:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
