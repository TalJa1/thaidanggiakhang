import { Fragment } from "react";

/** Renders "A · B · C" as styled items while keeping the exact text (with the dots). */
export default function DotList({ text, className = "", itemClassName = "" }: { text: string; className?: string; itemClassName?: string }) {
  const items = text.split(" · ");
  return (
    <span className={`dotlist ${className}`}>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className={`dotlist__item ${itemClassName}`}>{item}</span>
          {i < items.length - 1 && <span className="dotlist__sep"> · </span>}
        </Fragment>
      ))}
    </span>
  );
}
