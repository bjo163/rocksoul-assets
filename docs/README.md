# MoonWitness × Rocksoul Documentation

This directory is the **canonical wiki source** for `rocksoul-assets`.

GitHub Wiki is enabled for the repository, but architectural and design decisions should live here first so they are versioned, reviewed, and released with the assets they describe. Any external Wiki page should link back to these files rather than become a second source of truth.

## Current status

| Signal | State |
|---|---:|
| Release | **v1.3.1** |
| Asset scope | **closed / delivery complete** |
| Asset-pack families | **44** |
| Showcase collections | **45** |
| Delivery files | **1,544** |
| Showcase coverage | **100%** |
| Live showcase | https://rocksoul-assets-showcase.vercel.app |

## Choose a path

### I want to use assets in product code

1. [Getting Started](GETTING-STARTED.md)
2. [Asset Consumption](ASSET-CONSUMPTION.md)
3. [Asset Pack Catalog](ASSET-PACK-CATALOG.md)
4. `dist/assets.ts` or `dist/assets.json`

### I want to design or extend the visual system

1. [Visual Language](VISUAL-LANGUAGE-V1.3.md)
2. [Asset Structure](ASSET-STRUCTURE.md)
3. [Asset Classification](ASSET-CLASSIFICATION.md)
4. [Semantic Primitives](SEMANTIC-PRIMITIVES.md)
5. [Accessibility](ACCESSIBILITY.md)
6. [Penpot Handoff](PENPOT-HANDOFF.md)
7. [Penpot Import Contract](PENPOT-IMPORT-CONTRACT.md)

### I maintain the repository

1. [Governance](GOVERNANCE.md)
2. [Branching Policy](BRANCHING.md)
3. [Versioning](VERSIONING.md)
4. [Release Checklist](RELEASE-CHECKLIST.md)
5. [Showcase Operations](SHOWCASE-OPERATIONS.md)
6. [Asset Closure Audit](ASSET-CLOSURE-AUDIT.md)

### I am reviewing completeness or quality

1. [Asset Closure Audit](ASSET-CLOSURE-AUDIT.md)
2. [Showcase Coverage](SHOWCASE-COVERAGE.md)
3. [Design System Readiness](DESIGN-SYSTEM-READINESS.md)
4. [Live Penpot Verification](PENPOT-LIVE-VERIFICATION.md)

## Documentation map

| Document | Purpose |
|---|---|
| [Getting Started](GETTING-STARTED.md) | fastest route from discovery to using a real asset |
| [Architecture](ARCHITECTURE.md) | canonical → generated → registry → showcase/product model |
| [Asset Consumption](ASSET-CONSUMPTION.md) | runtime format and usage rules |
| [Asset Pack Catalog](ASSET-PACK-CATALOG.md) | complete human-readable pack index |
| [Asset Structure](ASSET-STRUCTURE.md) | repository paths and raster/vector contracts |
| [Asset Classification](ASSET-CLASSIFICATION.md) | production primitive, illustration, specimen, and screen-reference boundaries |
| [Semantic Primitives](SEMANTIC-PRIMITIVES.md) | atomic theme-aware vectors, sprite membership, and optical-size contact sheet |
| [Application Shell](APPLICATION-SHELL.md) | authenticated shell and v2 product-surface contract |
| [Visual Language](VISUAL-LANGUAGE-V1.3.md) | semantic visual grammar |
| [LAW / AWS Visual Contract](LAW_VISUAL_CONTRACT.md) | legal result vocabulary, applicability axes, review pipeline, and guardrails |
| [Accessibility](ACCESSIBILITY.md) | non-negotiable product accessibility rules |
| [Governance](GOVERNANCE.md) | ownership, change classes, definition of done |
| [Branching Policy](BRANCHING.md) | single-main workflow and temporary PR branch lifecycle |
| [Versioning](VERSIONING.md) | visual and release version rules |
| [Showcase Operations](SHOWCASE-OPERATIONS.md) | production showcase architecture and deployment |
| [Showcase Coverage](SHOWCASE-COVERAGE.md) | 100% delivery-index guarantee |
| [Design System Readiness](DESIGN-SYSTEM-READINESS.md) | repository vs live-Penpot readiness |
| [Penpot Handoff](PENPOT-HANDOFF.md) | design-system reconstruction flow |
| [Penpot Import Contract](PENPOT-IMPORT-CONTRACT.md) | generated Penpot package contract |
| [Live Penpot Verification](PENPOT-LIVE-VERIFICATION.md) | manual workspace-only checks |
| [Release Checklist](RELEASE-CHECKLIST.md) | release acceptance gates |
| [Asset Closure Audit](ASSET-CLOSURE-AUDIT.md) | v1.3.1 closure evidence |
| [Licensing](LICENSING.md) | current reuse-rights boundary |
| [FAQ](FAQ.md) | common implementation and governance questions |

## Canonical machine-readable entry points

- `moonwitness/asset-packs.json`
- `moonwitness/asset-classification.json`
- `dist/assets.json`
- `showcase/catalog.json`
- `manifest.json`
- `VERSION`

## Documentation rule

If a change alters a consumer contract, visual semantic, release rule, generator, or showcase behavior, the related documentation must change in the **same pull request**.

Documentation is part of the asset system, not post-release commentary.

- [RGBL / TEXT Visual Contract](RGBL_TEXT_VISUAL_CONTRACT.md) — canonical TEXT/RGBL visual ownership and consumer guidance.
- [LAW / AWS Visual Contract](LAW_VISUAL_CONTRACT.md) — canonical LAW applicability semantics and generated boundary visualization.
