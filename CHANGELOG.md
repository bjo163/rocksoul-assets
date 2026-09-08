# Changelog

## [1.2.0] — 2026-09-08

### Secondary production asset packs
- Added 10 graph/vector UI components with PNG derivatives.
- Added 12 badge/status assets.
- Added 15 source/file-type assets.
- Added 15 geospatial/map assets.
- Added 17 cursor/interaction assets.
- Added 9 persona/avatar vectors with 32/64/128/256 PNG sizes.
- Added 8 social/campaign templates.
- Added 8 platform delivery/store/install templates.
- Added 8 onboarding/tutorial illustrations.
- Added 9 document/report assets.
- Added 8 notification/email visual templates.
- Added 6 editorial image vectors.

### Motion and sound
- Expanded Motion Pack from 6 to 12 animated SVG references.
- Expanded SFX Pack from 10 to 14 deterministic WAV/OGG cues.

### Tooling
- Added global `moonwitness/asset-packs.json` index.
- Added deterministic SVG → PNG renderer for secondary packs.
- Added CI validation for all secondary pack manifests and generated derivatives.
- Added developer asset consumption contract.


All notable repository-level changes to MoonWitness × Rocksoul design assets are documented here.

## [1.1.0] — 2026-09-08

### Product icon pack
- Added 44 canonical SVG icons across navigation, action, status, and MoonWitness domain categories.
- Standardized icon grid at 24 × 24 with 1.75 stroke and currentColor theming.

### Dashboard pack
- Added 20 modular dashboard widget SVG sources: KPI, backend status, notifications, recent cases, progress, timeline, map, donut/bar/line charts, correlation, provenance, quick actions, AI summary, Kanban, calendar, profile, audit, search, and empty widget.

### Data visualization
- Added 16 reusable data-viz SVG components covering charts, timeline, provenance, node-link correlation, evidence matrix, heatmap, repository health, legends, graph nodes, edge styles, metrics, and annotations.

### Hero and product-state illustration
- Added 8 reusable 1600×900 vector hero/background sources.
- Added 12 reusable product-state illustration SVGs.

### Motion and SFX
- Added 6 animated SVG motion references with reduced-motion requirements.
- Added 10 procedural product SFX cues and reproducible WAV/OGG generation.

### Validation
- Asset validator now enforces pack manifests and minimum canonical asset counts.
- Release gate validates pack sources plus reproducible generated SFX.

## [1.0.0] — 2026-09-08

### Brand system
- Added canonical editable SVG identity family: mark, horizontal, stacked, monochrome, wordmark, ecosystem lockup, favicon, pinned tab, Apple touch, app/maskable icons, social avatar, and Open Graph card.
- Added reproducible SVG → PNG/ICO delivery generation.
- Added generated-asset manifest mapping derivatives back to canonical SVG sources.

### Raster and vector sources
- Added native editable SVG counterparts for all 16 immutable v1 PNG visual baselines.
- Enforced that canonical SVG sources cannot embed PNG/JPEG/WebP raster payloads.
- Expanded repository manifest to track raster/vector pairs and the v2 application layer.

### Authenticated application layer
- Added shared responsive application shell.
- Added compact sidebar, shared topbar, breadcrumbs, backend health, theme control, notifications, user menu, and command-palette entry.
- Added Dashboard, Command Palette, Notifications, Kanban, Calendar, Chat, AI Workspace, Resources/AutoMenu, Profile/Settings, Authorization UX, and unified system states.
- Added machine-readable AutoMenu navigation, screen, state, and Penpot application-shell contracts.

### Golden case
- Fixed MW-0042 mobile viewport overflow while retaining the fixed 390 × 844 contract.
- Preserved desktop/tablet/mobile golden-slice generation and validation.

### Tooling and CI
- Added repository-wide raster/vector and asset-contract validation.
- Added brand raster generation workflow.
- Locked Penpot builder dependencies with package-lock.json and switched installs to npm ci.
- Added release gate validating assets, brand derivative reproducibility, release metadata, and Penpot generation/package structure.
