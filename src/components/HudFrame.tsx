import type { CSSProperties, ReactNode } from "react";
import { UI } from "../data/content";

interface Props {
  children: ReactNode;
  /** Decorative mono label (generic HUD vocabulary only). */
  label?: string;
  /** Show the "Schematic" tag (all simulations). */
  schematic?: boolean;
  /** Controls rendered outside the aria-hidden area (e.g. Replay). */
  controls?: ReactNode;
  ratio?: string;
  className?: string;
  tone?: "orange" | "cyan";
}

export default function HudFrame({ children, label, schematic, controls, ratio, className = "", tone = "orange" }: Props) {
  const style = ratio ? ({ "--ratio": ratio } as CSSProperties) : undefined;
  return (
    <div className={`hud hud--${tone} ${ratio ? "hud--ratio" : ""} ${className}`} style={style} data-lock="">
      {(label || schematic) && (
        <div className="hud__bar" aria-hidden="true">
          <span className="hud__dot" />
          <span className="hud__label">{label}</span>
          {schematic && <span className="hud__tag">{UI.schematic}</span>}
        </div>
      )}
      <div className="hud__body">{children}</div>
      {controls && <div className="hud__controls">{controls}</div>}
      <span className="hud__c hud__c--tl" aria-hidden="true" />
      <span className="hud__c hud__c--tr" aria-hidden="true" />
      <span className="hud__c hud__c--bl" aria-hidden="true" />
      <span className="hud__c hud__c--br" aria-hidden="true" />
      <span className="hud__ticks" aria-hidden="true" />
    </div>
  );
}

export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="replay" onClick={onClick}>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v2.8h2.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {UI.replay}
    </button>
  );
}

export function SimFallback({ ratio = "16 / 9" }: { ratio?: string }) {
  return (
    <div className="sim-fallback" style={{ aspectRatio: ratio }} aria-hidden="true">
      <span className="sim-fallback__bar" />
      <span className="sim-fallback__text">SYS · SCAN</span>
    </div>
  );
}
