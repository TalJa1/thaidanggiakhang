# Thai Dang Gia Khang — Portfolio

An "engineering console" portfolio: blueprint grid, HUD frames, live telemetry and
hand-built SVG simulations of each project. React 19 + Vite + TypeScript.

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build into dist/
npm run lint
npm run preview   # serve the production build locally
```

Routes: `/` · `/about` · `/passion-project` · `/research` (anchors `#rescue`, `#flood`,
`#romad`, `#cantho`, `#paper`) · `/community` · `/awards`.

## Where things live

| What | File |
| --- | --- |
| **All visible text** | `src/data/content.ts` |
| Image / video / PDF file names | `src/config/media.ts` |
| Contact + research paper + Facebook links | `src/config/links.ts` |
| Pages | `src/pages/*.tsx` |
| Simulations (SVG, lazy-loaded) | `src/sims/*.tsx` + `src/sims/sims.css` |
| Design tokens + all other styles | `src/index.css` |
| Shared animation loop, lite mode, smooth scroll | `src/lib/raf.ts`, `src/lib/perf.ts`, `src/lib/scroll.ts` |

## Media (Firebase Storage)

Files are served from public Firebase Storage URLs, with no Firebase SDK. Everything is configured in
`src/config/media.ts`:

- **`BASE_PATH`**: the folder inside the bucket (`"GiaKhang2/"`). It is case-sensitive; keep the
  trailing slash. To move all media to another folder, change only this value.
- **`IMAGES`**: one entry per image slot (`"slot-name": "file-name.ext"`). To use a different
  file for a slot, change the file name on the right. The slot names on the left are used by the
  pages, so don't rename them.
- **`FALLBACK_EXTENSIONS`**: if the configured file fails to load (wrong extension or case), the
  site tries the same base name with `.jpg`, `.JPG`, `.jpeg`, `.JPEG`, `.png`, `.PNG` and `.webp`.
- **`IMAGE_FALLBACKS`**: if a slot has no usable file at all, show another slot's photo
  (currently `home-feature` → `research-romad-2`).
- If nothing loads, the slot shows an "Image coming soon" HUD placeholder of the same size.
  Slots are never hidden. Uploading the missing JPG makes the photo appear with no code change.
- `.HEIC` and `.PDF` files are never used as images (browsers can't display them). Convert
  them to `.jpg` and upload them under the file name listed in `IMAGES`.
- **`LOCAL_IMAGES`**: slots whose Firebase original is `.HEIC`. They load a converted copy from
  `public/media/<slot>.jpg` first. To refresh those copies after uploading new HEIC photos, run
  `pip install pillow pillow-heif` then `python scripts/heic-to-jpg.py`, and add any new slot name
  to `LOCAL_IMAGES`.
- **`VIDEOS`**: each video lists its sources in order (`.mp4` first, then `.MOV`). If none can
  play, a "Video coming soon" card is shown. Chrome, Edge and Firefox generally cannot play
  `.MOV`, so upload an `.mp4` for full support.
- **`DOCS`**: PDFs opened by the "View PDF" buttons.

### Optimize images before uploading

Several photos are 2–13 MB. Resize them to about **1600 px on the long side** and keep each
file **under about 400 KB** before uploading. For example, with
[ImageMagick](https://imagemagick.org):

```bash
# resize + recompress every JPG in the folder, in place
magick mogrify -resize "1600x1600>" -quality 78 -strip *.jpg *.JPG

# convert an iPhone HEIC photo to an optimized JPG
magick IMG_1234.HEIC -resize "1600x1600>" -quality 80 -strip aquarescue-hero.jpg
```

On macOS you can also use `sips -s format jpeg -Z 1600 input.HEIC --out output.jpg`.
Keep the exact file names from `src/config/media.ts`, including upper or lower case.

## Links

`src/config/links.ts`:

```ts
export const LINKS = {
  contact: "",        // e.g. "mailto:name@example.com" or a LinkedIn URL
  researchPaper: "",  // URL of the Student Research Paper
  aquarescueFacebook: "https://www.facebook.com/profile.php?id=61572936353768",
};
```

- `contact` empty → every "Let's Connect" button scrolls to the footer. When set, it opens
  that link (`mailto:` and `tel:` open in place, other links open in a new tab).
- `researchPaper` empty → the button on `/research#paper` is disabled and reads "Coming soon".

## Motion, accessibility and lite mode

- **Reduced motion** (OS setting `prefers-reduced-motion`): no smooth scrolling, boot sequence,
  text decoding, loops, parallax or custom cursor. Every simulation shows a static final frame.
- **Lite mode**: if the average frame time stays above ~24 ms for 2 seconds, the site sets
  `<html data-lite="true">`. That stops background loops, scanlines, cursor effects and tilt,
  and halves simulation frame rates.
  - Force it on: open any page with **`?lite=1`**.
  - Never auto-enable it: open any page with **`?lite=0`**.
  - The choice is remembered for the browser session (sessionStorage key `gk-lite`).
- The boot sequence runs once per browser session (sessionStorage key `gk-booted`) and can be
  skipped with any key or click.
- `Ctrl K` / `⌘ K` opens the command palette (keyboard navigation, Esc closes).
- Screens under 900 px get no custom cursor, tilt or scanlines, plus lighter simulations.

All simulations are labelled "Schematic". They are illustrations, not real data. The only
numbers they show come from the project text.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project → Import** the repository.
3. Framework Preset: **Vite**. Build command: **`npm run build`**. Output directory: **`dist`**.
4. Deploy.

`vercel.json` already rewrites every path to `/index.html`, so deep links like
`/research#flood` work on reload.
