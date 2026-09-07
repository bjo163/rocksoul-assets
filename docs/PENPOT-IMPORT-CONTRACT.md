# Penpot Import Contract

## Artifact

`penpot/generated/moonwitness-mw-0042.penpot`

The artifact is built with Penpot's official programmatic library and validated in CI before being committed.

## Expected import result

File name:

**MoonWitness Platform — MW-0042 Golden Slice**

Pages:

1. `06 — Web / Desktop`
2. `10 — Responsive / Tablet`
3. `10 — Responsive / Mobile`

Each page contains seven ordered boards:

1. Overview
2. Evidence
3. Correlation
4. AWS / Legal
5. Community
6. Platform Review
7. Platform Decision

## Source-of-truth rule

The generated file is reproducible output.

Canonical editable sources remain:

- `penpot/tokens/moonwitness.tokens.json`
- `penpot/primitives/primitives.json`
- `penpot/components/components.json`
- `penpot/patterns/patterns.json`
- `penpot/golden-cases/mw-0042/`

Do not make a Git binary the only source of a design decision.

## Native rebuild target

After import, the final Penpot design system must replace media-backed screen assemblies with native reusable structures:

```text
Token
 → Primitive
 → Component
 → Pattern
 → Screen
```

The reference boards should remain untouched for visual comparison.

## Acceptance before code unlock

- Native primitive components exist.
- Native core MoonWitness components exist.
- MW-0042 is recomposed from those components.
- Desktop / tablet / mobile are verified.
- Keyboard/focus/semantic states are reviewed.
- Prototype path Public → Community → Platform is working.
