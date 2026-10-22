import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV, SITE, UI } from "../data/content";
import { openPalette } from "../lib/events";
import { lockScroll } from "../lib/scroll";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { LogoMark } from "./Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // transparent at the top, blurred bar after; hides on scroll-down, returns on scroll-up
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      el.classList.toggle("is-solid", y > 32);
      if (y > 180 && y > lastY + 6) el.classList.add("is-hidden");
      else if (y < lastY - 6 || y <= 180) el.classList.remove("is-hidden");
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  useFocusTrap(menuRef, open, () => setOpen(false));

  const close = () => setOpen(false);

  return (
    <>
    <header ref={headerRef} className={`header ${open ? "is-open" : ""}`}>
      <div className="header__inner">
        <Link to="/" className="brand" onClick={close}>
          <LogoMark />
          <span className="brand__name">{SITE.name}</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === "/"} className="nav__link">
                  <span className="nav__br" aria-hidden="true">[</span>
                  {item.label}
                  <span className="nav__br" aria-hidden="true">]</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="kbd-btn" onClick={openPalette} aria-label={UI.palette} aria-keyshortcuts="Control+K Meta+K">
          <kbd>Ctrl</kbd>
          <kbd>K</kbd>
        </button>

        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>

      {/* always mounted so it can animate out; inert + hidden while closed */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mmenu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mmenu__grid" aria-hidden="true" />
        <div className="mmenu__top">
          <span className="mmenu__sys" aria-hidden="true">
            <i className="dot-ok" /> SYS · ONLINE
          </span>
          <button type="button" className="mmenu__close" onClick={close} aria-label="Close">
            <span />
            <span />
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul className="mmenu__list">
            {NAV.map((item, i) => (
              <li key={item.to} className="mmenu__item" style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}>
                <NavLink to={item.to} end={item.to === "/"} className="mmenu__link" onClick={close}>
                  <span className="mmenu__num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
