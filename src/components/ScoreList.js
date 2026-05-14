"use client";

import { useState, useMemo } from "react";
import { COLORS as C } from "../data/constants";
import ScoreCard from "./ScoreCard";
import Lightbox from "./Lightbox";

function seasonFor(iso) {
  if (!iso) return "Undated";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Undated";
  return String(d.getFullYear());
}

export default function ScoreList({ items }) {
  const [open, setOpen] = useState(null);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0;
        const db = b.date ? Date.parse(b.date) : 0;
        return db - da;
      }),
    [items]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of sorted) {
      const s = seasonFor(item.date);
      if (!map.has(s)) map.set(s, []);
      map.get(s).push(item);
    }
    return [...map.entries()];
  }, [sorted]);

  if (sorted.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: C.warmGray,
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
        }}
      >
        No scorecards yet — they&apos;ll appear here after match days.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        {grouped.map(([season, rows]) => (
          <div key={season}>
            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: 22,
                fontWeight: 700,
                color: C.charcoal,
                margin: "0 0 16px 0",
                paddingBottom: 10,
                borderBottom: `1px solid ${C.sage}`,
              }}
            >
              {season} <span style={{ color: C.warmGray, fontSize: 14, fontWeight: 400, marginLeft: 8 }}>· {rows.length} {rows.length === 1 ? "match" : "matches"}</span>
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rows.map((entry) => {
                const flatIndex = sorted.findIndex((s) => s.key === entry.key);
                return (
                  <ScoreCard
                    key={entry.key}
                    entry={entry}
                    onClick={() => setOpen(flatIndex)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {open !== null && (
        <Lightbox items={sorted} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}
    </>
  );
}
