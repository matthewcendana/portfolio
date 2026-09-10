import type { ReactNode } from 'react';
import './CodeEditorWindow.css';

// Reusable macOS-style code editor shell. Pure chrome + a line-numbered body
// driven entirely by props, so the landing page and the querying screen can
// both reuse this exact shell with different tab name, body lines, and
// status bar text.
//
// Ported from CodeEditorWindow.astro. The old idPrefix/statusRightId props
// existed solely so vanilla script could reach specific lines via
// getElementById without id collisions between the two instances that live
// in the same DOM. In React, the owning component holds that content as
// state and passes it straight down as `lines`/`statusRight` — there is
// nothing left to query, so those props are gone.
export interface EditorLine {
  id: string;
  text: ReactNode;
  tone?: 'normal' | 'dim' | 'faint';
  italic?: boolean;
  size?: 'base' | 'sm';
  cursor?: boolean;
  /** Collapsed below 480px, for the "simplified two-line version". */
  collapseOnXs?: boolean;
}

interface Props {
  tabTitle: string;
  /** Renders a colored text badge (e.g. "SQL") before the filename instead of the file icon. */
  tabBadge?: string;
  editorLabel?: string;
  /** Trailing dot after the filename. Default true; the loading-screen variant omits it. */
  showTabDot?: boolean;
  /** Webcam notch on the bezel. Default true; the loading-screen variant omits it. */
  showNotch?: boolean;
  /** Laptop base/shelf beneath the window. Default true. */
  showBase?: boolean;
  /** Outer shell max-width. Default '900px'. */
  maxWidth?: string;
  /** Bezel aspect-ratio, used unless bodyHeight is set. Default '16 / 10'. */
  aspectRatio?: string;
  /** If set, the window uses this fixed height instead of the bezel aspect-ratio. */
  bodyHeight?: string;
  statusLeft: string;
  statusRight: ReactNode;
  lines: EditorLine[];
}

export default function CodeEditorWindow({
  tabTitle,
  tabBadge,
  editorLabel = 'SQL Editor',
  showTabDot = true,
  showNotch = true,
  showBase = true,
  maxWidth = '900px',
  aspectRatio = '16 / 10',
  bodyHeight,
  statusLeft,
  statusRight,
  lines,
}: Props) {
  const bezelStyle = bodyHeight
    ? { height: bodyHeight, aspectRatio: 'auto' }
    : { aspectRatio };

  return (
    <div className="editor-shell" style={{ ['--editor-max-width' as string]: maxWidth }}>
      <div className="editor-shell__glow" aria-hidden="true" />
      <div className="editor-shell__bezel" style={bezelStyle}>
        {showNotch && (
          <div className="editor-shell__notch" aria-hidden="true">
            <span />
          </div>
        )}
        <div className="editor-shell__window">
          <div className="editor-shell__titlebar">
            <div className="editor-shell__traffic-lights" aria-hidden="true">
              <span className="editor-shell__dot editor-shell__dot--red" />
              <span className="editor-shell__dot editor-shell__dot--yellow" />
              <span className="editor-shell__dot editor-shell__dot--green" />
            </div>
            <div className="editor-shell__tab">
              {tabBadge ? (
                <span className="editor-shell__tab-badge">{tabBadge}</span>
              ) : (
                <svg className="editor-shell__tab-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-4c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V13z" />
                </svg>
              )}
              <span className="editor-shell__tab-title">{tabTitle}</span>
              {showTabDot && <span className="editor-shell__tab-dot" aria-hidden="true" />}
            </div>
            <div className="editor-shell__label">{editorLabel}</div>
          </div>
          <div className="editor-shell__body">
            <div className="editor-shell__gutter" aria-hidden="true">
              {lines.map((line, i) => (
                <span key={line.id} className={line.collapseOnXs ? 'gutter--collapse-xs' : undefined}>
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="editor-shell__lines">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={[
                    'editor-line',
                    `editor-line--${line.tone ?? 'normal'}`,
                    line.italic && 'editor-line--italic',
                    line.size === 'sm' && 'editor-line--sm',
                    line.collapseOnXs && 'editor-line--collapse-xs',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="editor-line__text">{line.text}</span>
                  {line.cursor && <span className="editor-cursor" aria-hidden="true" />}
                </div>
              ))}
            </div>
          </div>
          <div className="editor-shell__statusbar">
            <div className="editor-shell__status-left">
              <span className="editor-shell__status-dot" aria-hidden="true" />
              <span>{statusLeft}</span>
            </div>
            <div className="editor-shell__status-right">{statusRight}</div>
          </div>
        </div>
      </div>
      {showBase && (
        <>
          <div className="editor-shell__shelf" aria-hidden="true">
            <span className="editor-shell__shelf-groove" />
          </div>
          <div className="editor-shell__shadow" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
