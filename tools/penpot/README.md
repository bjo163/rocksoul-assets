# Penpot Generator

This directory builds the MoonWitness golden vertical slice with Penpot's official `@penpot/library`.

## Output

`penpot/generated/moonwitness-mw-0042.penpot`

## Source inputs

- `manifest.json`
- `penpot/tokens/moonwitness.tokens.json`
- `penpot/screens/screens.json`
- `penpot/responsive/responsive.json`
- `penpot/golden-cases/mw-0042/visuals/desktop/*.svg`
- `penpot/golden-cases/mw-0042/visuals/tablet/*.svg`
- `penpot/golden-cases/mw-0042/visuals/mobile/*.svg`

## Generated file structure

The generated Penpot file contains:

- Desktop page: 7 boards at 1440 × 1024
- Tablet page: 7 boards at 768 × 1024
- Mobile page: 7 boards at 390 × 844
- supported MoonWitness design tokens embedded in the Penpot file

Each board contains the responsive SVG assembly as an SVG media fill. This is the **bootstrap Penpot package**, not the final native component tree.

The next Penpot-native step is to rebuild the shared primitives/components from the imported reference boards and replace media-backed boards with real component instances.

## Local build

```bash
cd tools/penpot
npm install --no-audit --no-fund
npm run validate:sources
npm run generate
npm run validate
```

Or run the full check:

```bash
npm run check
```

The repository currently does not commit an npm lockfile, so `npm ci` is not a valid bootstrap command yet.

GitHub Actions validates design-source consistency, rebuilds the Penpot package, validates its ZIP structure, and uploads the generated artifact for inspection. The binary export is treated as generated output; CI relies on semantic/source validation rather than byte-for-byte reproducibility.
