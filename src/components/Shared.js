"use client";

import { COLORS as C } from "../data/constants";

export function BowlsIcon({ size = 40, color = C.sageDeep }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="26" stroke={color} strokeWidth="2" opacity="0.6" />
      <circle cx="30" cy="30" r="18" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <circle cx="30" cy="30" r="5" fill={color} opacity="0.5" />
    </svg>
  );
}

export function JackIcon({ size = 16, color = C.gold }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" fill={color} opacity="0.7" />
      <circle cx="10" cy="10" r="4" fill={color} opacity="0.9" />
    </svg>
  );
}

export function CheckIcon({ color = C.sageDark }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M5 8l2 2 4-4" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function PastelPlaceholder({ label, height = 300, variant = "green" }) {
  const gradients = {
    green: `linear-gradient(135deg, ${C.sage} 0%, ${C.cream} 50%, ${C.sky} 100%)`,
    warm: `linear-gradient(135deg, ${C.blush} 0%, ${C.goldLight} 50%, ${C.cream} 100%)`,
    sky: `linear-gradient(135deg, ${C.sky} 0%, ${C.cream} 50%, ${C.sage} 100%)`,
    village: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.blush} 40%, ${C.sage} 100%)`,
  };
  return (
    <div style={{
      height, background: gradients[variant] || gradients.green, borderRadius: 12,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", border: "1px solid rgba(197,213,192,0.4)",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: `radial-gradient(ellipse at 20% 50%, ${C.sageDeep} 0%, transparent 50%),
                          radial-gradient(ellipse at 80% 30%, ${C.gold} 0%, transparent 40%),
                          radial-gradient(ellipse at 50% 80%, ${C.sky} 0%, transparent 45%)`,
      }} />
      <BowlsIcon size={48} color={C.warmGray} />
      <span style={{
        marginTop: 12, fontFamily: "'Libre Baskerville', Georgia, serif",
        fontSize: 13, color: C.warmGray, letterSpacing: 1, textTransform: "uppercase", opacity: 0.7,
      }}>{label}</span>
      <span style={{
        marginTop: 4, fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, color: C.warmGray, opacity: 0.5,
      }}>Gemini pastel image</span>
    </div>
  );
}

export function Section({ id, children, bg = C.cream, style = {} }) {
  return (
    <section id={id} style={{ background: bg, padding: "80px 24px", position: "relative", overflow: "hidden", ...style }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 2 }}>{children}</div>
    </section>
  );
}

export function SectionTitle({ label, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      <div style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.sageDark, marginBottom: 12 }}>{label}</div>
      <h2 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: C.charcoal, margin: "0 0 12px 0", lineHeight: 1.2 }}>{title}</h2>
      {subtitle && <p style={{ fontFamily: "'DM Sans'", fontSize: 16, color: C.warmGray, maxWidth: 500, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}>{subtitle}</p>}
    </div>
  );
}
