# Asset Validator

Repository-level checks for MoonWitness visual assets.

## Validates

- every v1 PNG/JPEG baseline screen has a same-basename editable SVG counterpart
- canonical SVG counterparts do not embed PNG/JPEG/WebP via `<image>` or data URI
- brand inventory points to existing native SVG sources
- v2 application screen contract points to existing native SVG sources
- resource navigation remains AutoMenu-driven with unique IDs/routes
- error / empty / loading / offline / forbidden state contracts exist
- MW-0042 mobile golden-slice SVGs stay inside the fixed 390 × 844 viewport

Run:

```bash
node tools/assets/validate.mjs
```
