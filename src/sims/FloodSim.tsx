import { useRef } from "react";
import HudFrame, { ReplayButton } from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { $, attrs, seeded } from "../lib/util";
import "./sims.css";

// Schematic only: a scripted tide, not sensor data. Four unlabelled tier
// bands, a noisy raw line against a filtered line, and the published ±0.2 cm.

const DURATION = 14;
const STATIC_T = 4.2;

const GX = 92;
const GW = 60;
const TOP = 70;
const BOTTOM = 470;
const H = BOTTOM - TOP;
const TIERS = [0.34, 0.54, 0.7, 0.84];
const TIER_COLORS = ["#22D3EE", "#FFB020", "#FF6B1A", "#FF3B5C"];

const PX0 = 292;
const PX1 = 910;
const PY0 = 92;
const PY1 = 238;
const N = 128;
const SAMPLE = 1 / 20;

const level = (t: number) => 0.5 + 0.38 * Math.sin((2 * Math.PI * t) / DURATION - Math.PI / 2) + 0.035 * Math.sin((2 * Math.PI * t) / 3.5);
const yOf = (v: number) => BOTTOM - v * H;
const sy = (v: number) => PY1 - v * (PY1 - PY0);

interface State {
  raw: number[];
  filt: number[];
  acc: number;
  tier: number;
  alertAt: number;
  rand: () => number;
}

function tierOf(v: number) {
  let k = 0;
  TIERS.forEach((th, i) => {
    if (v >= th) k = i + 1;
  });
  return k;
}

function initState(t: number): State {
  const rand = seeded(11);
  const raw: number[] = [];
  const filt: number[] = [];
  let f = level(t - N * SAMPLE);
  for (let i = 0; i < N; i++) {
    const v = level(t - (N - i) * SAMPLE) + (rand() - 0.5) * 0.09 + (rand() > 0.94 ? (rand() - 0.5) * 0.25 : 0);
    f += (v - f) * 0.14;
    raw.push(v);
    filt.push(f);
  }
  return { raw, filt, acc: 0, tier: tierOf(level(t)), alertAt: -10, rand };
}

function line(values: number[]) {
  const dx = (PX1 - PX0) / (N - 1);
  let d = "";
  values.forEach((v, i) => {
    d += `${i ? "L" : "M"}${(PX0 + i * dx).toFixed(1)} ${sy(Math.min(1, Math.max(0, v))).toFixed(1)}`;
  });
  return d;
}

function draw(svg: SVGSVGElement, s: State, t: number, dt: number) {
  const L = level(t);
  const y = yOf(L);

  // stream new samples
  s.acc += dt;
  while (s.acc >= SAMPLE) {
    s.acc -= SAMPLE;
    const v = L + (s.rand() - 0.5) * 0.09 + (s.rand() > 0.94 ? (s.rand() - 0.5) * 0.25 : 0);
    const f = s.filt[s.filt.length - 1] + (v - s.filt[s.filt.length - 1]) * 0.14;
    s.raw.push(v);
    s.filt.push(f);
    s.raw.shift();
    s.filt.shift();
  }
  attrs($(svg, "raw"), { d: line(s.raw) });
  attrs($(svg, "filt"), { d: line(s.filt) });
  attrs($(svg, "head"), { cy: sy(s.filt[s.filt.length - 1]) });

  // water column with a moving surface
  let wd = `M${GX} ${y}`;
  for (let x = 0; x <= GW; x += 6) wd += ` L${GX + x} ${(y + Math.sin(x / 9 + t * 4) * 2.4).toFixed(1)}`;
  attrs($(svg, "water"), { d: `${wd} L${GX + GW} ${BOTTOM} L${GX} ${BOTTOM} Z` });
  attrs($(svg, "surface"), { d: wd });

  // tiers + ALERT on each upward crossing
  const tier = tierOf(L);
  if (tier > s.tier && dt > 0) s.alertAt = t;
  s.tier = tier;
  TIERS.forEach((_, i) => $(svg, `tier${i}`).classList.toggle("is-on", tier > i));
  const since = t - s.alertAt;
  const alert = since >= 0 && since < 1.8;
  attrs($(svg, "alert"), { opacity: alert ? 0.55 + 0.45 * Math.sin(since * 16) : 0 });
  attrs($(svg, "pin"), { fill: tier ? TIER_COLORS[tier - 1] : "#8DA0BC" });

  // ±0.2 cm tolerance bracket rides on the surface
  attrs($(svg, "tol"), { transform: `translate(0 ${y})` });

  // sun on its arc, LEDs
  const a = Math.PI * (1 - ((t / DURATION) % 1));
  attrs($(svg, "sun"), { transform: `translate(${369 + Math.cos(a) * 84} ${452 - Math.sin(a) * 84})` });
  attrs($(svg, "rays"), { transform: `rotate(${(t * 40) % 360})` });
  [5.2, 3.1, 8.3].forEach((k, i) => attrs($(svg, `led${i}`), { opacity: Math.sin(t * k + i) > 0 ? 1 : 0.18 }));
}

export default function FloodSim() {
  const svgRef = useRef<SVGSVGElement>(null);
  const state = useRef<State | null>(null);
  const { hostRef, replay, reduced } = useSim(
    (t, dt) => {
      const svg = svgRef.current;
      if (!svg) return;
      if (!state.current) state.current = initState(t);
      draw(svg, state.current, t, dt);
    },
    { duration: DURATION, staticT: STATIC_T },
  );

  const ticks = Array.from({ length: 41 }, (_, i) => i);

  return (
    <HudFrame label="SIGNAL · ESP32 · ALERT" schematic ratio="16 / 9" controls={!reduced && <ReplayButton onClick={replay} />}>
      <div ref={hostRef} className="sim sim--flood" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 960 540">
          {/* gauge */}
          <rect x={GX - 6} y={TOP - 6} width={GW + 12} height={H + 12} rx="10" className="fs-tube" />
          <clipPath id="fs-tube-clip">
            <rect x={GX} y={TOP} width={GW} height={H} rx="6" />
          </clipPath>
          <g clipPath="url(#fs-tube-clip)">
            <rect x={GX} y={TOP} width={GW} height={H} className="fs-tube-bg" />
            <path data-k="water" className="fs-water" />
            <path data-k="surface" className="fs-surface" />
            {TIERS.map((th) => (
              <path key={th} d={`M${GX} ${yOf(th)}H${GX + GW}`} className="fs-th" />
            ))}
          </g>
          {TIERS.map((th, i) => {
            const top = i === TIERS.length - 1 ? 1 : TIERS[i + 1];
            return (
              <rect
                key={th}
                data-k={`tier${i}`}
                className="fs-band"
                x={GX + GW + 12}
                y={yOf(top)}
                width="10"
                height={yOf(th) - yOf(top) - 3}
                rx="2"
                style={{ fill: TIER_COLORS[i] }}
              />
            );
          })}
          {ticks.map((i) => (
            <path key={i} d={`M${GX - 12 - (i % 5 === 0 ? 10 : 4)} ${BOTTOM - i * 10}H${GX - 12}`} className={i % 5 === 0 ? "fs-tick fs-tick--major" : "fs-tick"} />
          ))}
          <g data-k="tol">
            <path d={`M${GX - 30} -7H${GX + GW + 34} M${GX - 30} 7H${GX + GW + 34}`} className="fs-tol" />
            <path d={`M${GX + GW + 30} -7V7`} className="fs-tol fs-tol--v" />
            <text x={GX + GW + 40} y="5" className="fs-txt fs-txt--tol">
              ±0.2 cm
            </text>
          </g>
          <g data-k="alert" opacity="0">
            <rect x={GX - 26} y="22" width="112" height="30" rx="4" className="fs-alert" />
            <text x={GX + 30} y="42" textAnchor="middle" className="fs-txt fs-txt--alert">
              ALERT
            </text>
          </g>

          {/* streaming sparkline */}
          <rect x="272" y="62" width="656" height="200" rx="6" className="fs-panel" />
          <text x="292" y="84" className="fs-txt">
            SIGNAL
          </text>
          <g className="fs-legend" transform="translate(760 78)">
            <path d="M0 0H18" className="fs-raw" />
            <path d="M70 0H88" className="fs-filt" />
          </g>
          {TIERS.map((th, i) => (
            <path key={th} d={`M${PX0} ${sy(th)}H${PX1}`} className="fs-grid" style={{ stroke: TIER_COLORS[i] }} />
          ))}
          <path data-k="raw" className="fs-raw" />
          <path data-k="filt" className="fs-filt" />
          <circle data-k="head" cx={PX1} cy={PY1} r="4.5" className="fs-head" />

          {/* solar */}
          <rect x="272" y="290" width="194" height="214" rx="6" className="fs-panel" />
          <path d="M285 452 A84 84 0 0 1 453 452" className="fs-arc" />
          <g data-k="sun">
            <circle r="11" className="fs-sun" />
            <g data-k="rays">
              {Array.from({ length: 8 }, (_, i) => (
                <path key={i} d="M0 -17V-23" transform={`rotate(${i * 45})`} className="fs-ray" />
              ))}
            </g>
          </g>
          <g transform="translate(306 462)">
            <path d="M8 0H126L118 30H0Z" className="fs-solar" />
            <path d="M38 0L32 30M68 0L63 30M98 0L94 30M4 15H122" className="fs-solar-grid" />
          </g>

          {/* ESP32 */}
          <rect x="482" y="290" width="214" height="214" rx="6" className="fs-panel" />
          <g transform="translate(529 352)">
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${12 + i * 16} -10V0M${12 + i * 16} 84V94`} className="fs-pin" />
            ))}
            <rect width="120" height="84" rx="6" className="fs-chip" />
            <rect x="14" y="14" width="44" height="30" rx="2" className="fs-chip-inner" />
            <text x="60" y="68" textAnchor="middle" className="fs-txt fs-txt--chip">
              ESP32
            </text>
            <path d="M96 12 h10 v6 h-6 v6 h6 v6" className="fs-ant" />
          </g>
          {[0, 1, 2].map((i) => (
            <circle key={i} data-k={`led${i}`} cx={560 + i * 26} cy="476" r="5" className={`fs-led fs-led--${i}`} />
          ))}
          <g className="fs-wifi" transform="translate(589 330)">
            <path d="M-14 -4 A20 20 0 0 1 14 -4" />
            <path d="M-24 -12 A34 34 0 0 1 24 -12" />
          </g>

          {/* dashboard map */}
          <rect x="712" y="290" width="216" height="214" rx="6" className="fs-panel" />
          <g clipPath="url(#fs-map-clip)">
            <clipPath id="fs-map-clip">
              <rect x="712" y="290" width="216" height="214" rx="6" />
            </clipPath>
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${712 + i * 36} 290V504 M712 ${290 + i * 36}H928`} className="fs-mapgrid" />
            ))}
            <path d="M712 450 C760 420 790 470 830 430 S900 380 928 400" className="fs-river" />
          </g>
          <g transform="translate(820 400)">
            <circle r="26" className="fs-pin-pulse" />
            <path data-k="pin" d="M0 0 C-6 -9 -10 -14 -10 -20 A10 10 0 0 1 10 -20 C10 -14 6 -9 0 0Z" fill="#22D3EE" />
            <circle cy="-20" r="3.5" fill="#060B14" />
          </g>
        </svg>
      </div>
    </HudFrame>
  );
}
