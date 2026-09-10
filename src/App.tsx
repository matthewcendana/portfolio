import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import Nav from './components/Nav';
import QueryingScreen from './components/QueryingScreen';
import LandingPage from './pages/LandingPage';
import SectionsPage from './pages/SectionsPage';
import { SECTIONS, type Section } from './config/sections';

// Everything that used to be split across independent Astro islands (the
// landing dropdown, the querying screen, the nav) lives in one React tree.
//
// About Me / Projects / Fun Facts are one scrollable page (SectionsPage)
// mounted under all three of their routes — which route you arrived on
// only decides where it scrolls on mount. The landing page is the only
// other, standalone route.
//
// Route transitions run through AnimatePresence, keyed off location.pathname.
// Under no-preference this uses mode="wait": the outgoing page's exit
// variant finishes before the incoming page mounts and runs its own
// entrance stagger. Under reduced motion the pages must cross-fade instead
// (no flash of empty background), which requires the *opposite* of
// mode="wait" — both pages present and animating at once — so mode is left
// unset (defaults to "sync") in that case. See usePageTransition in
// config/motion.ts for the matching opacity timing.
export default function App() {
  const location = useLocation();
  const reduced = useReducedMotion();

  // ---- Querying screen ----
  const [activeTransition, setActiveTransition] = useState<Section | null>(null);

  function handleCommit(section: Section) {
    setActiveTransition(section);
  }

  function handleTransitionDone() {
    setActiveTransition(null);
  }

  // ---- Active section (for Nav's pill highlight) ----
  // Lifted here rather than read from location.pathname: SectionsPage
  // updates the URL via history.replaceState as the user scrolls, which
  // deliberately bypasses React Router (see SectionsPage) so scrolling
  // never triggers a route remount. That means Nav can't derive the active
  // section from useLocation() either — it has to come from here instead.
  const [activeSectionPath, setActiveSectionPath] = useState<string | null>(null);

  // A real navigation to "/" leaves the sections page entirely — clear the
  // stale section so landing shows no highlighted pill (SectionsPage only
  // reports *into* activeSectionPath; nothing clears it back out on its
  // own since it never re-mounts for an intra-page scroll).
  useEffect(() => {
    if (location.pathname === '/') setActiveSectionPath(null);
  }, [location.pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Nav
        hidden={activeTransition !== null}
        activeSectionPath={activeSectionPath}
        onActiveSectionChange={setActiveSectionPath}
      />
      <AnimatePresence mode={reduced ? undefined : 'wait'}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage onCommit={handleCommit} />} />
          {SECTIONS.map((section) => (
            <Route
              key={section.table}
              path={section.path}
              element={<SectionsPage onActiveSectionChange={setActiveSectionPath} />}
            />
          ))}
        </Routes>
      </AnimatePresence>
      <AnimatePresence>
        {activeTransition && (
          <QueryingScreen key="querying" section={activeTransition} onDone={handleTransitionDone} />
        )}
      </AnimatePresence>
    </>
  );
}
