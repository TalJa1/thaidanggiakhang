import { useRef } from "react";
import type { Award, Level } from "../data/content";
import { useInView } from "../hooks/useInView";
import MedalTilt from "../sims/MedalTilt";
import { ArrowUpRight } from "./Icons";
import { openLightbox } from "../lib/events";
import Img from "./Img";

const TONE: Record<Level, string> = { gold: "#F5C451", silver: "#C9D3E0", bronze: "#D58A55", third: "#22D3EE" };

function MedalIcon({ level }: { level: Level }) {
  const c = TONE[level];
  if (level === "third") {
    // trophy
    return (
      <svg viewBox="0 0 48 48" className="award__icon" aria-hidden="true">
        <path d="M15 8h18v9a9 9 0 0 1-18 0z" fill="none" stroke={c} strokeWidth="1.8" />
        <path d="M15 11H9a5 5 0 0 0 6 7M33 11h6a5 5 0 0 1-6 7" fill="none" stroke={c} strokeWidth="1.8" />
        <path d="M24 26v7M17 40h14M19 33h10v7H19z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />
        <text x="24" y="20" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill={c}>
          3
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="award__icon" aria-hidden="true">
      <path d="M16 4l6 14M32 4l-6 14" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="30" r="12" fill="none" stroke={c} strokeWidth="1.8" />
      <circle cx="24" cy="30" r="7.5" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M24 25.5l1.4 2.9 3.1.4-2.3 2.2.6 3.1-2.8-1.5-2.8 1.5.6-3.1-2.3-2.2 3.1-.4z" fill={c} />
    </svg>
  );
}

/** Award card that "unlocks" (ring fills, then reveal + shimmer) when it enters the view. */
export default function AwardCard({ award, alt, index }: { award: Award; alt: string; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, threshold: 0.25 });
  const openAt = (i: number) => {
    const main = ref.current?.querySelector<HTMLImageElement>(".award__media img");
    if (!main || !award.gallery) return;
    const alt = main.alt;
    openLightbox({ src: main.src, alt, gallery: [{ src: main.src, alt }, ...award.gallery], index: i });
  };
  return (
    <article ref={ref} className={`award ${inView ? "is-in" : ""}`} style={{ transitionDelay: `${index * 90}ms` }}>
      <MedalTilt>
        <div className="award__card">
          <div className="award__media">
            <Img name={award.image} alt={alt} ratio="4 / 3" fit="contain" mat more={award.gallery} />
            <div className="award__ribbons">
              {award.levels.map((l) => (
                <span key={l.level} className={`ribbon ribbon--${l.level}`}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          <div className="award__body">
            <MedalIcon level={award.levels[0].level} />
            <h3 className="award__title">{award.title}</h3>
            <p className="award__event">{award.event}</p>
            <p className="award__cat">{award.category}</p>
            <p className="award__text">{award.text}</p>
            {(award.gallery || award.link) && (
              <div className="award__extras">
                {award.gallery && (
                  <div className="award__thumbs">
                    {award.gallery.map((g, i) => (
                      <button key={g.src} type="button" className="award__thumb" aria-label={`${g.alt} — enlarge`} onClick={() => openAt(i + 1)}>
                        {g.video ? <span className="award__thumb-play" aria-hidden="true">▶</span> : <img src={g.src} alt="" loading="lazy" />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="award__actions">
                  {award.gallery && (
                    <button type="button" className="award__btn" onClick={() => openAt(1)}>
                      View all {award.gallery.length + 1}
                    </button>
                  )}
                  {award.link && (
                    <a className="award__btn" href={award.link.href} target="_blank" rel="noopener noreferrer">
                      {award.link.label} <ArrowUpRight />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          <span className="award__shimmer" aria-hidden="true" />
        </div>
      </MedalTilt>
      <div className="award__lock" aria-hidden="true">
        <svg viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="30" className="award__lock-track" />
          <circle cx="40" cy="40" r="30" className="award__lock-ring" pathLength={1} />
          <path d="M33 38v-5a7 7 0 0 1 14 0v5M30 38h20v13H30z" className="award__lock-icon" />
        </svg>
      </div>
    </article>
  );
}
