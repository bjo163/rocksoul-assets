# Generated Brand Delivery Assets

Files in this directory are generated from the canonical SVG sources one directory above.

Do not edit PNG/ICO files directly.

Regenerate with:

```bash
python -m pip install cairosvg==2.7.1 pillow==10.4.0
python tools/assets/render-brand.py
```

The generator writes `manifest.json` mapping each raster/ICO output to its SVG source.
