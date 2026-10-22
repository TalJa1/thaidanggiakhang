import { useEffect, useRef } from "react";
import { pad } from "../lib/util";

/** Real pointer coordinates (decorative HUD readout). */
export default function LiveXY({ className = "" }: { className?: string }) {
  const x = useRef<HTMLSpanElement>(null);
  const y = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    let px = 0;
    let py = 0;
    const flush = () => {
      raf = 0;
      if (x.current) x.current.textContent = pad(px, 4);
      if (y.current) y.current.textContent = pad(py, 4);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <span className={`livexy ${className}`} aria-hidden="true">
      X <b ref={x}>0000</b> Y <b ref={y}>0000</b>
    </span>
  );
}
