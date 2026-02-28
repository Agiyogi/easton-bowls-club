"use client";

import { COLORS as C } from "../data/constants";
import { Section, SectionTitle, CheckIcon } from "./Shared";

const TIERS = [
  {
    name: "Full Member",
    price: "£50",
    period: "per season",
    highlight: true,
    features: [
      "Full green access Apr–Sep",
      "League & cup matches",
      "Club competitions",
      "Social events",
      "Voting rights at AGM",
      "Match fees: £2 per game",
    ],
  },
  {
    name: "Social Member",
    price: "£10",
    period: "per year",
    highlight: false,
    features: [
      "Clubhouse access",
      "Social events",
      "Spectating welcome",
      "Tea and Refreshments",
      "Support the club",
    ],
  },
  {
    name: "Junior Member",
    price: "£10",
    period: "per season",
    highlight: false,
    features: [
      "Under 18s welcome",
      "Coaching included",
      "Equipment provided",
      "Match fees: £2 per game",
    ],
  },
];

export default function Membership() {
  return (
    <Section id="membership" bg={C.white}>
      <SectionTitle
        label="Join Us"
        title="Membership"
        subtitle="Affordable rates for the whole family. No green fees — just one simple annual subscription."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="membership-grid">
        {TIERS.map((t, i) => (
          <div key={i} style={{
            background: t.highlight ? `linear-gradient(160deg, ${C.sageDeep} 0%, #4A6B4A 100%)` : C.cream,
            borderRadius: 16, padding: "40px 32px", textAlign: "center",
            border: t.highlight ? "none" : "1px solid rgba(197,213,192,0.3)",
            position: "relative", overflow: "hidden",
            transform: t.highlight ? "scale(1.03)" : "scale(1)",
            boxShadow: t.highlight ? "0 12px 40px rgba(90,122,90,0.2)" : "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            {t.highlight && (
              <div style={{
                position: "absolute", top: 16, right: -28, background: C.gold,
                color: C.charcoal, fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans'",
                letterSpacing: 1.5, padding: "4px 36px", transform: "rotate(45deg)", textTransform: "uppercase",
              }}>Popular</div>
            )}
            <h3 style={{
              fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
              color: t.highlight ? C.cream : C.charcoal, marginBottom: 8,
            }}>{t.name}</h3>
            <div style={{
              fontFamily: "'Libre Baskerville', serif", fontSize: 42, fontWeight: 700,
              color: t.highlight ? C.goldLight : C.sageDeep, marginBottom: 4,
            }}>{t.price}</div>
            <div style={{
              fontFamily: "'DM Sans'", fontSize: 13,
              color: t.highlight ? "rgba(253,248,240,0.6)" : C.warmGray, marginBottom: 28,
            }}>{t.period}</div>
            <div style={{ textAlign: "left" }}>
              {t.features.map((f, fi) => (
                <div key={fi} style={{
                  display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
                  fontFamily: "'DM Sans'", fontSize: 14,
                  color: t.highlight ? "rgba(253,248,240,0.9)" : C.charcoal,
                }}>
                  <CheckIcon color={t.highlight ? C.gold : C.sageDark} />
                  {f}
                </div>
              ))}
            </div>
            <button style={{
              marginTop: 20, width: "100%", padding: "14px 0",
              fontFamily: "'DM Sans'", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
              background: t.highlight ? C.gold : C.sageDeep,
              color: t.highlight ? C.charcoal : C.cream,
              border: "none", borderRadius: 50, cursor: "pointer",
            }}>Enquire Now</button>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .membership-grid { grid-template-columns: 1fr !important; max-width: 400px; margin: 0 auto; }
          .membership-grid > div { transform: scale(1) !important; }
        }
      `}</style>
    </Section>
  );
}
