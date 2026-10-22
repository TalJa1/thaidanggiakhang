import { useState } from "react";
import { useLocation } from "react-router-dom";

const BARS = 8;

/** Quick "circuit wipe" between routes (≤450 ms, CSS only, skipped under reduced motion). */
export default function PageTransition() {
  const location = useLocation();
  const [firstKey] = useState(location.key);
  if (location.key === firstKey) return null;

  return (
    // keyed by path so same-page #hash jumps do not replay the wipe
    <div key={location.pathname} className="wipe" aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => (
        <span key={i} className="wipe__bar" style={{ animationDelay: `${i * 22}ms` }} />
      ))}
      <span className="wipe__scan" />
    </div>
  );
}
