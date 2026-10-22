import { useEffect, useMemo, useRef } from "react";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLite } from "../hooks/useFpsGuard";
import { useRaf } from "../hooks/useRaf";
import { $, attrs } from "../lib/util";

// Closed GPS-style loop around the airframe (param 0..1).
function loopPoint(u: number) {
  const a = u * Math.PI * 2;
  return {
    x: Math.cos(a) * 196 + Math.sin(a * 2) * 14,
    y: Math.sin(a) * 132 + Math.sin(a * 3) * 12 + 18,
  };
}

const WAYPOINTS = [0.08, 0.32, 0.58, 0.82];
const ARMS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
] as const;
const ARM = 104;

/** Wireframe top-down quadcopter: draws itself, spins up, hovers on a GPS loop. */
export default function QuadcopterWire() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(hostRef);
  const reduced = useReducedMotion();
  const lite = useLite();
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const time = useRef(0);

  const loopPath = useMemo(() => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const p = loopPoint(i / 120);
      d += `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    return d + "Z";
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useRaf(
    (dt) => {
      const svg = svgRef.current;
      if (!svg) return;
      time.current += dt;
      const t = time.current;
      const p = pointer.current;
      p.sx += (p.x - p.sx) * Math.min(1, dt * 3);
      p.sy += (p.y - p.sy) * Math.min(1, dt * 3);
      const float = Math.sin(t * 1.3) * 7;
      attrs($(svg, "body"), {
        transform: `translate(${p.sx * 14} ${p.sy * 10 + float}) rotate(${p.sx * 4 + Math.sin(t * 0.7) * 1.5})`,
      });
      attrs($(svg, "shadow"), { transform: `translate(${p.sx * 6} ${p.sy * 4 + 24}) scale(${1 - float / 120})` });
      // tracer on the loop
      const u = (t * 0.045) % 1;
      const q = loopPoint(u);
      attrs($(svg, "tracer"), { transform: `translate(${q.x} ${q.y})` });
      WAYPOINTS.forEach((w, i) => {
        const d = Math.abs(((u - w + 1.5) % 1) - 0.5);
        $(svg, `wp${i}`).classList.toggle("is-near", d < 0.06);
      });
    },
    inView && !reduced && !lite,
  );

  return (
    <div ref={hostRef} className={`quad ${inView ? "is-play" : ""}`} aria-hidden="true">
      <svg ref={svgRef} viewBox="-240 -210 480 440">
        <path className="quad__loop" d={loopPath} />
        {WAYPOINTS.map((w, i) => {
          const p = loopPoint(w);
          return (
            <g key={w} data-k={`wp${i}`} className="quad__wp" transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" />
              <circle r="12" className="quad__wp-ring" />
            </g>
          );
        })}
        <g data-k="tracer" className="quad__tracer">
          <circle r="4" />
          <circle r="9" className="quad__tracer-halo" />
        </g>
        <text className="quad__lbl" x="-196" y="-150">
          GPS · WAYPOINT
        </text>
        <text className="quad__lbl" x="120" y="196">
          TRACK
        </text>

        <ellipse data-k="shadow" className="quad__shadow" cx="0" cy="0" rx="120" ry="42" />

        <g data-k="body">
          {ARMS.map(([sx, sy], i) => (
            <g key={i}>
              <circle className="quad__draw quad__guard" cx={sx * ARM} cy={sy * ARM} r="58" pathLength={1} style={{ animationDelay: `${0.5 + i * 0.08}s` }} />
              <path
                className="quad__draw"
                d={`M${sx * 26} ${sy * 18} L${sx * ARM - sx * 16} ${sy * ARM - sy * 14}`}
                pathLength={1}
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
              />
              <path
                className="quad__draw"
                d={`M${sx * 18} ${sy * 26} L${sx * ARM - sx * 14} ${sy * ARM - sy * 16}`}
                pathLength={1}
                style={{ animationDelay: `${0.15 + i * 0.06}s` }}
              />
              <circle className="quad__draw quad__motor" cx={sx * ARM} cy={sy * ARM} r="17" pathLength={1} style={{ animationDelay: `${0.35 + i * 0.06}s` }} />
              <g transform={`translate(${sx * ARM} ${sy * ARM})`}>
                <g className={`quad__rotor ${i % 2 ? "quad__rotor--ccw" : ""}`}>
                  <path d="M-50 -3 C-26 -9 -10 -4 0 0 C10 4 26 9 50 3" />
                  <path d="M-3 50 C-9 26 -4 10 0 0 C4 -10 9 -26 3 -50" opacity=".55" />
                  <circle r="4" className="quad__hub" />
                </g>
              </g>
            </g>
          ))}
          <rect className="quad__draw quad__frame" x="-40" y="-34" width="80" height="68" rx="12" pathLength={1} />
          <rect className="quad__draw" x="-24" y="-20" width="48" height="40" rx="5" pathLength={1} style={{ animationDelay: ".2s" }} />
          <circle className="quad__draw quad__gps" cx="0" cy="0" r="9" pathLength={1} style={{ animationDelay: ".4s" }} />
          <path className="quad__draw quad__nose" d="M-8 -44 L0 -56 L8 -44" pathLength={1} style={{ animationDelay: ".6s" }} />
          <circle className="quad__led" cx="-30" cy="26" r="2.5" />
          <circle className="quad__led quad__led--b" cx="30" cy="26" r="2.5" />
        </g>
      </svg>
    </div>
  );
}
