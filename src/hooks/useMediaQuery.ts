import { useEffect, useState } from 'react';

/** Viewport-width detection via matchMedia — never user-agent sniffing.
 * Used where a feature genuinely depends on available screen space (e.g.
 * whether to render a PDF iframe at all), not just CSS layout. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
