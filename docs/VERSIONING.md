# Versioning

`rocksoul-assets` versions two related things:

1. repository releases;
2. visual baselines / surface generations.

They are related but not identical.

## Repository release version

The current repository release is **v1.3.1**.

Use semantic intent:

- **patch** — delivery/tooling/documentation correction that does not add a new visual capability;
- **minor** — new asset families, new consumable visual capability, or non-breaking delivery expansion;
- **major** — breaking path/contract changes or a materially incompatible visual-system generation.

## Visual baseline version

Visual baselines preserve history.

- `ui/v1` — immutable first public visual baseline;
- `ui/v2` — authenticated vector-first application layer.

Do not rewrite a released visual baseline to make history look cleaner.

If a future design direction materially replaces v2, create v3.

## Pack evolution

Existing pack paths should remain stable whenever possible.

Additive assets:

- extend the pack manifest;
- generate derivatives;
- update registries/showcase;
- release as minor scope when appropriate.

Renames/removals are breaking because downstream applications may reference asset keys or paths.

## Generated formats

A generated-format change can be non-breaking only when canonical asset identifiers and existing supported delivery paths remain valid.

Removing a format that consumers may rely on is breaking.

## Release files

A release-changing PR must keep these aligned:

- `VERSION`
- `manifest.json`
- `CHANGELOG.md`
- `RELEASE.md`
- pack/global indexes where affected.

The Release Gate checks this contract.

## Documentation versions

Docs that describe current behavior should track the current release.

Historical release information belongs in `CHANGELOG.md` and GitHub Releases, not stale headers in active operational docs.
