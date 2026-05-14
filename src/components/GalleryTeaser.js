"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { COLORS as C } from "../data/constants";
import { Section, SectionTitle } from "./Shared";
import Lightbox from "./Lightbox";

export default function GalleryTeaser() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/r2/manifest?gallery=photos")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems((data.entries || []).slice(0, 6));
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section id="gallery-teaser" bg={C.cream}>
      <SectionTitle
        label="Gallery"
        title="From the green"
        subtitle="A glimpse of life at the rink — match days, social evenings, and everything in between."
      />

      {loading ? (
        <div className="teaser-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "4 / 3",
                background: "rgba(197,213,192,0.25)",
                borderRadius: 10,
              }}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", color: C.warmGray, padding: "24px 0", fontSize: 14 }}>
          Photos coming soon.
        </div>
      ) : (
        <div className="teaser-grid">
          {items.map((item, i) => (
            <button
              key={item.key}
              onClick={() => setOpen(i)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
                position: "relative",
                aspectRatio: "4 / 3",
              }}
              className="teaser-tile"
            >
              <Image
                src={item.url}
                alt={item.caption || "Easton Bowls Club photo"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                style={{ objectFit: "cover", background: C.sage }}
              />
            </button>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link
          href="/gallery"
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
          View all photos →
        </Link>
      </div>

      {open !== null && (
        <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
      )}

      <style>{`
        .teaser-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }
        .teaser-tile:hover { transform: translateY(-2px); transition: transform 0.25s ease; }
        @media (max-width: 900px) { .teaser-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px) { .teaser-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </Section>
  );
}
