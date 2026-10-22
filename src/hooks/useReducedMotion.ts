import { useMedia } from "./useMedia";

export function useReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)");
}
