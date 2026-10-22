import { useRef, type CSSProperties } from "react";
import { useInView } from "../hooks/useInView";

const DIGITS = "01234567890123456789".split("");

/**
 * Rolling-digit counter. Only the digits roll; "+", "VND", "million", units
 * and dashes stay static. Runs once when it enters the view.
 */
export default function OdometerStat({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const run = useInView(ref, { once: true, threshold: 0.35 });
  const parts = value.split(/(\d+)/).filter(Boolean);
  let col = 0;

  return (
    <span ref={ref} className={`odo ${run ? "is-run" : ""} ${className}`}>
      <span className="sr-only">{value}</span>
      <span className="odo__vis" aria-hidden="true">
        {parts.map((part, i) =>
          /^\d+$/.test(part) ? (
            <span className="odo__num" key={i}>
              {Array.from(part).map((d, j) => (
                <span className="odo__col" key={j} style={{ "--d": d, "--i": col++ } as CSSProperties}>
                  <span className="odo__sizer">{d}</span>
                  <span className="odo__strip">
                    {DIGITS.map((n, k) => (
                      <span key={k}>{n}</span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className="odo__static" key={i}>
              {part}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
