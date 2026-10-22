import { Fragment } from "react";
import OdometerStat from "./OdometerStat";

/** "120+ students reached · 17 student volunteers · …" with rolling numbers, exact text kept. */
export default function StatsLine({ text, className = "" }: { text: string; className?: string }) {
  const items = text.split(" · ").map((item) => {
    const i = item.indexOf(" ");
    return { value: item.slice(0, i), label: item.slice(i + 1) };
  });
  return (
    <p className={`statsline ${className}`}>
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className="statsline__item">
            <OdometerStat value={it.value} className="statsline__num" /> <span className="statsline__label">{it.label}</span>
          </span>
          {i < items.length - 1 && <span className="statsline__sep"> · </span>}
        </Fragment>
      ))}
    </p>
  );
}
