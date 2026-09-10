# Release Automation Contract

`rocksoul-assets` uses one release identity: `VERSION` + exact Git commit SHA + immutable semantic tag `v<version>` + one GitHub Release. `manifest.json`, `moonwitness/asset-packs.json`, `dist/assets.json`, and `showcase/catalog.json` are synchronized consumers of that identity and may not invent a different version.

## State machine

The only valid forward path is:

`DRAFT → VALIDATING → VALIDATED → VERSIONED → SEALED → TAGGED → PUBLISHED`

Any failed gate moves the candidate to `INVALID`. Publishing requires a sealed exact SHA and proof from the full `Release Gate`; a partial workflow is never release proof.

## Change impact and automatic versioning

`tools/release/release-relevant.json` is the centralized release-impact path contract. `tools/release/detect-release-impact.mjs` deterministically classifies changes as `PATCH`, `MINOR`, or `MAJOR`. `tools/release/next-version.mjs` resolves the next semantic version and `Auto Version` applies it after changes land on `main`.

The resolver never downgrades a version and never moves an existing tag. Post-release changes on `main` are treated as a stale-release condition and produce a new candidate version.

## Full release proof

`Release Gate` runs for every pull request and every `main` push. It first classifies the change set and, when release-relevant, runs the complete asset, generation, registry, documentation, repository-contract, evidence, runtime, Penpot, and deterministic-regeneration checks. The terminal `FULL_RELEASE_GATE_PASS` job is the only workflow proof accepted by publication.

## Seal, snapshot, and artifacts

Before publication, automation creates:

- `.release/out/release.json` — exact version/SHA/tag/gate identity;
- `.release/out/inventory.json` — generated pack, format, registry, classification, and coverage snapshot;
- `rocksoul-assets-v<version>.zip` — deterministic release bundle;
- matching `.sha256` checksum.

The GitHub Release attaches the bundle, checksum, inventory, and release metadata. Publication validates the checksum before upload and targets only the exact current `main` SHA that passed the full gate.

## Recovery

`tools/release/recover.mjs` compares current `main` with the latest semantic tag. If they differ, it computes a deterministic candidate instead of altering historical tags. Re-running recovery for the same repository state must return the same candidate.

Historical `v1.3.1` predates this contract and is recorded as a migration exception in `.releases/exceptions.json`; it remains immutable and is never rewritten.
