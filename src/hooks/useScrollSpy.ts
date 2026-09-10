import { useEffect, useRef, useState } from 'react';

const FALLBACK_NAV_HEIGHT = 72;

function readNavHeightPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : FALLBACK_NAV_HEIGHT;
}

/**
 * Tracks which of `ids` (DOM element ids, in page order) is "current" for
 * scroll-spy purposes: whichever section is intersecting a thin detection
 * band positioned just below the sticky nav. When more than one section
 * touches the band at once (the moment one section's bottom edge and the
 * next section's top edge both cross it), the later section wins, so the
 * nav switches the instant the next heading clears the nav rather than
 * lagging behind on the outgoing section.
 */
export function useScrollSpy(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const navHeight = readNavHeightPx();
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleRef.current.add(entry.target.id);
          else visibleRef.current.delete(entry.target.id);
        }
        for (let i = ids.length - 1; i >= 0; i--) {
          if (visibleRef.current.has(ids[i])) {
            setActiveId(ids[i]);
            return;
          }
        }
      },
      { rootMargin: `-${navHeight}px 0px -55% 0px`, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return activeId;
}
