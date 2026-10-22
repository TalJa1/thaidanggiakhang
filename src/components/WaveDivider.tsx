import { useRef } from "react";
import { useInView } from "../hooks/useInView";

/** Periodic wave over [0, 2880] so a -1440 translate loops seamlessly. */
function wave(amp: number, y: number, wl: number, phase = 0) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 2880; x += 40) {
    d += ` L${x} ${(y + Math.sin(((x + phase) / wl) * Math.PI * 2) * amp).toFixed(1)}`;
  }
  return d;
}

const LAYERS = [
  { d: wave(8, 34, 360, 0), cls: "wave__l1" },
  { d: wave(6, 44, 480, 120), cls: "wave__l2" },
  { d: wave(4, 54, 720, 300), cls: "wave__l3" },
];

export default function WaveDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref);
  return (
    <div ref={ref} className={`wave ${on ? "is-on" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        {LAYERS.map((l) => (
          <path key={l.cls} className={`wave__line ${l.cls}`} d={l.d} />
        ))}
      </svg>
    </div>
  );
}
