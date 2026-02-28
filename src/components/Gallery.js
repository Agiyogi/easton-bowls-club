"use client";

import { COLORS as C } from "../data/constants";
import { Section, SectionTitle, PastelPlaceholder } from "./Shared";

const IMAGES = [
  { label: "Morning on the Green", variant: "green" },
  { label: "The Crinkle-Crankle Wall", variant: "village" },
  { label: "Evening Match", variant: "warm" },
  { label: "Easton Village Green", variant: "sky" },
  { label: "Junior Players", variant: "green" },
  { label: "The White Horse Pub", variant: "village" },
];

export default function Gallery() {
  return (
    <Section id="gallery" bg={C.white}>
      <SectionTitle
        label="Gallery"
        title="Life at the Green"
        subtitle="Scenes from our beautiful corner of Suffolk."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="gallery-grid">
        {IMAGES.map((img, i) => (
          <div key={i} style={{
            borderRadius: 12, overflow: "hidden",
            gridRow: i === 0 || i === 3 ? "span 2" : "span 1",
          }}>
            <PastelPlaceholder
              label={img.label}
              height={i === 0 || i === 3 ? 400 : 192}
              variant={img.variant}
            />
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .gallery-grid { grid-template-columns: 1fr 1fr !important; }
          .gallery-grid > div { grid-row: span 1 !important; }
        }
      `}</style>
    </Section>
  );
}
