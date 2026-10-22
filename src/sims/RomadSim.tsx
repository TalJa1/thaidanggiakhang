import { useRef } from "react";
import HudFrame, { ReplayButton } from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { $, attrs, clamp, easeOut, lerp, span } from "../lib/util";
import "./sims.css";

// Schematic only: an invented floor plan. Counters show the published 50+ / 30+ / 100+.

const PATH: [number, number][] = [
  [70, 282],
  [300, 282],
  [300, 206],
  [590, 206],
  [590, 300],
  [880, 300],
  [880, 470],
  [400, 470],
  [400, 400],
];
const SEG = PATH.slice(1).map((p, i) => Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]));
const CUM = SEG.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
const TOTAL = CUM[CUM.length - 1];
const SPEED = 142;
const TRAVEL = TOTAL / SPEED;
const DURATION = TRAVEL + 1.6;
const STATIC_T = DURATION - 0.05;
const LINE = "M" + PATH.map((p) => p.join(" ")).join(" L");

const EXHIBITS = [
  [104, 92, 150, 82],
  [336, 88, 190, 72],
  [628, 92, 220, 92],
  [420, 252, 136, 88],
  [692, 350, 156, 96],
];
const VISITORS: [number, number][] = [
  [452, 176],
  [742, 266],
  [478, 434],
];
const GREETING = "Hello · Xin chào · Bonjour · 你好";
const COUNTERS = [
  { to: 50, label: "navigation trials" },
  { to: 30, label: "participants" },
  { to: 100, label: "AI question-answering tests" },
];

function at(d: number) {
  let i = 0;
  while (i < SEG.length - 1 && d > CUM[i + 1]) i++;
  const k = clamp((d - CUM[i]) / SEG[i]);
  const [x0, y0] = PATH[i];
  const [x1, y1] = PATH[i + 1];
  return { x: lerp(x0, x1, k), y: lerp(y0, y1, k), a: Math.atan2(y1 - y0, x1 - x0) };
}

interface State {
  total: number;
  seen: number[];
  greetAt: number;
  greetPos: [number, number];
  angle: number;
}

function draw(svg: SVGSVGElement, s: State, t: number, dt: number) {
  s.total += dt;
  const d = Math.min(t, TRAVEL) * SPEED;
  const p = at(d);
  // ease the heading through corners
  let diff = p.a - s.angle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  s.angle = dt === 0 ? p.a : s.angle + diff * Math.min(1, dt * 9);
  const deg = (s.angle * 180) / Math.PI;
  const sweep = Math.sin(t * 1.8) * 26;
  attrs($(svg, "robot"), { transform: `translate(${p.x} ${p.y}) rotate(${deg})` });
  attrs($(svg, "cone"), { transform: `rotate(${sweep})` });
  attrs($(svg, "laser"), { opacity: 0.55 + Math.sin(t * 40) * 0.25 });
  attrs($(svg, "done"), { "stroke-dashoffset": 1 - d / TOTAL });

  // visitor recognition: ring pulse + greeting bubble
  if (t < 0.05) {
    s.seen = VISITORS.map(() => -10);
    s.greetAt = -10;
  }
  VISITORS.forEach(([vx, vy], i) => {
    const near = Math.hypot(vx - p.x, vy - p.y) < 96;
    if (near && t - s.seen[i] > 6) {
      s.seen[i] = t;
      s.greetAt = t;
      s.greetPos = [vx, vy];
    }
    const k = span(t - s.seen[i], 0, 1.4);
    const live = t - s.seen[i] < 1.4 && t >= s.seen[i];
    attrs($(svg, `ring${i}`), { r: 12 + k * 46, opacity: live ? (1 - k) * 0.9 : 0 });
    $(svg, `vis${i}`).classList.toggle("is-seen", t - s.seen[i] < 3 && t >= s.seen[i]);
  });
  const since = t - s.greetAt;
  const bubble = $(svg, "bubble");
  if (since >= 0 && since < 3.2) {
    const n = Math.floor(clamp(since / 1.25) * GREETING.length);
    $(svg, "greet").textContent = Array.from(GREETING).slice(0, n).join("") || " ";
    const [gx, gy] = s.greetPos;
    attrs(bubble, { opacity: since > 2.8 ? (3.2 - since) / 0.4 : 1, transform: `translate(${clamp(gx - 40, 20, 640)} ${clamp(gy - 82, 16, 470)})` });
  } else {
    attrs(bubble, { opacity: 0 });
  }

  // one-time counters (absolute clock, not the loop)
  COUNTERS.forEach((c, i) => {
    const k = easeOut(span(s.total, 0.4 + i * 0.25, 2.6 + i * 0.25));
    $(svg, `c${i}`).textContent = `${Math.round(c.to * k)}+`;
  });
}

export default function RomadSim() {
  const svgRef = useRef<SVGSVGElement>(null);
  const state = useRef<State | null>(null);
  const { hostRef, replay, reduced } = useSim(
    (t, dt, _lite, still) => {
      const svg = svgRef.current;
      if (!svg) return;
      if (!state.current) state.current = { total: 0, seen: VISITORS.map(() => -10), greetAt: -10, greetPos: VISITORS[0], angle: 0 };
      const s = state.current;
      if (still) {
        // static frame (reduced motion): end of the path, counters full, last greeting shown
        s.total = 99;
        s.seen = VISITORS.map((_, i) => (i === 2 ? t - 2 : -10));
        s.greetAt = t - 2;
        s.greetPos = VISITORS[2];
      }
      else if (dt === 0 && t === 0) s.total = 0;
      draw(svg, s, t, dt);
    },
    { duration: DURATION, staticT: STATIC_T },
  );

  return (
    <HudFrame label="TRACK · SCAN · SIGNAL" schematic ratio="16 / 9" controls={!reduced && <ReplayButton onClick={replay} />}>
      <div ref={hostRef} className="sim sim--romad" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 960 540">
          <defs>
            <pattern id="rm-floor" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M30 0H0V30" fill="none" stroke="rgba(141,160,188,.07)" />
            </pattern>
          </defs>
          <rect x="40" y="40" width="880" height="470" fill="url(#rm-floor)" />
          <path d="M40 40H420M500 40H920V510H560M480 510H40V320M40 250V40" className="rm-wall" />
          <path d="M640 40V70M240 510V480M920 230H890" className="rm-wall rm-wall--thin" />
          {EXHIBITS.map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx="4" className="rm-exhibit" />
              <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx="2" className="rm-exhibit-in" />
            </g>
          ))}
          <path d={LINE} className="rm-track" />
          <path d={LINE} className="rm-line" />
          <path data-k="done" d={LINE} className="rm-done" pathLength={1} />
          <circle cx={PATH[0][0]} cy={PATH[0][1]} r="6" className="rm-node" />
          <circle cx={PATH[PATH.length - 1][0]} cy={PATH[PATH.length - 1][1]} r="6" className="rm-node rm-node--end" />

          {VISITORS.map(([x, y], i) => (
            <g key={i}>
              <circle data-k={`ring${i}`} cx={x} cy={y} r="12" className="rm-ring" opacity="0" />
              <g data-k={`vis${i}`} className="rm-visitor" transform={`translate(${x} ${y})`}>
                <circle r="9" />
                <circle r="3.5" cy="-1" className="rm-visitor__head" />
              </g>
            </g>
          ))}

          <g data-k="robot">
            <g data-k="cone">
              <path d="M0 0 L120 -46 A124 124 0 0 1 120 46 Z" className="rm-cone" />
            </g>
            <path data-k="laser" d="M16 0 H86" className="rm-laser" />
            <circle r="15" className="rm-robot" />
            <circle r="9" className="rm-robot__core" />
            <path d="M6 -6 L15 0 L6 6" className="rm-robot__nose" />
          </g>

          <g data-k="bubble" opacity="0">
            <rect width="300" height="44" rx="8" className="rm-bubble" />
            <path d="M30 44 L40 56 L50 44" className="rm-bubble" />
            <text data-k="greet" x="16" y="28" className="rm-txt rm-txt--greet">
              {" "}
            </text>
          </g>

          <g transform="translate(54 360)" className="rm-counters">
            <rect width="310" height="128" rx="6" className="rm-panel" />
            {COUNTERS.map((c, i) => (
              <g key={c.label} transform={`translate(14 ${30 + i * 36})`}>
                <text data-k={`c${i}`} className="rm-txt rm-txt--num">
                  0+
                </text>
                <text x="64" y="-2" className="rm-txt rm-txt--s">
                  {c.label}
                </text>
              </g>
            ))}
          </g>
          <text x="60" y="30" className="rm-txt rm-txt--s">
            TRACK · SCAN
          </text>
        </svg>
      </div>
    </HudFrame>
  );
}
