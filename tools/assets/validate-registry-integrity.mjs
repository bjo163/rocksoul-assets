import { exists, readJson, jsonResult, fail } from "../release/lib.mjs";
const visualExt=/\.(svg|png|ico)$/i;
try{
  const idx=await readJson("moonwitness/asset-packs.json");
  const dist=await readJson("dist/assets.json");
  const ids=idx.packs.map(p=>p.id);
  if(new Set(ids).size!==ids.length) throw new Error("duplicate asset pack IDs");
  const errors=[],canonicalSources=new Set(),deliveryToSource=new Map();
  for(const p of idx.packs){
    if(!await exists(p.manifest)){errors.push(`${p.id}: missing manifest ${p.manifest}`);continue;}
    let m; try{m=await readJson(p.manifest);}catch{errors.push(`${p.id}: invalid manifest JSON`);continue;}
    if(Number.isFinite(p.count)&&Number.isFinite(m.count)&&p.count!==m.count) errors.push(`${p.id}: index count ${p.count} != manifest count ${m.count}`);
    const dp=dist.packs?.[p.id];
    if(!dp){errors.push(`${p.id}: missing from dist registry`);continue;}
    if(Number.isFinite(p.count)&&Number.isFinite(dp.count)&&p.count!==dp.count) errors.push(`${p.id}: index count ${p.count} != dist count ${dp.count}`);
    const files=[...new Set(dp.files??[])];
    for(const f of files) if(!await exists(f)) errors.push(`${p.id}: missing delivery file ${f}`);
    for(const f of files.filter(x=>visualExt.test(x))){
      const meta=dp.visualAssets?.[f];
      if(!meta){errors.push(`${p.id}: visual delivery missing metadata ${f}`);continue;}
      const source=meta.canonicalSource??(f.endsWith(".svg")?f:null);
      if(!source){errors.push(`${p.id}: visual delivery has no canonical source ${f}`);continue;}
      if(!await exists(source)) errors.push(`${p.id}: canonical source missing ${source}`);
      deliveryToSource.set(f,source); canonicalSources.add(source);
    }
  }
  const coverage=dist.coverage??{};
  if(Number(coverage.packFamilies)!==idx.packs.length) errors.push(`pack family drift: ${coverage.packFamilies} != ${idx.packs.length}`);
  if(Number(coverage.indexedDeliveryFiles)!==Number(coverage.deliveryFiles)) errors.push(`delivery index drift: ${coverage.indexedDeliveryFiles} != ${coverage.deliveryFiles}`);
  if(Number(coverage.coveragePercent)!==100||Number(coverage.missingDeliveryFiles)!==0) errors.push("showcase/delivery coverage is not 100%");
  if(errors.length) throw new Error(errors.slice(0,50).join("; ")+(errors.length>50?`; +${errors.length-50} more`:""));
  jsonResult({ok:true,packFamilies:idx.packs.length,deliveryFiles:coverage.deliveryFiles,coveragePercent:coverage.coveragePercent,visualReverseMappings:deliveryToSource.size,canonicalSources:canonicalSources.size});
}catch(e){fail(e.message);}
