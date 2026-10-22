import { useCallback, useLayoutEffect, useRef } from "react";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";
import { useLite } from "./useFpsGuard";
import { useRaf } from "./useRaf";

/** `still` is true for the static final frame drawn under reduced motion. */
export type SimFrame = (t: number, dt: number, lite: boolean, still: boolean) => void;

interface SimOptions {
  /** Timeline length in seconds. */
  duration: number;
  loop?: boolean;
  /** Time drawn as the static final frame under reduced motion. */
  staticT?: number;
}

/**
 * Clock for a simulation: runs only while the host is in view, pauses when it
 * leaves, draws a static frame under reduced motion and halves the frame rate
 * in lite mode. `frame` does the drawing imperatively (no React re-render).
 */
export function useSim(frame: SimFrame, { duration, loop = true, staticT }: SimOptions) {
  const hostRef = useRef<HTMLDivElement>(null);
  const inView = useInView(hostRef, { threshold: 0.08 });
  const reduced = useReducedMotion();
  const lite = useLite();
  const frameRef = useRef(frame);
  const time = useRef(0);
  const acc = useRef(0);

  useLayoutEffect(() => {
    frameRef.current = frame;
  });

  useLayoutEffect(() => {
    if (reduced) frameRef.current(staticT ?? duration, 0, lite, true);
    else frameRef.current(time.current, 0, lite, false);
  }, [reduced, lite, staticT, duration]);

  useRaf(
    (dt) => {
      acc.current += dt;
      if (lite && acc.current < 1 / 30) return;
      const step = acc.current;
      acc.current = 0;
      let next = time.current + step;
      if (next >= duration) next = loop ? next % duration : duration;
      time.current = next;
      frameRef.current(next, step, lite, false);
    },
    inView && !reduced,
  );

  const replay = useCallback(() => {
    time.current = 0;
    frameRef.current(0, 0, false, false);
  }, []);

  return { hostRef, replay, reduced, inView, lite };
}
