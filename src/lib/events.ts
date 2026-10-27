// Tiny cross-component signals.

import { LINKS } from "../config/links";
import { scrollToId } from "./scroll";

const PALETTE_EVENT = "gk:palette";

export function openPalette() {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
}

export function onPaletteOpen(cb: () => void) {
  window.addEventListener(PALETTE_EVENT, cb);
  return () => window.removeEventListener(PALETTE_EVENT, cb);
}

const LIGHTBOX_EVENT = "gk:lightbox";

export interface LightboxImage {
  src: string;
  alt: string;
  /** Set for a video item (shown with controls instead of an <img>). */
  video?: boolean;
}

export interface LightboxOpen extends LightboxImage {
  /** Optional set to browse with prev/next; `index` is where to start. */
  gallery?: LightboxImage[];
  index?: number;
}

export function openLightbox(image: LightboxOpen) {
  window.dispatchEvent(new CustomEvent<LightboxOpen>(LIGHTBOX_EVENT, { detail: image }));
}

export function onLightboxOpen(cb: (image: LightboxOpen) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<LightboxOpen>).detail);
  window.addEventListener(LIGHTBOX_EVENT, handler);
  return () => window.removeEventListener(LIGHTBOX_EVENT, handler);
}

/** "Let's Connect": LINKS.contact when set, otherwise the footer. */
export function connect() {
  if (LINKS.contact) {
    if (LINKS.contact.startsWith("mailto:") || LINKS.contact.startsWith("tel:")) window.location.href = LINKS.contact;
    else window.open(LINKS.contact, "_blank", "noopener,noreferrer");
    return;
  }
  scrollToId("connect");
}
