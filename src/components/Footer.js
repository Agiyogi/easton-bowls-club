"use client";

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
      <div style={{
        fontFamily: "'DM Sans'", fontSize: 12, color: "rgba(253,248,240,0.3)",
        borderTop: "1px solid rgba(253,248,240,0.1)", paddingTop: 24,
      }}>
        &copy; {new Date().getFullYear()} Easton Bowls Club. Part of the Suffolk County Bowls Association.
      </div>
    </footer>
  );
}
