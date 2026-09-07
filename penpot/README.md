# MoonWitness / Penpot

Version-controlled design source for MoonWitness.

## Current stage

**Design System Foundation v0.2 — READY FOR PENPOT ASSEMBLY**

The repository now defines:

- importable design tokens
- type / grid / motion direction
- raw primitive state matrices
- shared component contracts
- responsive behavior
- accessibility rules
- product patterns
- 16-screen visual references

## Import order

1. Create **MoonWitness Platform — Design System & Product** in Penpot.
2. Import `tokens/moonwitness.tokens.json`.
3. Create the page structure.
4. Import SVG primitives.
5. Build everything listed in `primitives/primitives.json`.
6. Build `components/components.json` only from those primitives.
7. Compose `patterns/patterns.json`.
8. Place all 16 PNGs on References.
9. Build the MW-0042 vertical slice.
10. Validate desktop / tablet / mobile.
11. Only then hand off to code.

## Page structure

```text
00 — Cover
01 — References
02 — Foundations
03 — Primitives
04 — Components
05 — Patterns
06 — Web
07 — Community
08 — Platform
09 — Auth
10 — Responsive
11 — Prototype
12 — Dev Handoff
```

## Surface personality

### Web / Community
Gen Z × grunge × editorial research × evidence archive × cinematic title sequence.

### Platform
Precise, dense, operational, clean.

Both surfaces share tokens, semantics, typography grammar, RGBL, case language, and AWS boundary semantics.

## Core rule

```text
TOKEN
  ↓
RAW PRIMITIVE
  ↓
COMPONENT
  ↓
PATTERN
  ↓
SCREEN
```

Never trace each generated screenshot into a separate one-off component tree.
