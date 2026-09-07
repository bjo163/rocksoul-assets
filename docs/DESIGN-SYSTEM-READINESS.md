# MoonWitness Design System — Ready-for-Code Gate

The design system moves into `packages/tokens` and `packages/ui` only when every required gate passes.

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

## Golden vertical slice
- [x] MW-0042 canonical synthetic fixture
- [x] Exact screen contract
- [x] Component-state mapping
- [x] Public → community → platform flow
- [x] Acceptance criteria
- [ ] Penpot 1440 design complete
- [ ] Penpot 768 design complete
- [ ] Penpot 390 design complete
- [ ] Interaction prototype complete
- [ ] Accessibility review complete

Golden fixture: `penpot/golden-cases/mw-0042/`

## Code handoff
Only after the golden slice passes:

    penpot/tokens
       ↓
    packages/tokens
       ↓
    packages/ui
       ↓
    apps/web
    apps/community
    apps/platform

Do not begin by creating screen-specific CSS copies of the PNG references.