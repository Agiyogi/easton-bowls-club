"use client";

import { COLORS as C } from "../data/constants";
import { Section, SectionTitle } from "./Shared";

const EVENTS = [
  {
    title: "Season Open Day",
    date: "Sunday 19th April 2026",
    time: "2:00pm onwards",
    desc: "Come along and try your hand at bowls! All ages welcome. Refreshments served on the green.",
    image: "/images/open.jpg",
    tag: "Open Green",
  },
  // {
  //   title: "Friday School Sessions",
  //   date: "Every Friday (Term Time)",
  //   time: "Afternoon",
  //   desc: "Children from Easton Primary School enjoy bowls every Friday afternoon. A wonderful introduction to the sport for young players.",
  //   image: "/images/children.jpg",
  //   tag: "Weekly",
  // },
  {
    title: "Eric Peck Open",
    date: "Sunday 10th May 2026",
    time: "10:00 AM",
    desc: "One of our popular open competitions. Enter as an individual or bring a friend — all welcome.",
    image: "/images/eric.jpg",
    tag: "Competition",
  },
  {
    title: "Finals Day",
    date: "Sunday 30th August 2026",
    time: "2:00 PM onwards",
    desc: "The climax of our competition season. Come and support the finalists as they compete for club honours. Spectators very welcome.",
    image: "/images/finals.jpg",
    tag: "Club Finals",
  },
];

export default function Events() {
  return (
    <Section id="events" bg={C.cream}>
      <SectionTitle
        label="What's On"
        title="Events & Open Days"
        subtitle="From open days to social evenings, there's always something happening at the green."
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        className="events-grid"
      >
        {EVENTS.map((e, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(197,213,192,0.2)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            <img
              src={e.image}
              alt={e.title}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
            />
            <div style={{ padding: "24px 28px" }}>
              <span
                style={{
                  fontFamily: "'DM Sans'",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.sageDeep,
                  background: "rgba(197,213,192,0.2)",
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {e.tag}
              </span>
              <h3
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.charcoal,
                  margin: "12px 0 8px",
                }}
              >
                {e.title}
              </h3>
              <div
                style={{
                  fontFamily: "'DM Sans'",
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.sageDeep,
                  marginBottom: 4,
                }}
              >
                {e.date} · {e.time}
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans'",
                  fontSize: 14,
                  color: C.warmGray,
                  lineHeight: 1.6,
                  margin: "12px 0 0 0",
                }}
              >
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      <style>{`@media (max-width: 640px) { .events-grid { grid-template-columns: 1fr !important; } }`}</style>
    </Section>
  );
}
