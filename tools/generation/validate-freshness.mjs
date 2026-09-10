import { exists, readJson, jsonResult, git, fail } from "../release/lib.mjs";
try{
  const manifest=await readJson("tools/generation/generation-manifest.json");
  const ids=new Set(),outputs=new Map(),errors=[];
  for(const e of manifest.entries??[]){
    if(!e.id||ids.has(e.id)) errors.push(`duplicate/missing generator id: ${e.id}`); ids.add(e.id);
    if(!await exists(e.generator)) errors.push(`${e.id}: missing generator ${e.generator}`);
    for(const s of e.sources??[]) if(!await exists(s)) errors.push(`${e.id}: missing source ${s}`);
    for(const o of e.outputs??[]){
      if(!await exists(o)) errors.push(`${e.id}: missing output ${o}`);
      const prior=outputs.get(o); if(prior&&prior!==e.id&&o!=="moonwitness") errors.push(`${e.id}: output ${o} also owned by ${prior}`);
      outputs.set(o,e.id);
    }
  }
  if(errors.length) throw new Error(errors.join("; "));
  if(process.argv.includes("--assert-clean")){
    const dirty=git(["status","--porcelain"]).stdout.trim();
    if(dirty) throw new Error(`generated tree is not clean after regeneration:\n${dirty}`);
  }
  jsonResult({ok:true,generators:ids.size,outputs:[...outputs.keys()].sort()});
}catch(e){ fail(e.message); }
