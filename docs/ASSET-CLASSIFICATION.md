# Asset Classification Contract

MoonWitness delivery coverage and production fitness are separate guarantees. A file being indexed does not make it safe to use as a compact product primitive.

## Kinds

- `primitive` — transparent, compact building block intended for product composition.
- `illustration` — identity, editorial, state, or motion artwork used as a supporting visual.
- `specimen` — composed reference showing a component, workflow, or semantic pattern. It may contain a background, labels, and fixed colors and must not be scaled into an icon slot.
- `screen-reference` — immutable visual baseline used for review and reconstruction, never as runtime UI.

Audio and developer-only collections are explicitly classified as non-visual and do not receive visual file metadata.

## Per-file registry metadata

`tools/assets/build-dist.mjs` projects the collection policy from `moonwitness/asset-classification.json` onto every registered SVG, PNG, ICO, WebM, and Lottie file under `visualAssets`.

Each visual delivery declares:

- `assetKind`
- `intendedUsage`
- `themeBehavior`
- `minimumDisplaySize`
- `containsText`
- `accessibilityRole`

`themeBehavior` is inspected from the actual delivery: SVG using `currentColor` is `currentColor`, SVG using CSS custom properties is `semantic-token`, and fixed SVG or raster/motion delivery is `fixed`.

## Consumer rules

1. Product controls and compact graph/status marks must consume `primitive` assets only.
2. `specimen` assets are implementation guidance, not runtime controls.
3. `screen-reference` assets cannot be embedded as an application screen.
4. Text-bearing artwork cannot replace live labels, provenance, status, or accessible names.
5. Consumers must respect `minimumDisplaySize` and provide context-appropriate accessible text.

Run `node tools/assets/validate-classification.mjs` after changing classifications, manifests, or delivery assets.
