"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { COLORS as C } from "../data/constants";
import Lightbox from "./Lightbox";

function dateOf(item) {
  return item.takenAt || (item.uploadedAt ? item.uploadedAt.slice(0, 10) : "");
}

function monthKeyFor(item) {
  const iso = dateOf(item);
  return iso ? iso.slice(0, 7) : "0000-00"; // YYYY-MM
}

function monthLabel(ym) {
  if (ym === "0000-00") return "Undated";
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export default function GalleryGrid({ items }) {
  const [open, setOpen] = useState(null);

  // Flat list sorted newest-first by takenAt. The lightbox traverses this list,
  // so prev/next cross month boundaries in chronological order.
  const sorted = useMemo(
    () =>
      [...(items || [])].sort((a, b) => {
        const da = dateOf(a);
        const db = dateOf(b);
        if (da !== db) return da < db ? 1 : -1;
        return (b.uploadedAt || "").localeCompare(a.uploadedAt || "");
      }),
    [items]
  );

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of sorted) {
      const ym = monthKeyFor(item);
      if (!map.has(ym)) map.set(ym, []);
      map.get(ym).push(item);
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
        No photos yet — check back soon.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {grouped.map(([ym, photos]) => (
          <div key={ym}>
            <h3
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: 22,
                fontWeight: 700,
                color: C.charcoal,
                margin: "0 0 20px 0",
                paddingBottom: 10,
                borderBottom: `1px solid ${C.sage}`,
              }}
            >
              {monthLabel(ym)}
              <span style={{ color: C.warmGray, fontSize: 14, fontWeight: 400, marginLeft: 8 }}>
                · {photos.length} {photos.length === 1 ? "photo" : "photos"}
              </span>
            </h3>

            <div className="gallery-grid">
              {photos.map((item) => {
                const flatIndex = sorted.findIndex((s) => s.key === item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => setOpen(flatIndex)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "block",
                      width: "100%",
                      marginBottom: 12,
                      borderRadius: 10,
                      overflow: "hidden",
                      breakInside: "avoid",
                      boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    className="gallery-tile"
                  >
                    <Image
                      src={item.url}
                      alt={item.caption || "Easton Bowls Club photo"}
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        background: C.sage,
                      }}
                    />
                    {item.caption && (
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12,
                          color: C.warmGray,
                          padding: "8px 10px 10px",
                          textAlign: "left",
                          background: C.white,
                        }}
                      >
                        {item.caption}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          items={sorted}
          index={open}
          onClose={() => setOpen(null)}
          onIndex={setOpen}
        />
      )}

      <style>{`
        .gallery-grid {
          column-count: 4;
          column-gap: 12px;
        }
        .gallery-tile:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        @media (max-width: 1024px) {
          .gallery-grid { column-count: 3; }
        }
        @media (max-width: 640px) {
          .gallery-grid { column-count: 2; }
        }
      `}</style>
    </>
  );
}
