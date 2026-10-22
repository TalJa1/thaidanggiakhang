import { useEffect } from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLite } from "../hooks/useFpsGuard";

const SELECTOR = ".btn, .magnetic";
const STRENGTH = 0.28;
const MAX = 10;

/** Desktop only: buttons ease toward the pointer. */
export default function Magnetic() {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const lite = useLite();
  const enabled = desktop && !reduced && !lite;

  useEffect(() => {
    if (!enabled) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement) => {
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(SELECTOR) ?? null;
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - (r.left + r.width / 2)) * STRENGTH));
      const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - (r.top + r.height / 2)) * STRENGTH));
      el.style.setProperty("--mx", `${dx.toFixed(1)}px`);
      el.style.setProperty("--my", `${dy.toFixed(1)}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (current) reset(current);
    };
  }, [enabled]);

  return null;
}
