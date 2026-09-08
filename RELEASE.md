# MoonWitness × Rocksoul — Repository Release v1.0.0

**Release date:** 2026-09-08  
**Release branch:** `main`  
**Repository acceptance:** PASSED  
**Canonical design tool:** Penpot

## Release scope

v1.0.0 is the first complete repository release of the MoonWitness × Rocksoul visual/design-source system. It includes canonical brand vectors, generated web/app delivery assets, immutable v1 raster references with editable SVG counterparts, the vector-first authenticated v2 application layer, Penpot handoff/generation sources, and CI contracts that keep those layers synchronized.

## Included

- 13 canonical brand SVG assets
- generated favicon PNG/ICO, Apple touch, app/maskable icons, social avatar, and OG card
- 16 immutable v1 PNG baseline screens
- 16 same-basename editable vector-native SVG reconstructions
- shared v2 application shell
- 11 v2 authenticated product surfaces/overlays
- AutoMenu navigation and state contracts
- MW-0042 responsive golden slice
- generated `.penpot` bootstrap package
- locked Penpot dependency graph
- repository-wide validation workflows

## Acceptance criteria

A repository release is accepted only when:

1. every PNG/JPEG under `moonwitness/` has an identifiable canonical SVG source;
2. canonical SVG sources contain no embedded raster payloads;
3. brand derivative outputs reproduce from canonical SVGs without diff;
4. application routes remain AutoMenu-driven and unique;
5. required system-state contracts exist;
6. MW-0042 mobile golden boards fit the fixed 390 × 844 viewport;
7. Penpot source validation, generation, and package validation pass;
8. `VERSION`, `manifest.json`, and changelog release versions agree.

## Live Penpot verification

The repository release is complete without pretending that external interactive checks were performed. The following require a live Penpot workspace and remain documented manual verification:

- final font availability/licensing inspection;
- native reusable component reconstruction;
- native recomposition of MW-0042 and v2 application screens;
- live state-matrix review;
- interaction prototype wiring;
- keyboard/focus inspection;
- final contrast/accessibility review.

Those items are design-workspace verification, not missing repository assets.

## Source commit

Release preparation started from:

`d293b0f1190fee3d0079aada222bcb2a255dcde6`

The authoritative released source is the final merged tip of `main`.
