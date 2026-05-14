import { COLORS as C } from "../data/constants";

export default function InnerHeader({ label, title, subtitle }) {
  return (
    <header
      style={{
        background: `linear-gradient(180deg, ${C.sage} 0%, rgba(197,213,192,0.35) 60%, ${C.cream} 100%)`,
        padding: "140px 24px 56px",
        textAlign: "center",
        borderBottom: `1px solid rgba(197,213,192,0.4)`,
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: C.sageDeep,
            marginBottom: 12,
          }}
        >
          {label}
        </div>
        <h1
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            color: C.charcoal,
            margin: "0 0 14px 0",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              color: C.warmGray,
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
