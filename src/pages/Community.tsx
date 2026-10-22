import { lazy, Suspense, type ComponentType } from "react";
import CircuitDivider from "../components/CircuitDivider";
import DecodeText from "../components/DecodeText";
import HudFrame, { SimFallback } from "../components/HudFrame";
import Img from "../components/Img";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import { COMMUNITY, type Initiative } from "../data/content";
import { useMeta } from "../hooks/useMeta";

const VISUALS: Record<Initiative["visual"], ComponentType> = {
  code: lazy(() => import("../sims/CodeTyper")),
  graph: lazy(() => import("../sims/VolunteerGraph")),
  piano: lazy(() => import("../sims/PianoEqualizer")),
};

const ALTS: Record<string, [string, string, string]> = {
  nextgen: ["A NextGen Lab programming lesson with children", "Children learning with NextGen Lab", "A NextGen Lab engineering workshop"],
  giveforward: ["GiveForward volunteers at Phụng Hiệp Primary School", "The Golden Bell Challenge activity", "Gift packages of school supplies being handed out"],
  canvas: ["Piano performance at the Wonderland of Wishes charity concert", "Audience at the Canvas of Sounds charity concert", "Canvas of Sounds event"],
};

function InitiativeBlock({ item, index }: { item: Initiative; index: number }) {
  const Visual = VISUALS[item.visual];
  const titleId = `${item.id}-title`;
  return (
    <section id={item.id} className={`init ${index % 2 ? "init--rev" : ""}`} data-section="" aria-labelledby={titleId}>
      <div className="container init__grid">
        <div className="init__text">
          <Reveal>
            <h2 id={titleId} className="init__title">
              <span className="init__num">{item.num}</span> {item.title}
            </h2>
            <p className="init__role">{item.role}</p>
          </Reveal>
          <Reveal delay={80}>
            {item.paragraphs.map((p) => (
              <p key={p} className="body-lg">
                {p}
              </p>
            ))}
            {item.impactTitle && <h3 className="init__impact">{item.impactTitle}</h3>}
            <ul className="ticklist">
              {item.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="init__media">
          <Reveal className="init__img init__img--0" variant="clip">
            <HudFrame label="REC">
              <Img name={item.images[0]} alt={ALTS[item.id][0]} ratio="4 / 3" />
            </HudFrame>
          </Reveal>
          <Reveal className="init__img init__img--1" delay={100} variant="clip">
            <HudFrame label="SCAN">
              <Img name={item.images[1]} alt={ALTS[item.id][1]} ratio="1 / 1" />
            </HudFrame>
          </Reveal>
          <Reveal className="init__img init__img--2" delay={180} variant="clip">
            <HudFrame label="TRACK">
              <Img name={item.images[2]} alt={ALTS[item.id][2]} ratio="1 / 1" />
            </HudFrame>
          </Reveal>
          <div className="init__visual">
            <Suspense fallback={<SimFallback ratio="3 / 2" />}>
              <Visual />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Community() {
  useMeta("/community");
  return (
    <div className="page page--community">
      <Section className="page-hero community-hero" labelledBy="community-title">
        <div className="container">
          <p className="hud-row" aria-hidden="true">
            <i className="dot-ok" /> SYS · SIGNAL
          </p>
          <DecodeText as="h1" id="community-title" className="display display--xl" text={COMMUNITY.title} delay={200} />
          <p className="subtitle">
            <em>{COMMUNITY.subtitle}</em>
          </p>
        </div>
      </Section>
      {COMMUNITY.items.map((item, i) => (
        <div key={item.id}>
          <CircuitDivider flip={i % 2 === 1} />
          <InitiativeBlock item={item} index={i} />
        </div>
      ))}
    </div>
  );
}
