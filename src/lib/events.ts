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

/** "Let's Connect": LINKS.contact when set, otherwise the footer. */
export function connect() {
  if (LINKS.contact) {
    if (LINKS.contact.startsWith("mailto:") || LINKS.contact.startsWith("tel:")) window.location.href = LINKS.contact;
    else window.open(LINKS.contact, "_blank", "noopener,noreferrer");
    return;
  }
  scrollToId("connect");
}
