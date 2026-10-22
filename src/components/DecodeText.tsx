import { useLayoutEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { subscribeRaf } from "../lib/raf";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+/<>=_";

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** ms before the decode starts once visible. */
  delay?: number;
  duration?: number;
  id?: string;
}

/**
 * Headline that resolves from scrambled glyphs into the exact text, left to
 * right. The real text is always in the DOM (visually hidden duplicate) and
 * the visual layer keeps its layout because every glyph overlays its final
 * character.
 */
export default function DecodeText({ text, as = "span", className = "", delay = 0, duration = 900, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const Tag = as as "span";
  const words = text.split(" ");

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduced) return;
    const chars = Array.from(root.querySelectorAll<HTMLElement>(".dc-c"));
    const scramble = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    chars.forEach((c) => {
      c.classList.add("is-scr");
      c.dataset.g = scramble();
    });

    let stop: (() => void) | null = null;
    let startAt = 0;
    let lastSwap = 0;
    const run = () => {
      stop = subscribeRaf((_dt, now) => {
        if (!startAt) startAt = now + delay;
        const p = (now - startAt) / duration;
        if (p < 0) return;
        const resolved = Math.floor(p * chars.length * 1.05);
        const swap = now - lastSwap > 45;
        if (swap) lastSwap = now;
        chars.forEach((c, i) => {
          if (i < resolved) c.classList.remove("is-scr");
          else if (swap) c.dataset.g = scramble();
        });
        if (resolved >= chars.length) {
          stop?.();
          stop = null;
        }
      });
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.2 },
    );
    // wait for the boot overlay so the decode is actually seen
    const observe = () => io.observe(root);
    const booting = document.documentElement.classList.contains("is-booting");
    if (booting) window.addEventListener("gk:booted", observe, { once: true });
    else observe();

    return () => {
      window.removeEventListener("gk:booted", observe);
      io.disconnect();
      stop?.();
      chars.forEach((c) => c.classList.remove("is-scr"));
    };
  }, [text, reduced, delay, duration]);

  return (
    <Tag ref={ref as RefObject<HTMLSpanElement>} className={`decode ${className}`} id={id}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="dc-w">
              {Array.from(w).map((ch, ci) => (
                <span className="dc-c" key={ci}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
