"use client";

import { useState } from "react";
import Image from "next/image";
import { COLORS as C } from "../data/constants";
import Lightbox from "./Lightbox";

export default function GalleryGrid({ items }) {
  const [open, setOpen] = useState(null);

  if (!items || items.length === 0) {
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
      <div className="gallery-grid">
        {items.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setOpen(i)}
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
        ))}
      </div>

      {open !== null && (
        <Lightbox
          items={items}
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
