import { useEffect, useRef } from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLite } from "../hooks/useFpsGuard";
import { subscribeRaf } from "../lib/raf";
import { pad } from "../lib/util";

const LOCKABLE = "a, button, input, [data-lock], .btn";

/** Desktop crosshair + ring with live X/Y; locks with corner brackets over images, sims and buttons. */
export default function CursorCrosshair() {
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();
  const lite = useLite();
  if (!desktop || reduced || lite) return null;
  return <CursorLayer />;
}

function CursorLayer() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const read = useRef<HTMLDivElement>(null);
  const lineX = useRef<HTMLDivElement>(null);
  const lineY = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("has-cursor");
    const target = { x: -100, y: -100 };
    const box = { x: -100, y: -100, w: 30, h: 30 };
    let locked: Element | null = null;
    let visible = false;
    let lastText = "";

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        box.x = e.clientX;
        box.y = e.clientY;
        html.classList.add("cursor-on");
      }
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(LOCKABLE) ?? null;
      locked = el;
      ring.current?.classList.toggle("is-lock", !!el);
    };
    const onLeave = () => {
      visible = false;
      html.classList.remove("cursor-on");
    };
    const onDown = () => ring.current?.classList.add("is-down");
    const onUp = () => ring.current?.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const stop = subscribeRaf((dt) => {
      if (!visible) return;
      let tx = target.x;
      let ty = target.y;
      let tw = 30;
      let th = 30;
      if (locked && locked.isConnected) {
        const r = locked.getBoundingClientRect();
        if (r.width < 440 && r.height < 220) {
          // snap the brackets to small targets (buttons, links)
          tx = r.left + r.width / 2;
          ty = r.top + r.height / 2;
          tw = r.width + 14;
          th = r.height + 12;
        } else {
          tw = 76;
          th = 76;
        }
      }
      const k = 1 - Math.pow(0.0001, dt * 1.6);
      box.x += (tx - box.x) * k;
      box.y += (ty - box.y) * k;
      box.w += (tw - box.w) * k;
      box.h += (th - box.h) * k;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${box.x - box.w / 2}px, ${box.y - box.h / 2}px, 0)`;
        ring.current.style.width = `${box.w}px`;
        ring.current.style.height = `${box.h}px`;
      }
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      if (lineX.current) lineX.current.style.transform = `translate3d(0, ${target.y}px, 0)`;
      if (lineY.current) lineY.current.style.transform = `translate3d(${target.x}px, 0, 0)`;
      if (read.current) {
        read.current.style.transform = `translate3d(${target.x + 18}px, ${target.y + 18}px, 0)`;
        const text = `X ${pad(target.x, 4)}  Y ${pad(target.y, 4)}`;
        if (text !== lastText) {
          read.current.textContent = text;
          lastText = text;
        }
      }
    });

    return () => {
      stop();
      html.classList.remove("has-cursor", "cursor-on");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__line cursor__line--x" ref={lineX} />
      <div className="cursor__line cursor__line--y" ref={lineY} />
      <div className="cursor__ring" ref={ring}>
        <i className="cursor__b cursor__b--tl" />
        <i className="cursor__b cursor__b--tr" />
        <i className="cursor__b cursor__b--bl" />
        <i className="cursor__b cursor__b--br" />
      </div>
      <div className="cursor__dot" ref={dot} />
      <div className="cursor__read" ref={read} />
    </div>
  );
}
