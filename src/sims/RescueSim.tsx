import { useRef } from "react";
import HudFrame, { ReplayButton } from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { $, attrs, clamp, easeInOut, easeOut, lerp, seeded, span } from "../lib/util";
import "./sims.css";

// Schematic only: geometry is illustrative. The only numbers shown are the
// published drop-error ranges (143–187 cm GPS-only, 40–59 cm aligned).

const DURATION = 12;
const STATIC_T = 11.9;

/* ---------------- route on the map (start pad + four waypoints) */
const PTS: [number, number][] = [
  [86, 468],
  [222, 332],
  [384, 418],
  [526, 300],
  [702, 404],
];
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p[0] - PTS[i][0], p[1] - PTS[i][1]));
const CUM = SEG.reduce<number[]>((acc, l) => [...acc, acc[acc.length - 1] + l], [0]);
const TOTAL = CUM[CUM.length - 1];
const ROUTE = "M" + PTS.map((p) => p.join(" ")).join(" L");

function along(d: number) {
  let i = 0;
  while (i < SEG.length - 1 && d > CUM[i + 1]) i++;
  const k = clamp((d - CUM[i]) / SEG[i]);
  const [x0, y0] = PTS[i];
  const [x1, y1] = PTS[i + 1];
  return { x: lerp(x0, x1, k), y: lerp(y0, y1, k), a: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI + 90 };
}

/* ---------------- camera picture-in-picture (local 340 × 200) */
type P = [number, number];
const KP: Record<string, P> = {
  nose: [240, 56],
  ls: [224, 80],
  rs: [256, 80],
  le: [207, 62],
  re: [273, 60],
  lw: [201, 37],
  rw: [279, 35],
  lh: [231, 118],
  rh: [249, 118],
  lk: [227, 146],
  rk: [253, 146],
  la: [225, 172],
  ra: [255, 172],
};
const KEYS = Object.keys(KP);
const EDGES: [string, string][] = [
  ["nose", "ls"],
  ["nose", "rs"],
  ["ls", "rs"],
  ["ls", "le"],
  ["le", "lw"],
  ["rs", "re"],
  ["re", "rw"],
  ["ls", "lh"],
  ["rs", "rh"],
  ["lh", "rh"],
  ["lh", "lk"],
  ["lk", "la"],
  ["rh", "rk"],
  ["rk", "ra"],
];
const CROSS_START: P = [104, 64];

/* ---------------- drop comparison (cm → px inside a 62 px ring = 200 cm) */
const PX_PER_CM = 62 / 200;
const rnd = seeded(7);
const DOTS_GPS = Array.from({ length: 9 }, () => ({ a: rnd() * Math.PI * 2, r: (143 + rnd() * 44) * PX_PER_CM }));
const DOTS_PID = Array.from({ length: 9 }, () => ({ a: rnd() * Math.PI * 2, r: (40 + rnd() * 19) * PX_PER_CM }));

function pose(t: number) {
  const out: Record<string, P> = {};
  const wave = Math.sin(t * 6);
  KEYS.forEach((k, i) => {
    let [x, y] = KP[k];
    if (k === "lw" || k === "rw") y += wave * 8;
    if (k === "le" || k === "re") y += wave * 4;
    x += Math.sin(t * 13 + i * 1.7) * 1.3 + Math.sin(t * 5.1 + i) * 1.1;
    y += Math.sin(t * 11 + i * 2.3) * 1.3 + Math.sin(t * 2.2 + i) * 1.6;
    out[k] = [x, y];
  });
  return out;
}

function draw(svg: SVGSVGElement, t: number) {
  /* drone flight */
  const d = easeInOut(span(t, 0.3, 4.6)) * TOTAL;
  const pos = along(d);
  const hover = t > 4.6 ? Math.sin(t * 2.4) * 2.5 : 0;
  attrs($(svg, "drone"), { transform: `translate(${pos.x} ${pos.y + hover}) rotate(${pos.a})` });
  const spin = (t * 1600) % 360;
  for (let i = 0; i < 4; i++) attrs($(svg, `blade${i}`), { transform: `rotate(${i % 2 ? -spin : spin})` });
  attrs($(svg, "trail"), { "stroke-dashoffset": 1 - d / TOTAL });

  let next = -1;
  for (let i = 1; i < PTS.length; i++) {
    const hit = d >= CUM[i] - 2;
    $(svg, `wp${i}`).classList.toggle("is-hit", hit);
    if (!hit && next < 0) next = i;
  }
  const lbl = $(svg, "wplabel");
  if (next > 0) {
    attrs(lbl, { x: PTS[next][0] + 18, y: PTS[next][1] - 16, opacity: 1 });
  } else {
    attrs(lbl, { opacity: 0 });
  }

  /* picture-in-picture */
  const pipIn = easeOut(span(t, 4.4, 4.9));
  attrs($(svg, "pip"), { opacity: pipIn, transform: `translate(600 18) scale(${0.94 + pipIn * 0.06})` });
  const camO = span(t, 4.5, 4.9) * (1 - span(t, 9.3, 9.7));
  attrs($(svg, "cam"), { opacity: camO });

  if (camO > 0) {
    // ripples
    for (let i = 0; i < 3; i++) {
      const k = ((t * 0.45 + i / 3) % 1 + 1) % 1;
      attrs($(svg, `rip${i}`), { rx: 18 + k * 110, ry: 5 + k * 26, opacity: (1 - k) * 0.7 });
    }
    // water surface
    let wd = "M0 112";
    for (let x = 0; x <= 340; x += 20) wd += ` L${x} ${(112 + Math.sin(x / 26 + t * 3) * 2.6).toFixed(1)}`;
    attrs($(svg, "surface"), { d: wd });
    attrs($(svg, "waterfill"), { d: wd + " L340 200 L0 200 Z" });

    const kp = pose(t);
    // body silhouette
    const [hx, hy] = kp.nose;
    attrs($(svg, "head"), { cx: hx, cy: hy - 2 });
    const limb = (a: string, b: string, c?: string) => {
      const p = [kp[a], kp[b], ...(c ? [kp[c]] : [])];
      return "M" + p.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L");
    };
    attrs($(svg, "armL"), { d: limb("ls", "le", "lw") });
    attrs($(svg, "armR"), { d: limb("rs", "re", "rw") });
    const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const sh = mid(kp.ls, kp.rs);
    const hp = mid(kp.lh, kp.rh);
    attrs($(svg, "torso"), { d: `M${sh[0]} ${sh[1]} L${hp[0]} ${hp[1]}` });
    attrs($(svg, "legs"), { d: `${limb("lh", "lk", "la")} ${limb("rh", "rk", "ra")}` });

    // skeleton
    const skO = span(t, 5.1, 5.6);
    attrs($(svg, "skeleton"), { opacity: skO });
    EDGES.forEach(([a, b], i) => attrs($(svg, `e${i}`), { x1: kp[a][0], y1: kp[a][1], x2: kp[b][0], y2: kp[b][1] }));
    KEYS.forEach((k, i) => attrs($(svg, `k${i}`), { cx: kp[k][0], cy: kp[k][1] }));

    // bounding box + LOCK
    let x0 = 999;
    let y0 = 999;
    let x1 = 0;
    let y1 = 0;
    KEYS.forEach((k) => {
      x0 = Math.min(x0, kp[k][0]);
      y0 = Math.min(y0, kp[k][1]);
      x1 = Math.max(x1, kp[k][0]);
      y1 = Math.max(y1, kp[k][1]);
    });
    x0 -= 12;
    y0 -= 16;
    x1 += 12;
    y1 += 8;
    const bbO = span(t, 5.8, 6.1);
    const c = 10;
    attrs($(svg, "bbox"), {
      opacity: bbO,
      d: `M${x0} ${y0 + c}V${y0}H${x0 + c} M${x1 - c} ${y0}H${x1}V${y0 + c} M${x1} ${y1 - c}V${y1}H${x1 - c} M${x0 + c} ${y1}H${x0}V${y1 - c}`,
    });
    attrs($(svg, "bboxFill"), { x: x0, y: y0, width: x1 - x0, height: y1 - y0, opacity: bbO * 0.12 });
    attrs($(svg, "lock"), { x: x0, y: y0 - 7, opacity: span(t, 6.0, 6.2) * (0.75 + 0.25 * Math.sin(t * 9)) });
    attrs($(svg, "scanlbl"), { opacity: 1 - span(t, 6.0, 6.2) });

    // PID alignment: damped oscillation of the crosshair onto the torso
    const target: P = [(sh[0] + hp[0]) / 2, (sh[1] + hp[1]) / 2];
    const s = Math.max(0, t - 7.1);
    const env = t < 7.1 ? 1 : Math.exp(-2.3 * s) * Math.cos(6.4 * s);
    const cx = target[0] + (CROSS_START[0] - target[0]) * env;
    const cy = target[1] + (CROSS_START[1] - target[1]) * env * 0.9;
    attrs($(svg, "cross"), { transform: `translate(${cx} ${cy})` });
    attrs($(svg, "pid"), { opacity: span(t, 6.9, 7.2) });
    let ed = "";
    const sNow = Math.min(s, 2.2);
    for (let i = 0; i <= 44; i++) {
      const si = (i / 44) * sNow;
      const e = Math.exp(-2.3 * si) * Math.abs(Math.cos(6.4 * si));
      ed += `${i ? "L" : "M"}${(16 + (si / 2.2) * 116).toFixed(1)} ${(186 - e * 30).toFixed(1)}`;
    }
    attrs($(svg, "err"), { d: ed });
  }

  /* lifebuoy drop + comparison */
  const dropO = span(t, 9.4, 9.8);
  attrs($(svg, "drop"), { opacity: dropO });
  const fall = span(t, 9.5, 10.2);
  const [bx, by] = PTS[PTS.length - 1];
  attrs($(svg, "buoy"), {
    opacity: fall > 0 ? 1 : 0,
    transform: `translate(${bx} ${by + 26}) scale(${lerp(2.6, 1, easeOut(fall))})`,
  });
  for (let i = 0; i < 2; i++) {
    const k = span(t, 10.2 + i * 0.35, 11.6 + i * 0.35);
    attrs($(svg, `splash${i}`), { r: 14 + k * 60, opacity: k > 0 ? (1 - k) * 0.8 : 0 });
  }
  if (dropO > 0) {
    DOTS_GPS.forEach((p, i) => {
      const k = easeOut(span(t, 9.9 + i * 0.1, 10.2 + i * 0.1));
      attrs($(svg, `g${i}`), { cx: 90 + Math.cos(p.a) * p.r, cy: 88 + Math.sin(p.a) * p.r, r: 3.4 * k, opacity: k });
    });
    DOTS_PID.forEach((p, i) => {
      const k = easeOut(span(t, 10.3 + i * 0.1, 10.6 + i * 0.1));
      attrs($(svg, `p${i}`), { cx: 250 + Math.cos(p.a) * p.r, cy: 88 + Math.sin(p.a) * p.r, r: 3 * k, opacity: k });
    });
    const k1 = easeOut(span(t, 9.9, 10.9));
    const k2 = easeOut(span(t, 10.3, 11.3));
    $(svg, "vGps").textContent = `${Math.round(143 * k1)}–${Math.round(187 * k1)} cm`;
    $(svg, "vPid").textContent = `${Math.round(40 * k2)}–${Math.round(59 * k2)} cm`;
  }
  attrs($(svg, "readout"), { opacity: span(t, 11.0, 11.4) });
}

export default function RescueSim() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { hostRef, replay, reduced } = useSim(
    (t) => {
      if (svgRef.current) draw(svgRef.current, t);
    },
    { duration: DURATION, staticT: STATIC_T },
  );

  return (
    <HudFrame label="TRACK · GPS · PID" schematic ratio="16 / 9" controls={!reduced && <ReplayButton onClick={replay} />}>
      <div ref={hostRef} className="sim sim--rescue" aria-hidden="true">
        <svg ref={svgRef} viewBox="0 0 960 540">
          <defs>
            <pattern id="rs-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(141,160,188,.10)" strokeWidth="1" />
            </pattern>
            <clipPath id="rs-pip-clip">
              <rect width="340" height="200" rx="6" />
            </clipPath>
          </defs>
          <rect width="960" height="540" fill="url(#rs-grid)" />
          {/* lake */}
          <path className="rs-lake" d="M420 540 C430 470 470 432 540 414 C602 396 612 334 682 322 C762 308 822 342 884 302 C922 276 960 282 960 282 V540 Z" />
          <path className="rs-contour" d="M480 540 C490 486 530 458 590 444 C650 430 660 380 720 370 C790 360 840 380 900 350 C930 336 960 340 960 340" />
          <path className="rs-contour" d="M560 540 C570 506 610 490 660 480 C720 468 740 430 790 424 C850 418 900 420 960 400" />
          <path className="rs-land" d="M0 120 C120 100 180 160 300 150 S460 90 560 120" />
          <path className="rs-land" d="M0 200 C140 180 200 230 330 222 S470 170 600 196" />
          {/* home pad */}
          <g transform={`translate(${PTS[0][0]} ${PTS[0][1]})`} className="rs-pad">
            <circle r="20" />
            <path d="M-7 -8V8M7 -8V8M-7 0H7" />
          </g>
          {/* route */}
          <path className="rs-route" d={ROUTE} />
          <path data-k="trail" className="rs-trail" d={ROUTE} pathLength={1} />
          {PTS.slice(1).map(([x, y], i) => (
            <g key={i} data-k={`wp${i + 1}`} className="rs-wp" transform={`translate(${x} ${y})`}>
              <circle r="15" className="rs-wp__ring" />
              <rect x="-6" y="-6" width="12" height="12" transform="rotate(45)" />
            </g>
          ))}
          <text data-k="wplabel" className="rs-txt rs-txt--wp">
            WAYPOINT
          </text>
          {/* splash + lifebuoy */}
          {[0, 1].map((i) => (
            <circle key={i} data-k={`splash${i}`} className="rs-splash" cx={PTS[4][0]} cy={PTS[4][1] + 26} r="14" opacity="0" />
          ))}
          <g data-k="buoy" opacity="0">
            <circle r="9" fill="none" stroke="#FF6B1A" strokeWidth="6" />
            <circle r="9" fill="none" stroke="#F2F6FB" strokeWidth="6" strokeDasharray="4.7 9.4" strokeDashoffset="2.35" />
          </g>
          {/* drone */}
          <g data-k="drone">
            <path d="M-16 -16L16 16M16 -16L-16 16" className="rs-drone__arm" />
            <rect x="-7" y="-7" width="14" height="14" rx="3" className="rs-drone__body" />
            {[
              [-16, -16],
              [16, -16],
              [16, 16],
              [-16, 16],
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <circle r="8" className="rs-drone__guard" />
                <path data-k={`blade${i}`} d="M-7 0H7" className="rs-drone__blade" />
              </g>
            ))}
            <path d="M-4 -11L0 -16L4 -11" className="rs-drone__nose" />
          </g>
          <text className="rs-txt" x="24" y="36">
            TRACK · GPS
          </text>
          <g className="rs-signal" transform="translate(24 50)">
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={i * 7} y={12 - i * 4} width="4" height={4 + i * 4} />
            ))}
            <text className="rs-txt rs-txt--s" x="36" y="16">
              SIGNAL
            </text>
          </g>

          {/* picture-in-picture */}
          <g data-k="pip" opacity="0" transform="translate(600 18)">
            <rect width="340" height="200" rx="6" className="rs-pip" />
            <g clipPath="url(#rs-pip-clip)">
              <g data-k="cam">
                <rect width="340" height="200" className="rs-cam-bg" />
                {[0, 1, 2].map((i) => (
                  <ellipse key={i} data-k={`rip${i}`} className="rs-ripple" cx="240" cy="116" rx="20" ry="6" />
                ))}
                <circle data-k="head" className="rs-person rs-person--head" cx="240" cy="54" r="10" />
                <path data-k="armL" className="rs-person" />
                <path data-k="armR" className="rs-person" />
                <path data-k="torso" className="rs-person" />
                <path data-k="legs" className="rs-person rs-person--legs" />
                <path data-k="waterfill" className="rs-waterfill" />
                <path data-k="surface" className="rs-surface" />
                <g data-k="skeleton" opacity="0">
                  {EDGES.map((_, i) => (
                    <line key={i} data-k={`e${i}`} className="rs-bone" />
                  ))}
                  {KEYS.map((_, i) => (
                    <circle key={i} data-k={`k${i}`} r="3.2" className="rs-joint" />
                  ))}
                </g>
                <rect data-k="bboxFill" className="rs-bbox-fill" opacity="0" />
                <path data-k="bbox" className="rs-bbox" opacity="0" />
                <text data-k="lock" className="rs-txt rs-txt--lock" opacity="0">
                  LOCK
                </text>
                <g data-k="cross" transform={`translate(${CROSS_START[0]} ${CROSS_START[1]})`}>
                  <circle r="14" className="rs-cross" />
                  <path d="M-24 0H-8M8 0H24M0 -24V-8M0 8V24" className="rs-cross" />
                </g>
                <g data-k="pid" opacity="0">
                  <rect x="10" y="148" width="128" height="44" rx="3" className="rs-chart" />
                  <path d="M16 186H132" className="rs-chart-axis" />
                  <path data-k="err" className="rs-err" />
                  <text className="rs-txt rs-txt--s" x="16" y="162">
                    PID
                  </text>
                </g>
                <text data-k="scanlbl" className="rs-txt rs-txt--s" x="12" y="22">
                  SCAN
                </text>
                <g className="rs-rec">
                  <circle cx="300" cy="17" r="4" />
                  <text className="rs-txt rs-txt--s" x="310" y="22">
                    REC
                  </text>
                </g>
              </g>

              <g data-k="drop" opacity="0">
                <rect width="340" height="200" className="rs-cam-bg rs-cam-bg--drop" />
                {[90, 250].map((cx, i) => (
                  <g key={cx} transform={`translate(${cx} 88)`} className={i ? "rs-target rs-target--pid" : "rs-target"}>
                    <circle r="62" className="rs-target__ring" />
                    <circle r="31" className="rs-target__ring rs-target__ring--in" />
                    <path d="M-70 0H70M0 -70V70" className="rs-target__axis" />
                    <path
                      className="rs-target__band"
                      fillRule="evenodd"
                      d={
                        i
                          ? `M${40 * PX_PER_CM} 0A${40 * PX_PER_CM} ${40 * PX_PER_CM} 0 1 0 ${-40 * PX_PER_CM} 0A${40 * PX_PER_CM} ${40 * PX_PER_CM} 0 1 0 ${40 * PX_PER_CM} 0Z M${59 * PX_PER_CM} 0A${59 * PX_PER_CM} ${59 * PX_PER_CM} 0 1 0 ${-59 * PX_PER_CM} 0A${59 * PX_PER_CM} ${59 * PX_PER_CM} 0 1 0 ${59 * PX_PER_CM} 0Z`
                          : `M${143 * PX_PER_CM} 0A${143 * PX_PER_CM} ${143 * PX_PER_CM} 0 1 0 ${-143 * PX_PER_CM} 0A${143 * PX_PER_CM} ${143 * PX_PER_CM} 0 1 0 ${143 * PX_PER_CM} 0Z M${187 * PX_PER_CM} 0A${187 * PX_PER_CM} ${187 * PX_PER_CM} 0 1 0 ${-187 * PX_PER_CM} 0A${187 * PX_PER_CM} ${187 * PX_PER_CM} 0 1 0 ${187 * PX_PER_CM} 0Z`
                      }
                    />
                    <circle r="3" className="rs-target__center" />
                  </g>
                ))}
                {DOTS_GPS.map((_, i) => (
                  <circle key={i} data-k={`g${i}`} className="rs-dot rs-dot--gps" r="0" />
                ))}
                {DOTS_PID.map((_, i) => (
                  <circle key={i} data-k={`p${i}`} className="rs-dot rs-dot--pid" r="0" />
                ))}
                <text className="rs-txt rs-txt--s" x="90" y="172" textAnchor="middle">
                  GPS only
                </text>
                <text data-k="vGps" className="rs-txt rs-txt--val" x="90" y="192" textAnchor="middle">
                  0–0 cm
                </text>
                <text className="rs-txt rs-txt--s" x="250" y="172" textAnchor="middle">
                  PID · LOCK
                </text>
                <text data-k="vPid" className="rs-txt rs-txt--val rs-txt--cyan" x="250" y="192" textAnchor="middle">
                  0–0 cm
                </text>
              </g>
            </g>
            <rect width="340" height="200" rx="6" className="rs-pip-frame" />
          </g>

          {/* final readout */}
          <g data-k="readout" opacity="0" transform="translate(24 96)">
            <rect width="372" height="50" rx="4" className="rs-readout" />
            <text className="rs-txt rs-txt--big" x="16" y="33">
              143–187 cm → 40–59 cm
            </text>
          </g>
        </svg>
      </div>
    </HudFrame>
  );
}
