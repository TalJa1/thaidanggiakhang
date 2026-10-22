import { DOCS, mediaUrl, type DocName } from "../config/media";
import { UI } from "../data/content";

export default function DocLink({ name, describedBy }: { name: DocName; describedBy?: string }) {
  return (
    <a className="doc" href={mediaUrl(DOCS[name])} target="_blank" rel="noopener noreferrer" aria-describedby={describedBy}>
      <svg className="doc__icon" viewBox="0 0 40 48" aria-hidden="true">
        <path d="M6 2h20l10 10v32a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="rgba(34,211,238,.06)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M26 2v10h10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="8" y="26" width="24" height="11" rx="1.5" fill="#FF6B1A" />
        <text x="20" y="34.4" textAnchor="middle" fontSize="7.5" fontFamily="JetBrains Mono, monospace" fontWeight="500" fill="#060B14">
          PDF
        </text>
        <path d="M9 17h16M9 21h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      </svg>
      <span className="doc__btn">
        {UI.viewPdf}
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path d="M5 3h8v8M13 3L4 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </a>
  );
}
