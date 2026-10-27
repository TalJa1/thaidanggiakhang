import { useMemo, useState, type CSSProperties } from "react";
import { imageCandidates, type ImageName } from "../config/media";
import { UI } from "../data/content";
import { openLightbox, type LightboxImage } from "../lib/events";
import { Expand } from "./Icons";

interface Props {
  name: ImageName;
  alt: string;
  /** CSS aspect-ratio reserved before load, e.g. "4 / 3". */
  ratio?: string;
  fit?: "cover" | "contain";
  position?: string;
  /** Hero image: eager + high fetch priority. */
  priority?: boolean;
  /** Show on a light paper mat (medals, certificates). */
  mat?: boolean;
  className?: string;
  sizes?: string;
  /** Click to open the photo full-screen (default true). */
  expand?: boolean;
  /** More photos/videos to browse after this one when it is expanded. */
  more?: LightboxImage[];
}

// Remember what worked / failed so a slot used on several pages does not retry.
const bad = new Set<string>();
const good = new Map<string, string>();

function nextUsable(list: string[], from: number) {
  let i = from;
  while (i < list.length && bad.has(list[i])) i++;
  return i;
}

export default function Img(props: Props) {
  return <ImgSlot key={props.name} {...props} />;
}

function ImgSlot({ name, alt, ratio = "4 / 3", fit = "cover", position = "50% 30%", priority, mat, className = "", sizes, expand = true, more }: Props) {
  const candidates = useMemo(() => imageCandidates(name), [name]);
  const [index, setIndex] = useState(() => {
    const known = good.get(name);
    const k = known ? candidates.indexOf(known) : -1;
    return k >= 0 ? k : nextUsable(candidates, 0);
  });
  const src = candidates[index];
  const style = { aspectRatio: ratio } as CSSProperties;
  const cls = `img ${mat ? "img--mat" : ""} ${fit === "contain" ? "img--contain" : ""} ${className}`;

  if (!src) {
    return (
      <div className={`${cls} img--empty`} style={style} role="img" aria-label={alt} data-lock="">
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <div className={cls} style={style} data-lock="">
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        style={{ objectFit: fit, objectPosition: position }}
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0) el.parentElement?.classList.add("is-loaded");
        }}
        onLoad={(e) => {
          good.set(name, src);
          e.currentTarget.parentElement?.classList.add("is-loaded");
        }}
        onError={() => {
          bad.add(src);
          setIndex((i) => nextUsable(candidates, i + 1));
        }}
      />
      {expand && (
        <button type="button" className="img__zoom" aria-label={`${UI.expandImage}: ${alt}`} onClick={() => openLightbox(more?.length ? { src, alt, gallery: [{ src, alt }, ...more], index: 0 } : { src, alt })}>
          <span className="img__zoom-icon" aria-hidden="true">
            <Expand />
          </span>
        </button>
      )}
    </div>
  );
}

export function ImagePlaceholder({ label = UI.imageComingSoon }: { label?: string }) {
  return (
    <div className="ph">
      <span className="ph__grid" aria-hidden="true" />
      <span className="ph__scan" aria-hidden="true" />
      <span className="ph__c ph__c--tl" aria-hidden="true" />
      <span className="ph__c ph__c--tr" aria-hidden="true" />
      <span className="ph__c ph__c--bl" aria-hidden="true" />
      <span className="ph__c ph__c--br" aria-hidden="true" />
      <svg className="ph__icon" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17" cy="20" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 34l10-9 7 6 6-5 9 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="ph__label">{label}</span>
    </div>
  );
}
