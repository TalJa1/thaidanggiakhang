import CircuitDivider from "../components/CircuitDivider";
import DecodeText from "../components/DecodeText";
import FocusIcon from "../components/FocusIcon";
import HudFrame from "../components/HudFrame";
import Img from "../components/Img";
import LiveXY from "../components/LiveXY";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import { ABOUT } from "../data/content";
import { useMeta } from "../hooks/useMeta";

export default function About() {
  useMeta("/about");
  return (
    <div className="page page--about">
      <Section className="page-hero about-hero" labelledBy="about-title">
        <div className="container about-hero__grid">
          <div className="about-hero__copy">
            <p className="hud-row" aria-hidden="true">
              <i className="dot-ok" /> SYS · SCAN <span className="hud-row__sep">/</span> <LiveXY />
            </p>
            <DecodeText as="h1" id="about-title" className="display about-hero__title" text={ABOUT.title} delay={200} />
          </div>
          <div className="about-hero__media">
            <HudFrame label="SCAN · LOCK" className="about-hero__portrait">
              <div className="scan-reveal scan-reveal--line">
                <Img name="about-main" alt="Portrait of Thai Dang Gia Khang" ratio="4 / 5" priority position="50% 22%" />
              </div>
            </HudFrame>
            <HudFrame label="REC" className="about-hero__work">
              <Img name="about-work" alt="Thai Dang Gia Khang working on an engineering build" ratio="4 / 3" />
            </HudFrame>
          </div>
        </div>
      </Section>

      <CircuitDivider />

      <Section className="focus">
        <div className="container">
          <ul className="focus__grid">
            {ABOUT.cards.map((title, i) => (
              <Reveal as="li" key={title} className="fcard" delay={(i % 3) * 90}>
                <span className="fcard__idx" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <FocusIcon index={i} />
                <h2 className="fcard__title">{title}</h2>
                <span className="fcard__trace" aria-hidden="true" />
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <CircuitDivider flip />

      <Section className="philosophy" labelledBy="philo-title">
        <div className="container philosophy__grid">
          <Reveal>
            <h2 id="philo-title" className="h2">
              {ABOUT.philosophy.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="statement">{ABOUT.philosophy.text}</p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
