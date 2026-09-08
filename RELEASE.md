# MoonWitness × Rocksoul — Repository Release v1.3.0

**Release date:** 2026-09-08  
**Release branch:** `main`  
**Canonical editable visual format:** SVG  
**Canonical design tool:** Penpot

## Scope

v1.3.0 completes the modular visual language for investigation workflows. Product screens no longer carry the only representation of Kanban, Calendar, Chat, AI, Security, table/form, evidence-inspection, privacy, integrity, export, character, diagram, device, jurisdiction, and runtime-motion semantics.

Every visual pack is consumable as individual source files. Atlas/poster imagery is reference-only and is never required at runtime.

## New v1.3 pack families

| Pack | Canonical assets |
|---|---:|
| Evidence Media / Annotation | 24 |
| Correlation Semantics | 24 |
| Kanban Workflow | 18 |
| Calendar / Temporal | 16 |
| Chat / Collaboration | 24 |
| AI Workspace | 18 |
| Authorization / Security | 18 |
| Data Grid / Table | 16 |
| Form Controls | 20 |
| Theme / Accessibility | 12 |
| Privacy / Redaction | 16 |
| Evidence Integrity / Chain-of-Custody | 16 |
| Export / Evidence Seal | 12 |
| Rocksoul Character | 12 |
| Command / Keyboard | 14 |
| Texture / Material | 12 |
| Architecture / Diagram | 16 |
| Device Mockup | 8 |
| Jurisdiction / Locale | 16 |
| Cinematic Hero | 12 |
| Runtime Motion | 12 |
| Developer Distribution | 4 generated artifacts |

## Runtime and developer delivery

Runtime Motion ships:
- animated SVG canonical source
- APNG
- WebM
- Lottie JSON
- reduced-motion fallback metadata

Developer distribution ships:
- `dist/assets.json`
- `dist/assets.ts`
- `dist/assets.css`
- `dist/sprite.svg`

Use `moonwitness/asset-packs.json` as the canonical 41-family pack index.

## Repository inventory

At release-candidate generation:
- **614 SVG**
- **538 PNG**
- **12 WebM**
- **12 Lottie JSON**
- **14 WAV + 14 OGG**

Counts include existing baseline/product assets and generated derivatives under `moonwitness/`.

## Release acceptance

Release Gate must:
1. validate canonical SVG structure and raster/vector pairing;
2. validate 41 indexed asset-pack families;
3. regenerate all modular PNG derivatives with zero diff;
4. regenerate APNG/Lottie with zero diff and validate WebM semantically with ffprobe;
5. regenerate developer `dist/` with zero diff;
6. regenerate brand and SFX derivatives with zero diff;
7. pass Penpot source, package and golden-slice checks.

Live native Penpot reconstruction/prototype/accessibility inspection remains a separate manual workspace verification and is not falsely represented as repository CI.
