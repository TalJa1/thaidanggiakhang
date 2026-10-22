import { useState } from "react";
import { mediaUrl, VIDEOS, type VideoName } from "../config/media";
import { UI } from "../data/content";
import { ImagePlaceholder } from "./Img";

function typeFor(file: string) {
  if (/\.mov$/i.test(file)) return "video/quicktime";
  if (/\.webm$/i.test(file)) return "video/webm";
  return "video/mp4";
}

export default function Video({ name, label, ratio = "16 / 9" }: { name: VideoName; label: string; ratio?: string }) {
  const files = VIDEOS[name];
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="img img--empty video" style={{ aspectRatio: ratio }} role="img" aria-label={label}>
        <ImagePlaceholder label={UI.videoComingSoon} />
      </div>
    );
  }

  return (
    <div className="video" style={{ aspectRatio: ratio }} data-lock="">
      <video controls preload="metadata" playsInline aria-label={label} onError={() => setFailed(true)}>
        {files.map((file, i) => (
          <source
            key={file}
            src={mediaUrl(file)}
            type={typeFor(file)}
            // the browser fires "error" on the last <source> once every source failed
            onError={i === files.length - 1 ? () => setFailed(true) : undefined}
          />
        ))}
      </video>
    </div>
  );
}
