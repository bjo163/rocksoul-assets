# Visual System 2.0 Migration

Visual System 2.0 upgrades canonical assets inside existing packs instead of creating parallel pack sprawl.

## Replaced in place
- data-viz canonical charts and graph specimens
- graph-vector charts
- correlation semantic nodes and edges
- architecture topology specimens
- cinematic-hero compositions
- editorial compositions
- production primitive stroke normalization

## Deprecated with replacement
- cursor-interaction/crosshair -> geospatial/crosshair

## Frozen reference
- baseline-v1 remains immutable and non-runtime.

## Production rules
Deprecated assets remain browseable for migration but are not production-eligible. Specimen/reference assets may be distributed as documentation but never enter the production primitive sprite. Graph meaning survives grayscale. Charts use neutral magnitude with semantic crimson boundaries only. Archive Serif is limited to approved archive/editorial/cinematic work. Product icons and semantic primitives are reviewed at 16/20/24/32 in light and dark.

## Regeneration
Run the V2 migration generator, render-packs, build-dist and visual audit before validation.
