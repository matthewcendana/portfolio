import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import CodeEditorWindow, { type EditorLine } from './CodeEditorWindow';
import BackgroundArt from './BackgroundArt';
import StatusStrip from './StatusStrip';
import { queryingHeading, sqlFilename, tableName, type Section } from '../config/sections';
import { DURATION, REDUCED_DURATION, useFadeVariants } from '../config/motion';
import './QueryingScreen.css';

// The querying/loading transition that plays after a database is selected on
// the landing page. App mounts this inside <AnimatePresence> keyed off
// whether a transition is active, so its own fade in (mount) and fade out
// (unmount) are driven by the initial/animate/exit variants below rather
// than a manually-timed unmount.
//
// Seamlessness: `finish()` calls navigate() AND onDone() in the same tick.
// onDone() removes this component from App's tree, which starts
// AnimatePresence's 0.3s exit fade — meanwhile navigate() has already
// changed the route, so the destination page's entrance stagger starts
// immediately, overlapping with this screen's fade-out rather than waiting
// for it.

const TYPE_STAGGER_MS = 250;
// The screen's hold — how long it stays up before handing off to the
// destination route. The progress bar's fill duration is DERIVED from
// whichever of these is active (not a second number that happens to
// match), so the bar always finishes exactly as the hold ends: 1.8s clears
// the ~1.2s floor a progress bar needs to read as real progress rather
// than a blip; 700ms is that same floor compressed for the reduced-motion
// path, which skips the line-by-line typing entirely.
const HOLD_DURATION_MS = 1800;
const REDUCED_HOLD_MS = 700;
const QUERYING_FADE_OUT_S = DURATION.slow / 2; // 0.3s

type RevealStep = 0 | 1 | 2 | 3; // 0 = only the comment; 3 = comment+select+from+cursor

interface Props {
  section: Section;
  onDone: () => void;
}

const lineFadeTransition = { duration: DURATION.fast };

export default function QueryingScreen({ section, onDone }: Props) {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();
  const screenVariants = useFadeVariants(DURATION.fast, QUERYING_FADE_OUT_S, REDUCED_DURATION.queryingFade);
  const [revealStep, setRevealStep] = useState<RevealStep>(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // How long the screen holds before handing off — and, matching it
  // exactly, how long the progress bar takes to fill. One value feeds both,
  // so they can never drift apart between the two motion states.
  const holdMs = reduced ? REDUCED_HOLD_MS : HOLD_DURATION_MS;

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };

    setRevealStep(0);

    const finish = () => {
      clearTimers();
      // Both fire in the same tick: navigate() starts the destination page's
      // entrance immediately, while onDone() lets THIS screen fade out
      // over top of it — an overlap, not a hand-off.
      navigate(section.path);
      onDone();
    };

    if (reduced) {
      // Skip the line-by-line typing — the destination query is known
      // immediately, so render it immediately.
      setRevealStep(3);
    } else {
      timersRef.current.push(setTimeout(() => setRevealStep(1), TYPE_STAGGER_MS));
      timersRef.current.push(setTimeout(() => setRevealStep(2), TYPE_STAGGER_MS * 2));
      timersRef.current.push(setTimeout(() => setRevealStep(3), TYPE_STAGGER_MS * 3));
    }
    timersRef.current.push(setTimeout(finish, holdMs));

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, reduced, holdMs]);

  const lines: EditorLine[] = [
    { id: 'comment', text: '-- Querying profile details', tone: 'dim', italic: true },
    {
      id: 'select',
      text:
        revealStep >= 1 ? (
          <motion.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={lineFadeTransition}>
            <span className="qs-kw">SELECT</span> <span className="qs-star">*</span>
          </motion.span>
        ) : (
          ''
        ),
    },
    {
      id: 'from',
      text:
        revealStep >= 2 ? (
          <motion.span initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={lineFadeTransition}>
            <span className="qs-kw">FROM</span> <span className="qs-id">{tableName(section.table)}</span>{' '}
            <span className="qs-semi">;</span>
          </motion.span>
        ) : (
          ''
        ),
    },
    { id: 'cursor', text: '', cursor: revealStep >= 3 },
    { id: 'filler-5', text: '', tone: 'dim' },
    { id: 'filler-6', text: '', tone: 'dim' },
  ];

  return (
    <motion.div
      className="querying-screen"
      variants={screenVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <BackgroundArt />
      <div className="querying-screen__left">
        <h1 className="querying-screen__heading" aria-live="polite">
          {queryingHeading(section.label)}
        </h1>
        <div className="querying-screen__progress">
          <motion.div
            className="querying-screen__progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: holdMs / 1000, ease: 'linear' }}
          />
        </div>
      </div>
      <div className="querying-screen__right" aria-hidden="true">
        <StatusStrip />
        <CodeEditorWindow
          tabTitle={sqlFilename(section.table)}
          tabBadge="SQL"
          editorLabel="UTF-8"
          showTabDot={false}
          showNotch={false}
          maxWidth="740px"
          bodyHeight="420px"
          statusLeft="PostgreSQL 16 • Executing..."
          statusRight="12ms • 1 row queried"
          lines={lines}
        />
      </div>
    </motion.div>
  );
}
