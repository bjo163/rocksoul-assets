# Security Policy

`rocksoul-assets` is primarily a static asset and build-tooling repository, but its CI, generated files, deployment configuration, and supply-chain dependencies still matter.

## Report privately

Do not open a public issue for:

- exposed credentials or tokens;
- workflow privilege escalation;
- dependency compromise;
- malicious generated payloads;
- deployment configuration that exposes private data;
- supply-chain issues affecting generators or release artifacts.

Use GitHub's private security reporting / Security Advisory workflow when available, or contact the repository owner privately.

## Never commit

- GitHub tokens;
- Vercel tokens;
- private API credentials;
- production secrets;
- private evidence or user data;
- non-public legal/research records.

## Asset-specific security

Canonical SVGs are validated as XML and are expected to remain native vector sources.

Generated distributions should not introduce executable payloads, remote scripts, or embedded raster/data content outside documented delivery contracts.

## Dependency changes

Generator/build dependency changes should be reviewed as supply-chain changes, especially:

- CairoSVG;
- Pillow;
- ffmpeg/runtime codecs;
- Node dependencies used by the Penpot builder.

Prefer locked versions and reproducible outputs.
