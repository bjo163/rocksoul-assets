from pathlib import Path
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
files = sorted(p for p in ROOT.rglob("*.svg") if ".git" not in p.parts and "node_modules" not in p.parts)
errors = []

for svg in files:
    try:
        root = ET.parse(svg).getroot()
        if not root.tag.endswith("svg"):
            errors.append(f"{svg.relative_to(ROOT)}: root element is not <svg>")
    except Exception as exc:
        errors.append(f"{svg.relative_to(ROOT)}: {exc}")

if errors:
    print("Invalid SVG/XML documents:", file=sys.stderr)
    for error in errors:
        print(f"- {error}", file=sys.stderr)
    raise SystemExit(1)

print(f"validSvgXml={len(files)}")
