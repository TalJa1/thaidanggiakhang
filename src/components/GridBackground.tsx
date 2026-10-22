import { useRef } from "react";
import { useRaf } from "../hooks/useRaf";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLite } from "../hooks/useFpsGuard";

/** Fixed blueprint grid + glow + noise + scanlines + vignette, with slow scroll parallax. */
export default function GridBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const lite = useLite();
  const last = useRef(-1);

  useRaf(() => {
    const y = window.scrollY;
    if (y === last.current || !gridRef.current) return;
    last.current = y;
    // major cell is 120px: wrap so the transform stays small
    gridRef.current.style.transform = `translate3d(0, ${-((y * 0.12) % 120)}px, 0)`;
  }, !reduced && !lite);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__glow" />
      <div className="bg__grid" ref={gridRef} />
      <div className="bg__noise" />
      <div className="bg__scan" />
      <div className="bg__vignette" />
    </div>
  );
}
