# Penpot Handoff

## Goal

Rebuild the MoonWitness visual baseline as a maintainable product design system rather than tracing 16 screenshots into isolated frames.

## Canonical chain

```text
rocksoul-assets
  → Penpot
  → packages/tokens
  → packages/ui
  → apps/web / apps/community / apps/platform
```

## Import

In Penpot:

1. Create **MoonWitness Platform — Design System & Product**.
2. Open the Tokens panel.
3. Use **Tools → Import**.
4. Import `penpot/tokens/moonwitness.tokens.json`.
5. Create the pages listed in `penpot/screens/screens.json`.
6. Import SVGs under `penpot/primitives/` as editable vectors.
7. Place the 16 PNGs under the References page.
8. Build components from `penpot/components/components.json`.
9. Compose patterns from `penpot/patterns/patterns.json`.
10. Rebuild Web, Community, Platform and Auth screens from components.

## Product boundaries

- **Web:** public MoonWitness observatory and case archive.
- **Community:** user portal, following, saved cases, discussions, submissions and notifications.
- **Platform:** admin/research/moderation/operations.
- **API / Worker:** not visual apps; UI contracts must not embed their business logic.

## Domain boundaries

- STORY → `rocksoul-legend`
- EVENT → `rocksoul-event`
- PERSON → `rocksoul-superhero`
- RGBL → `rocksoul-rgbl`
- AWS → `rocksoul-aws`

Five domain repositories are evidence/source layers. They are not five separate MoonWitness frontends.

## Required component states

Every interactive primitive must define at minimum:

- default
- hover where relevant
- keyboard focus
- disabled
- error where relevant
- loading where relevant

Every evidence/legal status must use semantic tokens rather than arbitrary colors.

## Responsive baseline

Start with:

- Desktop: 1440
- Tablet: 1024
- Mobile: 390

Do not shrink the desktop composition mechanically. Preserve reading order, case provenance, legal status, and evidence hierarchy.

## Language

Short, clear, slightly rebellious, never stiff.

Examples:

- “The trails are starting to line up.”
- “Not enough yet.”
- “Cool. Now the law gets involved.”
- “Still open.”

Avoid forced slang and avoid replacing technical terms where precision matters.
