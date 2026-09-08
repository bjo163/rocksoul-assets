from pathlib import Path
import json
import cairosvg

ROOT=Path(__file__).resolve().parents[2]
MW=ROOT/"moonwitness"
summary=[]

for manifest_path in MW.rglob("manifest.json"):
    try:
        manifest=json.loads(manifest_path.read_text())
    except Exception:
        continue
    if not manifest.get("renderPng"):
        continue
    pack_dir=manifest_path.parent
    svg_dir=pack_dir/manifest.get("root","svg")
    png_dir=pack_dir/"png"
    png_dir.mkdir(parents=True,exist_ok=True)
    outputs=[]
    sizes=manifest.get("sizes")
    for svg_path in sorted(svg_dir.glob("*.svg")):
        if sizes:
            for size in sizes:
                out_dir=png_dir/str(size)
                out_dir.mkdir(parents=True,exist_ok=True)
                out=out_dir/(svg_path.stem+".png")
                cairosvg.svg2png(url=str(svg_path),write_to=str(out),output_width=int(size),output_height=int(size))
                outputs.append({"source":str(svg_path.relative_to(ROOT)),"path":str(out.relative_to(ROOT)),"width":int(size),"height":int(size)})
        else:
            out=png_dir/(svg_path.stem+".png")
            cairosvg.svg2png(url=str(svg_path),write_to=str(out))
            outputs.append({"source":str(svg_path.relative_to(ROOT)),"path":str(out.relative_to(ROOT))})
    (png_dir/"manifest.json").write_text(json.dumps({"schemaVersion":1,"pack":manifest.get("pack"),"canonicalFormat":"svg","generatedFormat":"png","outputs":outputs},indent=2)+"\n")
    summary.append({"pack":manifest.get("pack"),"outputs":len(outputs)})

print(json.dumps({"rendered":summary},indent=2))
