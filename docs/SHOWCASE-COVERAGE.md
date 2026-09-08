# Showcase Coverage Audit

Status: **100% delivery coverage**

The Vercel showcase is required to expose every MoonWitness delivery asset, not a curated subset.

## Current coverage

| Delivery format | Indexed |
|---|---:|
| SVG | 614 |
| PNG / APNG | 757 |
| ICO | 1 |
| WebM | 12 |
| WAV | 14 |
| OGG | 14 |
| Lottie JSON | 12 |
| **Total** | **1,424** |

## Collections

- 42 indexed asset-pack families
- Brand System foundation collection — 31 delivery files
- V1 Baseline foundation collection — 32 delivery files
- **44 showcase collections total**

## Guarantees

`tools/assets/build-dist.mjs` fails when any repository delivery file is not indexed.

`tools/assets/validate-showcase-coverage.mjs` fails when:
- a delivery file is missing from the showcase registry;
- the registry references a nonexistent delivery file;
- a showcase collection lacks label/category/description metadata;
- showcase catalog and registry versions disagree;
- the generated registry does not report 100% coverage.

The UI can preview:
- SVG / PNG / APNG / ICO as images;
- WebM as video;
- WAV / OGG through native audio controls;
- Lottie / JSON / TypeScript / CSS as inspectable text;
- all raw files through direct source links.

This is the operational closure condition for the showcase.
