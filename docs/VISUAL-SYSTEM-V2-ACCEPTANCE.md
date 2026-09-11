# Visual System 2.0 — Phase 5–12 Acceptance

Status: **implementation complete on migration branch; merge/release proof pending**.

## Phase acceptance

| Phase | Issue | Implemented evidence |
| --- | --- | --- |
| 5 — Graph language | #80 | canonical data-viz, graph-vector, correlation, and architecture sources use V2 node geometry, edge rhythm/direction, provenance, uncertainty, and grayscale-safe semantics |
| 6 — Data-viz | #80 | chart grammar is neutral-first; magnitude and status are separated; confidence/uncertainty and threshold boundaries have distinct encodings |
| 7 — Asset rationalization | #81 | all 44 packs plus foundation collections have lifecycle metadata; cursor crosshair and duplicate graph timeline have explicit canonical replacements |
| 8 — Cinematic/editorial | #82 | cinematic heroes use four controlled composition families; editorial sources use archival structure with selective ROCKSOUL intervention |
| 9 — Primitive optical pass | #83 | product icons and semantic primitives use canonical 2px stroke and are reviewed/delivered at 16/20/24/32 with light/dark optical board |
| 10 — Penpot V2 | #83 | canonical token/component/pattern sources contain V2 palette roles, density modes, six personalities, graph nodes/edges, and intervention overlays |
| 11 — Visual lint | #84 | strict validator enforces lifecycle, replacement, production eligibility, crimson/font policy, graph proof, primitive sizes, and duplicate resolution |
| 12 — Asset Explorer | #84 | Explorer filters lifecycle/personality/kind, exposes semantic role/grammar/usage, and seven dedicated V2 galleries teach the visual system |

## Deterministic pipeline

`Visual System V2 Migration` is the only writer for migration outputs. It performs:

```text
V2 source generator
  → canonical SVG rewrite
  → raster regeneration
  → dist registry rebuild
  → quantitative audit regeneration
  → XML / asset / registry / classification validation
  → primitive validation
  → strict Visual System V2 validation
  → Explorer validation
  → migration idempotence
  → audit idempotence
```

`Visual System V2 Audit` is check-only. `Validate Asset System` and `Release Gate` require migration and audit freshness.

## Post-migration quantitative delta

| Signal | Foundation baseline | Migrated |
| --- | ---: | ---: |
| Canonical SVGs | 621 | 621 |
| Fixed palette colors | 69 | 67 |
| Historical bright-red family | 8 observed red/crimson values including `#FF2A3D` | `#FF2A3D` eliminated from mutable V2 sources |
| Stroke-width variants | 19 | 16 |
| Radius variants | 35 | 32 |
| Graph geometry signatures | 46 | 39 |
| Archive Serif declarations | 43 | 3 approved cinematic uses |
| Production primitive violations | 0 | 0 |

## Duplicate resolution

- `cursor-interaction/crosshair` → deprecated; canonical replacement `geospatial/crosshair`.
- `graph-vector/evidence-timeline` → deprecated; canonical replacement `data-viz/evidence-timeline`.
- Deprecated assets remain discoverable for migration but are not production eligible.

## Remaining release gate

Phase 13 (#85) begins only after this migration PR passes exact-head migration, audit, asset validation, Penpot validation, and `FULL_RELEASE_GATE_PASS`, then is merged to `main`. The released main SHA must subsequently pass Post Release Integrity Audit before #48 can close.
