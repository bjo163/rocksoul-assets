# MoonWitness × Rocksoul — Repository Release v1.2.0

**Release date:** 2026-09-08  
**Release branch:** `main`  
**Canonical design tool:** Penpot  
**Canonical editable format:** SVG

## Scope

v1.2.0 completes the production asset-pack layer. Every new pack is shipped as individual SVG assets with generated PNG derivatives and machine-readable manifests; developers do not need to crop or slice atlas posters.

## New pack families

- Graph Vector Pack — 10
- Badge / Status Pack — 12
- Source / File-Type Pack — 15
- Geospatial / Map Pack — 15
- Cursor / Interaction Pack — 17
- Persona / Avatar Pack — 9 SVGs + 36 sized PNGs
- Social Campaign Pack — 8
- Platform Delivery Pack — 8
- Onboarding / Tutorial Pack — 8
- Document / Report Pack — 9
- Notification / Email Pack — 8
- Editorial Image Pack — 6

## Expanded packs

- Motion Pack — 12 animated SVGs
- SFX Pack — 14 deterministic cues in WAV + OGG

## Consumption contract

Use `moonwitness/asset-packs.json` as the global index. SVG is canonical. PNG is generated. See `docs/ASSET-CONSUMPTION.md`.

## Release acceptance

Release Gate must:
1. validate every canonical SVG;
2. validate every pack manifest count;
3. map every generated PNG back to an SVG source;
4. regenerate secondary PNG derivatives with zero diff;
5. regenerate brand derivatives with zero diff;
6. regenerate SFX with zero diff;
7. pass Penpot source/package checks.

Live Penpot workspace verification remains a separate manual design-workspace gate.
