// Frame-rate guard + lite mode store.
// Lite mode turns off background loops, scanlines, cursor effects and tilt,
// and asks the simulations to draw with less fidelity.
//
// Manual switch: add ?lite=1 (force on) or ?lite=0 (never auto-enable) to the
// URL. The choice is remembered for the browser session.

import { subscribeRaf } from "./raf";

type Listener = () => void;
const listeners = new Set<Listener>();

let lite = false;
let fps = 60;
let autoAllowed = true;

function emit() {
  listeners.forEach((l) => l());
}

export function setLite(value: boolean) {
  if (lite === value) return;
  lite = value;
  if (value) document.documentElement.dataset.lite = "true";
  else delete document.documentElement.dataset.lite;
  emit();
}

export function isLite() {
  return lite;
}

export function getFps() {
  return fps;
}

export function subscribePerf(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const SLOW_FRAME_MS = 24;
const SLOW_FOR_MS = 2000;
const WARMUP_MS = 2500;

let started = false;

/** Starts measuring frame times (idempotent). */
export function startFpsGuard() {
  if (started) return;
  started = true;

  try {
    const param = new URLSearchParams(window.location.search).get("lite");
    if (param === "1" || param === "0") sessionStorage.setItem("gk-lite", param);
    const stored = sessionStorage.getItem("gk-lite");
    if (stored === "1") setLite(true);
    if (stored === "0") autoAllowed = false;
  } catch {
    /* storage unavailable: keep defaults */
  }

  const startAt = performance.now();
  let avg = 16.7;
  let slowSince = 0;
  let frames = 0;
  let windowStart = startAt;

  subscribeRaf((dt, now) => {
    const ms = dt * 1000;
    frames++;
    if (now - windowStart >= 500) {
      fps = Math.round((frames * 1000) / (now - windowStart));
      frames = 0;
      windowStart = now;
      emit();
    }
    // ignore huge gaps (tab switches, debugger) and the warm-up period
    if (ms > 90 || now - startAt < WARMUP_MS || lite || !autoAllowed) return;
    avg = avg * 0.9 + ms * 0.1;
    if (avg > SLOW_FRAME_MS) {
      if (!slowSince) slowSince = now;
      else if (now - slowSince > SLOW_FOR_MS) setLite(true);
    } else {
      slowSince = 0;
    }
  });
}
