// Lenis smooth scrolling (skipped under reduced motion) + scroll helpers that
// work with or without it.

import Lenis from "lenis";
import { subscribeRaf } from "./raf";

let lenis: Lenis | null = null;
let stopRaf: (() => void) | null = null;

export const HEADER_OFFSET = 84;

// ScrollTrigger reads native scroll events (Lenis scrolls the window), so it
// only needs a refresh after route changes; lib/gsap.ts registers it lazily.
let refresher: (() => void) | null = null;
export function setScrollRefresher(fn: () => void) {
  refresher = fn;
}
export function refreshScrollTriggers() {
  refresher?.();
}

export function startSmoothScroll() {
  if (lenis) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.11, smoothWheel: true, anchors: false });
  stopRaf = subscribeRaf((_dt, now) => lenis?.raf(now));
}

export function stopSmoothScroll() {
  stopRaf?.();
  stopRaf = null;
  lenis?.destroy();
  lenis = null;
}

/** Pause/resume page scrolling (menus, dialogs). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-scroll-locked", locked);
}

export function scrollToElement(el: Element, opts: { immediate?: boolean } = {}) {
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  scrollToY(top, opts);
}

export function scrollToY(y: number, { immediate = false }: { immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(y, { immediate, force: true, duration: immediate ? 0 : 1.1 });
  } else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: immediate || reduced ? "auto" : "smooth" });
  }
}

export function scrollToId(id: string, opts?: { immediate?: boolean }) {
  const el = document.getElementById(id);
  if (el) scrollToElement(el, opts);
  return !!el;
}
