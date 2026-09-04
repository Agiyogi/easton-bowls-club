import { COLORS as C } from "../data/constants";
import { NEWS } from "../data/news";

// Slim pill linking to the news section. Positioned by its parent (the hero).
// Driven by the banner field of the newest news item; renders nothing if unset.
export default function NewsBanner() {
  const banner = NEWS[0]?.banner;
  if (!banner) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      <a
        href={banner.href}
        className="news-banner"
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          maxWidth: "100%",
          padding: "9px 18px",
          borderRadius: 50,
          background: "rgba(253,248,240,0.94)",
          border: `1px solid ${C.sage}`,
          boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)",
          color: C.charcoal,
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.4,
          textAlign: "center",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: C.gold,
            flexShrink: 0,
          }}
        />
        <span>{banner.text}</span>
        <span aria-hidden="true" style={{ color: C.sageDeep, flexShrink: 0 }}>
          →
        </span>
      </a>
      <style>{`
        .news-banner:hover { background: ${C.white}; }
        @media (max-width: 600px) {
          .news-banner { font-size: 12px !important; padding: 8px 14px !important; }
        }
      `}</style>
    </div>
  );
}
