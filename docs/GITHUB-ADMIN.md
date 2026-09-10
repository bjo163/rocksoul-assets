# GitHub Administration Contract

Repository administration is deliberately separated from release/runtime automation because changing repository settings requires GitHub administration permission.

The desired public metadata is machine-readable in `.github/REPOSITORY-METADATA.json`:

- description explains that this repository is the MoonWitness × Rocksoul visual asset and design-system source;
- homepage points to the production Asset Explorer;
- topics cover Rocksoul, assets, design system, Penpot, SVG, and MoonWitness;
- `/docs` is canonical documentation;
- GitHub Wiki, when enabled, is an optional mirror/navigation layer only and must not become a second source of truth.

After an administrator applies the file, verify the live repository metadata against it. Release automation must not fabricate administrative success when the connected token cannot mutate repository settings.
