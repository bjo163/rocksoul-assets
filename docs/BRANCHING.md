# Branching Policy

`rocksoul-assets` uses a **single long-lived branch**:

- `main` — production source of truth

All other branches are temporary pull-request branches.

## Why

The asset system is release-driven and source-first. Keeping multiple long-lived branches creates unnecessary drift between:

- canonical SVG sources;
- generated raster/audio/motion derivatives;
- developer registries;
- showcase metadata;
- documentation;
- release metadata.

A single production branch keeps those contracts synchronized.

## Workflow

1. Create a short-lived branch from current `main`.
2. Make one coherent source/change-set.
3. Open a pull request to `main`.
4. Let asset validation, showcase coverage, release gate, and Penpot checks run.
5. Merge only when required checks are green.
6. Delete the head branch after merge.

## Branch naming

Recommended temporary prefixes:

- `feat/` — new visual capability or delivery behavior;
- `fix/` — correction;
- `docs/` — documentation/showcase narrative;
- `chore/` — maintenance, CI, repository cleanup;
- `release/` — only when a dedicated release-preparation branch is genuinely necessary.

A prefix does **not** make a branch long-lived.

## Do not

- keep historical release branches after their PR is merged;
- keep feature branches as de facto environments;
- point generator workflows at temporary feature branches;
- use `dev` as a second production source of truth;
- merge source changes into multiple long-lived branches.

## CI policy

Generator workflows that write derived files run against `main`.

Pull requests are validated through read-only asset/showcase/release/Penpot checks before merge.

Temporary branches must not be hard-coded into active workflow branch filters.

## Release history

Historical state is preserved by:

- Git commits;
- merged pull requests;
- GitHub Releases/tags;
- `CHANGELOG.md`.

A branch is not required to preserve release history.

## Cleanup rule

Once a PR is merged and no active workflow references its head branch, that branch may be deleted.

For the current repository state, historical feature/release branches are disposable after the workflow cleanup merged into `main`.
