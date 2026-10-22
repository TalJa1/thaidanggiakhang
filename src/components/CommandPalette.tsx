import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAV, UI } from "../data/content";
import { connect, onPaletteOpen } from "../lib/events";
import { lockScroll } from "../lib/scroll";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface Item {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const show = () => {
    setQuery("");
    setActive(0);
    setOpen(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setActive(0);
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = onPaletteOpen(show);
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  useFocusTrap(panelRef, open, () => setOpen(false));

  const items: Item[] = [
    ...NAV.map((n) => ({ id: n.to, label: n.label, hint: n.to, run: () => navigate(n.to) })),
    { id: "connect", label: UI.connect, hint: "#connect", run: () => window.setTimeout(connect, 60) },
  ];
  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q) || i.hint.includes(q)) : items;
  const current = Math.min(active, Math.max(filtered.length - 1, 0));

  const choose = (item: Item | undefined) => {
    if (!item) return;
    setOpen(false);
    item.run();
  };

  if (!open) return null;

  return (
    <div className="palette" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div ref={panelRef} className="palette__panel" role="dialog" aria-modal="true" aria-labelledby="palette-title">
        <div className="palette__head">
          <span id="palette-title" className="palette__title">
            {UI.palette}
          </span>
          <kbd className="palette__esc">{UI.esc}</kbd>
        </div>
        <div className="palette__search">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            data-autofocus=""
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[current] ? `pal-${current}` : undefined}
            aria-autocomplete="list"
            aria-label={UI.search}
            placeholder={UI.search}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((current + 1) % Math.max(filtered.length, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((current - 1 + filtered.length) % Math.max(filtered.length, 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(filtered[current]);
              }
            }}
          />
        </div>
        <ul id="palette-list" role="listbox" className="palette__list" aria-label={UI.palette}>
          {filtered.map((item, i) => (
            <li
              key={item.id}
              id={`pal-${i}`}
              role="option"
              aria-selected={i === current}
              className={`palette__item ${i === current ? "is-active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(item)}
            >
              <span className="palette__idx" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="palette__label">{item.label}</span>
              <span className="palette__hint" aria-hidden="true">
                {item.hint}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
