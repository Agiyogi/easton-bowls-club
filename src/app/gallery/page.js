import { readPhotosWithDates } from "@/lib/r2";
import { COLORS as C } from "@/data/constants";
import InnerHeader from "@/components/InnerHeader";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60;

export const metadata = {
  title: "Gallery | Easton Bowls Club",
  description: "Match days, social evenings, and life around the rink at Easton Bowls Club.",
};

export default async function GalleryPage() {
  let entries = [];
  try {
    entries = await readPhotosWithDates();
  } catch (err) {
    console.error("gallery: manifest read failed", err);
  }

  return (
    <main>
      <InnerHeader
        label="Gallery"
        title="From the green"
        subtitle="Match days, social evenings, and life around the rink."
      />
      <section style={{ background: C.cream, padding: "48px 24px 96px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <GalleryGrid items={entries} />
        </div>
      </section>
    </main>
  );
}
