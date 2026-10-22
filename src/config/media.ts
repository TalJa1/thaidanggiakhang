export const BUCKET = "main-ada2c.firebasestorage.app";
export const BASE_PATH = "GiaKhang2/"; // case-sensitive; keep the trailing slash

export const IMAGES = {
  "home-hero": "home-hero.png",
  "home-feature": "home-feature.jpg",                 // not uploaded yet (see IMAGE_FALLBACKS)
  "about-main": "about-main.jpg",
  "about-work": "about-work.jpg",                     // only a PDF exists so far
  "research-rescue-1": "research-rescue-1.jpg",       // (HEIC) JPG to be uploaded
  "research-rescue-2": "research-rescue-2.JPG",
  "research-flood-1": "research-flood-1.jpg",         // only a PDF exists so far
  "research-flood-2": "research-flood-2.jpg",         // not uploaded yet
  "research-romad-1": "research-romad-1.jpg",         // only a PDF exists so far
  "research-romad-2": "research-romad-2.JPG",
  "research-cantho-1": "research-cantho-1.jpg",       // not uploaded yet
  "research-cantho-2": "research-cantho-2.jpg",       // not uploaded yet
  "community-nextgen-1": "community-nextgen-1.JPG",
  "community-nextgen-2": "community-nextgen-2.jpg",   // (HEIC) JPG to be uploaded
  "community-nextgen-3": "community-nextgen-3.JPG",
  "community-giveforward-1": "community-giveforward-1.jpg", // (HEIC)
  "community-giveforward-2": "community-giveforward-2.jpg", // (HEIC)
  "community-giveforward-3": "community-giveforward-3.jpg", // (HEIC)
  "community-canvas-1": "community-canvas-1.jpg",
  "community-canvas-2": "community-canvas-2.jpg",
  "community-canvas-3": "community-canvas-3.JPG",
  "award-wico": "award-wico.jpg",
  "award-wro": "award-wro.webp",
  "award-seacso": "award-seacso.webp",
  "award-sports-festival": "award-sports-festival.webp",
  "award-chess": "award-chess.webp",
  "aquarescue-logo": "aquarescue-logo.png",
  "aquarescue-hero": "aquarescue-hero.jpg",                   // (HEIC)
  "aquarescue-education-2": "aquarescue-education-2.jpg",     // (HEIC)
  "aquarescue-posters-1": "aquarescue-posters-1.jpg",         // (HEIC)
  "aquarescue-posters-2": "aquarescue-posters-2.jpg",         // (HEIC)
  "aquarescue-lifejackets-1": "aquarescue-lifejackets-1.jpg", // (HEIC)
  "aquarescue-lifejackets-2": "aquarescue-lifejackets-2.jpg", // (HEIC)
  "aquarescue-school-1": "aquarescue-school-1.jpg",           // (HEIC)
  "aquarescue-school-2": "aquarescue-school-2.jpg",           // (HEIC)
  "aquarescue-founder": "aquarescue-founder.jpg"              // (HEIC)
} as const;

// If an image slot has no usable file yet, show another real photo instead of a placeholder.
export const IMAGE_FALLBACKS: Record<string, string> = {
  "home-feature": "research-romad-2"
};

export const VIDEOS = {
  // Source is currently a .MOV; offer both an .mp4 and the .MOV (video/quicktime) as <source> elements.
  "aquarescue-education-1": ["aquarescue-education-1.mp4", "aquarescue-education-1.MOV"]
} as const;

export const DOCS = {
  "research-flood-1": "research-flood-1.pdf",
  "research-romad-1": "research-romad-1.pdf"
} as const;

// If a configured image fails (wrong extension/case), try the same base name with these extensions before giving up.
export const FALLBACK_EXTENSIONS = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".webp"];

export type ImageName = keyof typeof IMAGES;
export type VideoName = keyof typeof VIDEOS;
export type DocName = keyof typeof DOCS;

/** Public download URL for a file inside BASE_PATH. */
export function mediaUrl(fileName: string): string {
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(BASE_PATH + fileName)}?alt=media`;
}

// Browsers cannot display these as <img>, so they are never used as an image source.
const NOT_DISPLAYABLE = /\.(heic|heif|pdf)$/i;

/**
 * Ordered list of URLs to try for an image slot: the configured file, the same
 * base name with each FALLBACK_EXTENSIONS entry, then the IMAGE_FALLBACKS slot.
 */
export function imageCandidates(name: string, seen = new Set<string>()): string[] {
  if (seen.has(name)) return [];
  seen.add(name);
  const file = (IMAGES as Record<string, string>)[name];
  const out: string[] = [];
  if (file) {
    const dot = file.lastIndexOf(".");
    const base = dot > 0 ? file.slice(0, dot) : file;
    const ext = dot > 0 ? file.slice(dot) : "";
    if (!NOT_DISPLAYABLE.test(file)) out.push(mediaUrl(file));
    for (const e of FALLBACK_EXTENSIONS) {
      if (e !== ext) out.push(mediaUrl(base + e));
    }
  }
  const fb = IMAGE_FALLBACKS[name];
  if (fb) out.push(...imageCandidates(fb, seen));
  return out;
}
