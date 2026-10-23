"""Download every .HEIC in the Firebase media folder and save a web-ready JPG copy
to public/media/<base-name>.jpg (max 1600px, quality 80, metadata/GPS stripped).

  pip install pillow pillow-heif
  python scripts/heic-to-jpg.py

Then add the slot name to LOCAL_IMAGES in src/config/media.ts.
"""
import io
import json
import pathlib
import urllib.parse
import urllib.request

import pillow_heif
from PIL import Image, ImageOps

BUCKET = "main-ada2c.firebasestorage.app"
BASE_PATH = "GiaKhang2/"
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "media"
API = f"https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o"

pillow_heif.register_heif_opener()
OUT.mkdir(parents=True, exist_ok=True)

listing = json.load(urllib.request.urlopen(f"{API}?prefix={urllib.parse.quote(BASE_PATH)}&maxResults=1000"))
for item in listing.get("items", []):
    path = item["name"]
    if not path.lower().endswith((".heic", ".heif")):
        continue
    data = urllib.request.urlopen(f"{API}/{urllib.parse.quote(path, safe='')}?alt=media").read()
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    im.thumbnail((1600, 1600), Image.LANCZOS)
    out = OUT / (pathlib.PurePosixPath(path).stem + ".jpg")
    im.save(out, "JPEG", quality=80, optimize=True, progressive=True)
    print(f"{out.name}: {im.width}x{im.height}, {out.stat().st_size // 1024} KB")
