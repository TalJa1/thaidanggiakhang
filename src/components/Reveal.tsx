import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "../hooks/useInView";

interface Props {
  children: ReactNode;
  as?: "div" | "li" | "article" | "p" | "header" | "span";
  className?: string;
  delay?: number;
  variant?: "up" | "fade" | "clip";
  id?: string;
}

/** Fades content in once it enters the view. Content is visible by default
 *  (the hidden state only applies under `html.motion-ok`). */
export default function Reveal({ children, as = "div", className = "", delay = 0, variant = "up", id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, rootMargin: "0px 0px -8% 0px" });
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal reveal--${variant} ${inView ? "is-in" : ""} ${className}`}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
