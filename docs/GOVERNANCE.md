# Governance

This document defines how `rocksoul-assets` changes after v1.3.1 asset closure.

## Principle

**A visual file is not complete until the system around it is complete.**

A production asset change may require:

- canonical source;
- derivative generation;
- manifest/index registration;
- developer registry update;
- showcase metadata;
- documentation;
- validation;
- release notes.

## Change classes

### Class A — metadata / documentation only

Examples:

- wording clarification;
- README navigation;
- docs correction;
- showcase copy with no delivery-contract change.

No new visual version is required.

### Class B — derivative/tooling correction

Examples:

- regeneration bug;
- malformed SVG correction with unchanged visual intent;
- registry mapping fix;
- accessibility metadata fix.

Patch release is appropriate when delivery output changes materially.

### Class C — new asset in an existing visual grammar

Examples:

- new evidence annotation icon;
- new notification state;
- new document/source type.

Requires:

1. canonical source;
2. pack manifest count update;
3. derivative output;
4. registry + showcase coverage;
5. relevant docs;
6. CI green.

Use a minor release when consumer capability expands.

### Class D — new visual system or materially changed baseline

Examples:

- replacement design language;
- new application surface generation;
- breaking naming/path contract;
- major token grammar change.

Do not overwrite a released baseline. Create a new version layer and treat it as a major or clearly scoped new visual generation.

## Source ownership

| Decision | Owner source |
|---|---|
| visual identity | `moonwitness/brand/` |
| asset family membership | pack manifest + `moonwitness/asset-packs.json` |
| runtime path registry | generated `dist/` |
| presentation metadata | `showcase/catalog.json` |
| design-system hierarchy | `penpot/` |
| release state | `VERSION`, `manifest.json`, `CHANGELOG.md`, `RELEASE.md` |
| operational docs | `docs/` |

Generated files never override source ownership.

## Definition of done for a new asset

A new MoonWitness delivery asset is done when:

- [ ] source is valid native SVG or approved canonical non-visual contract;
- [ ] no embedded raster payload exists in canonical SVG;
- [ ] pack manifest and global index agree;
- [ ] required PNG derivative exists;
- [ ] generated registry exposes it;
- [ ] showcase metadata resolves to the pack/collection;
- [ ] showcase coverage returns 100%;
- [ ] accessibility semantics are appropriate;
- [ ] release/change documentation is updated;
- [ ] CI and release gate pass.

## Pull-request rule

Keep canonical source and the contract changes that make it consumable in the **same pull request**.

Avoid:

- “source now, registry later”;
- “asset now, docs later”;
- manual edits to generated derivatives;
- visual changes hidden inside generator-only commits.

## Closed scope

v1.3.1 closes the currently defined asset-generation scope.

That does not mean the repository is archived. It means new visual requests should be treated as **explicit new scope**, not as missing work from v1.3.1.

## Live Penpot exception

Native component reconstruction and final workspace interaction/accessibility review remain manual workspace gates.

They must never be silently marked complete by repository CI.
