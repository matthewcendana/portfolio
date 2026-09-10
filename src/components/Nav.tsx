import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { SECTIONS, enabledSections, sectionAnchorId } from '../config/sections';
import {
  useNavPillTransition,
  useFadeVariants,
  useStaggerContainer,
  useDecorativeEntrance,
  useScrollBehavior,
  DURATION,
} from '../config/motion';
import { scrollToSection } from '../utils/scrollToSection';
import BrandIcon from './BrandIcon';
import './Nav.css';

// Persistent header: lives at the app root (outside the routed page content
// in App.tsx), so it never unmounts and never re-animates on navigation.
// Present on every route including "/" — only actually hidden while the
// querying screen is playing.
interface Props {
  hidden: boolean;
  /** Which section is under scroll-spy right now, e.g. "/projects" — null
   * on the landing page, where nothing is active. Comes from App (lifted
   * there because SectionsPage updates the URL via history.replaceState,
   * which deliberately doesn't touch React Router's own location). */
  activeSectionPath: string | null;
  /** Lets a nav click update the active pill immediately, without waiting
   * for the scroll-spy observer to catch up with the smooth scroll. */
  onActiveSectionChange: (path: string) => void;
}

export default function Nav({ hidden, activeSectionPath, onActiveSectionChange }: Props) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pillTransition = useNavPillTransition();
  const overlayVariants = useFadeVariants(DURATION.micro, DURATION.micro, DURATION.micro);
  const mobileLinksContainer = useStaggerContainer(0.05);
  const mobileLinkItem = useDecorativeEntrance();
  const scrollBehavior = useScrollBehavior();

  // True while on any of the four stacked sections (regardless of which
  // one is currently scrolled to) — the only time a nav click should
  // smooth-scroll locally instead of doing a real navigation. Reads
  // location.pathname (not activeSectionPath): React Router's location is
  // stable across scroll — it only changes on a real navigation — so this
  // stays accurate for the whole time SectionsPage is mounted.
  const onSectionsPage = SECTIONS.some((s) => s.path === location.pathname);

  // Close the mobile overlay whenever a real route change happens (e.g.
  // arriving at the sections page from landing).
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  if (hidden) return null;

  const links = enabledSections().map((s) => ({ path: s.path, label: s.label }));

  function handleLinkClick(e: MouseEvent<HTMLAnchorElement>, path: string) {
    if (!onSectionsPage) return; // real navigation from the landing page
    e.preventDefault();
    scrollToSection(sectionAnchorId(path), scrollBehavior);
    onActiveSectionChange(path);
    window.history.replaceState(null, '', path);
  }

  return (
    <header className="site-nav">
      <div className="site-nav__inner">
        <Link to="/" className="site-nav__brand">
          <img src="/favicon.png" alt="" className="site-nav__logo" />
          <span className="site-nav__wordmark">Matthew Cendana</span>
        </Link>

        <div className="site-nav__right">
          <nav className="site-nav__links" aria-label="Primary">
            {links.map((link) => {
              const isActive = activeSectionPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="site-nav__pill"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleLinkClick(e, link.path)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="site-nav__pill-bg"
                      transition={pillTransition}
                    />
                  )}
                  <span className="site-nav__pill-label">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="site-nav__divider" aria-hidden="true" />

          <div className="site-nav__socials">
            <a
              href="https://github.com/matthewcendana"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav__social-link"
              title="GitHub"
              aria-label="GitHub"
            >
              <BrandIcon name="github" />
            </a>
            <a
              href="https://linkedin.com/in/matthew-cendana"
              target="_blank"
              rel="noopener noreferrer"
              className="site-nav__social-link"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <BrandIcon name="linkedin" />
            </a>
          </div>
        </div>

        <button
          type="button"
          className="site-nav__hamburger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-overlay"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <>
                <path d="M2 2L22 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 2L2 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M1.5 1.5H22.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M1.5 9H22.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M1.5 16.5H22.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-overlay"
            className="site-nav__mobile-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMobileOpen(false)}
          >
            <motion.nav
              className="site-nav__mobile-links"
              aria-label="Primary"
              variants={mobileLinksContainer}
              initial="hidden"
              animate="visible"
            >
              {links.map((link) => {
                const isActive = activeSectionPath === link.path;
                return (
                  <motion.div key={link.path} variants={mobileLinkItem}>
                    <Link
                      to={link.path}
                      className={`site-nav__mobile-link${isActive ? ' is-active' : ''}`}
                      onClick={(e) => {
                        handleLinkClick(e, link.path);
                        setMobileOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
