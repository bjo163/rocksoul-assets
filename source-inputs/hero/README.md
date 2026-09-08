# Photographic hero source inputs

This directory preserves the raw AI-generated candidate renders used to build the named photographic hero masters.

They intentionally live outside `moonwitness/` so raw candidates do not enter the canonical SVG/PNG delivery registry or break raster/vector coverage checks.

The active production inputs are:
- `ChatGPT Image Sep 8, 2026, 05_02_55 AM (1).png` — desktop master source
- `ChatGPT Image Sep 8, 2026, 05_02_55 AM (2).png` — mobile master source
- `ChatGPT Image Sep 8, 2026, 05_02_55 AM (3).png` — moon source

Build with `bash tools/assets/build-photographic-hero.sh`.
