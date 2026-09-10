import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import AboutMeSection from "./AboutMeSection";
import ProjectsSection from "./ProjectsSection";
import FunFactsSection from "./FunFactsSection";
import SignOff from "../components/SignOff";
import BackgroundArt from "../components/BackgroundArt";
import {
  SECTIONS,
  SECTION_ANCHOR_IDS,
  sectionAnchorId,
} from "../config/sections";
import { usePageTransition } from "../config/motion";
import { usePageTitle } from "../hooks/usePageTitle";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { scrollToSection } from "../utils/scrollToSection";

interface Props {
  /** Reports the section currently under scroll-spy so Nav (a sibling, not
   * an ancestor of this route) can highlight the right pill. Also mirrors
   * into the URL via history.replaceState — see the effect below. */
  onActiveSectionChange: (path: string) => void;
}

// The single scrollable page for About Me, Projects, and Fun Facts — one
// route per section for direct links and the landing dropdown, but all
// three render here, always, in that order. Which route you arrived on
// only decides where this scrolls on mount. SignOff is the closing beat
// (message + contact) — not a scroll-spied section itself.
export default function SectionsPage({ onActiveSectionChange }: Props) {
  const location = useLocation();
  const activeId = useScrollSpy(SECTION_ANCHOR_IDS);

  // Direct visit / arrival from the querying screen: jump to the section
  // named by the route instantly, before first paint — never animated.
  useLayoutEffect(() => {
    scrollToSection(sectionAnchorId(location.pathname), "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = activeId ? `/${activeId}` : location.pathname;
    onActiveSectionChange(path);
    // Replace, not push — scrolling shouldn't fill up the back button with
    // every section the user passed through.
    window.history.replaceState(null, "", path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const activeSection = SECTIONS.find(
    (s) => sectionAnchorId(s.path) === activeId,
  );
  usePageTitle(
    activeSection
      ? `${activeSection.label} — Matthew Cendana`
      : "Matthew Cendana",
  );

  return (
    <motion.main
      id="main-content"
      variants={usePageTransition()}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <BackgroundArt />
      <AboutMeSection />
      <ProjectsSection />
      <FunFactsSection />
      <SignOff />
    </motion.main>
  );
}
