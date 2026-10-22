import { lazy, Suspense, useLayoutEffect, useRef, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/gsap";
import CircuitDivider from "../components/CircuitDivider";
import DecodeText from "../components/DecodeText";
import DocLink from "../components/DocLink";
import DotList from "../components/DotList";
import HudFrame, { SimFallback } from "../components/HudFrame";
import { ArrowUpRight } from "../components/Icons";
import Img from "../components/Img";
import OdometerStat from "../components/OdometerStat";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import { LINKS } from "../config/links";
import { PROJECTS, RESEARCH, UI, type Project, type ProjectId } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import { useReducedMotion } from "../hooks/useReducedMotion";


const SIMS: Record<ProjectId, { C: ComponentType; ratio: string }> = {
  rescue: { C: lazy(() => import("../sims/RescueSim")), ratio: "16 / 9" },
  flood: { C: lazy(() => import("../sims/FloodSim")), ratio: "16 / 9" },
  romad: { C: lazy(() => import("../sims/RomadSim")), ratio: "16 / 9" },
  cantho: { C: lazy(() => import("../sims/GisFloodSim")), ratio: "8 / 5" },
};

const ALTS: Record<ProjectId, [string, string]> = {
  rescue: ["The autonomous rescue quadcopter", "The autonomous rescue quadcopter during development"],
  flood: ["The solar-powered flood monitoring station", "The flood monitoring station and its sensors"],
  romad: ["ROMAD, the AI-powered museum guide robot", "ROMAD museum guide robot project"],
  cantho: ["Flood risk research in Can Tho City", "Flood risk analysis for Can Tho City"],
};

function ProjectBlock({ p, index }: { p: Project; index: number }) {
  const sim = SIMS[p.id];
  const Sim = sim.C;
  const titleId = `${p.id}-title`;
  return (
    <section id={p.id} className={`proj ${index % 2 ? "proj--rev" : ""}`} data-section="" aria-labelledby={titleId}>
      <div className="container">
        <div className="proj__head">
          <span className="proj__numeral" aria-hidden="true">
            {p.num}
          </span>
          <Reveal>
            <h2 id={titleId} className="proj__title">
              <span className="proj__label">{p.label} — </span>
              <span className="proj__name">{p.title}</span>
            </h2>
            <p className="chips">
              <DotList text={p.fields} itemClassName="chip" />
            </p>
          </Reveal>
        </div>

        <div className="proj__grid">
          <Reveal className="proj__text" delay={80}>
            <p className="body-lg">{p.description}</p>
            {p.highlight && (
              <div className="highlight">
                <OdometerStat value={p.highlight.value} className="highlight__val" />
                <span className="highlight__cap">{p.highlight.caption}</span>
              </div>
            )}
            {p.stats && (
              <ul className="statchips">
                {p.stats.map((s) => {
                  const i = s.indexOf(" ");
                  return (
                    <li key={s} className="statchip">
                      <OdometerStat value={s.slice(0, i)} className="statchip__num" /> <span>{s.slice(i + 1)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            {p.doc && <DocLink name={p.doc} describedBy={titleId} />}
          </Reveal>
          <div className="proj__sim">
            <Suspense fallback={<SimFallback ratio={sim.ratio} />}>
              <Sim />
            </Suspense>
          </div>
        </div>

        <div className="proj__media">
          {p.images.map((img, i) => (
            <Reveal key={img} className={`proj__img proj__img--${i}`} delay={i * 120} variant="clip">
              <HudFrame label={i ? "REC" : "SCAN"}>
                <Img name={img} alt={ALTS[p.id][i]} ratio={i ? "4 / 3" : "3 / 2"} />
              </HudFrame>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Research() {
  useMeta("/research");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".proj").forEach((el) => {
        const num = el.querySelector(".proj__numeral");
        if (num) gsap.fromTo(num, { yPercent: 18 }, { yPercent: -18, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="page page--research" ref={rootRef}>
      <Section className="page-hero research-hero" labelledBy="research-title">
        <div className="container">
          <p className="hud-row" aria-hidden="true">
            <i className="dot-ok" /> SYS · TRACK
          </p>
          <DecodeText as="h1" id="research-title" className="display display--xl" text={RESEARCH.title} delay={200} />
          <nav className="proj-index" aria-label={RESEARCH.title}>
            <ol>
              {PROJECTS.map((p) => (
                <li key={p.id}>
                  <Link to={`#${p.id}`} className="proj-index__link">
                    <span className="proj-index__num" aria-hidden="true">
                      {p.num}
                    </span>
                    <span>{p.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </Section>

      {PROJECTS.map((p, i) => (
        <div key={p.id}>
          <CircuitDivider flip={i % 2 === 1} />
          <ProjectBlock p={p} index={i} />
        </div>
      ))}

      <CircuitDivider />

      <section id="paper" className="paper" data-section="" aria-labelledby="paper-title">
        <div className="container">
          <Reveal className="paper__card">
            <svg className="paper__icon" viewBox="0 0 64 64" aria-hidden="true">
              <path d="M14 6h26l12 12v40H14z" />
              <path d="M40 6v12h12M22 28h22M22 36h22M22 44h14" />
            </svg>
            <h2 id="paper-title" className="paper__title">
              <span className="paper__label">{RESEARCH.paper.label} </span>
              {RESEARCH.paper.title}
            </h2>
            {LINKS.researchPaper ? (
              <a className="btn btn--primary" href={LINKS.researchPaper} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">{UI.readMore}</span>
                <ArrowUpRight />
              </a>
            ) : (
              <button type="button" className="btn btn--disabled" aria-disabled="true" disabled>
                <span className="btn__label">{UI.comingSoon}</span>
              </button>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
