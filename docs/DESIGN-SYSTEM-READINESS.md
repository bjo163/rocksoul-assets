# MoonWitness Design System — Ready-for-Code Gate

## Foundations

- [x] Color baseline / modes / semantics
- [x] Spacing / radius / sizing / type direction / grid / motion
- [x] Penpot-compatible token subset embedded in generated package
- [ ] Final font availability verified inside Penpot
- [ ] Contrast audit on native assembled components

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

## Code handoff

Application implementation remains locked until the native Penpot rebuild, interaction prototype, and accessibility review are complete.

```text
Penpot bootstrap reference
        ↓
native tokens / primitives / components
        ↓
MW-0042 interactive proof
        ↓
packages/tokens
packages/ui
        ↓
apps/web
apps/community
apps/platform
```
