import { useLayoutEffect, useMemo, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import HudFrame, { ReplayButton } from "../components/HudFrame";
import { useInView } from "../hooks/useInView";
import { useIsWide } from "../hooks/useIsDesktop";
import { useLite } from "../hooks/useFpsGuard";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { subscribeRaf } from "../lib/raf";
import { easeInOut, seeded } from "../lib/util";
import "./sims.css";


// Schematic only: an abstract vector city, NOT a real map of Can Tho. The
// hotspot names come from the project text; their positions are illustrative.

const W = 960;
const H = 600;
const riverY = (x: number) => 318 + Math.sin(x / 170) * 92 + Math.sin(x / 63 + 1.2) * 26;
const HOTSPOTS = [
  { name: "Tân An", x: 300 },
  { name: "An Phú", x: 560 },
  { name: "An Cư", x: 760 },
].map((h, i) => ({ ...h, y: riverY(h.x) + (i % 2 ? -58 : 54) }));

const STATIC_F = 0.62;

function buildCells(size: number) {
  const rnd = seeded(23);
  const cols = Math.ceil(W / size);
  const rows = Math.ceil(H / size);
  const cells: { x: number; y: number; e: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * size + size / 2;
      const y = r * size + size / 2;
      const dist = Math.abs(y - riverY(x)) / 260;
      // low ground near the river and around the hotspots
      let e = dist + (rnd() - 0.5) * 0.16 + Math.sin(x / 90) * Math.cos(y / 70) * 0.05;
      HOTSPOTS.forEach((h) => {
        const dd = Math.hypot(x - h.x, y - h.y) / 120;
        e -= Math.max(0, 0.22 - dd * 0.22);
      });
      cells.push({ x: c * size, y: r * size, e });
    }
  }
  return cells;
}

function colorFor(depth: number) {
  if (depth <= 0) return ["transparent", 0] as const;
  if (depth < 0.07) return ["#22D3EE", 0.22] as const;
  if (depth < 0.16) return ["#22D3EE", 0.42] as const;
  if (depth < 0.26) return ["#FFB020", 0.5] as const;
  return ["#FF6B1A", 0.62] as const;
}

const RIVER = (() => {
  let d = "";
  for (let x = -20; x <= W + 20; x += 20) d += `${d ? "L" : "M"}${x} ${riverY(x).toFixed(1)}`;
  return d;
})();

const CONTOURS = [70, 130, 200].flatMap((off) => {
  const mk = (sign: number) => {
    let d = "";
    for (let x = -20; x <= W + 20; x += 24) {
      const y = riverY(x) + sign * (off + Math.sin(x / 40 + off) * 10);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    return d;
  };
  return [mk(1), mk(-1)];
});

const BLOCKS = (() => {
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const rnd = seeded(5);
  for (let y = 24; y < H - 30; y += 44) {
    for (let x = 20; x < W - 30; x += 52) {
      const cx = x + 20;
      const cy = y + 16;
      if (Math.abs(cy - riverY(cx)) < 46) continue;
      if (rnd() < 0.18) continue;
      out.push({ x, y, w: 34 + rnd() * 8, h: 24 + rnd() * 8 });
    }
  }
  return out;
})();

export default function GisFloodSim() {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const manual = useRef(false);
  const inView = useInView(hostRef);
  const reduced = useReducedMotion();
  const wide = useIsWide();
  const lite = useLite();
  const size = wide && !lite ? 30 : 60;
  const cells = useMemo(() => buildCells(size), [size]);

  // paint the flood layer for level f (0 = present, 1 = future)
  const paintRef = useRef<(f: number) => void>(() => {});
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rects = Array.from(svg.querySelectorAll<SVGRectElement>(".gf-cell"));
    let last = -1;
    paintRef.current = (f: number) => {
      if (Math.abs(f - last) < 0.004) return;
      last = f;
      const th = 0.06 + f * 0.5;
      rects.forEach((r, i) => {
        const [fill, op] = colorFor(th - cells[i].e);
        r.style.fill = fill;
        r.style.opacity = String(op);
      });
      svg.style.setProperty("--flood", f.toFixed(3));
      if (sliderRef.current && !manual.current) sliderRef.current.value = String(Math.round(f * 100));
    };
    paintRef.current(reduced ? STATIC_F : Number(sliderRef.current?.value ?? 0) / 100);
  }, [cells, reduced]);

  // scroll scrub (GSAP ScrollTrigger), disabled under reduced motion
  useLayoutEffect(() => {
    if (reduced || !hostRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: hostRef.current,
        start: "top 85%",
        end: "bottom 25%",
        scrub: true,
        onUpdate: (self) => {
          if (!manual.current) paintRef.current(self.progress);
        },
      });
    });
    return () => ctx.revert();
  }, [reduced]);

  const replay = () => {
    manual.current = false;
    const t0 = performance.now();
    const stop = subscribeRaf((_dt, now) => {
      const k = Math.min(1, (now - t0) / 3200);
      paintRef.current(easeInOut(k));
      if (k >= 1) stop();
    });
  };

  return (
    <div className="gis">
      <HudFrame label="GPS · SCAN · ALERT" schematic ratio="8 / 5" controls={!reduced && <ReplayButton onClick={replay} />}>
        <div ref={hostRef} className={`sim sim--gis ${inView ? "is-play" : ""}`} aria-hidden="true">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}>
            <rect width={W} height={H} className="gf-bg" />
            {CONTOURS.map((d, i) => (
              <path key={i} d={d} className="gf-contour" />
            ))}
            <g className="gf-blocks">
              {BLOCKS.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="2" />
              ))}
            </g>
            <g className="gf-cells">
              {cells.map((c, i) => (
                <rect key={i} className="gf-cell" x={c.x + 1} y={c.y + 1} width={size - 2} height={size - 2} rx="2" />
              ))}
            </g>
            <path d={RIVER} className="gf-river gf-river--bank" />
            <path d={RIVER} className="gf-river" />
            <path d="M0 120 C200 140 380 90 560 118 S860 150 960 130" className="gf-road" />
            <path d="M180 0 C200 160 150 380 210 600" className="gf-road" />
            <path d="M700 0 C680 180 740 400 690 600" className="gf-road" />
            {HOTSPOTS.map((h, i) => (
              <g key={h.name} className="gf-hot" transform={`translate(${h.x} ${h.y.toFixed(1)})`} style={{ animationDelay: `${i * 0.5}s` }}>
                <circle r="34" className="gf-hot__pulse" style={{ animationDelay: `${i * 0.6}s` }} />
                <circle r="18" className="gf-hot__ring" />
                <circle r="5" className="gf-hot__core" />
                <rect x="24" y="-15" width={h.name.length * 12 + 20} height="30" rx="4" className="gf-hot__tag" />
                <text x="34" y="6" className="gf-txt">
                  {h.name}
                </text>
              </g>
            ))}
            <text x="24" y="578" className="gf-watermark">
              Schematic
            </text>
            <g className="gf-compass" transform="translate(905 52)">
              <circle r="20" />
              <path d="M0 -14 L5 0 L0 14 L-5 0Z" />
            </g>
          </svg>
        </div>
      </HudFrame>
      <div className="gis__slider">
        <span id="gis-present" className="gis__lbl">
          Present
        </span>
        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={100}
          defaultValue={reduced ? Math.round(STATIC_F * 100) : 0}
          aria-labelledby="gis-present gis-future"
          onInput={(e) => {
            manual.current = true;
            paintRef.current(Number(e.currentTarget.value) / 100);
          }}
        />
        <span id="gis-future" className="gis__lbl">
          Future
        </span>
      </div>
    </div>
  );
}
