"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { COLORS as C } from "../data/constants";
import { Section, SectionTitle } from "./Shared";
import ScoreCard from "./ScoreCard";
import Lightbox from "./Lightbox";

export default function ScoresTeaser() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/r2/manifest?gallery=scores")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const sorted = [...(data.entries || [])].sort((a, b) => {
          const da = a.date ? Date.parse(a.date) : 0;
          const db = b.date ? Date.parse(b.date) : 0;
          return db - da;
        });
        setItems(sorted.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section id="scores-teaser" bg="rgba(197,213,192,0.15)">
      <SectionTitle
        label="Results"
        title="Recent results"
        subtitle="The latest scorecards from match days."
      />

      {loading ? (
        <div className="scores-teaser-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ height: 92, background: C.white, borderRadius: 14, opacity: 0.6 }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", color: C.warmGray, padding: "24px 0", fontSize: 14 }}>
          Scorecards will appear here after the next match.
        </div>
      ) : (
        <div className="scores-teaser-grid">
          {items.map((item, i) => (
            <ScoreCard key={item.key} entry={item} compact onClick={() => setOpen(i)} />
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link
          href="/scores"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            borderRadius: 50,
            background: "transparent",
            color: C.sageDeep,
            border: `1px solid ${C.sageDark}`,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 2,
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          View all scorecards →
        </Link>
      </div>

      {open !== null && (
        <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}

      <style>{`
        .scores-teaser-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 640px) { .scores-teaser-grid { grid-template-columns: 1fr; } }
      `}</style>
    </Section>
  );
}
