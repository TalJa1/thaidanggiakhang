import { useRef } from "react";
import { useInView } from "../hooks/useInView";
import type { ProjectId } from "../data/content";

/** Tiny looping corner animation for the Home project cards (CSS, paused off-screen). */
export default function MiniAnim({ kind }: { kind: ProjectId }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={`mini mini--${kind} ${inView ? "is-play" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 56 56">
        <rect x="0.5" y="0.5" width="55" height="55" rx="6" className="mini__bg" />
        {kind === "rescue" && (
          <>
            <circle cx="28" cy="28" r="15" className="mini__orbit" />
            <path d="M24 28h8M28 24v8" className="mini__wp" />
            <g className="mini__spin">
              <g transform="translate(28 13)">
                <path d="M-4 -4L4 4M4 -4L-4 4" className="mini__quad" />
                <circle cx="-4" cy="-4" r="1.8" className="mini__rot" />
                <circle cx="4" cy="-4" r="1.8" className="mini__rot" />
                <circle cx="-4" cy="4" r="1.8" className="mini__rot" />
                <circle cx="4" cy="4" r="1.8" className="mini__rot" />
              </g>
            </g>
          </>
        )}
        {kind === "flood" && (
          <>
            <rect x="20" y="10" width="16" height="36" rx="3" className="mini__tube" />
            <clipPath id="mini-flood-clip">
              <rect x="21" y="11" width="14" height="34" rx="2" />
            </clipPath>
            <g clipPath="url(#mini-flood-clip)">
              <rect x="21" y="11" width="14" height="34" className="mini__water" />
            </g>
            {[16, 22, 28, 34, 40].map((y) => (
              <path key={y} d={`M14 ${y}h4`} className="mini__tick" />
            ))}
            <circle cx="42" cy="14" r="2.2" className="mini__alert" />
          </>
        )}
        {kind === "romad" && (
          <>
            <path d="M12 40 H24 V18 H44 V38" className="mini__line" />
            <circle r="3.2" className="mini__bot" />
          </>
        )}
        {kind === "cantho" && (
          <>
            <path d="M6 36 C16 30 22 40 32 33 S46 26 50 30" className="mini__river" />
            <circle cx="28" cy="24" r="9" className="mini__pulse" />
            <path d="M28 33 C24 27 21 24 21 20.5 A7 7 0 0 1 35 20.5 C35 24 32 27 28 33Z" className="mini__pin" />
            <circle cx="28" cy="20.5" r="2.4" className="mini__pin-core" />
          </>
        )}
      </svg>
    </div>
  );
}
