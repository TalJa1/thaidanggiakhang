import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { refreshScrollTriggers, scrollToId, scrollToY } from "../lib/scroll";

/** Scroll to top on route change; honour #hash anchors, also on a cold deep link. */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const prevPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  useLayoutEffect(() => {
    const samePage = prevPath.current === pathname;
    prevPath.current = pathname;
    const timers: number[] = [];
    let raf = 0;

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const attempt = () => {
        if (scrollToId(id, { immediate: !samePage })) {
          // lazy content and fonts can still move things a little: correct once
          if (!samePage) timers.push(window.setTimeout(() => scrollToId(id, { immediate: true }), 450));
        } else if (tries++ < 240) {
          raf = requestAnimationFrame(attempt);
        }
      };
      attempt();
    } else if (!samePage) {
      scrollToY(0, { immediate: true });
    }

    timers.push(window.setTimeout(refreshScrollTriggers, 600));
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname, hash, key]);

  return null;
}
