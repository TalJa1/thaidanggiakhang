import { useRef } from "react";
import HudFrame from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { useIsWide } from "../hooks/useIsDesktop";
import { $, attrs, seeded, span } from "../lib/util";
import "./sims.css";

// Exactly 23 nodes (the 23 volunteers in the text) around one central node.
const COUNT = 23;
const CX = 300;
const CY = 200;
const NODES = Array.from({ length: COUNT }, (_, i) => {
  const inner = i < 9;
  const k = inner ? i / 9 : (i - 9) / 14;
  const a = k * Math.PI * 2 + (inner ? 0.2 : 0);
  const r = inner ? 98 : 168;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r * 0.8, ph: i * 0.7 };
});
const LINKS = Array.from({ length: 14 }, (_, i) => [9 + i, 9 + ((i + 1) % 14)] as const);
const DURATION = 12;
const rnd = seeded(3);
const PULSES = Array.from({ length: 36 }, (_, i) => ({ node: Math.floor(rnd() * COUNT), at: (i / 36) * DURATION, out: rnd() > 0.35 }));

export default function VolunteerGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const wide = useIsWide();
  const pool = wide ? 8 : 4;

  const { hostRef } = useSim(
    (t, _dt, lite) => {
      const svg = svgRef.current;
      if (!svg) return;
      const pos = NODES.map((n) => ({ x: n.x + Math.sin(t * 0.8 + n.ph) * 4, y: n.y + Math.cos(t * 0.7 + n.ph) * 3 }));
      pos.forEach((p, i) => {
        attrs($(svg, `n${i}`), { transform: `translate(${p.x} ${p.y})` });
        attrs($(svg, `l${i}`), { x2: p.x, y2: p.y });
      });
      LINKS.forEach(([a, b], i) => attrs($(svg, `m${i}`), { x1: pos[a].x, y1: pos[a].y, x2: pos[b].x, y2: pos[b].y }));

      // pulses travelling along the edges (fixed pool of elements)
      const active = PULSES.filter((p) => {
        const k = (t - p.at + DURATION) % DURATION;
        return k < 1.2;
      }).slice(0, lite ? Math.min(3, pool) : pool);
      const hits = new Set<number>();
      for (let i = 0; i < 8; i++) {
        const el = $(svg, `p${i}`);
        const p = active[i];
        if (!p) {
          attrs(el, { opacity: 0 });
          continue;
        }
        const k = span((t - p.at + DURATION) % DURATION, 0, 1.1);
        const f = p.out ? k : 1 - k;
        const n = pos[p.node];
        attrs(el, { cx: CX + (n.x - CX) * f, cy: CY + (n.y - CY) * f, opacity: Math.sin(k * Math.PI) });
        if ((p.out && k > 0.92) || (!p.out && k < 0.1)) hits.add(p.node);
      }
      NODES.forEach((_, i) => $(svg, `n${i}`).classList.toggle("is-hit", hits.has(i)));
      attrs($(svg, "core"), { r: 26 + Math.sin(t * 2.2) * 2 });
    },
    { duration: DURATION, staticT: 3.3 },
  );

  return (
    <HudFrame label="SIGNAL · TRACK" schematic tone="cyan">
      <div ref={hostRef} className="sim sim--graph" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 600 400">
          <circle cx={CX} cy={CY} r="98" className="vg-orbit" />
          <ellipse cx={CX} cy={CY} rx="168" ry="134" className="vg-orbit" />
          {LINKS.map((_, i) => (
            <line key={i} data-k={`m${i}`} className="vg-mesh" />
          ))}
          {NODES.map((n, i) => (
            <line key={i} data-k={`l${i}`} x1={CX} y1={CY} x2={n.x} y2={n.y} className="vg-edge" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} data-k={`p${i}`} r="3.4" className="vg-pulse" opacity="0" />
          ))}
          {NODES.map((n, i) => (
            <g key={i} data-k={`n${i}`} className="vg-node" transform={`translate(${n.x} ${n.y})`}>
              <circle r="9" />
              <circle r="3" className="vg-node__core" />
            </g>
          ))}
          <circle data-k="core" cx={CX} cy={CY} r="26" className="vg-core" />
          <text x={CX} y={CY + 7} textAnchor="middle" className="vg-txt">
            23
          </text>
        </svg>
      </div>
    </HudFrame>
  );
}
