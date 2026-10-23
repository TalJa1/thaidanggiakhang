import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import DepthGauge from "../components/DepthGauge";
import DotList from "../components/DotList";
import HudFrame from "../components/HudFrame";
import { ArrowUpRight } from "../components/Icons";
import Img from "../components/Img";
import OdometerStat from "../components/OdometerStat";
import Reveal from "../components/Reveal";
import Section, { Eyebrow } from "../components/Section";
import StatsLine from "../components/StatsLine";
import Video from "../components/Video";
import WaveDivider from "../components/WaveDivider";
import { BookIcon, LifeJacketIcon, MegaphoneIcon } from "../components/WaterIcons";
import { LINKS } from "../config/links";
import { PASSION, UI } from "../data/content";
import { useMeta } from "../hooks/useMeta";
import { useReducedMotion } from "../hooks/useReducedMotion";


const SonarRipples = lazy(() => import("../sims/SonarRipples"));

const APPROACH_ICONS = { education: BookIcon, awareness: MegaphoneIcon, access: LifeJacketIcon } as const;

const WHAT_ALTS: Record<string, string> = {
  "aquarescue-education-2": "A drowning-prevention session with primary school students",
  "aquarescue-posters-1": "A drowning-prevention poster displayed in the community",
  "aquarescue-posters-2": "Aquarescue posters at a community location in Can Tho",
  "aquarescue-lifejackets-1": "Life jackets provided to Phung Hiep Primary School",
  "aquarescue-lifejackets-2": "Students with the donated life jackets",
  "aquarescue-school-1": "A classroom being restored after flood damage",
  "aquarescue-school-2": "Restored classroom facilities after the floods",
};

/** Layered wave lines used in the hero (parallax via ScrollTrigger). */
function WaveLayers() {
  const rows = [0, 1, 2, 3];
  return (
    <div className="wlayers" aria-hidden="true">
      {rows.map((r) => {
        let d = "M0 40";
        for (let x = 0; x <= 2880; x += 30) d += ` L${x} ${(40 + Math.sin((x / (300 + r * 90)) * Math.PI * 2) * (10 - r * 2)).toFixed(1)}`;
        return (
          <svg key={r} className={`wlayers__row wlayers__row--${r}`} viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d={d} />
          </svg>
        );
      })}
    </div>
  );
}

export default function PassionProject() {
  useMeta("/passion-project");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const P = PASSION;

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const st = { trigger: ".aqua-hero", start: "top top", end: "bottom top", scrub: true };
      gsap.utils.toArray<HTMLElement>(".wlayers__row").forEach((row, i) => {
        gsap.to(row, { y: -30 - i * 26, ease: "none", scrollTrigger: st });
      });
      gsap.to(".aqua-hero__media .img img", { scale: 1.08, ease: "none", scrollTrigger: st });
      gsap.to(".aqua-hero__sonar", { yPercent: -20, ease: "none", scrollTrigger: st });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="page page--water" ref={rootRef}>
      <DepthGauge />

      <Section className="aqua-hero" labelledBy="aqua-title">
        <div className="container aqua-hero__grid">
          <div className="aqua-hero__copy">
            <div className="aqua-hero__logo">
              <Img name="aquarescue-logo" alt="Aquarescue logo" ratio="1 / 1" fit="contain" priority expand={false} />
            </div>
            <h1 id="aqua-title" className="display aqua-hero__title">
              {P.title}
            </h1>
            <p className="aqua-hero__sub">{P.subtitle}</p>
            <p className="chips">
              <DotList text={P.tags} itemClassName="chip chip--cyan" />
            </p>
          </div>
          <div className="aqua-hero__media">
            <HudFrame tone="cyan" label="SIGNAL · SCAN">
              <Img name="aquarescue-hero" alt="Aquarescue water-safety activity with children in Can Tho" ratio="5 / 4" priority />
            </HudFrame>
            <div className="aqua-hero__sonar">
              <Suspense fallback={null}>
                <SonarRipples />
              </Suspense>
            </div>
          </div>
        </div>
        <WaveLayers />
      </Section>

      {/* 01 — The Mission */}
      <Section className="aqua-sec mission" labelledBy="mission-title">
        <div className="container aqua-split">
          <Reveal className="aqua-split__head">
            <Eyebrow className="eyebrow--cyan">{P.mission.label}</Eyebrow>
            <h2 id="mission-title" className="h2">
              {P.mission.heading}
            </h2>
          </Reveal>
          <Reveal className="aqua-split__body" delay={100}>
            {P.mission.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "lead" : "body-lg"}>
                {p}
              </p>
            ))}
          </Reveal>
        </div>
        <div className="container">
          <Reveal className="aqua-stats">
            <StatsLine text={P.stats} className="statsline--xl" />
          </Reveal>
        </div>
      </Section>

      <WaveDivider />

      {/* 02 — Why Aquarescue? */}
      <Section className="aqua-sec why" labelledBy="why-title">
        <div className="container">
          <div className="aqua-split">
            <Reveal className="aqua-split__head">
              <Eyebrow className="eyebrow--cyan">{P.why.label}</Eyebrow>
              <h2 id="why-title" className="h2">
                {P.why.heading}
              </h2>
            </Reveal>
            <Reveal className="aqua-split__body" delay={100}>
              {P.why.paragraphs.map((p) => (
                <p key={p} className="body-lg">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <ul className="approach">
            {P.why.approaches.map((a, i) => {
              const Icon = APPROACH_ICONS[a.id as keyof typeof APPROACH_ICONS];
              return (
                <Reveal as="li" key={a.id} className="approach__card" delay={i * 110}>
                  <Icon />
                  <h3 className="approach__title">
                    {a.title}
                    <span className="sr-only"> — </span>
                  </h3>
                  <p>{a.text}</p>
                </Reveal>
              );
            })}
          </ul>
          <Reveal>
            <p className="lead aqua-closing">{P.why.closing}</p>
          </Reveal>
        </div>
      </Section>

      <WaveDivider />

      {/* 03 — What We Do */}
      <Section className="aqua-sec what" labelledBy="what-title">
        <div className="container">
          <Reveal className="aqua-head">
            <Eyebrow className="eyebrow--cyan">{P.what.label}</Eyebrow>
            <h2 id="what-title" className="h2">
              {P.what.heading}
            </h2>
          </Reveal>
          <ol className="actions">
            {P.what.items.map((item, i) => (
              <li key={item.title} className={`action ${i % 2 ? "action--rev" : ""}`}>
                <Reveal className="action__text">
                  <h3 className="action__title">
                    <span className="action__num">{item.num}</span> {item.title}
                  </h3>
                  {item.paragraphs.map((p) => (
                    <p key={p} className="body-lg">
                      {p}
                    </p>
                  ))}
                </Reveal>
                <div className={`action__media action__media--${item.images.length + (item.video ? 1 : 0)}`}>
                  {item.images.map((img, k) => (
                    <Reveal key={img} variant="clip" delay={k * 110}>
                      <HudFrame tone="cyan" label={k ? "REC" : "SCAN"}>
                        <Img name={img} alt={WHAT_ALTS[img]} ratio="4 / 3" />
                      </HudFrame>
                    </Reveal>
                  ))}
                  {item.video && (
                    <Reveal variant="clip" delay={110}>
                      <HudFrame tone="cyan" label="REC">
                        <Video name="aquarescue-education-1" label="Video of an Aquarescue water-safety education session" ratio="4 / 3" />
                      </HudFrame>
                    </Reveal>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <WaveDivider />

      {/* 04 — The Impact */}
      <Section className="aqua-sec impact" labelledBy="impact-title">
        <div className="container">
          <div className="aqua-split">
            <Reveal className="aqua-split__head">
              <Eyebrow className="eyebrow--cyan">{P.impact.label}</Eyebrow>
              <h2 id="impact-title" className="h2">
                {P.impact.heading}
              </h2>
            </Reveal>
            <Reveal className="aqua-split__body" delay={100}>
              <p className="lead">{P.impact.intro}</p>
            </Reveal>
          </div>
          <ul className="gauges">
            {P.impact.stats.map((s, i) => (
              <Reveal as="li" key={s.label} className="gauge" delay={(i % 3) * 100}>
                <svg className="gauge__dial" viewBox="0 0 120 64" aria-hidden="true">
                  <path d="M10 60 A50 50 0 0 1 110 60" className="gauge__track" />
                  <path d="M10 60 A50 50 0 0 1 110 60" className="gauge__arc" pathLength={1} />
                  {Array.from({ length: 11 }, (_, k) => (
                    <path key={k} d="M60 14 V20" transform={`rotate(${-90 + k * 18} 60 60)`} className="gauge__tick" />
                  ))}
                  <path d="M60 60 L60 22" className="gauge__needle" />
                  <circle cx="60" cy="60" r="4" className="gauge__hub" />
                </svg>
                <OdometerStat value={s.value} className="gauge__value" />
                <p className="gauge__label">{s.label}</p>
                <span className="gauge__id" aria-hidden="true">
                  SIGNAL · {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="note">
              <em>{P.impact.note}</em>
            </p>
            <p className="body-lg aqua-closing">{P.impact.closing}</p>
          </Reveal>
        </div>
      </Section>

      <WaveDivider />

      {/* 05 — My Role as Founder */}
      <Section className="aqua-sec role" labelledBy="role-title">
        <div className="container role__grid">
          <Reveal className="role__media" variant="clip">
            <HudFrame tone="cyan" label="SCAN · LOCK">
              <Img name="aquarescue-founder" alt="Thai Dang Gia Khang, founder of Aquarescue" ratio="4 / 5" position="50% 25%" />
            </HudFrame>
          </Reveal>
          <div className="role__text">
            <Reveal>
              <Eyebrow className="eyebrow--cyan">{P.role.label}</Eyebrow>
              <h2 id="role-title" className="h2">
                {P.role.heading}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="body-lg">{P.role.intro}</p>
              <p className="role__list-title">{P.role.listTitle}</p>
              <ul className="ticklist ticklist--cyan">
                {P.role.list.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
              <p className="body-lg">{P.role.closing}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <WaveDivider />

      {/* 06 — What I Learned */}
      <Section className="aqua-sec learned" labelledBy="learned-title">
        <div className="container aqua-split">
          <Reveal className="aqua-split__head">
            <Eyebrow className="eyebrow--cyan">{P.learned.label}</Eyebrow>
            <h2 id="learned-title" className="h2">
              {P.learned.heading}
            </h2>
          </Reveal>
          <div className="aqua-split__body learned__body">
            {P.learned.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <p className={i === 0 ? "lead" : "body-lg"}>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <WaveDivider />

      {/* 07 — Looking Ahead */}
      <Section className="aqua-sec ahead" labelledBy="ahead-title">
        <div className="container aqua-split">
          <Reveal className="aqua-split__head">
            <Eyebrow className="eyebrow--cyan">{P.ahead.label}</Eyebrow>
            <h2 id="ahead-title" className="h2">
              {P.ahead.heading}
            </h2>
          </Reveal>
          <Reveal className="aqua-split__body" delay={100}>
            {P.ahead.paragraphs.map((p) => (
              <p key={p} className="body-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Join the Mission */}
      <Section className="join" labelledBy="join-title">
        <div className="join__sonar">
          <Suspense fallback={null}>
            <SonarRipples />
          </Suspense>
        </div>
        <div className="container join__inner">
          <Reveal>
            <Eyebrow className="eyebrow--cyan">{P.join.label}</Eyebrow>
            <h2 id="join-title" className="display-2">
              {P.join.heading}
            </h2>
            <p className="lead">{P.join.text}</p>
            <p className="join__link">
              {UI.learnMoreAqua}{" "}
              <a href={LINKS.aquarescueFacebook} target="_blank" rel="noopener noreferrer" className="btn btn--cyan">
                <span className="btn__label">{UI.facebookPage}</span>
                <ArrowUpRight />
              </a>
            </p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
