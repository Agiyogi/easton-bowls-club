"use client";

import { COLORS as C } from "../data/constants";
import { Section, SectionTitle } from "./Shared";

export default function About() {
  return (
    <Section id="about" bg={C.white}>
      <SectionTitle
        label="Our Club"
        title="A Village Tradition"
        subtitle="Nestled in one of Suffolk's most beautiful estate villages, Easton Bowls Club has been bringing the community together on the green."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
        }}
        className="about-grid"
      >
        <img
          src="/images/green.jpg"
          alt="The bowling green at Easton"
          style={{
            width: "100%",
            height: 380,
            objectFit: "cover",
            borderRadius: 12,
          }}
        />
        <div>
          <p
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 18,
              fontStyle: "italic",
              color: C.sageDeep,
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            &ldquo;It&rsquo;s not just a sport for old people!&rdquo;
          </p>
          <p
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 15,
              color: C.charcoal,
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Easton Bowls Club is set in a beautiful position overlooking the
            Deben Valley, just a stone&rsquo;s throw from the village green and
            The White Horse pub. Our green sits on the gentle plateau to the
            northeast of the village, alongside the cricket club.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 15,
              color: C.charcoal,
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            We welcome players of every age and ability. There is plenty of opportunity for
            young people to get involved and enjoy themselves at the weekends.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans'",
              fontSize: 15,
              color: C.charcoal,
              lineHeight: 1.8,
            }}
          >
            Whether you&rsquo;re a seasoned bowler or have never picked up a
            wood, come along and give it a try. You&rsquo;ll find a warm welcome
            and a beautiful setting.
          </p>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; } }`}</style>
    </Section>
  );
}
