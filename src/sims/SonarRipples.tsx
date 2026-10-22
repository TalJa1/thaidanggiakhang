import { useRef } from "react";
import { useInView } from "../hooks/useInView";

/** Concentric sonar rings expanding from a bobbing lifebuoy. */
export default function SonarRipples({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className={`sonar ${inView ? "is-play" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="-200 -200 400 400">
        <g className="sonar__grid">
          <circle r="60" />
          <circle r="120" />
          <circle r="180" />
          <path d="M-190 0H190M0 -190V190" />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} r="180" className="sonar__ring" style={{ animationDelay: `${i * 1.1}s` }} />
        ))}
        <g className="sonar__sweep">
          <path d="M0 0 L180 0 A180 180 0 0 0 155.9 -90 Z" />
        </g>
        <g className="sonar__buoy">
          <circle r="34" fill="none" stroke="#FF6B1A" strokeWidth="16" />
          <circle r="34" fill="none" stroke="#F2F6FB" strokeWidth="16" strokeDasharray="17.8 35.6" strokeDashoffset="8.9" />
          <circle r="42" fill="none" stroke="rgba(6,11,20,.45)" strokeWidth="1" />
          <circle r="26" fill="none" stroke="rgba(6,11,20,.45)" strokeWidth="1" />
        </g>
        <text x="-180" y="-170" className="sonar__lbl">
          SIGNAL · SCAN
        </text>
      </svg>
    </div>
  );
}
