# MoonWitness Design System — Release & Ready-for-Code Gates

**Repository release:** v1.0.0 — released 2026-09-08  
**Repository acceptance:** passed  
**Live Penpot verification:** manual follow-up

## Foundations

- [x] Color baseline / modes / semantics
- [x] Spacing / radius / sizing / type direction / grid / motion
- [x] Penpot-compatible token subset embedded in generated package
- [x] Canonical brand vector family defined
- [x] Raster/vector source contract enforced in CI
- [x] Penpot builder dependency graph locked with `package-lock.json`
- [ ] Final font availability verified inside Penpot
- [ ] Contrast audit on native assembled components

## Brand + delivery assets

- [x] Logo mark / horizontal / stacked / monochrome / wordmark
- [x] MoonWitness × Rocksoul ecosystem lockup
- [x] Favicon / pinned tab / Apple touch / app / maskable / social / OG vector sources
- [x] Reproducible PNG/ICO delivery generator
- [x] Generated raster manifest points back to canonical SVG
- [x] 16 v1 PNG screens have 16 editable native SVG counterparts
- [x] Canonical SVGs reject embedded PNG/JPEG/WebP

## Application shell — v2

- [x] Shared responsive shell vector reference
- [x] Compact sidebar / shared topbar / breadcrumbs
- [x] Theme control / backend status / notifications / user menu
- [x] Dashboard / Command Palette / Notifications
- [x] AutoMenu-driven Resources navigation
- [x] Kanban / Calendar / Chat / AI Workspace
- [x] Profile / Settings
- [x] Authorization UX
- [x] Error / Empty / Loading / Offline / Forbidden state contracts
- [x] Penpot application-shell contract + v2 screen references

## Primitives + Components

- [x] Primitive inventory / states / accessibility contract
- [x] Component inventory / variants / responsive rules
- [ ] Rebuilt as native reusable Penpot components
- [ ] Visual state matrix reviewed inside Penpot

## Golden vertical slice — MW-0042

- [x] Synthetic fixture
- [x] Exact screen contract
- [x] Component-state mapping
- [x] Public → community → platform flow
- [x] Acceptance criteria
- [x] Editable 1440 SVG assembly
- [x] Editable 768 SVG assembly
- [x] Editable 390 SVG assembly
- [x] Mobile 390 × 844 overflow fixed and validated
- [x] Official-library Penpot bootstrap package generated
- [x] Penpot ZIP integrity validated
- [x] Penpot manifest validated
- [x] 3 responsive pages validated
- [x] 21 screen media entries validated
- [ ] Imported and visually inspected in a live Penpot workspace
- [ ] Native component rebuild complete
- [ ] Interaction prototype complete
- [ ] Accessibility review complete

## Generated package

`penpot/generated/moonwitness-mw-0042.penpot`

Generated automatically by:

`.github/workflows/build-penpot.yml`

Builder:

`tools/penpot/`

## Release status

The version-controlled repository asset system is released as **v1.0.0**. This release does not falsely mark live Penpot-only checks as completed. Native Penpot reconstruction, interaction wiring, font inspection, and final live accessibility review remain a separate design-workspace verification gate.

## Code handoff

Repository-side design sources, vectors, assets, contracts, and CI gates are ready. Application implementation remains gated only by the explicitly documented live Penpot verification work.

```text
version-controlled vector + contract sources
        ↓
Penpot bootstrap reference
        ↓
native tokens / primitives / components
        ↓
MW-0042 + v2 application interactive proof
        ↓
packages/tokens
packages/ui
        ↓
apps/web
apps/community
apps/platform
```
