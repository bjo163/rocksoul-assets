# MoonWitness Cinematic Web Hero

Application-facing delivery profile for the MoonWitness public observatory hero.

This directory does **not** create a new canonical asset family. It composes existing released visual sources and the photographic masters from `cinematic-hero-pack` into one stable manifest for web/UI consumers.

## Consumer contract

```text
rocksoul-assets
  cinematic hero sources
        ↓
moonwitness/cinematic-web-hero/manifest.json
        ↓
@rocksoul/ui CinematicWebHero
        ↓
rocksoul-web
```

The photographic image owns environment, atmosphere, moon, terrain, and Rocksoul composition. Semantic UI remains live HTML/SVG:

- wordmark and navigation;
- headline and supporting copy;
- case CTA;
- evidence graph and its text equivalent;
- coordinates, archive labels, and status;
- focus, theme and reduced-motion behavior.

## Responsive delivery

- desktop: 2880×1620 WebP, 16:9;
- mobile: 1440×1920 WebP, dedicated 3:4 composition;
- overlays: canonical SVG grid, grain, and scanlines;
- archive strip: existing canonical PNG derivatives.

Do not rasterize the interactive UI into the hero master. Do not crop the desktop image to manufacture the mobile composition.
