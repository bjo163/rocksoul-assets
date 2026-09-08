# rocksoul-assets

Visual and design-source repository for the **MoonWitness × Rocksoul** ecosystem.

> **MoonWitness watches. Rocksoul follows. The record connects. The law draws the line. The legend stays open.**

This repository stores canonical brand vectors, immutable raster baselines, editable SVG reconstructions, Penpot-ready design tokens, primitives, component contracts, product-shell references, and handoff specifications. Application source code belongs in the MoonWitness product repository.

## Release

**Current repository release:** `v1.1.0` — 2026-09-08

Release acceptance covers canonical SVG/raster assets, v1 raster→vector pairing, v2 application surfaces, generated brand delivery formats, Penpot package generation/validation, reproducible dependency installation, and CI source contracts. Live Penpot native-component/prototype inspection is tracked separately as a manual design-workspace verification and is not represented as completed by the repository release.

See `RELEASE.md`, `CHANGELOG.md`, and `docs/RELEASE-CHECKLIST.md`.

## Design source of truth

**Canonical design tool:** Penpot  
**Canonical repository layer:** `rocksoul-assets`  
**Raster baseline:** `moonwitness/ui/v1`  
**Application vector surfaces:** `moonwitness/ui/v2`  
**Brand source:** `moonwitness/brand`  
**Penpot source:** `penpot/`

The earlier Figma file is retained as a prototype/reference only:

https://www.figma.com/design/OZawflyISNWRFLSpVPaM4N

## Asset system

### Brand

Canonical SVG sources include:

- primary mark
- horizontal / stacked / monochrome logos
- wordmark
- MoonWitness × Rocksoul ecosystem lockup
- favicon
- Safari pinned tab
- Apple touch icon
- app icon + maskable app icon
- social avatar
- Open Graph card

Raster delivery assets are generated from those SVGs under `moonwitness/brand/generated/`.

### Raster → vector contract

Every PNG/JPEG visual reference in `moonwitness/` must either:

1. have a same-basename editable SVG counterpart, or
2. be a generated delivery asset whose manifest points to a canonical SVG source.

The 16 immutable v1 PNG screens now have 16 same-basename native SVG reconstructions. Canonical vector sources may not embed raster images.

## Asset packs

The repository now includes reusable production asset libraries in addition to screen references:

| Pack | Path | Canonical assets |
|---|---|---:|
| Product Icons | `moonwitness/icons/` | 44 SVG icons |
| Dashboard Pack | `moonwitness/dashboard-pack/` | 20 widget SVGs |
| Data-Viz Pack | `moonwitness/data-viz/` | 16 SVG components |
| Hero Backgrounds | `moonwitness/hero-backgrounds/` | 8 vector backgrounds |
| State Illustrations | `moonwitness/state-illustrations/` | 12 SVG illustrations |
| Motion Pack | `moonwitness/motion/` | 6 animated SVG references |
| SFX Pack | `moonwitness/sfx/` | 10 procedural cues + WAV/OGG |

All graphics remain vector-first. SFX is generated reproducibly from `tools/assets/generate-sfx.py`.

## Product surfaces

| Range | Surface | Target app |
|---|---|---|
| 01–12 | Public observatory, repositories, cases, correlation, legal | `apps/web` |
| 13–14 | Community + authentication | `apps/community` |
| 15 | Internal operations / admin | `apps/platform` |
| 16 | Design-system reference | `packages/tokens` + `packages/ui` |
| 17–27 | Authenticated application shell + workspaces | `apps/platform` / shared application UI |

V2 adds a shared application shell, Dashboard, Command Palette, Notifications, Kanban, Calendar, Chat, AI Workspace, AutoMenu Resources, Profile/Settings, Authorization UX, and system states.

## Repository domains

| Domain | Repository | Question |
|---|---|---|
| STORY | `rocksoul-legend` | What was told? |
| EVENT | `rocksoul-event` | What actually happened? |
| PERSON | `rocksoul-superhero` | Who crossed the frame? |
| RGBL | `rocksoul-rgbl` | What does the source actually say? |
| AWS | `rocksoul-aws` | Was it allowed? |

## Design pipeline

```text
brand SVG + v1 raster/vector baseline + v2 vector surfaces
                         ↓
                    penpot/tokens
                         ↓
                 penpot/primitives
                         ↓
                 penpot/components
                         ↓
                   penpot/patterns
                         ↓
                     Penpot file
                         ↓
              packages/tokens + packages/ui
                         ↓
          apps/web + apps/community + apps/platform
```

## Asset contract

- Never commit generator/default filenames.
- Prefix ordered screens with a two-digit sequence.
- Existing `v1` PNG images are immutable visual references.
- Material product expansion goes to a new version layer; v2 is vector-first.
- PNG screens are composition references, not pixel-perfect implementation contracts.
- Canonical editable assets are SVG; generated raster delivery files are derivatives.
- Penpot is the canonical interactive design layer.
- Tokens and component contracts in this repository are version-controlled sources for Penpot and implementation.
- Resource navigation remains AutoMenu-driven.
- Do not place application source code in this repository.

Start with `moonwitness/brand/README.md`, `docs/APPLICATION-SHELL.md`, `penpot/README.md`, and `docs/PENPOT-HANDOFF.md`.
