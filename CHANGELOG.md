# Changelog

All notable repository-level changes to MoonWitness × Rocksoul design assets are documented here.

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

### Known external verification
- Live Penpot native-component reconstruction, prototype wiring, font inspection, and final accessibility/contrast review require a live Penpot workspace and are intentionally not claimed as completed by this repository release.
