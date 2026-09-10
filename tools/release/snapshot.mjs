import { getArg, readJson, readText, writeJson, walk, sha256File, jsonResult, fail } from "./lib.mjs";
try{
  const version=(await readText("VERSION")).trim(),sha=String(getArg("sha",process.env.GITHUB_SHA??""));
  if(!/^[0-9a-f]{40}$/i.test(sha)) throw new Error("snapshot requires exact 40-character --sha");
  const packs=await readJson("moonwitness/asset-packs.json"),dist=await readJson("dist/assets.json");
  const moon=await walk("moonwitness"),delivery=await walk("dist");
  const classification=await readJson("moonwitness/asset-classification.json").catch(()=>({}));
  const classCounts={};
  for(const v of Object.values(classification.assets??classification.classification??{})){
    const k=v?.assetKind; if(k) classCounts[k]=(classCounts[k]??0)+1;
  }
  const snapshot={
    schema:"rocksoul.release-inventory.v1",version,commit:sha,tag:`v${version}`,
    packFamilies:packs.packs.length,deliveryFiles:delivery.length,
    svgSources:moon.filter(x=>x.endsWith(".svg")).length,
    pngDerivatives:moon.filter(x=>x.endsWith(".png")).length,
    spriteSymbols:dist.coverage?.spriteSymbols??null,
    showcaseCoverage:dist.coverage?.coveragePercent??null,
    classificationCounts:classCounts,
    registrySha256:await sha256File("dist/assets.json"),
    generatedAt:new Date(0).toISOString()
  };
  await writeJson(".release/out/inventory.json",snapshot);
  jsonResult({ok:true,...snapshot});
}catch(e){ fail(e.message); }
