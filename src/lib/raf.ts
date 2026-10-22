// One shared requestAnimationFrame loop for the whole site.
// Subscribers get (dt seconds, now ms). The loop sleeps when nobody listens
// and while the tab is hidden.

export type FrameCallback = (dt: number, now: number) => void;

const subscribers = new Set<FrameCallback>();
let frameId = 0;
let last = 0;

function tick(now: number) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  subscribers.forEach((cb) => {
    try {
      cb(dt, now);
    } catch (err) {
      // a broken animation must never take the page down
      subscribers.delete(cb);
      console.warn("[raf] subscriber removed after error", err);
    }
  });
  frameId = subscribers.size > 0 && !document.hidden ? requestAnimationFrame(tick) : 0;
}

function ensureRunning() {
  if (frameId || subscribers.size === 0 || document.hidden) return;
  last = performance.now();
  frameId = requestAnimationFrame(tick);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    } else {
      ensureRunning();
    }
  });
}

export function subscribeRaf(cb: FrameCallback): () => void {
  subscribers.add(cb);
  ensureRunning();
  return () => {
    subscribers.delete(cb);
  };
}
