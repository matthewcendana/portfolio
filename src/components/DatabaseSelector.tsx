import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { enabledSections, type Section } from '../config/sections';
import { useDropdownVariants } from '../config/motion';
import './DatabaseSelector.css';

// Custom, fully keyboard-operable listbox (not a native <select>) — the
// design calls for per-option hover previews that drive the code editor
// alongside it, which a native select can't expose.
//
// Ported from DatabaseSelector.astro's vanilla script. Behavior preserved
// deliberately, including a bug fix from that version: opening the menu
// moves keyboard focus to the first option WITHOUT firing a preview, so
// merely opening the dropdown can't clobber an already-committed query on
// the editor. Only a real hover or arrow-key move fires onPreview.
interface Props {
  onPreview: (section: Section | null) => void;
  onSelect: (section: Section) => void;
}

export default function DatabaseSelector({ onPreview, onSelect }: Props) {
  const dropdownVariants = useDropdownVariants();
  const sections = enabledSections();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selected, setSelected] = useState<Section | null>(null);

  const listboxRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Focus the listbox once it mounts (matching the vanilla version's
  // listbox.focus() call inside open()).
  useEffect(() => {
    if (isOpen) listboxRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Outside-click closes the menu. Effect-registered so it's only listening
  // while open, with matching removal — not a permanent document listener.
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

  function open() {
    setIsOpen(true);
    setActiveIndex(0); // visual highlight only — no preview dispatch
  }

  function close({ restoreFocus = false }: { restoreFocus?: boolean } = {}) {
    setIsOpen(false);
    setActiveIndex(-1);
    onPreview(null);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function moveActive(index: number) {
    setActiveIndex(index);
    const section = sections[index];
    onPreview(section ?? null);
  }

  function selectOption(section: Section) {
    setSelected(section);
    close({ restoreFocus: false });
    onSelect(section);
  }

  function handleTriggerClick() {
    if (isOpen) close({ restoreFocus: true });
    else open();
  }

  function handleTriggerKeyDown(e: KeyboardEvent) {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      open();
    }
  }

  function handleListboxKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(activeIndex < sections.length - 1 ? activeIndex + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(activeIndex > 0 ? activeIndex - 1 : sections.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const section = sections[activeIndex];
      if (section) selectOption(section);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close({ restoreFocus: true });
    } else if (e.key === 'Tab') {
      close({ restoreFocus: false });
    }
  }

  const activeOption = sections[activeIndex];

  return (
    <div className="db-selector" ref={wrapperRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`db-selector__trigger${selected ? ' has-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="db-selector-listbox"
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="db-selector__icon" aria-hidden="true">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1.5H22.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.75" />
            <path d="M1.5 9H22.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.75" />
            <path d="M1.5 16.5H22.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.75" />
          </svg>
        </span>
        <span className="db-selector__text">
          {selected ? selected.label : 'Select a database to start'}
        </span>
        <span className="db-selector__chevron" aria-hidden="true">
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
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listboxRef}
            id="db-selector-listbox"
            className="db-selector__listbox"
            role="listbox"
            aria-label="Available databases"
            aria-activedescendant={activeOption ? `db-option-${activeOption.table}` : undefined}
            tabIndex={-1}
            onKeyDown={handleListboxKeyDown}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ transformOrigin: 'top center' }}
          >
            {sections.map((section, index) => (
              <li
                key={section.table}
                id={`db-option-${section.table}`}
                role="option"
                aria-selected={selected?.table === section.table}
                className={`db-selector__option${index === activeIndex ? ' is-active' : ''}`}
                onMouseEnter={() => moveActive(index)}
                onClick={() => selectOption(section)}
              >
                <span className="db-selector__option-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M1.5 6h13M6 6v8.5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
                <span className="db-selector__option-text">{section.label}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
