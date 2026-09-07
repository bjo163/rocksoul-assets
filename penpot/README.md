# MoonWitness / Penpot

This directory is the version-controlled design source for reconstructing the MoonWitness product in Penpot.

## What is ready

- importable Penpot design tokens
- raw SVG primitives
- primitive/component inventory
- pattern inventory
- 16-screen mapping
- production page architecture
- developer handoff rules

## Import order

1. Create a Penpot file named **MoonWitness Platform — Design System & Product**.
2. Import `tokens/moonwitness.tokens.json` from the Tokens panel.
3. Create the page structure below.
4. Import SVGs from `primitives/` as editable vectors.
5. Build primitives first, then components, then patterns.
6. Place the 16 PNG references from `../moonwitness/ui/v1/screens/` on the References page.
7. Reconstruct product screens using only shared tokens/components.
8. Treat PNGs as visual references, not literal component geometry.

## Production page structure

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

## Design grammar

**Public / Community**

Gen Z × grunge × editorial research × evidence archive × cinematic title sequence.

**Platform / Admin**

Precise, dense, operational, clean. It shares the MoonWitness typography, semantics, RGBL grammar, and AWS crimson boundary but does not force cinematic grunge onto operational workflows.

## Build order

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

Do not reverse this flow by tracing each generated PNG into one-off frames.
