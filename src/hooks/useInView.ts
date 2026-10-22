import { useEffect, useState, type RefObject } from "react";

interface Options {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/** True while the element intersects the viewport (or forever after the first hit with `once`). */
export function useInView(ref: RefObject<Element | null>, { once = false, rootMargin = "0px", threshold = 0 }: Options = {}) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, once, rootMargin, threshold]);
  return inView;
}
