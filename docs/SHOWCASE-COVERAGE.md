# Showcase Coverage Audit

Status: **100% delivery coverage**

The Vercel showcase is required to expose every MoonWitness delivery asset, not a curated subset.

## Current coverage

| Delivery format | Indexed |
|---|---:|
| SVG | 634 |
| PNG / APNG | 777 |
| ICO | 1 |
| WebM | 12 |
| WAV | 14 |
| OGG | 14 |
| Lottie JSON | 12 |
| **Total** | **1,464** |

## Collections

- 43 indexed asset-pack families
- Brand System foundation collection — 31 delivery files
- V1 Baseline foundation collection — 32 delivery files
- **45 showcase collections total**

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


## Operations

Deployment architecture, production acceptance, rollback, security headers, and SEO requirements are documented in [SHOWCASE-OPERATIONS.md](SHOWCASE-OPERATIONS.md).

Current indexed delivery files: **1,464**.
