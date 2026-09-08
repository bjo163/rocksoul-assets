# Asset Showcase

Static production showcase for `rocksoul-assets`.

## Coverage contract

The showcase is not a curated subset. It must expose **100% of MoonWitness delivery files**.

Current registry model:

- 42 indexed asset-pack families
- 2 foundation collections: Brand System + V1 Baseline Screens
- all SVG and PNG delivery files
- favicon ICO
- all WAV + OGG SFX
- all WebM runtime motion
- all Lottie runtime motion
- generated developer-distribution artifacts

`tools/assets/build-dist.mjs` fails if a MoonWitness delivery file is not reachable from `dist/assets.json`.

`tools/assets/validate-showcase-coverage.mjs` additionally ensures every registry collection has showcase metadata in `showcase/catalog.json`.

## Runtime

The site intentionally has no application framework or build dependency.

Vercel hosts the lightweight UI, catalog metadata and generated registry. Canonical asset binaries resolve from the GitHub `main` source of truth.

## Local preview

Any static HTTP server from the repository root is sufficient.

## Canonical sources

- `moonwitness/asset-packs.json` — pack index
- `dist/assets.json` — complete delivery/showcase registry
- `showcase/catalog.json` — presentation metadata
