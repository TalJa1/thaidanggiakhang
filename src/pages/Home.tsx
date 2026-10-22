import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../lib/gsap";
import CircuitDivider from "../components/CircuitDivider";
import ConnectButton from "../components/ConnectButton";
import DecodeText from "../components/DecodeText";
import DotList from "../components/DotList";
import HudFrame from "../components/HudFrame";
import { ArrowDown, ArrowRight } from "../components/Icons";
import Img from "../components/Img";
import LiveXY from "../components/LiveXY";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import StatsLine from "../components/StatsLine";
import { HOME, NAV, PASSION, PROJECTS, UI } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { scrollToId } from "../lib/scroll";


const QuadcopterWire = lazy(() => import("../sims/QuadcopterWire"));
const SonarRipples = lazy(() => import("../sims/SonarRipples"));

const CARD_ALTS: Record<string, string> = {
  rescue: "The autonomous rescue quadcopter project",
  flood: "The IoT flood monitoring and warning station",
  romad: "ROMAD, the AI museum guide robot",
  cantho: "Flood risk research in Can Tho City",
};

export default function Home() {
  useMeta("/");
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced || !heroRef.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero__main .img img", { scale: 1.08, yPercent: 6, ease: "none", scrollTrigger: st });
      gsap.to(".hero__feature", { yPercent: -22, ease: "none", scrollTrigger: st });
      gsap.to(".hero__quad", { yPercent: -30, ease: "none", scrollTrigger: st });
      gsap.to(".hero__copy", { yPercent: 10, opacity: 0.35, ease: "none", scrollTrigger: st });
    }, heroRef);
    return () => ctx.revert();
  }, [reduced]);

  const projects = HOME.cards.map((c) => ({ ...c, project: PROJECTS.find((p) => p.id === c.id)! }));

  return (
    <div className="page page--home">
      <Section className="hero" labelledBy="home-title">
        <div ref={heroRef} className="container hero__grid">
          <div className="hero__copy">
            <p className="hud-row" aria-hidden="true">
              <i className="dot-ok" /> SYS · ONLINE <span className="hud-row__sep">/</span> <LiveXY />
            </p>
            <DecodeText as="h1" id="home-title" className="display hero__title" text={HOME.hero.title} delay={250} />
            <p className="lead hero__text">{HOME.hero.text}</p>
            <div className="hero__actions">
              <Link to="/about" className="btn btn--primary">
                <span className="btn__label">{HOME.hero.button}</span>
                <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="hero__media">
            <HudFrame label="REC · SCAN · LOCK" className="hero__main">
              <div className="scan-reveal">
                <Img name="home-hero" alt="Thai Dang Gia Khang with an engineering project" ratio="4 / 5" priority position="50% 25%" />
              </div>
            </HudFrame>
            <HudFrame label="TRACK" className="hero__feature">
              <Img name="home-feature" alt="Thai Dang Gia Khang presenting a robotics project" ratio="4 / 3" />
            </HudFrame>
            <div className="hero__quad">
              <Suspense fallback={null}>
                <QuadcopterWire />
              </Suspense>
            </div>
            <div className="hero__ruler" aria-hidden="true" />
          </div>
        </div>

        <div className="keywords">
          <div className="container">
            <p className="keywords__text">
              <DotList text={HOME.keywords} />
            </p>
          </div>
        </div>
      </Section>

      <CircuitDivider />

      <Section className="intro" labelledBy="intro-title">
        <div className="container intro__grid">
          <p className="sec-index" aria-hidden="true">
            01 / 04
          </p>
          <Reveal className="intro__head">
            <h2 id="intro-title" className="h2">
              {HOME.intro.title}
            </h2>
          </Reveal>
          <Reveal className="intro__body" delay={120}>
            <p className="lead">{HOME.intro.text}</p>
            <div className="link-row">
              <Link to="/about" className="link-arrow">
                {HOME.intro.about}
                <ArrowRight />
              </Link>
              <a
                href="#featured"
                className="link-arrow"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("featured");
                }}
              >
                {UI.featured}
                <ArrowDown />
              </a>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="featured" className="featured" labelledBy="featured-title">
        <div className="container">
          <header className="sec-head">
            <p className="sec-index" aria-hidden="true">
              02 / 04
            </p>
            <p className="eyebrow">
              <span className="eyebrow__mark" aria-hidden="true" />
              {UI.featured}
            </p>
            <h2 id="featured-title" className="h2 h2--wide">
              {HOME.featuredLabel}
            </h2>
          </header>
          <div className="cards">
            {projects.map((c, i) => (
              <ProjectCard key={c.id} project={c.project} name={c.name} image={c.image} index={i} alt={CARD_ALTS[c.id]} />
            ))}
          </div>
        </div>
      </Section>

      <Section className="teaser" labelledBy="teaser-title">
        <div className="teaser__waves" aria-hidden="true" />
        <div className="container teaser__grid">
          <Reveal className="teaser__media" variant="clip">
            <HudFrame tone="cyan" label="SIGNAL · SCAN">
              <Img name="aquarescue-hero" alt="Aquarescue water-safety activity with children in Can Tho" ratio="16 / 11" />
            </HudFrame>
            <div className="teaser__sonar">
              <Suspense fallback={null}>
                <SonarRipples />
              </Suspense>
            </div>
          </Reveal>
          <Reveal className="teaser__copy" delay={120}>
            <p className="sec-index sec-index--cyan" aria-hidden="true">
              03 / 04
            </p>
            <p className="eyebrow eyebrow--cyan">
              <span className="eyebrow__mark" aria-hidden="true" />
              {NAV[2].label}
            </p>
            <h2 id="teaser-title" className="display-2 teaser__title">
              {PASSION.title}
            </h2>
            <p className="teaser__sub">{PASSION.subtitle}</p>
            <StatsLine text={PASSION.stats} />
            <Link to="/passion-project" className="btn btn--cyan">
              <span className="btn__label">{UI.readMore}</span>
              <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </Section>

      <CircuitDivider flip />

      <Section className="purpose" labelledBy="purpose-title">
        <div className="container purpose__grid">
          <p className="sec-index" aria-hidden="true">
            04 / 04
          </p>
          <Reveal>
            <DecodeText as="h2" id="purpose-title" className="display-2" text={HOME.purpose.title} />
          </Reveal>
          <Reveal className="purpose__body" delay={120}>
            <p className="lead">{HOME.purpose.text}</p>
            <ConnectButton label={HOME.purpose.button} />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
