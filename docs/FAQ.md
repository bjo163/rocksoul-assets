# FAQ

## Is v1.3.1 missing any currently defined asset packs?

No. v1.3.1 closes the currently defined asset-generation scope. New requests are new scope.

## Does every PNG have a vector source?

Yes. The closure audit reports zero raster-without-vector delivery assets.

## Does every MoonWitness SVG have a PNG?

Yes for delivery SVGs. Penpot-only design source SVGs are intentionally exempt from raster delivery, but they still must be valid XML.

## Why keep SVG and PNG?

SVG is canonical and editable. PNG supports raster-only consumers, fixed delivery, email/social surfaces, and preview workflows.

## Why are WebM files not byte-reproducible?

WebM/VP9 container output can vary at the binary level even when the encoded contract is equivalent. Release validation therefore checks WebM semantics with ffprobe, while APNG and Lottie remain byte-reproducible.

## Is the showcase a curated gallery?

No. It is required to cover 100% of delivery files.

## Why are Brand and V1 Baseline shown as “foundation collections”?

They are first-class delivery assets created before the 42-pack index. The showcase adds them as explicit collections so they cannot become invisible.

## Can I use `dist/assets.ts` like an npm package?

It is a generated repository artifact, not a published npm package. Consumer repositories may vendor, synchronize, or otherwise integrate it according to their build strategy.

## Should I edit files under `dist/`, `png/`, `generated/`, or runtime derivative folders?

No. Edit canonical sources or generator logic, then regenerate.

## Is Penpot work finished?

Repository-side Penpot sources and generated package checks are complete. Native live-workspace reconstruction, interaction wiring, font inspection, and final live accessibility review remain manual checks.

## Is the showcase deployed automatically from GitHub?

The production project is currently deployed as an explicit static bundle from repository source. If Git integration is enabled later, the same CI gates should remain the deployment prerequisite.

## Can external users freely reuse these assets?

Do not assume so. The repository currently has no repository-wide license. See [Licensing](LICENSING.md).
