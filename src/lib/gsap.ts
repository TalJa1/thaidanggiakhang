// GSAP + ScrollTrigger, loaded only by the pages/sims that scrub on scroll.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setScrollRefresher } from "./scroll";

gsap.registerPlugin(ScrollTrigger);
setScrollRefresher(() => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

export { gsap, ScrollTrigger };
