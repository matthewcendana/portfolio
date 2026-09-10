import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDisclosureTransitionCss } from '../config/motion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './ResumeDropdown.css';

// A single inline disclosure panel, not a listbox: one destination (the
// resume PDF), so no option roles or arrow-key navigation apply — just
// aria-expanded/aria-controls on the trigger, matching the WAI-ARIA
// disclosure pattern.
//
// The panel itself stays mounted for the component's whole lifetime (never
// added/removed via AnimatePresence): it's a real block box whose height
// animates (via a plain CSS transition, see useDisclosureTransitionCss)
// between 0 and its measured content height, so opening it pushes the rest
// of the About Me section (and everything after it) down, and never
// overlays anything — the opposite of DatabaseSelector's floating popover.
// Keeping it mounted (rather than unmounting on close) also means the
// lazily-created iframe below survives a close/reopen instead of
// re-fetching the PDF each time.

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M6 2.5h8l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 20V4A1.5 1.5 0 0 1 5.5 2.5H6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 2.5V6a1.5 1.5 0 0 0 1.5 1.5H18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 12.5h8M8 16h5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** The document-icon + "Resume (PDF)" + open-in-new-tab card. Doubles as
 * the mobile fallback (PDF iframes are unreliable on iOS/Android) and as
 * the always-present layer behind the desktop iframe, so a silent iframe
 * load failure never leaves the panel empty. */
function ResumeFallbackCard({ fill = false }: { fill?: boolean }) {
  return (
    <a
      className={`resume-dropdown__fallback${fill ? ' resume-dropdown__fallback--behind' : ''}`}
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      <DocumentIcon />
      <span className="resume-dropdown__fallback-label">Resume (PDF)</span>
      <span className="resume-dropdown__fallback-cta">
        Open in new tab
        <ExternalLinkIcon />
      </span>
    </a>
  );
}

export default function ResumeDropdown() {
  const disclosureTransitionCss = useDisclosureTransitionCss();
  const isMobilePreview = useMediaQuery('(max-width: 767px)');
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelInnerRef = useRef<HTMLDivElement>(null);
  const headerLinkRef = useRef<HTMLAnchorElement>(null);

  // Motion's `animate` can't tween to the literal string 'auto' (its
  // isAnimatable check only accepts numbers/colors), so the open height is
  // measured instead: the inner content div is never itself height-clipped
  // — only this outer wrapper is — so its scrollHeight always reflects its
  // true natural height, whether the panel is open or not. Measured
  // synchronously in a layout effect (not a ResizeObserver) specifically
  // because it re-runs on exactly the two things that change the content's
  // shape — hasOpened (the iframe mounts) and isMobilePreview (iframe vs.
  // fallback card) — a plain script-driven layout read that isn't subject
  // to the browser's own throttling of async observer callbacks.
  const [measuredHeight, setMeasuredHeight] = useState(0);
  useLayoutEffect(() => {
    if (panelInnerRef.current) setMeasuredHeight(panelInnerRef.current.scrollHeight);
  }, [hasOpened, isMobilePreview]);

  function open() {
    setIsOpen(true);
    setHasOpened(true);
  }

  function close({ restoreFocus = false }: { restoreFocus?: boolean } = {}) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function toggle() {
    if (isOpen) close({ restoreFocus: true });
    else open();
  }

  // Move focus into the panel once it's open (and thus focusable — see the
  // `inert` toggle below, which excludes it from the tab order while
  // closed).
  useEffect(() => {
    if (isOpen) headerLinkRef.current?.focus();
  }, [isOpen]);

  // Outside click closes it.
  useEffect(() => {
    if (!isOpen) return;
    function handleDocumentClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape closes it even when focus is inside the panel, not just on the
  // trigger button.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') close({ restoreFocus: true });
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div className="resume-dropdown" ref={wrapperRef}>
      <button
        type="button"
        ref={triggerRef}
        className="resume-dropdown__trigger"
        aria-expanded={isOpen}
        aria-controls="resume-preview-panel"
        onClick={toggle}
      >
        <span>Resume</span>
        <span className="resume-dropdown__chevron" aria-hidden="true">
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1.5L8 8.5L15 1.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </span>
      </button>

      {/* Always mounted — height animates 0 <-> the measured content
          height via a plain CSS transition, so this is a real block box
          that pushes following content, never an overlay. */}
      <div
        className="resume-dropdown__panel"
        style={{
          height: isOpen ? measuredHeight : 0,
          overflow: 'hidden',
          transition: disclosureTransitionCss,
        }}
      >
        <div
          id="resume-preview-panel"
          className="resume-dropdown__panel-inner"
          ref={panelInnerRef}
          // Excludes the (otherwise still-present) content from focus and
          // the accessibility tree while the panel is collapsed to 0
          // height — without unmounting it, which would drop the lazily
          // loaded iframe and re-fetch the PDF on every reopen.
          inert={!isOpen}
        >
          <div className="resume-dropdown__card">
            <a
              ref={headerLinkRef}
              className="resume-dropdown__panel-header"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Resume.pdf</span>
              <span className="resume-dropdown__panel-header-cta">
                Open in new tab
                <ExternalLinkIcon />
              </span>
            </a>

            <div className="resume-dropdown__preview">
              {isMobilePreview ? (
                <ResumeFallbackCard />
              ) : (
                <div className="resume-dropdown__preview-frame">
                  <ResumeFallbackCard fill />
                  {hasOpened && (
                    <iframe
                      className="resume-dropdown__iframe"
                      src="/resume.pdf#toolbar=0&navpanes=0&view=FitH"
                      title="Resume preview"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
