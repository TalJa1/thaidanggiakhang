import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LINKS } from "../config/links";
import { NAV, SITE, UI } from "../data/content";
import { getFps } from "../lib/perf";
import { scrollToY } from "../lib/scroll";
import { pad } from "../lib/util";
import { ArrowUpRight, LogoMark } from "./Icons";

function utcOffset(d: Date) {
  const m = -d.getTimezoneOffset();
  const sign = m >= 0 ? "+" : "-";
  return `UTC${sign}${pad(Math.abs(m) / 60)}:${pad(Math.abs(m) % 60)}`;
}

/** Live status strip: real local time, time since page load and frame rate. */
function StatusStrip() {
  const clock = useRef<HTMLSpanElement>(null);
  const rec = useRef<HTMLSpanElement>(null);
  const fps = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      if (clock.current) clock.current.textContent = `${utcOffset(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      const s = performance.now() / 1000;
      if (rec.current) rec.current.textContent = `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}`;
      if (fps.current) fps.current.textContent = pad(getFps(), 2);
    };
    update();
    const id = window.setInterval(update, 500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="status" aria-hidden="true">
      <span className="status__item">
        <i className="dot-ok" /> ONLINE
      </span>
      <span className="status__item">
        <b ref={clock}>UTC</b>
      </span>
      <span className="status__item">
        REC <b ref={rec}>00:00:00</b>
      </span>
      <span className="status__item">
        FPS <b ref={fps}>60</b>
      </span>
      <span className="status__item status__sys">SYS · OK</span>
    </div>
  );
}

export default function Footer() {
  return (
    <footer id="connect" className="footer" data-section="">
      <div className="container footer__inner">
        <div className="footer__top">
          <Link to="/" className="brand brand--lg">
            <LogoMark />
            <span className="brand__name">{SITE.name}</span>
          </Link>
          <p className="footer__aqua">
            {UI.learnMoreAqua}{" "}
            <a href={LINKS.aquarescueFacebook} target="_blank" rel="noopener noreferrer" className="link-u">
              {UI.facebookPage}
              <ArrowUpRight />
            </a>
          </p>
        </div>

        <p className="footer__giant" aria-hidden="true">
          {SITE.name}
        </p>

        <div className="footer__bottom">
          <nav aria-label="Footer">
            <ul className="footer__nav">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__meta">
            <p>{SITE.copyright}</p>
            <button type="button" className="footer__top-btn" onClick={() => scrollToY(0)}>
              {UI.backToTop}
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                <path d="M8 13V3M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <StatusStrip />
    </footer>
  );
}
