# Asset Consumption Contract — v1.3.0

MoonWitness packs are shipped as **individual consumable assets**, never as required runtime poster slices.

## Preferred entry point

Use `dist/assets.ts` or `dist/assets.json` when application code can consume generated registries. Use `moonwitness/asset-packs.json` for pack discovery.

## Format priority

1. **SVG** — preferred for product UI, diagrams, graphs, badges, evidence overlays, controls and illustrations.
2. **PNG** — email, social, raster-only SDKs, thumbnails and fixed delivery.
3. **APNG / WebM / Lottie** — runtime motion where animation is supported.
4. **WAV / OGG** — SFX according to platform needs.

## Rules

- Never crop or slice an atlas at runtime.
- Never edit generated derivatives directly.
- Status and confidence may not rely on color alone.
- Correlation visuals may not imply causation by default.
- Graphs require accessible text/data equivalents.
- Motion must provide reduced-motion behavior.
- Redaction and privacy assets are semantic controls, not decoration.
- Jurisdiction assets are data-driven; flags are not the canonical legal-state vocabulary.
- Use the smallest adequate persona/character raster derivative.

## Examples

```ts
import { assets } from "./dist/assets";

const verified = assets.packs["badge-status"].svg.verified;
const evidenceBox = assets.packs["evidence-media"].svg["bounding-box"];
const supportsEdge = assets.packs["correlation-semantics"].svg["edge-supports"];
const researcher64 = assets.packs["persona-avatar"].png.researcher["64"];
```

```html
<svg aria-label="Search">
  <use href="/dist/sprite.svg#mw-search"></use>
</svg>
```

Generated files are reproducible via `tools/assets/render-packs.py`, `tools/assets/generate-runtime-motion.py`, and `tools/assets/build-dist.mjs`.
