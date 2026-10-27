import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { UI } from "../data/content";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { onLightboxOpen, type LightboxImage } from "../lib/events";
import { lockScroll } from "../lib/scroll";
import { ArrowRight, Close } from "./Icons";

/** Full-screen view of a clicked photo; closes on Esc, a click outside the photo or a route change. */
export default function Lightbox() {
  const [gallery, setGallery] = useState<LightboxImage[] | null>(null);
  const [index, setIndex] = useState(0);
  const image = gallery ? gallery[index] : null;
  const count = gallery?.length ?? 0;
  const setImage = (next: null) => setGallery(next);
  const step = (d: number) => setIndex((i) => (i + d + count) % count);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const open = image !== null;

  useEffect(
    () =>
      onLightboxOpen(({ gallery: list, index: start = 0, ...single }) => {
        setGallery(list?.length ? list : [single]);
        setIndex(start);
      }),
    []
  );

  useEffect(() => {
    if (!open || count < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % count);
      else if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, count]);

  // close when the page changes underneath (back button)
  const [shownOn, setShownOn] = useState(pathname);
  if (shownOn !== pathname) {
    setShownOn(pathname);
    setImage(null);
  }

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  useFocusTrap(panelRef, open, () => setImage(null));

  if (!image) return null;

  return (
    // any click outside the photo itself closes
    <div className="lightbox" onClick={(e) => e.target instanceof HTMLImageElement || e.target instanceof HTMLVideoElement || setImage(null)}>
      <div ref={panelRef} className="lightbox__panel" role="dialog" aria-modal="true" aria-label={image.alt}>
        <button type="button" className="lightbox__close" aria-label={UI.closeImage} data-autofocus="">
          <Close />
        </button>
        <figure className="lightbox__figure">
          {image.video ? (
            <video key={image.src} src={image.src} controls playsInline autoPlay muted loop aria-label={image.alt} />
          ) : (
            <img src={image.src} alt={image.alt} />
          )}
          <figcaption className="lightbox__caption">
            {image.alt}
            {count > 1 && ` · ${index + 1} / ${count}`}
          </figcaption>
        </figure>
        {count > 1 && (
          <>
            <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Previous" onClick={(e) => (e.stopPropagation(), step(-1))}>
              <ArrowRight size={18} />
            </button>
            <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Next" onClick={(e) => (e.stopPropagation(), step(1))}>
              <ArrowRight size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
