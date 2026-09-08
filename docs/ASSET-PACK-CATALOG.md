# MoonWitness Asset Pack Catalog — v1.2.0

Canonical index: `moonwitness/asset-packs.json`.

All new visual packs use:
- SVG as canonical editable source
- PNG as generated derivative
- per-pack manifest
- no embedded raster inside canonical SVG
- deterministic raster generation via `tools/assets/render-packs.py`

## Secondary packs

| Pack | SVG assets | PNG consumption |
|---|---:|---|
| Graph Vector | 10 | natural component size |
| Badge / Status | 12 | 240×64 |
| Source / File-Type | 15 | 64×64 |
| Geospatial / Map | 15 | 64×64 |
| Cursor / Interaction | 17 | 64×64 |
| Persona / Avatar | 9 | 32/64/128/256 |
| Social Campaign | 8 | platform-native sizes |
| Platform Delivery | 8 | store/install-native sizes |
| Onboarding / Tutorial | 8 | 800×600 |
| Document / Report | 9 | document/component-native sizes |
| Notification / Email | 8 | message-native sizes |
| Editorial | 6 | 1200×675 |

Developers should consume the smallest adequate PNG derivative when raster is required; otherwise consume SVG directly.
