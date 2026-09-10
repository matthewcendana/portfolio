// Single source of truth for the four site sections. The nav, the landing
// dropdown, and the querying-screen variants all read from this list rather
// than keeping their own copies.
export interface Section {
  /** SQL-flavored identifier: the table-name suffix (matthew.{table}) and the
   * .sql filename ({table}.sql). Shown only in the querying screen / editor —
   * never in the nav or the landing dropdown, which show `label` instead. */
  table: string;
  /** Human-readable name, used for nav labels, the landing dropdown, and
   * "Querying {label}" headings. */
  label: string;
  /** Route path. */
  path: string;
  /** When false, hidden from the nav and the landing dropdown, but the route still renders. */
  enabled: boolean;
}

export const SECTIONS: Section[] = [
  { table: 'about_me', label: 'About Me', path: '/about-me', enabled: true },
  { table: 'projects', label: 'Projects', path: '/projects', enabled: true },
  { table: 'fun_facts', label: 'Fun Facts', path: '/fun-facts', enabled: true },
];

export const enabledSections = (): Section[] => SECTIONS.filter((s) => s.enabled);

export const tableName = (table: string): string => `matthew.${table}`;

export const sqlFilename = (table: string): string => `${table}.sql`;

export const queryingHeading = (label: string): string => `Querying ${label}`;

/** The scrollable page's anchor id for a section — its path with the
 * leading slash stripped, e.g. "/about-me" -> "about-me". Used as the DOM
 * id every section root renders, so the nav, the scroll-spy observer, and
 * `history.replaceState` all agree on the same identifier. */
export const sectionAnchorId = (path: string): string => path.slice(1);

/** All section anchor ids in page order, including disabled sections —
 * the scrollable page renders (and scroll-spies) every section regardless
 * of `enabled`; only the nav and the landing dropdown filter on it. */
export const SECTION_ANCHOR_IDS: string[] = SECTIONS.map((s) => sectionAnchorId(s.path));
