// Small inline icons (all decorative).

export function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="ico">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="ico">
      <path d="M8 2v11M4 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="ico">
      <path d="M5 3h8v8M13 3L4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Animated chip + crosshair brand mark. */
export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
      <g className="logo-mark__pins" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M11 3.5v4M16 3.5v4M21 3.5v4M11 24.5v4M16 24.5v4M21 24.5v4M3.5 11h4M3.5 16h4M3.5 21h4M24.5 11h4M24.5 16h4M24.5 21h4" />
      </g>
      <rect x="7.5" y="7.5" width="17" height="17" rx="2.5" fill="var(--panel)" stroke="currentColor" strokeWidth="1.4" />
      <g className="logo-mark__cross">
        <circle cx="16" cy="16" r="4.6" fill="none" stroke="var(--orange)" strokeWidth="1.4" strokeDasharray="5 2.2" />
        <path d="M16 9.8v3M16 19.2v3M9.8 16h3M19.2 16h3" stroke="var(--orange)" strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <circle className="logo-mark__core" cx="16" cy="16" r="1.4" fill="var(--cyan)" />
    </svg>
  );
}

export function Lifebuoy({ size = 64, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="24" fill="none" stroke="#FF6B1A" strokeWidth="12" />
      <circle cx="32" cy="32" r="24" fill="none" stroke="#F2F6FB" strokeWidth="12" strokeDasharray="12.57 25.13" strokeDashoffset="6.28" />
      <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(6,11,20,.35)" strokeWidth="1" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(6,11,20,.35)" strokeWidth="1" />
    </svg>
  );
}
