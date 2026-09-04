"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS as C } from "../data/constants";

const HERO_VIDEO = "/videos/fynn-winners.mp4";
const HERO_POSTER = "/images/fynn-winners-poster.jpg";
const HERO_FALLBACK = "/images/hero.jpg";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);
  const onNav = scrollTo;

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

      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          padding: "0 24px",
          maxWidth: 800,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(30px)",
          transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
      

        <h1
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            color: C.cream,
            lineHeight: 1.1,
            margin: "0 0 8px 0",
          }}
        >
          Easton Bowls
        </h1>
        <h1
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: C.goldLight,
            lineHeight: 1.1,
            margin: "0 0 32px 0",
          }}
        >
          Club
        </h1>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 18,
            lineHeight: 1.7,
            color: "rgba(253,248,240,0.85)",
            maxWidth: 520,
            margin: "0 auto 48px",
            fontWeight: 300,
          }}
        >
          Set in the beautiful heart of the Deben Valley, our village bowls club
          welcomes players of all ages and abilities.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => onNav("membership")}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: C.gold,
              color: C.charcoal,
              border: "none",
              padding: "16px 36px",
              borderRadius: 50,
              cursor: "pointer",
            }}
          >
            Join the Club
          </button>
          <button
            onClick={() => onNav("fixtures")}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 2,
              textTransform: "uppercase",
              background: "transparent",
              color: C.cream,
              border: "1px solid rgba(253,248,240,0.4)",
              padding: "16px 36px",
              borderRadius: 50,
              cursor: "pointer",
            }}
          >
            View Fixtures
          </button>
        </div>
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
