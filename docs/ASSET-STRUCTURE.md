# Asset Structure

## Canonical path

```text
moonwitness/ui/<version>/screens/<NN>-<slug>.png
```

## Versioning rule

- `v1` is the first visual baseline.
- Do **not** overwrite a released visual baseline when the design direction changes materially.
- Create `v2`, `v3`, etc. so visual decisions stay auditable.
- Small metadata/documentation fixes may be committed without a new visual version.

## Figma handoff

The 16 PNGs are composition references. Figma must reconstruct them using:

```text
token
  -> primitive
  -> component
  -> pattern
  -> screen
```

The intended application topology is:

```text
apps/web
apps/community
apps/platform
apps/api
apps/worker
```

Shared implementation should later live under reusable packages such as:

```text
packages/tokens
packages/ui
packages/contracts
packages/auth
packages/domain
```
