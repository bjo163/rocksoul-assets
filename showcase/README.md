# Asset Showcase

Static production showcase for `rocksoul-assets`.

The site intentionally has no application framework or build dependency. It reads `/dist/assets.json` at runtime and resolves previews from the canonical repository asset paths.

## Local preview

Any static HTTP server from the repository root is sufficient.

## Vercel

The root `index.html` is the entrypoint. `vercel.json` defines immutable caching for versioned visual/audio assets and short caching for the generated developer registry.

The showcase is a presentation layer only; `moonwitness/asset-packs.json` and `dist/assets.json` remain the canonical discovery sources.
