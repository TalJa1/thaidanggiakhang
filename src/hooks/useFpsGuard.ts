import { useEffect, useSyncExternalStore } from "react";
import { getFps, isLite, startFpsGuard, subscribePerf } from "../lib/perf";

/** Starts the frame-time guard that flips <html data-lite="true"> on slow devices. */
export function useFpsGuard() {
  useEffect(() => {
    startFpsGuard();
  }, []);
}

export function useLite() {
  return useSyncExternalStore(subscribePerf, isLite, () => false);
}

export function useFps() {
  return useSyncExternalStore(subscribePerf, getFps, () => 60);
}
