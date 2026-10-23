// GSAP + ScrollTrigger, loaded only by the pages/sims that scrub on scroll.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollRefresher } from "./scroll";

gsap.registerPlugin(ScrollTrigger);

// refresh() can restore a scroll position remembered from the previous route
// (it jumped new pages back down); keep the page where it is instead. Native
// scroll on purpose: Lenis still thinks it is at `y` and would ignore scrollTo(y).
function refresh() {
  const y = window.scrollY;
  ScrollTrigger.refresh();
  if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: "instant" });
}

setScrollRefresher(refresh);
document.fonts?.ready.then(refresh).catch(() => {});

export { gsap, ScrollTrigger };
