// Line icons for the six About cards. Every stroke uses pathLength=1 so CSS
// can redraw it on hover.

const ICONS: string[][] = [
  // Robotics & Autonomous Systems: robot head
  ["M14 18h28v22H14z", "M28 18v-7", "M28 8a3 3 0 1 1 0 .1", "M21 27a2 2 0 1 0 0 .1M35 27a2 2 0 1 0 0 .1", "M22 34h12", "M14 26h-4v8h4M42 26h4v8h-4", "M18 40v6h20v-6"],
  // Embedded Systems & IoT: chip + signal
  ["M16 22h20v20H16z", "M21 27h10v10H21z", "M20 22v-4M26 22v-4M32 22v-4M20 42v4M26 42v4M32 42v4M16 27h-4M16 37h-4M36 27h4M36 37h4", "M40 14a8 8 0 0 1 6 6", "M40 8a14 14 0 0 1 12 12"],
  // Artificial Intelligence: network
  ["M10 16a3 3 0 1 0 0 .1M10 28a3 3 0 1 0 0 .1M10 40a3 3 0 1 0 0 .1", "M28 22a3 3 0 1 0 0 .1M28 34a3 3 0 1 0 0 .1", "M46 28a3 3 0 1 0 0 .1", "M13 16l12 6M13 28l12-6M13 28l12 6M13 40l12-6M13 16l12 18M31 22l12 6M31 34l12-6"],
  // Engineering Design: set square + compass arc
  ["M10 44V12l32 32z", "M16 38V26l12 12z", "M10 18h4M10 24h3M10 30h4M10 36h3", "M30 12a14 14 0 0 1 14 14", "M44 26l3-4M44 26l-4-2"],
  // Disaster Prevention & Public Safety: shield + wave
  ["M28 8l16 6v12c0 10-7 17-16 21-9-4-16-11-16-21V14z", "M17 29c3-3 5-3 8 0s5 3 8 0 5-3 8 0", "M19 36c3-2 4-2 7 0s5 2 7 0 4-2 6 0", "M28 15v8"],
  // Technology for Social Impact: people + heart
  ["M18 22a5 5 0 1 0 0 .1M38 22a5 5 0 1 0 0 .1", "M8 44c0-7 5-11 10-11s10 4 10 11M28 44c0-7 5-11 10-11s10 4 10 11", "M28 18c-2-3-7-2-7 2 0 3 4 5 7 8 3-3 7-5 7-8 0-4-5-5-7-2z"],
];

export default function FocusIcon({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 56 56" className="ficon" aria-hidden="true">
      {ICONS[index].map((d, i) => (
        <path key={i} d={d} pathLength={1} style={{ animationDelay: `${i * 70}ms` }} />
      ))}
    </svg>
  );
}
