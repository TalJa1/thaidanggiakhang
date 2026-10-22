import { useMedia } from "./useMedia";

/** Wide screen with a precise pointer (custom cursor, tilt, magnetic buttons). */
export function useIsDesktop() {
  return useMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
}

/** Wide screen regardless of input type. */
export function useIsWide() {
  return useMedia("(min-width: 900px)", true);
}
