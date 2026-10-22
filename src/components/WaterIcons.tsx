// Animated icons for the three Aquarescue approaches.

export function BookIcon() {
  return (
    <svg viewBox="0 0 64 64" className="wicon wicon--book" aria-hidden="true">
      <path d="M32 18v32" className="wicon__spine" />
      <path d="M32 18c-6-4-14-5-22-3v32c8-2 16-1 22 3" className="wicon__page wicon__page--l" />
      <path d="M32 18c6-4 14-5 22-3v32c-8-2-16-1-22 3" className="wicon__page wicon__page--r" />
      <path d="M32 18c4-5 9-7 14-7v30c-5 0-10 2-14 7" className="wicon__flip" />
      <path d="M15 24h10M15 30h10M15 36h8M39 24h10M39 30h10" className="wicon__lines" />
    </svg>
  );
}

export function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 64 64" className="wicon wicon--mega" aria-hidden="true">
      <path d="M10 26h8l18-10v32L18 38h-8z" className="wicon__body" />
      <path d="M14 38l3 12h6l-3-12" className="wicon__body" />
      <path d="M43 26a8 8 0 0 1 0 12" className="wicon__wave wicon__wave--1" />
      <path d="M48 21a15 15 0 0 1 0 22" className="wicon__wave wicon__wave--2" />
      <path d="M53 16a22 22 0 0 1 0 32" className="wicon__wave wicon__wave--3" />
    </svg>
  );
}

export function LifeJacketIcon() {
  return (
    <svg viewBox="0 0 64 64" className="wicon wicon--jacket" aria-hidden="true">
      <g className="wicon__bob">
        <path d="M22 8l-10 8v38h16V22z" className="wicon__vest" />
        <path d="M42 8l10 8v38H36V22z" className="wicon__vest" />
        <path d="M22 8c2 6 6 9 10 9s8-3 10-9" className="wicon__collar" />
        <path d="M12 32h16M36 32h16M12 42h16M36 42h16" className="wicon__strap" />
        <path d="M28 32h8M28 42h8" className="wicon__buckle" />
      </g>
      <path d="M4 58c5-3 9-3 14 0s9 3 14 0 9-3 14 0 9 3 14 0" className="wicon__water" />
    </svg>
  );
}
