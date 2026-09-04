// Club news. Newest item first — the first entry is the featured article
// and drives the banner under the nav. Add a new object to publish a story.
//
// Fields:
//   id        stable slug, used as the React key
//   date      ISO date the story was published
//   banner    optional slim strip under the nav; href anchors to the news section
//   heading   article title
//   subline   small line under the title (date · competition · result)
//   highlight names to render in bold wherever they appear in the body
//   body      array of paragraphs, rendered verbatim

export const NEWS = [
  {
    id: "fynn-league-winners-2026",
    date: "2026-09-04",
    banner: {
      text: "Easton A win the 2026 Fynn League Final v Sax Sports — 3 September 2026",
      href: "#news",
    },
    heading: "Easton A are Fynn League champions",
    subline: "4 September 2026 · Fynn League Final · Easton A beat Sax Sports at Hollesley",
    highlight: ["Cliff Green", "Mike Cattermole"],
    body: [
      "Easton A lifted the 2026 Fynn League title last night, beating Sax Sports in the final at Hollesley.",
      "This was a win for the whole team. Led by captain Cliff Green, every rink pulled its weight — steady bowling from the front ends, precise strategy from the middle players, and the big shots at the back end all got us over the line. Cliff's calm on the bank all season, and especially last night, set the tone for everyone.",
      "It was also a win for the whole club. The A team stand on the shoulders of everyone at Easton — the B team and Woodbridge team players who push them in practice, and those who run the pavilion, the teas and the raffle week in, week out. None of last night happens without all of that.",
      "A very special thank you goes to Mike Cattermole, who has kept our green in such fine condition all year. Through a long, dry summer Mike has had the surface running true week after week, and a team only bowls as well as the green it practises on. This trophy is as much his as anyone's. We also wish Mike a very happy 80th birthday for 5 September.",
      "And it was a win for our supporters. A huge thank you to everyone who made the journey to Hollesley — members, partners, families and friends. A final on a September evening is a long way to travel, and as the sun went down over Hollesley Green you could hear the Easton crowd on every end. It made a real difference to the players.",
      "Thank you too to Hollesley Bowls Club for hosting the final so well, and to Sax Sports for a hard-fought and sporting match — they made us earn every shot.",
      "Congratulations to Cliff and the squad, and thank you to every member and supporter who has been part of this season. The trophy will be on display in the pavilion — come and see it, and raise a glass with us at the club.",
    ],
  },
];
