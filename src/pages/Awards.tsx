import AwardCard from "../components/AwardCard";
import CircuitDivider from "../components/CircuitDivider";
import DecodeText from "../components/DecodeText";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import { AWARDS } from "../data/content";
import { useMeta } from "../hooks/useMeta";

const ALTS: Record<string, string> = {
  "award-wico": "Special Award and Gold Medal certificate from WICO 2026",
  "award-wro": "Gold Award from the World Robot Olympiad 2026",
  "award-seacso": "Bronze Award from SEACSO 2026",
  "award-sports-festival": "Medals from The Asian International School Sports Festival 2026",
  "award-chess": "Third place in chess at The Asian International School Sports Competition",
};

export default function Awards() {
  useMeta("/awards");
  return (
    <div className="page page--awards">
      <Section className="page-hero awards-hero" labelledBy="awards-title">
        <div className="container awards-hero__grid">
          <div>
            <p className="hud-row" aria-hidden="true">
              <i className="dot-ok" /> SYS · LOCK
            </p>
            <DecodeText as="h1" id="awards-title" className="display display--xl" text={AWARDS.title} delay={200} />
          </div>
          <Reveal delay={150}>
            <p className="lead">{AWARDS.intro}</p>
          </Reveal>
        </div>
      </Section>

      {AWARDS.groups.map((g, gi) => (
        <div key={g.label}>
          <CircuitDivider flip={gi % 2 === 1} />
          <Section className="award-group" labelledBy={`group-${gi}`}>
            <div className="container">
              <h2 id={`group-${gi}`} className="group-label">
                <em>{g.label}</em>
              </h2>
              <div className={`award-grid award-grid--${g.items.length}`}>
                {g.items.map((a, i) => (
                  <AwardCard key={a.title} award={a} alt={ALTS[a.image]} index={i} />
                ))}
              </div>
            </div>
          </Section>
        </div>
      ))}
    </div>
  );
}
