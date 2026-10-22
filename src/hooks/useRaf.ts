import { useEffect, useLayoutEffect, useRef } from "react";
import { subscribeRaf, type FrameCallback } from "../lib/raf";

/** Run `cb` on the shared animation loop while `active` is true. */
export function useRaf(cb: FrameCallback, active = true) {
  const ref = useRef(cb);
  useLayoutEffect(() => {
    ref.current = cb;
  });
  useEffect(() => {
    if (!active) return;
    return subscribeRaf((dt, now) => ref.current(dt, now));
  }, [active]);
}
