"use client";

import { COLORS as C } from "../data/constants";
import { NEWS } from "../data/news";
import { Section, SectionTitle } from "./Shared";

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wrap each highlighted name in <strong>, leaving the rest of the text verbatim.
function renderParagraph(text, highlight = []) {
  if (!highlight.length) return text;
  const re = new RegExp(`(${highlight.map(escapeRegExp).join("|")})`, "g");
  return text.split(re).map((part, i) =>
    highlight.includes(part) ? (
      <strong key={i} style={{ fontWeight: 600, color: C.charcoal }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function longDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function News() {
  const [featured, ...older] = NEWS;
  if (!featured) return null;

  return (
    <Section id="news" bg={C.cream} style={{ scrollMarginTop: 80 }}>
      <SectionTitle label="Club News" title={featured.heading} subtitle={featured.subline} />

      <article
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: C.white,
          borderRadius: 16,
          padding: "40px 44px",
          border: "1px solid rgba(197,213,192,0.3)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
        className="news-article"
      >
        {featured.body.map((p, i) => (
          <p
            key={i}
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 15,
              color: C.charcoal,
              lineHeight: 1.8,
              marginBottom: i === featured.body.length - 1 ? 0 : 18,
            }}
          >
            {renderParagraph(p, featured.highlight)}
          </p>
        ))}
      </article>

      {older.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontFamily: "'DM Sans'", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: C.sageDark, marginBottom: 12 }}>
            More news
          </div>
          {older.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                padding: "12px 0",
                borderBottom: "1px solid rgba(197,213,192,0.25)",
                fontFamily: "'DM Sans'",
                fontSize: 14,
              }}
            >
              <span style={{ color: C.charcoal, fontWeight: 500 }}>{item.heading}</span>
              <span style={{ color: C.warmGray, whiteSpace: "nowrap" }}>{longDate(item.date)}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .news-article { padding: 28px 24px !important; }
        }
      `}</style>
    </Section>
  );
}
