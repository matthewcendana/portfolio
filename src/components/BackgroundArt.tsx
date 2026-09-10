import './BackgroundArt.css';

// Single reusable decorative layer for the "data-engineering" background
// theme (faint grid, connector curves, database-cylinder/schema glyphs)
// used behind the landing page, the querying screen, and the sections
// page — never duplicated per-section markup. Fixed positioning + a
// negative z-index keeps it behind normal-flow page content without every
// consumer having to opt its own content into a stacking context.
export default function BackgroundArt() {
  return (
    <div className="bg-art" aria-hidden="true">
      <div className="bg-art__glow bg-art__glow--a" />
      <div className="bg-art__glow bg-art__glow--b" />
      <div className="bg-art__glow bg-art__glow--c" />
      <svg
        className="bg-art__lines"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bg-art-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-art-grid)" className="bg-art__grid" />

        <path className="bg-art__connector" d="M 100 200 C 240 200 220 340 380 340 C 520 340 500 500 700 500" />
        <path className="bg-art__connector" d="M 900 160 C 1040 160 1000 300 1200 300 C 1320 300 1360 460 1500 460" />
        <path className="bg-art__connector" d="M 160 700 C 300 700 340 600 480 600" />

        <circle className="bg-art__node" cx="380" cy="340" r="3.5" />
        <circle className="bg-art__node" cx="1200" cy="300" r="3" />
        <circle className="bg-art__node" cx="480" cy="600" r="2.5" />

        {/* Database cylinder glyph */}
        <g className="bg-art__glyph" transform="translate(1180, 480)">
          <ellipse cx="80" cy="18" rx="70" ry="18" />
          <ellipse cx="80" cy="43" rx="70" ry="18" />
          <ellipse cx="80" cy="68" rx="70" ry="18" />
          <path d="M 10 18 L 10 68" />
          <path d="M 150 18 L 150 68" />
        </g>

        {/* Schema/table glyph */}
        <g className="bg-art__glyph" transform="translate(90, 110)">
          <rect width="140" height="88" rx="6" />
          <line x1="0" y1="24" x2="140" y2="24" />
          <line x1="16" y1="44" x2="90" y2="44" />
          <line x1="16" y1="62" x2="110" y2="62" />
          <line x1="16" y1="76" x2="70" y2="76" />
        </g>
      </svg>
    </div>
  );
}
