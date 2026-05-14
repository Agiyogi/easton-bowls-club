import { readManifest } from "@/lib/r2";
import { COLORS as C } from "@/data/constants";
import InnerHeader from "@/components/InnerHeader";
import ScoreList from "@/components/ScoreList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scorecards | Easton Bowls Club",
  description: "A season-by-season record of our match results.",
};

export default async function ScoresPage() {
  let entries = [];
  try {
    entries = await readManifest("scores");
  } catch (err) {
    console.error("scores: manifest read failed", err);
  }

  return (
    <main>
      <InnerHeader
        label="Results"
        title="Scorecards"
        subtitle="A season-by-season record of our match results."
      />
      <section style={{ background: C.cream, padding: "48px 24px 96px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <ScoreList items={entries} />
        </div>
      </section>
    </main>
  );
}
