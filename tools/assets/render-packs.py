from pathlib import Path
import json
import shutil
import cairosvg

ROOT = Path(__file__).resolve().parents[2]
MW = ROOT / "moonwitness"
INDEX = json.loads((MW / "asset-packs.json").read_text())
summary = []

for pack in INDEX.get("packs", []):
    manifest_path = ROOT / pack["manifest"]
    try:
        manifest = json.loads(manifest_path.read_text())
    except Exception:
        continue
    if not manifest.get("renderPng"):
        continue

    pack_dir = manifest_path.parent
    svg_dir = (pack_dir / manifest.get("root", "svg")).resolve()
    png_dir = pack_dir / "png"

    # Generated PNG is disposable. Clean first so deleted/renamed SVGs cannot leave stale raster files behind.
    if png_dir.exists():
        shutil.rmtree(png_dir)
    png_dir.mkdir(parents=True, exist_ok=True)

    svg_paths = sorted(
        p for p in svg_dir.rglob("*.svg")
        if png_dir.resolve() not in p.resolve().parents
    )
    expected = int(manifest.get("count", len(svg_paths)))
    if len(svg_paths) != expected:
        raise RuntimeError(f'{manifest.get("pack", pack["id"])}: expected {expected} SVGs, found {len(svg_paths)}')

    outputs = []
    sizes = manifest.get("sizes")
    for svg_path in svg_paths:
        print(f"rendering {svg_path.relative_to(ROOT)}", flush=True)
        rel = svg_path.relative_to(svg_dir)
        if sizes:
            for size in sizes:
                out = png_dir / str(size) / rel.with_suffix(".png")
                out.parent.mkdir(parents=True, exist_ok=True)
                cairosvg.svg2png(
                    url=str(svg_path),
                    write_to=str(out),
                    output_width=int(size),
                    output_height=int(size),
                )
                outputs.append({
                    "source": str(svg_path.relative_to(ROOT)),
                    "path": str(out.relative_to(ROOT)),
                    "width": int(size),
                    "height": int(size),
                })
        else:
            out = png_dir / rel.with_suffix(".png")
            out.parent.mkdir(parents=True, exist_ok=True)
            cairosvg.svg2png(url=str(svg_path), write_to=str(out))
            outputs.append({
                "source": str(svg_path.relative_to(ROOT)),
                "path": str(out.relative_to(ROOT)),
            })

    (png_dir / "manifest.json").write_text(
        json.dumps({
            "schemaVersion": 1,
            "packId": pack["id"],
            "pack": manifest.get("pack"),
            "canonicalFormat": manifest.get("canonicalFormat", "svg"),
            "generatedFormat": "png",
            "sourceCount": len(svg_paths),
            "outputs": outputs,
        }, indent=2) + "\n"
    )
    summary.append({
        "id": pack["id"],
        "pack": manifest.get("pack"),
        "sources": len(svg_paths),
        "outputs": len(outputs),
    })

print(json.dumps({"rendered": summary}, indent=2))
