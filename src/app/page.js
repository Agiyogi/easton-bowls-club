import { COLORS as C } from "../data/constants";
import Hero from "../components/Hero";
import News from "../components/News";
import About from "../components/About";
import Fixtures from "../components/Fixtures";
import Membership from "../components/Membership";
import Events from "../components/Events";
import GalleryTeaser from "../components/GalleryTeaser";
import ScoresTeaser from "../components/ScoresTeaser";
import Contact from "../components/Contact";

export const revalidate = 60;

export default function Home() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.cream, minHeight: "100vh" }}>
      <Hero />
      <News />
      <About />
      <Fixtures />
      <Membership />
      <Events />
      <GalleryTeaser />
      <ScoresTeaser />
      <Contact />
    </div>
  );
}
