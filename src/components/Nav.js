"use client";

import { useState, useEffect } from "react";
import { COLORS as C } from "../data/constants";
import { BowlsIcon } from "./Shared";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "fixtures", label: "Fixtures" },
  { id: "membership", label: "Membership" },
  { id: "events", label: "Events" },
  // { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

export default function Nav({ activeSection, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(253,248,240,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(197,213,192,0.3)" : "none",
        transition: "all 0.4s ease", padding: scrolled ? "12px 0" : "20px 0",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onNav("home")}>
            <BowlsIcon size={32} color={scrolled ? C.sageDeep : C.white} />
            <div>
              <div style={{
                fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700,
                color: scrolled ? C.charcoal : C.white, letterSpacing: 0.5, transition: "color 0.4s",
              }}>Easton Bowls Club</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: 3,
                textTransform: "uppercase",
                color: scrolled ? C.warmGray : "rgba(255,255,255,0.7)", transition: "color 0.4s",
              }}>Suffolk</div>
            </div>
          </div>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
            {LINKS.map(l => (
              <button key={l.id} onClick={() => onNav(l.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                letterSpacing: 1, textTransform: "uppercase",
                color: activeSection === l.id
                  ? (scrolled ? C.sageDeep : C.gold)
                  : (scrolled ? C.warmGray : "rgba(255,255,255,0.8)"),
                transition: "color 0.3s", padding: "4px 0",
                borderBottom: activeSection === l.id
                  ? `2px solid ${scrolled ? C.sageDeep : C.gold}`
                  : "2px solid transparent",
              }}>{l.label}</button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{
            display: "none", background: "none", border: "none", cursor: "pointer",
            padding: 8, color: scrolled ? C.charcoal : C.white,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{ background: "rgba(253,248,240,0.98)", padding: "20px 24px", borderTop: `1px solid ${C.sage}` }}>
            {LINKS.map(l => (
              <button key={l.id} onClick={() => { onNav(l.id); setMobileOpen(false); }} style={{
                display: "block", width: "100%", textAlign: "left", background: "none",
                border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 500,
                color: activeSection === l.id ? C.sageDeep : C.charcoal,
                padding: "12px 0", borderBottom: "1px solid rgba(197,213,192,0.2)",
              }}>{l.label}</button>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
