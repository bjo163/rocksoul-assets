# Getting Started

This guide is the shortest route from “I found the repository” to “I am using the correct production asset.”

## 1. Decide what you need

Use the [Live Showcase](https://rocksoul-assets-showcase.vercel.app) when you know the visual idea but not the file name.

Use `moonwitness/asset-packs.json` when you know the pack family.

Use `dist/assets.ts` or `dist/assets.json` when you are implementing product code.

## 2. Prefer canonical SVG for product UI

For UI, graphs, badges, evidence overlays, controls, diagrams, and illustrations, start from SVG.

```ts
import { assets } from "./dist/assets";

const sourceIcon =
  assets.packs["source-file"].svg.source;

const evidenceBox =
  assets.packs["evidence-media"].svg["bounding-box"];
```

Generated PNG is for consumers that require raster delivery.

## 3. Choose the smallest adequate raster

Multi-size packs expose variants in the generated registry:

```ts
const researcher64 =
  assets.packs["persona-avatar"].png.researcher["64"];
```

Do not ship a 256px avatar where 32px is enough.

## 4. Use the right motion format

Runtime Motion provides four representations:

- animated SVG — canonical source;
- APNG — simple raster animation;
- WebM — video-capable surfaces;
- Lottie JSON — compatible animation runtimes.

Every motion-dependent interaction needs a reduced-motion fallback.

## 5. Use audio as enhancement, not required meaning

SFX ships WAV + OGG. Product state must remain understandable when audio is muted or unavailable.

## 6. Never slice a poster

Atlas boards and screen references are composition references. Product code consumes individual assets from their pack paths or generated registry.

## 7. Preserve semantics

Before using a visual state:

- community submission ≠ verified evidence;
- correlation ≠ causation;
- unresolved ≠ false;
- legal analysis ≠ court judgment;
- confidence must have an explanation path;
- status cannot rely on color only.

## 8. Verify the source

Every delivery path can be traced back to a canonical source through manifests and the generated registry.

If a file appears to be missing from the showcase or registry, treat that as a repository defect: showcase coverage is required to stay at 100%.

## Next

- [Asset Consumption](ASSET-CONSUMPTION.md)
- [Asset Pack Catalog](ASSET-PACK-CATALOG.md)
- [Architecture](ARCHITECTURE.md)
- [Accessibility](ACCESSIBILITY.md)
