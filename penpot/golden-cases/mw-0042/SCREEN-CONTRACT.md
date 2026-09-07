# MW-0042 — Exact Screen Contract

> **Fixture only.** This golden case is synthetic and exists to test MoonWitness product behavior, not to assert a real-world event.

## 1. Public / Case Overview

Route: `/cases/mw-0042`

Desktop structure:

    MW HEADER
    CASE HEADER
      MW-0042 / GOLDEN CASE
      THE SILENT FLIGHT
      unresolved
      summary

    FOUR RECORD SUMMARY
      STORY   linked
      EVENT   linked
      PERSON  partial
      RGBL    linked

    CORRELATION PREVIEW
      0.87
      medium-high
      identity remains incomplete

    EVIDENCE PREVIEW
      STORY / EVENT / PERSON / RGBL

    AWS BOUNDARY
      “Cool. Now the law gets involved.”
      disputed / jurisdiction unresolved

Tone:
- mysterious enough to feel MoonWitness
- never hide uncertainty
- avoid “proof”, “confirmed truth”, or “case solved”

## 2. Public / Evidence

The four records are peers. AWS is **not** a fifth evidence record.

Each card must show:
- record ID
- source repo
- short claim
- provenance/source ID
- verification state
- canonical status
- action: inspect source

PERSON is deliberately `partial` and must remain visibly uncertain without becoming unreadable.

## 3. Public / Correlation

Required values:
- score: **0.87**
- temporal match: **0.94**
- motif match: **0.89**
- source independence: **0.91**
- identity match: **0.64**

Mandatory copy:
- **The trails are starting to line up.**
- **That still doesn’t make them the same thing.**

Graph requirements:
- keyboard-selectable nodes
- visible selected state
- text/list equivalent below graph
- explanation beside or immediately after score
- identity uncertainty must not be hidden by aggregate score

## 4. Public / AWS

Transition begins with the semantic legal boundary.

    ──────── THE BOUNDARY ────────
    AWS / ANGEL WITH SHOTGUN
    INTERNATIONAL LAW / REGULATION

Evidence asks: **What happened?**
Law asks: **What rule would apply?**

Fixture status:
- jurisdiction: unresolved
- legal status: disputed
- review: needs legal review

All fixture instruments must be labeled synthetic/reference-only.

## 5. Community

Route: `/community/cases/mw-0042`

Primary layout:
- case header
- Follow / Save
- discussion thread
- community notes
- submission panel
- source/provenance warning

`SUB-0042-01` must display **NEEDS CONTEXT** and must never visually merge into canonical evidence.

## 6. Platform

Route: `/platform/cases/mw-0042`

Operational layout:
- platform sidebar
- case summary
- blockers
- repository health
- record verification table
- community submission review
- AWS legal review
- audit trail
- reviewer actions

The platform visual language is clean/dense. Do not bring cinematic grunge into data tables.

## Responsive

### 1440
- full editorial composition
- graph + side explanation
- platform sidebar expanded

### 768
- graph above explanation
- cards 2-column where readable
- platform sidebar collapsible

### 390
- single-column
- graph paired with semantic relationship list
- case ID/status always above fold
- all canonical/source badges remain visible
- platform actions may move to sticky bottom action area