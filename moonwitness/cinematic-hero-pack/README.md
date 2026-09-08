# Cinematic Hero Pack

12 large-format 1200×675 canonical vector scenes with PNG derivatives for hero, article and campaign use.

## Photographic hero masters

AI-assisted photographic masters are generated separately from the canonical SVG/PNG registry and live in `webp/`:

- `webp/hero-master-desktop.webp` — 2880×1620, no embedded copy/graph/CTA, with overlay-safe composition.
- `webp/hero-master-mobile.webp` — 1440×1920, dedicated mobile source and composition.
- `webp/moon-photographic.webp` — 1600×1600 lunar detail master with alpha edge.

Raw generation candidates are preserved in `source-inputs/hero/`. Regenerate with `bash tools/assets/build-photographic-hero.sh`.
