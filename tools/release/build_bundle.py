#!/usr/bin/env python3
import hashlib, json, pathlib, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
version=(ROOT/"VERSION").read_text().strip()
out=ROOT/".release"/"out"; out.mkdir(parents=True,exist_ok=True)
inventory=out/"inventory.json"
if not inventory.exists():
    raise SystemExit("inventory.json missing; run snapshot.mjs first")
bundle=out/f"rocksoul-assets-v{version}.zip"
paths=[ROOT/"VERSION",ROOT/"manifest.json",ROOT/"moonwitness"/"asset-packs.json",inventory,out/"release.json"]
paths += sorted((ROOT/"dist").rglob("*"))
paths=[p for p in paths if p.is_file()]
with zipfile.ZipFile(bundle,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(paths,key=lambda x:str(x.relative_to(ROOT))):
        arc=str(p.relative_to(ROOT)).replace("\\","/")
        info=zipfile.ZipInfo(arc,(1980,1,1,0,0,0))
        info.external_attr=(0o100644<<16)
        z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
digest=hashlib.sha256(bundle.read_bytes()).hexdigest()
(bundle.with_suffix(bundle.suffix+".sha256")).write_text(f"{digest}  {bundle.name}\n")
print(json.dumps({"ok":True,"bundle":str(bundle.relative_to(ROOT)),"sha256":digest,"files":len(paths)},indent=2))
