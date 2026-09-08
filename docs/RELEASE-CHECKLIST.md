# v1.0.0 Release Checklist

## Repository sources

- [x] Canonical brand SVG family present
- [x] Generated brand delivery formats present
- [x] Generated derivative manifest maps outputs to SVG sources
- [x] 16 v1 PNG references paired with 16 vector-native SVG sources
- [x] v2 application shell and all requested product surfaces present
- [x] AutoMenu navigation contract present
- [x] Authorization and system-state contracts present
- [x] Penpot application-shell contract present
- [x] MW-0042 mobile boards fit fixed 390 × 844
- [x] Penpot lockfile committed
- [x] VERSION = 1.0.0
- [x] manifest release version = 1.0.0
- [x] CHANGELOG contains 1.0.0 release entry

## Automated acceptance

- [x] Asset validator
- [x] Raster/vector source mapping
- [x] Brand SVG inventory
- [x] Brand PNG/ICO regeneration reproducibility
- [x] Application screen/state/navigation validation
- [x] Mobile golden-board bounds validation
- [x] Penpot source validation
- [x] Penpot package generation
- [x] Penpot package-structure validation

## External live Penpot verification

These checks are intentionally **not** claimed by repository CI:

- [ ] final font availability/licensing in the live Penpot workspace
- [ ] native Penpot component reconstruction
- [ ] native component state-matrix review
- [ ] live interaction prototype
- [ ] keyboard/focus walkthrough
- [ ] live contrast/accessibility review

They do not indicate missing release assets; they are post-source design-workspace verification.
