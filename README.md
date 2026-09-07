# rocksoul-assets

Visual and design-source repository for the **MoonWitness × Rocksoul** ecosystem.

> **MoonWitness watches. Rocksoul follows. The record connects. The law draws the line. The legend stays open.**

This repository stores visual baselines, Penpot-ready design tokens, primitives, component contracts, and handoff specifications. Application source code belongs in the MoonWitness product repository.

## Design source of truth

**Canonical design tool:** Penpot  
**Canonical repository layer:** `rocksoul-assets`  
**Visual baseline:** `moonwitness/ui/v1`  
**Penpot source:** `penpot/`

The earlier Figma file is retained as a prototype/reference only:

https://www.figma.com/design/OZawflyISNWRFLSpVPaM4N

### Product surfaces

| Range | Surface | Target app |
|---|---|---|
| 01–12 | Public observatory, repositories, cases, correlation, legal | `apps/web` |
| 13–14 | Community + authentication | `apps/community` |
| 15 | Internal operations / admin | `apps/platform` |
| 16 | Design-system reference | `packages/tokens` + `packages/ui` |

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
moonwitness/ui/v1/screens
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
- Existing `v1` images are immutable visual references; material revisions go to a new version folder.
- PNG screens are composition references, not pixel-perfect implementation contracts.
- Penpot is the canonical interactive design layer.
- Tokens and component contracts in this repository are version-controlled sources for Penpot and implementation.
- Do not place application source code in this repository.

Start with [`penpot/README.md`](./penpot/README.md) and [`docs/PENPOT-HANDOFF.md`](./docs/PENPOT-HANDOFF.md).
