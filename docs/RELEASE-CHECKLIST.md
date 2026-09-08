# Release Checklist

## Repository sources

- [x] Canonical brand SVG family present
- [x] Generated brand delivery formats present
- [x] Generated derivative manifest maps outputs to SVG sources
- [x] 16 v1 PNG references paired with 16 vector-native SVG sources
- [x] v2 application shell and all requested product surfaces present
- [x] AutoMenu navigation contract present
- [x] Authorization and system-state contracts present
- [x] Penpot application-shell contract present
- [x] MW-0042 mobile boards fit fixed 390 × 844
- [x] Penpot lockfile committed
- [x] VERSION = 1.3.1
- [x] manifest release version = 1.3.1
- [x] CHANGELOG contains 1.3.1 release entry

## Automated acceptance

- [x] Asset validator
- [x] Raster/vector source mapping
- [x] Brand SVG inventory
- [x] Brand PNG/ICO regeneration reproducibility
- [x] Application screen/state/navigation validation
- [x] Mobile golden-board bounds validation
- [x] Penpot source validation
- [x] Penpot package generation
- [x] Penpot package-structure validation

## Showcase and documentation

- [x] 42 asset-pack families represented in registry
- [x] Brand System + V1 Baseline foundation collections represented
- [x] 1,424 / 1,424 delivery files indexed
- [x] showcase JavaScript syntax validation
- [x] showcase catalog/registry version validation
- [x] documentation current-version validation
- [x] docs hub indexes every operational docs page

## External live Penpot verification

These checks are intentionally **not** claimed by repository CI:

- [ ] final font availability/licensing in the live Penpot workspace
- [ ] native Penpot component reconstruction
- [ ] native component state-matrix review
- [ ] live interaction prototype
- [ ] keyboard/focus walkthrough
- [ ] live contrast/accessibility review

They do not indicate missing release assets; they are post-source design-workspace verification.


## v1.1.0 Asset Packs

- [x] 44 product icon SVGs
- [x] 20 dashboard widget SVGs
- [x] 16 data-viz SVG components
- [x] 8 hero/background vector sources
- [x] 12 state illustration SVGs
- [x] 6 animated SVG motion references
- [x] 10 procedural SFX cues
- [x] generated SFX WAV/OGG manifest
- [x] pack manifests registered in root manifest
- [x] asset validator enforces pack counts and vector-native SVG sources

## v1.3.1 Final Asset Closure

- [x] 614 MoonWitness SVG delivery sources inventoried
- [x] 757 PNG derivatives generated
- [x] 0 PNG/JPEG assets without canonical SVG
- [x] 0 MoonWitness SVG delivery assets without PNG
- [x] 13/13 brand SVGs have generated raster delivery
- [x] 12/12 V2 application surfaces have PNG previews
- [x] product icons have 24/48/96 PNG delivery
- [x] dashboard, data-viz, hero, states and motion preview PNGs generated
- [x] 42 asset-pack families indexed
- [x] malformed mini-kanban SVG repaired
- [x] all tracked SVG files validated as XML in CI
- [x] stale raster cleanup is part of generation
- [x] bidirectional SVG/PNG coverage enforced by validator
