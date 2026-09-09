# SVG color, typography, and accessibility policy

Canonical SVG sources are classified before delivery. `product-icons` and `semantic-primitives` are theme-aware: they use `currentColor` (or CSS variables), contain no embedded raster data or `<text>`, and expose a meaningful accessible label when informative. Decorative illustrations and specimens may use fixed palette colors and lettering only when their registry entry declares them decorative; UI usage must mark them `aria-hidden="true"`. Font-dependent artwork is converted to paths; source manifests record font family, license, and fallback. Raster derivatives are generated at 16/20/24/32 optical sizes and reviewed in light and dark themes.

The structural audit (`node tools/assets/validate-svg-policy.mjs`) enforces the machine-checkable portion of this contract. Exceptions must be documented in the asset registry.
