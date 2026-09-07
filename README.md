# rocksoul-assets

Visual source of truth for the **MoonWitness × Rocksoul** ecosystem.

> **MoonWitness watches. Rocksoul follows. The record connects. The law draws the line. The legend stays open.**

This repository contains visual references and design-system direction only. Application source code belongs in the MoonWitness product repositories.

## Current visual baseline

**Version:** `moonwitness/ui/v1`  
**Status:** Concept baseline / ready for Figma reconstruction  
**Primary style:** Gen Z × grunge × editorial research × evidence archive × cinematic title sequence

### Product surfaces

| Range | Surface | Target app |
|---|---|---|
| 01–12 | Public observatory, repositories, cases, correlation, legal | `apps/web` |
| 13–14 | Community + authentication | `apps/community` |
| 15 | Internal operations / admin | `apps/platform` |
| 16 | Raw design-system reference | `packages/tokens` + `packages/ui` |

## Repository domains

| Domain | Repository | Question |
|---|---|---|
| STORY | `rocksoul-legend` | What was told? |
| EVENT | `rocksoul-event` | What actually happened? |
| PERSON | `rocksoul-superhero` | Who crossed the frame? |
| RGBL | `rocksoul-rgbl` | What does the source actually say? |
| AWS | `rocksoul-aws` | Was it allowed? |

## Asset contract

- Never use generator/default filenames in committed assets.
- Prefix ordered screens with a two-digit sequence.
- Existing `v1` files are immutable visual references; revisions go to a new version folder.
- Generated concept screens are **references**, not pixel-perfect implementation contracts.
- Figma is the next canonical layer for tokens, primitives, components, patterns, responsive states, and dev handoff.
- Do not place app source code in this repository.

See [`manifest.json`](./manifest.json) for machine-readable screen mapping.
