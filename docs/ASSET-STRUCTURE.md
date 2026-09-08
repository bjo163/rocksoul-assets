# Asset Structure

## Canonical paths

Raster baseline + vector counterpart:

```text
moonwitness/ui/v1/screens/<NN>-<slug>.png
moonwitness/ui/v1/screens/<NN>-<slug>.svg
```

Vector-first application surfaces:

```text
moonwitness/ui/v2/<NN>-<slug>.svg
```

Brand source + generated delivery assets:

```text
moonwitness/brand/*.svg
moonwitness/brand/generated/*
```

## Raster/vector rule

Every PNG/JPEG under `moonwitness/` must have a canonical SVG source.

- Immutable v1 raster references use a same-basename SVG counterpart.
- Generated delivery rasters use `moonwitness/brand/generated/manifest.json` to point back to their SVG source.
- Canonical SVG sources must not embed raster `<image>` elements or PNG/JPEG/WebP data URIs.

This contract is enforced by `tools/assets/validate.mjs`.

## Versioning rule

- `v1` is the first raster visual baseline and remains immutable.
- `v2` is the vector-first authenticated application layer.
- Do **not** overwrite a released visual baseline when the design direction changes materially.
- Create `v3`, `v4`, etc. so visual decisions stay auditable.
- Small metadata/documentation fixes may be committed without a new visual version.

## Penpot handoff

The PNGs are composition references. Penpot must reconstruct product UI using:

```text
token
  -> primitive
  -> component
  -> pattern
  -> screen
```

The v2 application shell contract is version-controlled under:

```text
penpot/application-shell/application-shell.json
penpot/screens/screens-v2.json
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
