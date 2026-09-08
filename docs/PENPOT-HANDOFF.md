# Penpot Handoff

## Goal

Rebuild the MoonWitness visual baseline as a maintainable product design system rather than tracing screenshots into isolated frames.

## Canonical chain

```text
rocksoul-assets
  → Penpot
  → rocksoul-ui / @rocksoul/ui
  → rocksoul-web
  → rocksoul-community
  → rocksoul-platform
  → rocksoul-crayon
```

Research ownership stays outside the experience layer:

```text
STORY        → rocksoul-mftl
EVENT        → rocksoul-legend
PERSON       → rocksoul-superhero
TEXT         → rocksoul-rgbl
LAW          → rocksoul-aws
PERSPECTIVE  → rocksoul-jizz
RELATIONSHIP → rocksoul-correlation
```

## Import

In Penpot:

1. Create **MoonWitness Platform — Design System & Product**.
2. Open the Tokens panel.
3. Use **Tools → Import**.
4. Import `penpot/tokens/moonwitness.tokens.json`.
5. Create the pages listed in `penpot/screens/screens.json`.
6. Import SVGs under `penpot/primitives/` as editable vectors.
7. Place the immutable v1 raster references under the References page.
8. Build components from `penpot/components/components.json`.
9. Compose patterns from `penpot/patterns/patterns.json`.
10. Rebuild Web, Community, Platform, Auth, and Console surfaces from components.

## Product boundaries

- **Web / `rocksoul-web`:** public MoonWitness observatory, repositories, public cases, correlation, and explainable legal/research views.
- **Community / `rocksoul-community`:** identity, following, saved cases, discussions, submissions, proposals, and notifications.
- **Platform / `rocksoul-platform`:** product administration, authorization, moderation operations, configuration, and system health.
- **Console / `rocksoul-crayon`:** authenticated research/operator workspace across STORY, EVENT, PERSON, TEXT, LAW, PERSPECTIVE, and reviewed RELATIONSHIP edges.
- **UI / `rocksoul-ui`:** reusable production implementation grammar; not an application surface by itself.
- **API / Worker:** not visual apps; UI contracts must not embed their business logic.

## Domain boundaries

- STORY → `rocksoul-mftl`
- EVENT → `rocksoul-legend`
- PERSON → `rocksoul-superhero`
- TEXT / RGBL → `rocksoul-rgbl`
- LAW / AWS → `rocksoul-aws`
- PERSPECTIVE / JIZZ → `rocksoul-jizz`
- RELATIONSHIP → `rocksoul-correlation`

The six research-domain repositories are canonical intelligence/source layers. `rocksoul-correlation` owns reviewed relationship edges and explainability metadata. None of them are separate MoonWitness frontends.

## Required component states

Every interactive primitive must define at minimum:

- default
- hover where relevant
- keyboard focus
- disabled
- error where relevant
- loading where relevant

Every evidence/legal status must use semantic tokens rather than arbitrary colors. Status must never rely on color alone.

## Responsive baseline

Start with:

- Desktop: 1440
- Tablet: 1024 / 768 as specified by the surface contract
- Mobile: 390, with 320 minimum-content QA where applicable

Do not shrink desktop compositions mechanically. Preserve reading order, provenance, legal status, uncertainty, and evidence hierarchy.

## Language

Short, clear, slightly rebellious, never stiff.

Examples:

- “The trails are starting to line up.”
- “Not enough yet.”
- “Cool. Now the law gets involved.”
- “Still open.”

Avoid forced slang. Never replace technical terms when precision matters.

## Voice rule

The shared voice across all repositories and product surfaces is:

```text
SHORT
CLEAR
EVIDENCE-FIRST
PROVENANCE-AWARE
UNCERTAINTY-VISIBLE
SLIGHTLY REBELLIOUS
NEVER PERFORMATIVELY EDGY
```

MoonWitness is the umbrella. Rocksoul is the connective thread. Domain labels and technical vocabulary stay precise.
