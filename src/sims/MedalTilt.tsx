import { useRef, type PointerEvent, type ReactNode } from "react";
import { useIsDesktop, useIsWide } from "../hooks/useIsDesktop";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLite } from "../hooks/useFpsGuard";

/**
 * Pointer-driven 3D tilt with a moving glare. Touch devices (≥ 900 px) get a
 * gentle auto-sway instead; nothing on small screens, lite mode or reduced motion.
 */
export default function MedalTilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const wide = useIsWide();
  const reduced = useReducedMotion();
  const lite = useLite();
  const tilt = desktop && !reduced && !lite;
  const sway = !desktop && wide && !reduced && !lite;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    el.classList.add("is-tilting");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("is-tilting");
  };

  return (
    <div
      ref={ref}
      className={`tilt ${tilt ? "tilt--on" : ""} ${sway ? "tilt--sway" : ""} ${className}`}
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? onLeave : undefined}
    >
      <div className="tilt__inner">
        {children}
        {tilt && <span className="tilt__glare" aria-hidden="true" />}
      </div>
    </div>
  );
}
