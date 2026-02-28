"use client";

import { useState, useMemo } from "react";
import { COLORS as C } from "../data/constants";
import { FIXTURES, CAPTAINS, MONTHS, TYPES, typeColor } from "../data/fixtures";
import { Section, SectionTitle } from "./Shared";

export default function Fixtures() {
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const filtered = useMemo(() => {
    return FIXTURES.filter(f =>
      (filterMonth === "All" || f.month === filterMonth) &&
      (filterType === "All" || f.type === filterType)
    );
  }, [filterMonth, filterType]);

  return (
    <Section id="fixtures" bg={C.cream}>
      <SectionTitle
        label="Season 2026"
        title="Fixture Card"
        subtitle="Full season fixtures — Woodbridge League, Fynn Valley A & B, Open events and Club competitions."
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {MONTHS.map(m => (
            <button key={m} onClick={() => setFilterMonth(m)} style={{
              fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500,
              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              background: filterMonth === m ? C.sageDeep : "rgba(197,213,192,0.15)",
              color: filterMonth === m ? C.cream : C.warmGray,
              border: "none", transition: "all 0.2s",
            }}>{m}</button>
          ))}
        </div>
        <div style={{ width: 1, background: "rgba(197,213,192,0.3)" }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(t)} style={{
              fontFamily: "'DM Sans'", fontSize: 12, fontWeight: 500,
              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              background: filterType === t ? C.sageDeep : "rgba(197,213,192,0.15)",
              color: filterType === t ? C.cream : C.warmGray,
              border: "none", transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div style={{ textAlign: "center", marginBottom: 16, fontFamily: "'DM Sans'", fontSize: 13, color: C.warmGray }}>
        Showing {filtered.length} fixture{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div style={{
        background: C.white, borderRadius: 16, overflow: "hidden",
        border: "1px solid rgba(197,213,192,0.3)", boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "70px 58px 1fr 100px 68px 56px",
          padding: "14px 20px", background: C.sageDeep, color: C.cream,
          fontFamily: "'DM Sans'", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
        }} className="fixture-row">
          <span>Date</span><span>Day</span><span>Opponent / Event</span><span>League</span><span>Venue</span><span>Time</span>
        </div>

        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {filtered.map((f, i) => {
            const tc = typeColor(f.type);
            const isNewMonth = i === 0 || filtered[i - 1].month !== f.month;
            return (
              <div key={i}>
                {isNewMonth && (
                  <div style={{
                    padding: "10px 20px", background: "rgba(197,213,192,0.08)",
                    fontFamily: "'Libre Baskerville', serif", fontSize: 14, fontWeight: 700,
                    color: C.sageDeep, borderBottom: "1px solid rgba(197,213,192,0.15)",
                  }}>{f.month}</div>
                )}
                <div style={{
                  display: "grid", gridTemplateColumns: "70px 58px 1fr 100px 68px 56px",
                  padding: "11px 20px", fontFamily: "'DM Sans'", fontSize: 14,
                  borderBottom: "1px solid rgba(197,213,192,0.12)",
                  background: i % 2 === 0 ? C.white : "rgba(197,213,192,0.04)",
                  color: C.charcoal, alignItems: "center",
                }} className="fixture-row">
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{f.day}</span>
                  <span style={{ fontSize: 12, color: C.warmGray }}>{f.dow}</span>
                  <span style={{ fontWeight: f.opponent ? 400 : 600, color: f.opponent ? C.charcoal : C.sageDeep }}>
                    {f.opponent || f.league}
                  </span>
                  <span style={{
                    display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11,
                    fontWeight: 600, background: tc.bg, color: tc.text, textAlign: "center", whiteSpace: "nowrap",
                  }}>{f.league}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: f.venue === "Home" ? C.sageDeep : f.venue === "Away" ? "#5A7A8A" : C.gold,
                  }}>{f.venue}</span>
                  <span style={{ fontSize: 13, color: C.warmGray }}>{f.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Captains */}
      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="captains-grid">
        {CAPTAINS.map((c, i) => (
          <div key={i} style={{
            background: C.white, borderRadius: 12, padding: "16px 20px", textAlign: "center",
            border: "1px solid rgba(197,213,192,0.2)",
          }}>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 15, fontWeight: 700, color: C.charcoal }}>{c.name}</div>
            <div style={{ fontFamily: "'DM Sans'", fontSize: 12, color: C.warmGray, marginTop: 4 }}>{c.role}</div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .fixture-row { grid-template-columns: 50px 40px 1fr 70px 50px 45px !important; font-size: 11px !important; padding: 8px 10px !important; }
          .captains-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Section>
  );
}
