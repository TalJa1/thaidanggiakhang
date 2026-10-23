import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { UI } from "../data/content";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { onLightboxOpen, type LightboxImage } from "../lib/events";
import { lockScroll } from "../lib/scroll";
import { Close } from "./Icons";

/** Full-screen view of a clicked photo; closes on Esc, a click outside the photo or a route change. */
export default function Lightbox() {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const open = image !== null;

  useEffect(() => onLightboxOpen(setImage), []);

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
    <div className="lightbox" onClick={(e) => e.target instanceof HTMLImageElement || setImage(null)}>
      <div ref={panelRef} className="lightbox__panel" role="dialog" aria-modal="true" aria-label={image.alt}>
        <button type="button" className="lightbox__close" aria-label={UI.closeImage} data-autofocus="">
          <Close />
        </button>
        <figure className="lightbox__figure">
          <img src={image.src} alt={image.alt} />
          <figcaption className="lightbox__caption">{image.alt}</figcaption>
        </figure>
      </div>
    </div>
  );
}
