import { useEffect, useLayoutEffect, useState } from "react";

const LINES = ["> init systems … OK", "> load modules … OK", "> sync signal … OK", "> SYS ONLINE"];
const KEY = "gk-booted";
const TOTAL_MS = 1500;
export const BOOTED_EVENT = "gk:booted";

function shouldBoot() {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return sessionStorage.getItem(KEY) !== "1";
  } catch {
    return false;
  }
}

/** Terminal-style boot sequence: once per session, skippable, time-based only. */
export default function BootLoader() {
  const [phase, setPhase] = useState<"run" | "out" | "gone">(() => (shouldBoot() ? "run" : "gone"));

  // hero reveals wait for the overlay (html.is-booting + "gk:booted")
  useLayoutEffect(() => {
    if (phase !== "run") return;
    const html = document.documentElement;
    html.classList.add("is-booting");
    return () => {
      html.classList.remove("is-booting");
      window.dispatchEvent(new Event(BOOTED_EVENT));
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "gone") return;
    if (phase === "out") {
      const t = window.setTimeout(() => setPhase("gone"), 320);
      return () => window.clearTimeout(t);
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    const finish = () => setPhase("out");
    const t = window.setTimeout(finish, TOTAL_MS);
    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`boot ${phase === "out" ? "is-out" : ""}`} aria-hidden="true">
      <div className="boot__term">
        {LINES.map((l, i) => (
          <p key={l} className="boot__line" style={{ animationDelay: `${120 + i * 260}ms` }}>
            {l}
          </p>
        ))}
        <div className="boot__bar">
          <span />
        </div>
      </div>
    </div>
  );
}
