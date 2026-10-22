// Small helpers shared by the simulations.

/** Deterministic PRNG (mulberry32) so geometry is stable between renders. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0..1 progress of t inside [a, b]. */
export const span = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const cache = new WeakMap<Element, Map<string, Element>>();
const dummy = typeof document !== "undefined" ? document.createElementNS("http://www.w3.org/2000/svg", "g") : null;

/** Cached lookup of `[data-k="key"]` inside a root element. */
export function $<T extends Element = SVGElement>(root: Element, key: string): T {
  let map = cache.get(root);
  if (!map) {
    map = new Map();
    cache.set(root, map);
  }
  let el = map.get(key);
  if (!el || !el.isConnected) {
    el = root.querySelector(`[data-k="${key}"]`) ?? undefined;
    if (el) map.set(key, el);
  }
  return (el ?? dummy) as T;
}

/** Set several attributes at once (numbers are rounded to 2 decimals). */
export function attrs(el: Element, values: Record<string, string | number>) {
  for (const k in values) {
    const v = values[k];
    el.setAttribute(k, typeof v === "number" ? String(Math.round(v * 100) / 100) : v);
  }
}

export const pad = (n: number, len = 2) => String(Math.max(0, Math.floor(n))).padStart(len, "0");
