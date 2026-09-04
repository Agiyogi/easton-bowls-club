"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COLORS as C } from "../data/constants";
import { BowlsIcon } from "./Shared";

const ANCHOR_LINKS = [
  { id: "home", label: "Home", anchor: true },
  { id: "about", label: "About", anchor: true },
  { id: "fixtures", label: "Fixtures", anchor: true },
  { id: "membership", label: "Membership", anchor: true },
  { id: "events", label: "Events", anchor: true },
  { id: "gallery", label: "Gallery", route: "/gallery" },
  { id: "scores", label: "Scores", route: "/scores" },
  { id: "contact", label: "Contact", anchor: true },
];

const SCROLL_SECTIONS = ["home", "about", "fixtures", "membership", "events", "contact"];

function scrollToId(id) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(isHome ? "home" : "");

  // Keep scrolled state in sync when route changes
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      setActiveSection("");
      return;
    }
    setScrolled(window.scrollY > 60);
  }, [isHome]);

  // Scroll listener: bg + active section (only meaningful on /)
  useEffect(() => {
    const handle = () => {
      if (isHome) {
        setScrolled(window.scrollY > 60);
        const scrollY = window.scrollY + 200;
        for (let i = SCROLL_SECTIONS.length - 1; i >= 0; i--) {
          const id = SCROLL_SECTIONS[i];
          if (id === "home") {
            if (scrollY < window.innerHeight * 0.5) {
              setActiveSection("home");
              break;
            }
            continue;
          }
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollY) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handle);
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, [isHome]);

  // Handle inbound /#anchor when arriving on the homepage from another route
  useEffect(() => {
    if (!isHome) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    // Wait a tick so the section is in the DOM, then drop the hash from the
    // address so a reload or a copied link opens at the top of the page.
    const t = setTimeout(() => {
      scrollToId(hash);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }, 50);
    return () => clearTimeout(t);
  }, [isHome]);

  const handleNav = useCallback(
    (link) => {
      setMobileOpen(false);
      if (link.route) {
        router.push(link.route);
        return;
      }
      if (link.anchor) {
        if (isHome) {
          scrollToId(link.id);
        } else {
          router.push(link.id === "home" ? "/" : `/#${link.id}`);
        }
      }
    },
    [isHome, router]
  );

  const handleLogo = useCallback(() => {
    setMobileOpen(false);
    if (isHome) {
      scrollToId("home");
    } else {
      router.push("/");
    }
  }, [isHome, router]);

  const isActive = (link) => {
    if (link.route) return pathname === link.route;
    if (link.anchor) return isHome && activeSection === link.id;
    return false;
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(253,248,240,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(197,213,192,0.3)" : "none",
          transition: "all 0.4s ease",
          padding: scrolled ? "12px 0" : "20px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
            onClick={handleLogo}
          >
            <BowlsIcon size={32} color={scrolled ? C.sageDeep : C.white} />
            <div>
              <div
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: scrolled ? C.charcoal : C.white,
                  letterSpacing: 0.5,
                  transition: "color 0.4s",
                }}
              >
                Easton Bowls Club
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: scrolled ? C.warmGray : "rgba(255,255,255,0.7)",
                  transition: "color 0.4s",
                }}
              >
                Suffolk
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 28, alignItems: "center" }} className="desktop-nav">
            {ANCHOR_LINKS.map((l) => {
              const active = isActive(l);
              return (
                <button
                  key={l.id}
                  onClick={() => handleNav(l)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    color: active
                      ? (scrolled ? C.sageDeep : C.gold)
                      : (scrolled ? C.warmGray : "rgba(255,255,255,0.8)"),
                    transition: "color 0.3s",
                    padding: "4px 0",
                    borderBottom: active
                      ? `2px solid ${scrolled ? C.sageDeep : C.gold}`
                      : "2px solid transparent",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: scrolled ? C.charcoal : C.white,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div style={{ background: "rgba(253,248,240,0.98)", padding: "20px 24px", borderTop: `1px solid ${C.sage}` }}>
            {ANCHOR_LINKS.map((l) => {
              const active = isActive(l);
              return (
                <button
                  key={l.id}
                  onClick={() => handleNav(l)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: active ? C.sageDeep : C.charcoal,
                    padding: "12px 0",
                    borderBottom: "1px solid rgba(197,213,192,0.2)",
                  }}
                >
                  {l.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
