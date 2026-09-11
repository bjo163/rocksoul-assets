# ROCKSOUL Visual System 2.0 — Art Direction

Status: **foundation / Phase 1–3 contract**. Machine-readable source: `moonwitness/visual-system-v2.json`.

## Brand layers

```text
MoonWitness = rigorous system / observatory / evidence
ROCKSOUL    = human intervention / character / signal
```

MoonWitness is the default layer for product structure, evidence, provenance, law, verification, archive, research, and system topology. It is controlled, precise, measured, highly legible, and must remain usable without ROCKSOUL decoration.

ROCKSOUL is an intervention layer. It may introduce annotation, xerox/tape/paper/scratch language, character presence, asymmetry, and crimson signal. It must communicate a human/editorial intervention, not provide generic decoration. Operator and forensic surfaces default to none/low intervention; editorial, cinematic, and community surfaces may increase it deliberately.

## Surface personalities

| Personality | Density | Geometry/material | Graph/data-viz | ROCKSOUL level |
| --- | --- | --- | --- | --- |
| operator | compact | orthogonal, clean, information-dense | compact semantic / dense-neutral | none–low |
| forensic | comfortable | structured, archival-clean, evidence boundaries | provenance-first / uncertainty-explicit | low |
| editorial | editorial | asymmetric reading, selective paper/xerox | narrative semantic / annotated | medium |
| archive | editorial | document-led, archival rule, paper | provenance-led / historical-neutral | low–medium |
| cinematic | editorial | negative-space-led, film/paper/photographic | compositional / supporting only | medium–high |
| community | comfortable | human-friendly, soft structured | relationship-readable / simple | medium |

Every personality must preserve keyboard focus, live text for critical information, reduced-motion behavior, and semantic equivalents for color-coded states.

## Density modes

`compact` uses the 4/8/12/16 spacing rhythm for operator and dense investigation UI. `comfortable` uses 8/12/16/24/32 as the default product rhythm. `editorial` uses 16/24/32/48/64/80 and is reserved for reading, archive, editorial, and cinematic compositions. Per-screen arbitrary spacing is not a density system.

## Typography

Canonical roles remain:

- **Display** → Inter Tight
- **Body** → Inter
- **Mono** → IBM Plex Mono
- **Archive Serif** → Georgia with Times New Roman/serif fallback, allowed only for archive/editorial/cinematic illustration, specimen, or immutable screen-reference work.

Archive Serif is not a generic UI font. It is forbidden in production primitives, dashboards, tables, notifications, generic operator controls, and compact semantic marks. Font-dependent artwork must declare its role in machine-readable metadata or be converted to paths.

## Crimson semantics

Crimson is semantic, not decorative.

| Role | Canonical value | Use |
| --- | --- | --- |
| Brand Crimson | `#D1132A` | brand emphasis and legal boundary |
| Signal Crimson | `#9F1022` | ROCKSOUL intervention and annotation signal |
| Critical Crimson | `#B20F23` | prohibited/critical state only |
| Soft Crimson | `#F7DDE2` | supporting tint, never primary state encoding |

Selected/active UI must use neutral structure/focus treatment unless the state itself is semantically crimson-coded. Legal boundary crimson must not become the generic active-state color.

## Geometry

Canonical stroke widths are 1/2/3 px. Canonical radii are 0/2/4/8/12/999 px. Production components use token geometry; exceptions belong to illustration/specimen/reference work and must be intentional.

## Material vocabulary

MoonWitness base material is clean, controlled, archival, and legible. ROCKSOUL may selectively use dossier layers, physical paper, photocopy/xerox, analog timestamp, film grain, halftone, redaction bars, evidence labels, coordinate grids, torn/taped edges, scratched film, and photographic composition. Never apply every treatment at once.

## Accessibility invariants

- Semantic distinctions survive grayscale.
- Color is reinforcement, never the only carrier.
- Critical copy remains live text.
- Reduced-motion alternatives are mandatory.
- Compact marks remain identifiable at their declared minimum size.
- Production primitives contain no embedded raster or live `<text>`.

## Ownership

`rocksoul-assets` owns visual truth, semantic grammar, assets, manifests, and generated distribution. `rocksoul-ui` owns runtime components and application implementation. UI consumers must not invent replacement visual semantics outside this repository.

## Audit/version boundary

Visual audit fingerprints are derived from visual source, classification, and Visual System contracts. Release/SemVer metadata is deliberately excluded so an automatic version bump cannot make otherwise-identical visual evidence stale or create a release loop.
