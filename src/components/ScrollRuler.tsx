import { useEffect, useRef } from "react";
import { useIsWide } from "../hooks/useIsDesktop";
import { subscribeRaf } from "../lib/raf";
import { pad } from "../lib/util";

/** Right-edge ruler: real scroll percentage + current section index. */
export default function ScrollRuler() {
  const wide = useIsWide();
  if (!wide) return null;
  return <Ruler />;
}

function Ruler() {
  const marker = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const idx = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = -1;
    let frame = 0;
    let lastIdx = "";
    return subscribeRaf(() => {
      frame++;
      const y = window.scrollY;
      if (y === lastY && frame % 30 !== 0) return;
      lastY = y;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, y / max));
      const h = track.current?.clientHeight ?? 0;
      if (marker.current) marker.current.style.transform = `translate3d(0, ${p * h}px, 0)`;
      if (pct.current) pct.current.textContent = `${pad(p * 100, 3)}%`;

      const sections = document.querySelectorAll("[data-section]");
      let current = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top < vh * 0.5) current = i + 1;
      });
      const text = `${pad(Math.max(1, current))} / ${pad(sections.length)}`;
      if (text !== lastIdx && idx.current) {
        idx.current.textContent = text;
        lastIdx = text;
      }
    });
  }, []);

  return (
    <div className="ruler" aria-hidden="true">
      <span className="ruler__idx" ref={idx}>
        01 / 01
      </span>
      <div className="ruler__track" ref={track}>
        <div className="ruler__marker" ref={marker}>
          <span className="ruler__pct" ref={pct}>
            000%
          </span>
        </div>
      </div>
    </div>
  );
}
