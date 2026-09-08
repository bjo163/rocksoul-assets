#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if command -v magick >/dev/null 2>&1; then
  im() { magick "$@"; }
elif command -v convert >/dev/null 2>&1; then
  im() { convert "$@"; }
else
  echo "ImageMagick is required" >&2
  exit 1
fi

SRC_ROOT="source-inputs/hero"
OUT="moonwitness/cinematic-hero-pack/webp"
mkdir -p "$OUT"

DESKTOP="$SRC_ROOT/ChatGPT Image Sep 8, 2026, 05_02_55 AM (1).png"
MOBILE="$SRC_ROOT/ChatGPT Image Sep 8, 2026, 05_02_55 AM (2).png"
MOON="$SRC_ROOT/ChatGPT Image Sep 8, 2026, 05_02_55 AM (3).png"

for file in "$DESKTOP" "$MOBILE" "$MOON"; do
  test -f "$file" || { echo "Missing source: $file" >&2; exit 1; }
done

# Desktop master: exact 16:9 output, composition preserved with center-weighted cover crop.
im "$DESKTOP" -auto-orient -resize "2880x1620^" -gravity center -extent 2880x1620   -strip -quality 88 "$OUT/hero-master-desktop.webp"

# Mobile master: dedicated 3:4 composition from a separate source, not a crop of desktop output.
im "$MOBILE" -auto-orient -resize "1440x1920^" -gravity center -extent 1440x1920   -strip -quality 88 "$OUT/hero-master-mobile.webp"

# Moon master: square photographic crop with a softly feathered circular alpha edge.
im "$MOON" -auto-orient -resize "1600x1600^" -gravity center -extent 1600x1600   \( -size 1600x1600 xc:black -fill white -draw "circle 800,800 800,12" -blur 0x1.4 \)   -alpha off -compose CopyOpacity -composite -strip -quality 90 "$OUT/moon-photographic.webp"

cat > "$OUT/photographic-masters.json" <<'JSON'
{
  "schemaVersion": 1,
  "packId": "cinematic-hero",
  "kind": "ai-assisted-photographic-master",
  "generatedFormat": "webp",
  "outputs": [
    {
      "id": "hero-master-desktop",
      "path": "moonwitness/cinematic-hero-pack/webp/hero-master-desktop.webp",
      "width": 2880,
      "height": 1620,
      "source": "source-inputs/hero/ChatGPT Image Sep 8, 2026, 05_02_55 AM (1).png",
      "safeArea": "left headline / right evidence graph",
      "overlayPolicy": "no embedded text, graph nodes, or CTA"
    },
    {
      "id": "hero-master-mobile",
      "path": "moonwitness/cinematic-hero-pack/webp/hero-master-mobile.webp",
      "width": 1440,
      "height": 1920,
      "source": "source-inputs/hero/ChatGPT Image Sep 8, 2026, 05_02_55 AM (2).png",
      "composition": "dedicated mobile source and recrop"
    },
    {
      "id": "moon-photographic",
      "path": "moonwitness/cinematic-hero-pack/webp/moon-photographic.webp",
      "width": 1600,
      "height": 1600,
      "source": "source-inputs/hero/ChatGPT Image Sep 8, 2026, 05_02_55 AM (3).png",
      "alpha": true,
      "edge": "soft circular feather"
    }
  ]
}
JSON

identify "$OUT/hero-master-desktop.webp"
identify "$OUT/hero-master-mobile.webp"
identify "$OUT/moon-photographic.webp"
