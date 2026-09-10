import { useEffect } from 'react';

// Astro's BaseLayout took a `title` prop and rendered a fresh <title> tag
// per page at request time. This SPA has one static index.html instead, so
// each page component sets its own document title on mount via this hook.
export function usePageTitle(title: string): void {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
