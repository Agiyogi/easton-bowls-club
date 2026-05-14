"use client";

import { useEffect, useCallback } from "react";
import { COLORS as C } from "../data/constants";

export default function Lightbox({ items, index, onClose, onIndex }) {
  const total = items.length;
  const current = total > 0 ? items[((index % total) + total) % total] : null;

  const prev = useCallback(() => {
    if (total === 0) return;
    onIndex(((index - 1) % total + total) % total);
  }, [index, total, onIndex]);

  const next = useCallback(() => {
    if (total === 0) return;
    onIndex((index + 1) % total);
  }, [index, total, onIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next]);

  if (!current) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(20,30,20,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(0,0,0,0.4)",
          color: C.cream,
          border: "1px solid rgba(253,248,240,0.3)",
          borderRadius: "50%",
          width: 44,
          height: 44,
          fontSize: 20,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ×
      </button>

      {total > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous"
            className="lb-arrow"
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: C.cream,
              border: "1px solid rgba(253,248,240,0.3)",
              borderRadius: "50%",
              width: 48,
              height: 48,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next"
            className="lb-arrow"
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.4)",
              color: C.cream,
              border: "1px solid rgba(253,248,240,0.3)",
              borderRadius: "50%",
              width: 48,
              height: 48,
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "92vw",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <img
          src={current.url}
          alt={current.caption || ""}
          style={{
            maxWidth: "92vw",
            maxHeight: "78vh",
            objectFit: "contain",
            borderRadius: 6,
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        />
        {(current.caption || current.opponent || current.result) && (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "rgba(253,248,240,0.85)",
              textAlign: "center",
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            {current.opponent && (
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 16, color: C.cream, marginBottom: 4 }}>
                vs {current.opponent}
                {current.homeAway ? ` (${current.homeAway})` : ""}
                {current.result ? ` — ${current.result}` : ""}
              </div>
            )}
            {current.date && <div style={{ opacity: 0.7, marginBottom: 4 }}>{current.date}</div>}
            {current.caption && <div>{current.caption}</div>}
          </div>
        )}
      </div>

      <style>{`.lb-arrow:hover { background: rgba(0,0,0,0.7) !important; }`}</style>
    </div>
  );
}
