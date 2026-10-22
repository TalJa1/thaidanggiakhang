import { useRef } from "react";
import { useInView } from "../hooks/useInView";

// Traces are normalised with pathLength=1000 so dash maths needs no measuring.
const MAIN = "M0 60 H300 L330 30 H560 L590 60 H860 L890 90 H1120 L1150 60 H1440";
const BRANCHES = ["M330 30 V12 H420", "M590 60 V96 H660", "M890 90 V108 H980", "M1150 60 V24 H1240"];
const VIAS: [number, number][] = [
  [420, 12],
  [660, 96],
  [980, 108],
  [1240, 24],
  [300, 60],
  [860, 60],
];

export default function CircuitDivider({ flip = false }: { flip?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { rootMargin: "0px 0px -10% 0px" });
  return (
    <div ref={ref} className={`circuit ${on ? "is-on" : ""} ${flip ? "circuit--flip" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="xMidYMid slice">
        <path className="circuit__base" d={MAIN} pathLength={1000} />
        {BRANCHES.map((d, i) => (
          <path key={d} className="circuit__trace" d={d} pathLength={1000} style={{ transitionDelay: `${300 + i * 120}ms` }} />
        ))}
        <path className="circuit__trace circuit__trace--main" d={MAIN} pathLength={1000} />
        <path className="circuit__pulse" d={MAIN} pathLength={1000} />
        {VIAS.map(([x, y], i) => (
          <g key={i} className="circuit__via" style={{ transitionDelay: `${600 + i * 90}ms` }}>
            <circle cx={x} cy={y} r="5" />
            <circle cx={x} cy={y} r="1.8" className="circuit__via-core" />
          </g>
        ))}
        <rect className="circuit__chip" x="700" y="44" width="56" height="32" rx="3" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} className="circuit__pin" d={`M${710 + i * 12} 44 v-6 M${710 + i * 12} 76 v6`} />
        ))}
      </svg>
    </div>
  );
}
