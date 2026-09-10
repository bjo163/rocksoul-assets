import { getArg, readJson, readText, writeJson, writeText, parseSemver, compareSemver, fail, jsonResult } from "./lib.mjs";
try{
  const next=String(getArg("version","")).trim(); parseSemver(next);
  const current=(await readText("VERSION")).trim(); parseSemver(current);
  if(compareSemver(next,current)<0) throw new Error(`refusing version downgrade ${current} -> ${next}`);
  await writeText("VERSION",next+"\n");
  const manifest=await readJson("manifest.json");
  manifest.release={...(manifest.release??{}),version:next,status:"managed",branch:"main",repositoryAcceptance:"pending-gate"};
  if(typeof manifest.release.name==="string") manifest.release.name=manifest.release.name.replace(/v\d+\.\d+\.\d+/g,`v${next}`);
  await writeJson("manifest.json",manifest);
  const packs=await readJson("moonwitness/asset-packs.json"); packs.version=next; await writeJson("moonwitness/asset-packs.json",packs);
  for(const p of ["dist/assets.json","showcase/catalog.json"]){
    try{const j=await readJson(p);j.version=next;await writeJson(p,j);}catch{}
  }
  try{
    const docs=await readText("docs/README.md");
    await writeText("docs/README.md",docs.replace(/\| Release \| \*\*v\d+\.\d+\.\d+\*\* \|/,`| Release | **v${next}** |`));
  }catch{}
  const changelog=await readText("CHANGELOG.md");
  if(!changelog.includes(`## [${next}]`)){
    const entry=`## [${next}] - ${new Date().toISOString().slice(0,10)}\n\n### Changed\n- Automated release candidate generated from deterministic repository impact.\n\n`;
    const marker=changelog.indexOf("\n## ");
    await writeText("CHANGELOG.md",marker>=0?changelog.slice(0,marker+1)+entry+changelog.slice(marker+1):changelog+"\n"+entry);
  }
  jsonResult({ok:true,from:current,to:next});
}catch(e){fail(e.message);}
