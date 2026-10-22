import type { ReactNode } from "react";

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}

/** Page section: registers itself with the ScrollRuler via data-section. */
export default function Section({ id, className = "", children, labelledBy }: Props) {
  return (
    <section id={id} className={`section ${className}`} data-section="" aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="eyebrow__mark" aria-hidden="true" />
      {children}
    </p>
  );
}
