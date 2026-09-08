# Asset Consumption Contract — v1.2.0

MoonWitness asset packs are shipped as **individual consumable files**, not as poster slices.

## Source of truth

`moonwitness/asset-packs.json` is the global pack index.

Each pack contains:

```text
<pack>/
  svg/                 # canonical editable source
  png/                 # generated derivative
  manifest.json        # ids, count, sizes, format contract
  README.md
```

Persona assets additionally generate:

```text
persona-pack/png/32/
persona-pack/png/64/
persona-pack/png/128/
persona-pack/png/256/
```

## Consumption rules

1. Prefer **SVG** for product UI, icons, badges, graphs, maps, cursors and illustrations.
2. Use **PNG** for external platforms, email clients, social surfaces, raster-only SDKs, thumbnails and fixed-size delivery.
3. Never crop/slice an atlas image at runtime.
4. Never edit generated PNG independently; change the canonical SVG and regenerate.
5. Status must not rely on color alone.
6. Graphs need a text/data equivalent in accessible UI.
7. Persona PNG should use the smallest adequate size for its displayed dimensions.

## Examples

### HTML

```html
<img
  src="/assets/moonwitness/badge-pack/svg/verified.svg"
  alt="Verified"
/>
```

### CSS background

```css
.hero {
  background-image: url("/assets/moonwitness/editorial-pack/svg/lunar-observatory.svg");
}
```

### React

```tsx
const assetRoot = "/assets/moonwitness";

export function StatusBadge() {
  return (
    <img
      src={`${assetRoot}/badge-pack/svg/legal-review.svg`}
      alt="Legal review"
      width={120}
      height={32}
    />
  );
}
```

### Raster-only consumer

```text
moonwitness/social-campaign-pack/png/instagram-square.png
moonwitness/platform-delivery-pack/png/app-store-banner.png
moonwitness/persona-pack/png/64/researcher.png
```

## Generated files

`tools/assets/render-packs.py` generates pack PNGs with CairoSVG.

`.github/workflows/generate-secondary-pack-raster.yml` keeps derivatives synchronized on `main`.
