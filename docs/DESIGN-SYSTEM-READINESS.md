# MoonWitness Design System — Ready-for-Code Gate

The design system is allowed to move into `packages/tokens` and `packages/ui` only when every item below is satisfied.

## Foundations

- [x] Color baseline
- [x] Dark / light surface semantics
- [x] RGBL semantics
- [x] AWS legal semantics
- [x] Spacing scale
- [x] Radius / stroke scale
- [x] Control sizing
- [x] Type scale direction
- [x] Breakpoint / grid contract
- [x] Motion contract
- [ ] Final font availability verified in Penpot
- [ ] Contrast audit performed on real components

## Raw primitives

- [x] Primitive inventory
- [x] Variant inventory
- [x] State inventory
- [x] Keyboard/focus rules
- [x] Minimum touch targets
- [ ] Built as reusable Penpot components
- [ ] Visual state matrix reviewed

## Components

- [x] Public header
- [x] Platform navigation
- [x] Case grammar
- [x] Evidence grammar
- [x] Correlation grammar
- [x] Graph grammar
- [x] Legal grammar
- [x] Community grammar
- [x] Platform operations grammar
- [ ] Built in Penpot from primitives
- [ ] Responsive instances validated

## Product proof

Before coding the full product, one vertical slice must be completed in design:

```text
CASE MW-0042
  → public case
  → evidence records
  → correlation
  → AWS legal layer
  → community discussion
  → platform review
```

The slice must be validated at:

- 1440 desktop
- 768 tablet
- 390 mobile

## Code handoff

Only after the vertical slice passes:

```text
penpot/tokens
   ↓
packages/tokens
   ↓
packages/ui
   ↓
apps/web
apps/community
apps/platform
```

Do not begin by creating screen-specific CSS copies of the PNG references.
