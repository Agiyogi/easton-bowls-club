"use client";

import Link from "next/link";
import { COLORS as C } from "../data/constants";
import { BowlsIcon } from "./Shared";

export default function Footer() {
  return (
    <footer style={{ background: C.charcoal, padding: "48px 24px 32px", textAlign: "center" }}>
      <BowlsIcon size={36} color={C.sage} />
      <div style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 18, color: C.cream,
        margin: "12px 0 4px", fontWeight: 700,
      }}>Easton Bowls Club</div>
      <div style={{
        fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
        color: "rgba(197,213,192,0.5)", marginBottom: 24,
      }}>Easton · Suffolk · Deben Valley</div>

      <div style={{ marginBottom: 24 }}>
        <Link
          href="/admin"
          className="footer-admin-link"
          style={{
            display: "inline-block",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "rgba(212,184,118,0.85)",
            textDecoration: "none",
            border: "1px solid rgba(212,184,118,0.35)",
            borderRadius: 50,
            padding: "8px 18px",
            transition: "all 0.25s ease",
          }}
        >
          Upload photos &amp; scorecards
        </Link>
      </div>

      <div style={{
        fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(253,248,240,0.3)",
        borderTop: "1px solid rgba(253,248,240,0.1)", paddingTop: 24,
      }}>
        &copy; {new Date().getFullYear()} Easton Bowls Club. Part of the Suffolk County Bowls Association.
      </div>

      <style>{`
        .footer-admin-link:hover {
          color: #D4B876 !important;
          border-color: rgba(212,184,118,0.7) !important;
          background: rgba(212,184,118,0.06);
        }
      `}</style>
    </footer>
  );
}
