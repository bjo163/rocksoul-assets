# Contributing to Rocksoul Assets

Thanks for improving the MoonWitness × Rocksoul visual system.

This repository is **source-first**. Do not submit a standalone generated image without the canonical and delivery contracts that make it maintainable.

## Before changing anything

Read:

1. [docs/GOVERNANCE.md](docs/GOVERNANCE.md)
2. [docs/ASSET-STRUCTURE.md](docs/ASSET-STRUCTURE.md)
3. [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md)
4. [docs/VERSIONING.md](docs/VERSIONING.md)

## Asset contribution workflow

1. Identify the existing pack that owns the semantic.
2. Add or modify the canonical source.
3. Update the pack manifest/count when needed.
4. Regenerate required derivatives.
5. Regenerate `dist/`.
6. Update `showcase/catalog.json` only when presentation metadata changes or a new collection is introduced.
7. Update relevant docs.
8. Run/allow CI to verify:
   - SVG/XML validity;
   - raster/vector coverage;
   - reproducible derivatives;
   - registry completeness;
   - 100% showcase coverage;
   - Penpot package/golden checks where applicable.

## Do not

- hand-edit generated PNGs;
- hand-edit `dist/assets.json` or `dist/assets.ts`;
- add raster-only visual assets without canonical SVG;
- hide a breaking rename behind a “cleanup” PR;
- imply verification/causation/legal judgment with decorative styling;
- treat screenshots/posters as runtime spritesheets.

## Pull requests

A good PR explains:

- what consumer problem it solves;
- which canonical pack/source owns the change;
- whether paths or keys change;
- which derivatives are generated;
- accessibility/semantic impact;
- whether release scope changes.

Keep unrelated visual-system changes separate.

## Documentation contributions

Current operational docs describe current behavior and should reference the current release.

Historical details belong in `CHANGELOG.md` or GitHub Releases.

## Licensing

Do not introduce third-party assets, fonts, imagery, or audio without a clear right to redistribute them.

See [docs/LICENSING.md](docs/LICENSING.md).
