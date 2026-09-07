# MW-0042 — The Silent Flight

**Status:** Golden vertical-slice specification  
**Nature:** Synthetic design fixture  
**Purpose:** Prove MoonWitness product grammar end-to-end before full application scaffolding.

## Why this case

MW-0042 deliberately tests mixed certainty:

- STORY → supported
- EVENT → supported
- PERSON → partial
- RGBL → supported
- CORRELATION → strong but not conclusive
- AWS → disputed / jurisdiction unresolved
- COMMUNITY → one unverified submission
- PLATFORM → two blockers remain

This prevents the design system from assuming every case ends in true, false, or verified.

## Files

- `case.json` — canonical fixture data
- `component-states.json` — exact component states by surface
- `flow.json` — public → community → platform flow
- `SCREEN-CONTRACT.md` — exact composition and responsive behavior
- `ACCEPTANCE.md` — design/code exit criteria

## Product path

    PUBLIC CASE
       ↓
    FOUR RECORDS
       ↓
    CORRELATION
       ↓
    AWS / LEGAL
       ↓
    COMMUNITY
       ↓
    PLATFORM REVIEW
       ↓
    STILL OPEN

The ending **STILL OPEN** is intentional.