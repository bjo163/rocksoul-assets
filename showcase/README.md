# Asset Showcase

Production: **https://rocksoul-assets-showcase.vercel.app**

The showcase is a public documentation and acceptance surface for `rocksoul-assets`.

## Responsibilities

It must:

- explain the MoonWitness × Rocksoul visual system;
- expose the capability map before forcing users into folder-oriented browsing;
- index **100% of delivery files**;
- distinguish production primitives, illustrations, specimens, screen references, and non-visual delivery;
- preview every supported delivery format appropriately;
- provide direct source paths and raw-source access;
- link users into canonical repository documentation;
- communicate current release and closure status accurately.

## Coverage contract

- 43 asset-pack families
- 2 foundation collections
- 45 showcase collections
- 1,464 / 1,464 delivery files
- 100% coverage

`tools/assets/build-dist.mjs` fails if a MoonWitness delivery file is not reachable from `dist/assets.json`.

`tools/assets/validate-showcase-coverage.mjs` validates registry coverage and presentation metadata.

## Information architecture

1. Overview / system value
2. Capability map
3. Evidence-semantic journey
4. Complete explorer
5. Developer delivery
6. Quality / closure evidence
7. Documentation hub
8. Release state

## Runtime

The site is framework-free static HTML/CSS/JS.

Vercel serves the UI, `showcase/catalog.json`, and `dist/assets.json`.

Canonical visual/audio binaries resolve from GitHub `main`.

## Accessibility

- keyboard-search shortcut: Cmd/Ctrl + K;
- dialog uses native `<dialog>`;
- visible focus states;
- status not color-only;
- reduced-motion disables motion-dependent autoplay;
- audio is never required to understand product meaning.

## SEO / security

See [docs/SHOWCASE-OPERATIONS.md](../docs/SHOWCASE-OPERATIONS.md).
