# Showcase Operations

Production showcase:

**https://rocksoul-assets-showcase.vercel.app**

Vercel project:

`rocksoul-assets-showcase`

## Purpose

The showcase has two jobs:

1. provide a human-readable explorer for every delivery asset;
2. prove that the registry can reach every delivery file.

It is therefore part documentation, part operational acceptance surface.

## Coverage model

Current production coverage:

- 43 asset-pack families;
- 2 foundation collections;
- 45 showcase collections;
- 1,464 / 1,464 delivery files;
- 100% coverage.

The two foundation collections are:

- Brand System;
- V1 Baseline Screens.

They exist because those sources predate the 42-pack index but remain first-class delivery assets.

## Deployment architecture

The showcase is framework-free static HTML/CSS/JS.

Vercel bundle:

```text
index.html
showcase/
  showcase.css
  showcase.js
  catalog.json
dist/
  assets.json
robots.txt
sitemap.xml
vercel.json
```

Large canonical binaries are not duplicated into the frontend bundle. Preview URLs resolve against GitHub `main`.

## Source-of-truth chain

```text
moonwitness/** + manifests
        ↓
tools/assets/build-dist.mjs
        ↓
dist/assets.json
        ↓
showcase/catalog.json + showcase.js
        ↓
Vercel production
```

## Deploy acceptance

Before production deployment:

- Asset Validator must pass;
- Showcase JS syntax check must pass;
- showcase delivery coverage must be 100%;
- Release Gate must pass;
- preview deployment should reach READY.

After production deployment verify:

- root HTML = HTTP 200;
- `/dist/assets.json` = JSON 200;
- `/showcase/catalog.json` = JSON 200;
- JS and CSS have correct MIME types;
- registry reports expected release version;
- registry reports zero missing delivery files.

## Rollback

Vercel keeps previous production deployments. If a presentation-only defect escapes CI, roll back the showcase deployment without changing canonical asset history.

A rollback does **not** change `rocksoul-assets` source-of-truth state.

## Runtime observation

The showcase is static, so application-runtime error volume should normally be zero.

Investigate:

- deployment build failure;
- missing static subresource;
- registry/catalog mismatch;
- GitHub raw asset unavailability;
- incorrect MIME type;
- CSP or security-header regression.

## Git integration

The current project is operated as an explicit static deployment of repository files. The source of truth remains GitHub `main`.

If Git-based automatic deployment is enabled later, preserve the same CI rule: production should only advance from a commit whose repository/showcase coverage gates are green.

## Security and caching

Keep:

- long-lived caching for immutable release binaries when served locally;
- short cache for registry/catalog metadata;
- `X-Content-Type-Options: nosniff`;
- strict referrer policy;
- a restrictive permissions policy;
- CSP limited to the static site plus canonical GitHub raw media/data origin.

## SEO

The showcase should expose:

- canonical URL;
- Open Graph title/description/image;
- Twitter summary card;
- sitemap;
- robots policy;
- clear release/coverage language in static HTML.

SEO copy should describe the actual asset system, not generic “design inspiration.”
