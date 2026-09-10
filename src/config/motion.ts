import { useReducedMotion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';

// Single source of truth for every animation timing/easing value in the
// site. Nothing outside this module should hardcode a duration, easing
// curve, stagger interval, or entrance distance — and nothing outside this
// module should branch on useReducedMotion() for a *visual variant/timing*
// decision. Components call a hook below and stay unaware of the flag.
//
// The two exceptions are structural, not stylistic, and live where they do
// because they can't be expressed as a variant: App.tsx reads
// useReducedMotion() directly to pick AnimatePresence's `mode` (sync vs
// "wait" — see usePageTransition below), and QueryingScreen reads it to
// choose its reveal-step *sequence* (typed lines vs instant text), which is
// state orchestration, not a style.
export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
  /** Micro-interactions (dropdown open, chevron rotate, hover) — smaller
   * than `fast`, used often enough to warrant its own name rather than
   * being a repeated magic number. Doubles as the reduced-motion duration
   * for the same interactions: 150ms already reads as instant-but-visible
   * at this scale, so there's nothing to shorten. */
  micro: 0.15,
} as const;

// Reduced-motion fades are the primary vocabulary on that path, so they
// need real duration — 150ms reads as a cut at page scale. These are
// intentionally distinct from DURATION.base/fast (the full-motion timings),
// not a shortened copy of them.
export const REDUCED_DURATION = {
  pageCrossFade: 0.28,
  queryingFade: 0.2,
  contentAppear: 0.18,
} as const;

export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const; // strong ease-out
export const EASE_EXIT = [0.4, 0, 1, 1] as const;
const EASE_LINEAR = 'linear' as const;

export const STAGGER = 0.07;
export const DISTANCE = 16;

/** Chevron rotation, dropdown/menu open-close: same duration in both
 * motion states, so it's a constant rather than a hook. */
export const MICRO_TRANSITION: Transition = { duration: DURATION.micro };

/**
 * A whole route's root element. Under no-preference: hosts the entrance
 * stagger for its children and a y+opacity exit (unchanged from before).
 *
 * Under reduced motion, the container itself becomes the page-to-page
 * cross-fade: hidden/visible/exit all carry a real, *matched* opacity
 * transition so the outgoing and incoming page can overlap with combined
 * opacity staying near 1 throughout (App.tsx pairs this with
 * `mode={reduced ? undefined : 'wait'}` on AnimatePresence — sync mode is
 * what makes the overlap actually happen; this variant alone only supplies
 * the timing).
 */
export function usePageTransition(): Variants {
  const reduced = useReducedMotion();
  if (reduced) {
    const transition: Transition = { duration: REDUCED_DURATION.pageCrossFade, ease: EASE_LINEAR };
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
      exit: { opacity: 0, transition },
    };
  }
  return {
    hidden: {},
    visible: { transition: { staggerChildren: STAGGER } },
    exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast, ease: EASE_EXIT } },
  };
}

/** Groups a set of decorative-entrance children under one stagger, e.g. the
 * mobile nav's link list. Reduced motion collapses the stagger to zero —
 * children (via `useDecorativeEntrance`) then fade in together instead of
 * one-by-one. */
export function useStaggerContainer(stagger: number = STAGGER): Variants {
  const reduced = useReducedMotion();
  return {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : stagger } },
  };
}

/** Standard decorative entrance: fade + rise under no-preference. Reduced
 * motion drops the transform entirely and keeps only the opacity fade, so
 * the state change (content has appeared) is still perceptible. */
export function useDecorativeEntrance(): Variants {
  const reduced = useReducedMotion();
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: REDUCED_DURATION.contentAppear } },
    };
  }
  return {
    hidden: { opacity: 0, y: DISTANCE },
    visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_ENTRANCE } },
  };
}

/** Card/tile decorative entrance: fade + rise + a slightly larger scale pop
 * under no-preference — calm, not springy, a plain eased tween. Reduced
 * motion drops the rise and the scale pop, keeping only the opacity fade. */
export function useDecorativeCard(): Variants {
  const reduced = useReducedMotion();
  if (reduced) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: REDUCED_DURATION.contentAppear } },
    };
  }
  return {
    hidden: { opacity: 0, y: DISTANCE, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE_ENTRANCE } },
  };
}

/** Functional nav-pill layout position: always animates, shortened under
 * reduced motion. */
export function useNavPillTransition(): Transition {
  const reduced = useReducedMotion();
  return { duration: reduced ? DURATION.micro : DURATION.base, ease: EASE_ENTRANCE };
}

/** Functional disclosure panel (e.g. the Resume preview pushing content
 * down): a plain CSS `transition: height ...` string, not a Motion
 * `animate` target. Motion's `animate` prop does not apply `height`
 * changes on a plain motion.div in this app (verified directly — even a
 * hardcoded numeric target never gets written to the DOM, while the same
 * pattern works for opacity/scaleX elsewhere in this file), so a
 * height-driven push-down panel goes through a normal CSS transition
 * instead, using the same timing/easing values as every other functional
 * transition here. Always animates — just shortened under reduced motion,
 * never skipped. */
export function useDisclosureTransitionCss(): string {
  const reduced = useReducedMotion();
  const duration = reduced ? DURATION.micro : DURATION.base;
  return `height ${duration}s cubic-bezier(${EASE_ENTRANCE.join(',')})`;
}

/** Functional dropdown/listbox open-close (opacity + a decorative scale
 * pop). The scale is flourish on top of the real state signal — dropped
 * under reduced motion — while the opacity fade (which fully conveys
 * open/closed) always plays, at the same duration in both states. */
export function useDropdownVariants(): Variants {
  const reduced = useReducedMotion();
  return {
    hidden: { opacity: 0, scale: reduced ? 1 : 0.96 },
    visible: { opacity: 1, scale: 1, transition: MICRO_TRANSITION },
    exit: { opacity: 0, scale: reduced ? 1 : 0.96, transition: MICRO_TRANSITION },
  };
}

/** Decorative hover lift (buttons, tiles, links): translate + brightness
 * under no-preference. Reduced motion drops the transform and substitutes
 * an opacity dip so the hover state is still perceptible; duration is
 * always MICRO_TRANSITION in both states. */
export function useHoverLift(y: number = -2, brightness: number = 1.08) {
  const reduced = useReducedMotion();
  return reduced ? { opacity: 0.75 } : { y, filter: `brightness(${brightness})` };
}

/** Scrolling a large distance down the stacked sections page is exactly the
 * "large-area travel" the vestibular-risk bucket cares about, so nav-driven
 * scrolling always goes through this rather than hardcoding 'smooth'. */
export function useScrollBehavior(): ScrollBehavior {
  const reduced = useReducedMotion();
  return reduced ? 'auto' : 'smooth';
}

/** Mount/unmount opacity fade for an overlay-like element (the querying
 * screen, the mobile nav backdrop). Under no-preference the enter/exit
 * durations can differ (matching prior behavior); under reduced motion
 * both use one matched duration so the element can cross-fade cleanly
 * against whatever it's layered over, per the reduced-motion timing table. */
export function useFadeVariants(enterFull: number, exitFull: number, reducedDuration: number): Variants {
  const reduced = useReducedMotion();
  if (reduced) {
    const transition: Transition = { duration: reducedDuration, ease: EASE_LINEAR };
    return { hidden: { opacity: 0 }, visible: { opacity: 1, transition }, exit: { opacity: 0, transition } };
  }
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: enterFull, ease: EASE_LINEAR } },
    exit: { opacity: 0, transition: { duration: exitFull, ease: EASE_LINEAR } },
  };
}
