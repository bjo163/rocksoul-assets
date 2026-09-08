# Changelog

## [1.3.1] — 2026-09-08

### Final asset closure audit
- Enforced bidirectional visual coverage: every MoonWitness delivery SVG now has at least one PNG derivative, and every PNG/JPEG maps back to canonical SVG.
- Generated missing raster delivery for Product Icons, Dashboard, Data-Viz, Hero Backgrounds, State Illustrations, Motion previews, V2 application screens, and all canonical brand SVGs.
- Added Application Screen Preview Pack as the 42nd indexed asset family.
- Repaired malformed legacy `mini-kanban.svg` XML discovered by actual renderer parsing.
- Added repository-wide XML parsing validation for every SVG, including MoonWitness, Penpot, and generated SVG distribution.
- Hardened generator pushes against concurrent brand/raster/dist bot updates.
- Updated raster generation to consume the global asset-pack index, preserve nested source structure, clean stale derivatives, and verify source counts.

### Closure inventory
- **614 MoonWitness SVG sources**
- **757 MoonWitness PNG derivatives**
- **0 raster assets without canonical SVG**
- **0 MoonWitness SVG delivery assets without PNG**
- **13/13 brand SVGs covered by raster delivery**
- **12/12 V2 application surfaces covered by PNG previews**
- **42 indexed asset-pack families**
- **12 WebM + 12 Lottie runtime motions**
- **14 WAV + 14 OGG SFX**


## [1.3.0] — 2026-09-08

### Investigation visual language
- Added 24 Evidence Media & Annotation assets for bounding regions, OCR, transcript/waveform cues, timestamps, comparisons, measurements, confidence, metadata, EXIF, hashes and source/location overlays.
- Added 24 Correlation Semantics assets: 10 canonical node types and 14 evidence-relationship edge types.
- Added 16 Privacy & Redaction assets and 16 Evidence Integrity / Chain-of-Custody assets.
- Added 12 Export & Evidence Seal assets.

### Authenticated product workflows
- Added 18 Kanban workflow assets.
- Added 16 Calendar / Temporal assets.
- Added 24 Chat / Collaboration assets.
- Added 18 AI Workspace assets.
- Added 18 Authorization / Security assets.
- Added 16 Data Grid / Table assets.
- Added 20 Form Control assets.
- Added 12 Theme / Accessibility assets.

### Character, editorial and system communication
- Added 12 Rocksoul character poses/scenes with 128/256/512 PNG derivatives.
- Added 12 Cinematic Hero scenes at 1200×675.
- Added 14 Command / Keyboard assets.
- Added 12 Texture / Material assets.
- Added 16 Architecture / Diagram assets.
- Added 8 Device Mockups.
- Added 16 data-driven Jurisdiction / Locale assets.

### Runtime delivery
- Added 12 runtime motions with animated-SVG sources; APNG/Lottie are byte-reproducible while WebM is validated semantically with ffprobe because container encoding is not byte-stable.
- Added generated developer distribution: `dist/assets.json`, `dist/assets.ts`, `dist/assets.css`, and `dist/sprite.svg`.
- Expanded global asset index to 41 pack families.
- Added generic v1.3 validation and reproducibility gates for modular packs, runtime motion and developer distribution.

### Repository inventory at release-candidate generation
- 614 SVG files under `moonwitness/`.
- 538 PNG files under `moonwitness/`.
- 12 WebM runtime motions and 12 Lottie runtime motions.
- 14 WAV + 14 OGG SFX derivatives.


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
