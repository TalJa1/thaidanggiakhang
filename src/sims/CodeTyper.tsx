import { useRef } from "react";
import HudFrame from "../components/HudFrame";
import { useSim } from "../hooks/useSim";
import { span } from "../lib/util";
import "./sims.css";

// A short generic loop: no real data.
const CODE = `def blink(led, times):
    for i in range(times):
        led.on()
        wait(0.5)
        led.off()

blink(led, 3)`;

const KEYWORDS = new Set(["def", "for", "in"]);
const BUILTINS = new Set(["range", "wait"]);

interface Token {
  text: string;
  cls: string;
  start: number;
}

function tokenize(src: string) {
  const lines: Token[][] = [];
  let offset = 0;
  src.split("\n").forEach((line) => {
    const out: Token[] = [];
    const re = /(\s+|[A-Za-z_]\w*|\d+(?:\.\d+)?|[^\sA-Za-z_\d])/g;
    let m: RegExpExecArray | null;
    let prev = "";
    while ((m = re.exec(line))) {
      const text = m[0];
      let cls = "ct-p";
      if (/^\s+$/.test(text)) cls = "";
      else if (KEYWORDS.has(text)) cls = "ct-k";
      else if (BUILTINS.has(text)) cls = "ct-b";
      else if (/^\d/.test(text)) cls = "ct-n";
      else if (/^[A-Za-z_]/.test(text)) cls = prev === "def" ? "ct-f" : "ct-v";
      if (cls) prev = text;
      out.push({ text, cls, start: offset + m.index });
    }
    lines.push(out);
    offset += line.length + 1;
  });
  return lines;
}

const LINES = tokenize(CODE);
const FLAT = LINES.flat();
const TOTAL = CODE.length;
const TYPE_END = 5.6;
const DURATION = 9.5;

export default function CodeTyper() {
  const codeRef = useRef<HTMLDivElement>(null);
  const { hostRef } = useSim(
    (t) => {
      const root = codeRef.current;
      if (!root) return;
      const shown = Math.floor(span(t, 0.3, TYPE_END) * TOTAL);
      const spans = root.querySelectorAll<HTMLSpanElement>("[data-t]");
      let cursorAt = -1;
      spans.forEach((el, i) => {
        const tok = FLAT[i];
        const n = Math.max(0, Math.min(tok.text.length, shown - tok.start));
        const text = tok.text.slice(0, n);
        if (el.textContent !== text) el.textContent = text;
        if (n > 0) cursorAt = i;
      });
      spans.forEach((el, i) => el.classList.toggle("is-cur", i === cursorAt && t < TYPE_END + 0.2));
      root.classList.toggle("is-run", t > TYPE_END + 0.4 && t < TYPE_END + 1.6);
      root.classList.toggle("is-out", t > TYPE_END + 1.0);
      root.classList.toggle("is-empty", shown === 0);
    },
    { duration: DURATION, staticT: DURATION - 0.1 },
  );

  return (
    <HudFrame label="SYS · REC" schematic tone="cyan">
      <div ref={hostRef} className="sim sim--code" aria-hidden="true">
        <div className="ct" ref={codeRef}>
          <div className="ct__bar">
            <i />
            <i />
            <i />
            <span className="ct__tab">SYS</span>
            <span className="ct__run">▶</span>
          </div>
          <div className="ct__body">
            {LINES.map((line, li) => (
              <div className="ct__line" key={li}>
                <span className="ct__ln">{li + 1}</span>
                <span className="ct__code">
                  {line.map((tok) => (
                    <span key={tok.start} data-t="" className={tok.cls}>
                      {tok.text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
            <div className="ct__line ct__out">
              <span className="ct__ln">›</span>
              <span className="ct__code">OK</span>
            </div>
          </div>
        </div>
      </div>
    </HudFrame>
  );
}
