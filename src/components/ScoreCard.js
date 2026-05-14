"use client";

import Image from "next/image";
import { COLORS as C } from "../data/constants";

function parseResult(result) {
  if (!result) return { tone: "neutral", label: "" };
  const r = result.trim().toLowerCase();
  if (r.startsWith("w")) return { tone: "win", label: result };
  if (r.startsWith("l")) return { tone: "loss", label: result };
  if (r.startsWith("d") || r.includes("draw")) return { tone: "draw", label: result };
  return { tone: "neutral", label: result };
}

const TONE_COLORS = {
  win: { bg: "rgba(90,122,90,0.12)", fg: C.sageDeep },
  loss: { bg: "rgba(208,109,109,0.12)", fg: "#A85555" },
  draw: { bg: "rgba(212,184,118,0.18)", fg: "#8B7340" },
  neutral: { bg: "rgba(155,145,133,0.12)", fg: C.warmGray },
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ScoreCard({ entry, onClick, compact = false }) {
  const { tone, label } = parseResult(entry.result);
  const tc = TONE_COLORS[tone];

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        background: C.white,
        border: "1px solid rgba(197,213,192,0.3)",
        borderRadius: 14,
        padding: compact ? 14 : 18,
        display: "flex",
        gap: compact ? 12 : 16,
        alignItems: "center",
        cursor: "pointer",
        boxShadow: "0 2px 14px rgba(0,0,0,0.04)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="score-card"
    >
      <div
        style={{
          width: compact ? 56 : 72,
          height: compact ? 56 : 72,
          flexShrink: 0,
          borderRadius: 8,
          overflow: "hidden",
          position: "relative",
          background: C.sage,
        }}
      >
        <Image
          src={entry.url}
          alt={entry.opponent ? `Scorecard vs ${entry.opponent}` : "Scorecard"}
          fill
          sizes="80px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: compact ? 15 : 17,
            fontWeight: 700,
            color: C.charcoal,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {entry.opponent || "Match"}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: C.warmGray,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>{formatDate(entry.date)}</span>
          {entry.homeAway && (
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 20,
                background: entry.homeAway === "home" ? "rgba(197,213,192,0.3)" : "rgba(212,228,237,0.5)",
                color: entry.homeAway === "home" ? C.sageDeep : "#4A6B7A",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {entry.homeAway}
            </span>
          )}
        </div>
      </div>
      {label && (
        <div
          style={{
            padding: "6px 14px",
            borderRadius: 20,
            background: tc.bg,
            color: tc.fg,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.5,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      )}
      <style>{`.score-card:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }`}</style>
    </button>
  );
}
