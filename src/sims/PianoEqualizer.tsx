import { useRef } from "react";
import HudFrame from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { $, attrs } from "../lib/util";
import "./sims.css";

// Visual only: no audio is ever created or played.
const WHITE = 14;
const KW = 600 / WHITE;
const BLACK_AFTER = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12]; // white index each black key follows
const STEP = 0.3;
// [white keys..., black keys as 100 + index]
const MELODY: number[][] = [
  [0, 4],
  [2],
  [4, 7],
  [102],
  [7, 11],
  [9],
  [7, 4],
  [104],
  [5, 9],
  [7],
  [9, 12],
  [107],
  [11, 7],
  [9],
  [7, 4],
  [2],
];
const DURATION = MELODY.length * STEP;
const BARS = 28;

export default function PianoEqualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hostRef } = useSim(
    (t) => {
      const svg = svgRef.current;
      if (!svg) return;
      const step = Math.floor(t / STEP) % MELODY.length;
      const local = (t % STEP) / STEP;
      const pressed = new Set(MELODY[step]);
      for (let i = 0; i < WHITE; i++) $(svg, `w${i}`).classList.toggle("is-down", pressed.has(i) && local < 0.85);
      BLACK_AFTER.forEach((_, i) => $(svg, `b${i}`).classList.toggle("is-down", pressed.has(100 + i) && local < 0.85));

      const energy = 1 - local * 0.6;
      const centers = MELODY[step].map((k) => (k >= 100 ? BLACK_AFTER[k - 100] + 1 : k + 0.5) / WHITE);
      for (let b = 0; b < BARS; b++) {
        const x = (b + 0.5) / BARS;
        let h = 0.12 + 0.08 * Math.sin(t * 3 + b * 0.9) + 0.06 * Math.sin(t * 7.3 + b * 2.1);
        centers.forEach((c) => {
          h += Math.exp(-((x - c) ** 2) / 0.006) * 0.7 * energy;
        });
        h = Math.min(1, Math.max(0.04, h));
        attrs($(svg, `eq${b}`), { y: 196 - h * 160, height: h * 160 });
      }
    },
    { duration: DURATION, staticT: STEP * 2.3 },
  );

  return (
    <HudFrame label="SIGNAL · REC" schematic tone="cyan">
      <div ref={hostRef} className="sim sim--piano" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 600 380">
          <path d="M0 196H600" className="pe-axis" />
          {[56, 96, 136].map((y) => (
            <path key={y} d={`M0 ${y}H600`} className="pe-grid" />
          ))}
          {Array.from({ length: BARS }, (_, b) => (
            <rect key={b} data-k={`eq${b}`} x={b * (600 / BARS) + 4} y="180" width={600 / BARS - 8} height="16" rx="2" className="pe-bar" />
          ))}
          <g transform="translate(0 222)">
            {Array.from({ length: WHITE }, (_, i) => (
              <rect key={i} data-k={`w${i}`} x={i * KW + 1} y="0" width={KW - 2} height="150" rx="4" className="pe-white" />
            ))}
            {BLACK_AFTER.map((w, i) => (
              <rect key={i} data-k={`b${i}`} x={(w + 1) * KW - KW * 0.3} y="0" width={KW * 0.6} height="92" rx="3" className="pe-black" />
            ))}
          </g>
        </svg>
      </div>
    </HudFrame>
  );
}
