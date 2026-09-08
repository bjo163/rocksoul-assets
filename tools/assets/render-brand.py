from pathlib import Path
import json
import cairosvg
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "moonwitness" / "brand"
OUT = BRAND / "generated"
OUT.mkdir(parents=True, exist_ok=True)

JOBS = [
    ("favicon.svg", "favicon-16.png", 16, 16),
    ("favicon.svg", "favicon-32.png", 32, 32),
    ("favicon.svg", "favicon-48.png", 48, 48),
    ("apple-touch-icon.svg", "apple-touch-icon-180.png", 180, 180),
    ("app-icon.svg", "app-icon-192.png", 192, 192),
    ("app-icon.svg", "app-icon-512.png", 512, 512),
    ("app-icon-maskable.svg", "app-icon-maskable-192.png", 192, 192),
    ("app-icon-maskable.svg", "app-icon-maskable-512.png", 512, 512),
    ("social-avatar.svg", "social-avatar-512.png", 512, 512),
    ("og-card.svg", "og-card-1200x630.png", 1200, 630),

    # Complete raster-preview coverage for every canonical brand SVG.
    ("logo-mark.svg", "logo-mark-512.png", 512, 512),
    ("logo-horizontal.svg", "logo-horizontal-1520x320.png", 1520, 320),
    ("logo-stacked.svg", "logo-stacked-1120x1040.png", 1120, 1040),
    ("wordmark.svg", "wordmark-1360x240.png", 1360, 240),
    ("logo-monochrome.svg", "logo-monochrome-1520x320.png", 1520, 320),
    ("rocksoul-lockup.svg", "rocksoul-lockup-1800x360.png", 1800, 360),
    ("safari-pinned-tab.svg", "safari-pinned-tab-512.png", 512, 512),
]

manifest = {
    "schemaVersion": 1,
    "generatedFrom": "moonwitness/brand/*.svg",
    "canonicalFormat": "svg",
    "coveragePolicy": "every canonical brand SVG has at least one generated raster derivative",
    "outputs": []
}

for source, output, width, height in JOBS:
    source_path = BRAND / source
    output_path = OUT / output
    cairosvg.svg2png(
        url=str(source_path),
        write_to=str(output_path),
        output_width=width,
        output_height=height,
    )
    manifest["outputs"].append({
        "path": f"moonwitness/brand/generated/{output}",
        "source": f"moonwitness/brand/{source}",
        "width": width,
        "height": height,
    })

favicon_48 = Image.open(OUT / "favicon-48.png").convert("RGBA")
favicon_48.save(
    OUT / "favicon.ico",
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
)
manifest["outputs"].append({
    "path": "moonwitness/brand/generated/favicon.ico",
    "source": "moonwitness/brand/favicon.svg",
    "sizes": [16, 32, 48],
})

canonical_sources = sorted(p.name for p in BRAND.glob("*.svg"))
covered_sources = sorted({Path(item["source"]).name for item in manifest["outputs"]})
missing = sorted(set(canonical_sources) - set(covered_sources))
if missing:
    raise RuntimeError(f"Brand SVGs without raster delivery: {missing}")
manifest["coverage"] = {
    "canonicalSvgCount": len(canonical_sources),
    "coveredSvgCount": len(covered_sources),
    "complete": True,
}

(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
