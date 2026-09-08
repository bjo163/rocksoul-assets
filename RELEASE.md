# MoonWitness × Rocksoul — Final Asset Closure v1.3.1

**Release date:** 2026-09-08  
**Release branch:** `main`  
**Canonical editable visual format:** SVG  
**Canonical design tool:** Penpot  
**Repository scope:** asset delivery closed

## Closure result

v1.3.1 is the final asset-completeness pass for the current MoonWitness × Rocksoul visual system.

The delivery contract is now **bidirectional**:

1. every PNG/JPEG delivery asset must map to an editable canonical SVG;
2. every MoonWitness delivery SVG must have at least one generated PNG derivative;
3. Penpot-only design sources are exempt from raster delivery because they are design-workspace inputs, not runtime assets.

## Final inventory

| Audit item | Result |
|---|---:|
| MoonWitness SVG sources | 634 |
| MoonWitness PNG derivatives | 777 |
| PNG/JPEG without SVG | **0** |
| MoonWitness SVG without PNG | **0** |
| Canonical brand SVGs | 13 |
| Brand SVGs with raster delivery | **13 / 13** |
| V2 application SVG surfaces | 12 |
| V2 application PNG previews | **12 / 12** |
| Indexed asset-pack families | **43** |
| WebM runtime motions | 12 |
| Lottie runtime motions | 12 |
| WAV SFX | 14 |
| OGG SFX | 14 |

There are no JPEG, WebP, or GIF delivery assets in the repository.

## Raster completion added in v1.3.1

Previously vector-only families now have generated PNG delivery:

- Product Icons — 24 / 48 / 96 px raster sizes
- Dashboard Pack
- Data-Viz Pack
- Hero Backgrounds
- State Illustrations
- Motion Pack static/reduced-motion previews
- V2 Application Screen Preview Pack
- remaining canonical Brand SVGs

## Permanent safeguards

Release Gate now checks:
- every SVG parses as valid XML;
- canonical SVGs contain no embedded raster payload;
- every MoonWitness raster maps to SVG;
- every MoonWitness SVG has PNG delivery;
- all 42 pack manifests/index entries exist;
- generated brand derivatives reproduce with zero diff;
- generated pack PNGs reproduce with zero diff;
- developer `dist/` regenerates with zero diff;
- runtime APNG/Lottie reproduce and WebM validates semantically;
- SFX regenerate with zero diff;
- Penpot source/package/golden-slice validation passes.

## Design-source boundary

`penpot/**` remains the canonical design-workspace source layer. Penpot-native reconstruction, prototype interaction inspection, font availability and live accessibility walkthrough remain external/manual workspace verification; they are not missing repository assets.

Once CI is green, the repository asset-generation scope represented by v1.3.1 can be considered **closed**.
