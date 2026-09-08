# RGBL textual-intelligence vector sources

These editable Penpot primitives define the visual contract for canonical textual research surfaces.

- `rgbl-text-hierarchy.svg` — WORK → EXPRESSION → EDITION → ARTIFACT → PASSAGE → CONTENT.
- `rgbl-parallel-text.svg` — source and translation lanes with explicit missing-state handling.
- `rgbl-provenance-trace.svg` — upstream → artifact → content → evidence → review trace.
- `rgbl-relation-map.svg` — alignment/variant/evidence relations without identity or equivalence implication.

These live under `penpot/**`, so they are editable design-source assets and are intentionally exempt from the runtime raster/vector delivery-pair requirement. Runtime semantics must be implemented as accessible HTML/SVG components in `@rocksoul/ui`, not baked into static images.
