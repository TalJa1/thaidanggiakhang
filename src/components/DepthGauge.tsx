import { useEffect, useRef } from "react";
import { useIsWide } from "../hooks/useIsDesktop";
import { subscribeRaf } from "../lib/raf";
import { pad } from "../lib/util";

/** Left-edge depth ruler on /passion-project, driven by the real scroll position. */
export default function DepthGauge() {
  const wide = useIsWide();
  if (!wide) return null;
  return <Gauge />;
}

function Gauge() {
  const fill = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let last = -1;
    return subscribeRaf(() => {
      const y = window.scrollY;
      if (y === last) return;
      last = y;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, y / max));
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
      if (read.current) {
        read.current.textContent = `${pad(p * 100, 3)}%`;
        read.current.style.transform = `translate3d(0, ${(p * 100).toFixed(2)}cqh, 0)`;
      }
    });
  }, []);
  return (
    <div className="depth" aria-hidden="true">
      <div className="depth__track">
        <div className="depth__fill" ref={fill} />
        <span className="depth__read" ref={read}>
          000%
        </span>
      </div>
    </div>
  );
}
