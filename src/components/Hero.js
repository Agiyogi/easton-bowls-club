"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS as C } from "../data/constants";
import NewsBanner from "./NewsBanner";

const HERO_VIDEO = "/videos/fynn-winners.mp4";
const HERO_POSTER = "/images/fynn-winners-poster.jpg";
const HERO_FALLBACK = "/images/hero.jpg";

export default function Hero() {
  // Video background: falls back to the poster if autoplay is blocked,
  // and to the original hero.jpg if the video fails to load at all.
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // React doesn't always emit the muted attribute in SSR HTML
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch((err) => {
        // NotAllowedError = autoplay policy; anything else means the file didn't load.
        if (err && err.name === "NotAllowedError") setAutoplayBlocked(true);
        else setVideoFailed(true);
      });
    }
  }, [videoFailed]);

  const bgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background: hero.jpg always underneath, video (or its poster) on top */}
      <img src={HERO_FALLBACK} alt="Easton Bowls Club green" style={bgStyle} />
      {!videoFailed && autoplayBlocked && (
        <img
          src={HERO_POSTER}
          alt="Fynn League winners 2026 — Easton A"
          onError={() => setVideoFailed(true)}
          style={bgStyle}
        />
      )}
      {!videoFailed && !autoplayBlocked && (
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Fireworks over the green — Fynn League winners 2026, Easton A"
          onError={() => setVideoFailed(true)}
          style={bgStyle}
        />
      )}
      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(160deg, rgba(42,62,42,0.7) 0%, rgba(30,50,30,0.6) 50%, rgba(20,40,20,0.7) 100%)",
        }}
      />

      {/* Hero copy removed while the Fynn League promotion runs — the nav carries the club name */}

      {/* News banner sits low in the hero, above the scroll cue */}
      <div style={{ position: "absolute", bottom: 104, left: 0, right: 0, zIndex: 3 }}>
        <NewsBanner />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "bounce 2s infinite",
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans'",
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(253,248,240,0.4)",
          }}
        >
          Scroll
        </span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          stroke="rgba(253,248,240,0.4)"
          strokeWidth="1.5"
        >
          <path d="M8 4v16M2 14l6 6 6-6" />
        </svg>
      </div>

      <style>{`@keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }`}</style>
    </section>
  );
}
