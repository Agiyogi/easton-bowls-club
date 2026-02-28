"use client";

import { useState, useEffect } from "react";
import { COLORS as C } from "../data/constants";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Fixtures from "../components/Fixtures";
import Membership from "../components/Membership";
import Events from "../components/Events";
// import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  const handleNav = (id) => {
    setActiveSection(id);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const sections = ["home", "about", "fixtures", "membership", "events",  "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === "home") {
          if (scrollY < window.innerHeight * 0.5) {
            setActiveSection("home");
            break;
          }
          continue;
        }
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.cream, minHeight: "100vh" }}>
      <Nav activeSection={activeSection} onNav={handleNav} />
      <Hero onNav={handleNav} />
      <About />
      <Fixtures />
      <Membership />
      <Events />
      {/* <Gallery /> */}
      <Contact />
      <Footer />
    </div>
  );
}
