import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");
const args=new Set(process.argv.slice(2));
const checkMode=args.has("--check");
const readJson=async(rel)=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const posix=(p)=>p.split(path.sep).join("/");

async function walk(dir){
  const out=[];
  for(const entry of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}
function normalizeFont(v){return v.trim().replace(/\s+/g," ").replace(/^['"]|['"]$/g,"")}
function normalizeHex(v){
  const raw=v.toUpperCase();
  if(/^#[0-9A-F]{3}$/.test(raw)) return "#"+raw.slice(1).split("").map(x=>x+x).join("");
  if(/^#[0-9A-F]{4}$/.test(raw)) return "#"+raw.slice(1).split("").map(x=>x+x).join("");
  return raw;
}
function isCrimsonLike(hex){
  if(!/^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/.test(hex)) return false;
  const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
  if(delta<0.12||r<0.35) return false;
  let h=0;
  if(delta!==0){
    if(max===r) h=60*(((g-b)/delta)%6);
    else if(max===g) h=60*(((b-r)/delta)+2);
    else h=60*(((r-g)/delta)+4);
  }
  if(h<0)h+=360;
  return (h<=20||h>=340)&&(max===0?0:delta/max)>=0.35;
}
function normalizeSvgExact(s){return s.replace(/<!--[^]*?-->/g,"").replace(/\s+/g," ").trim()}
function normalizeSvgStructure(s){
  return normalizeSvgExact(s)
    .replace(/id=(['"])[^'"]+\1/g,'id="<id>"')
    .replace(/url\(#[^)]+\)/g,"url(#<id>)")
    .replace(/#[0-9a-fA-F]{3,8}\b/g,"<color>")
    .replace(/rgba?\([^)]*\)/gi,"<color>")
    .replace(/hsla?\([^)]*\)/gi,"<color>")
    .replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi,"<n>");
}
const sha=(v)=>createHash("sha256").update(v).digest("hex");
function addCount(map,value,file){
  if(!value)return;
  const key=String(value).trim(); if(!key)return;
  const item=map.get(key)??{value:key,count:0,files:[]};
  item.count+=1;
  if(item.files.length<20&&!item.files.includes(file))item.files.push(file);
  map.set(key,item);
}
const grouped=(map)=>[...map.values()].sort((a,b)=>b.count-a.count||a.value.localeCompare(b.value));
function groupDuplicates(entries,key){
  const groups=new Map();
  for(const entry of entries){const list=groups.get(entry[key])??[];list.push(entry.file);groups.set(entry[key],list)}
  return [...groups.entries()].filter(([,files])=>files.length>1)
    .map(([signature,files])=>({signature,count:files.length,files:files.sort().slice(0,30)}))
    .sort((a,b)=>b.count-a.count||a.signature.localeCompare(b.signature)).slice(0,30);
}
function categoryFor(packId,file){
  if(packId==="semantic-primitives"||file.includes("/primitives/"))return"primitives";
  if(packId==="product-icons")return"product-icons";
  if(["graph-vector","data-viz","architecture-diagram"].includes(packId))return"graph-data-viz";
  if(packId==="dashboard")return"dashboard-widgets";
  if(["evidence-media","correlation-semantics","evidence-integrity","privacy-redaction","export-seal"].includes(packId))return"evidence-correlation";
  if(["editorial","document-report","source-file"].includes(packId))return"editorial-document";
  if(["cinematic-hero","hero-backgrounds"].includes(packId))return"cinematic-heroes";
  if(["motion","runtime-motion"].includes(packId))return"motion-first-frames";
  if(["rocksoul-character","persona-avatar"].includes(packId))return"rocksoul-character-persona";
  return"other";
}
const esc=(v)=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function contactSheet(title,category=null){
  const categoryJson=JSON.stringify(category);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>body{font:14px/1.45 system-ui,sans-serif;margin:0;background:#151515;color:#f7f4ec}main{padding:24px}h1{margin:0 0 8px}p{color:#a3a3a3}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.card{border:1px solid #4a4a4a;border-radius:8px;overflow:hidden;background:#242424}.card header{padding:10px 12px;display:grid;gap:4px}.card code{font-size:10px;overflow-wrap:anywhere;color:#d9d6ce}.previews{display:grid;grid-template-columns:1fr 1fr;min-height:140px}.preview{display:grid;place-items:center;padding:12px}.preview img{max-width:100%;max-height:160px}.light{background:#f7f4ec}.dark{background:#0b0b0b}@media(max-width:600px){.previews{grid-template-columns:1fr}}</style></head>
<body><main><h1>${esc(title)}</h1><p id="summary">Loading canonical registry…</p><section class="grid" id="grid"></section></main>
<script>
const selectedCategory=${categoryJson};
const categoryFor=(packId,file)=>{
  if(packId==="semantic-primitives"||file.includes("/primitives/"))return"primitives";
  if(packId==="product-icons")return"product-icons";
  if(["graph-vector","data-viz","architecture-diagram"].includes(packId))return"graph-data-viz";
  if(packId==="dashboard")return"dashboard-widgets";
  if(["evidence-media","correlation-semantics","evidence-integrity","privacy-redaction","export-seal"].includes(packId))return"evidence-correlation";
  if(["editorial","document-report","source-file"].includes(packId))return"editorial-document";
  if(["cinematic-hero","hero-backgrounds"].includes(packId))return"cinematic-heroes";
  if(["motion","runtime-motion"].includes(packId))return"motion-first-frames";
  if(["rocksoul-character","persona-avatar"].includes(packId))return"rocksoul-character-persona";
  return"other";
};
const esc=(v)=>String(v).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const collectSvg=(value,out)=>{
  if(typeof value==="string"&&value.endsWith(".svg"))out.add(value);
  else if(Array.isArray(value))for(const item of value)collectSvg(item,out);
  else if(value&&typeof value==="object")for(const item of Object.values(value))collectSvg(item,out);
};
fetch("../../../dist/assets.json").then(r=>r.json()).then(registry=>{
  const items=[];
  for(const source of [registry.packs??{},registry.collections??{}]){
    for(const [packId,data] of Object.entries(source)){
      const files=new Set(); collectSvg(data,files);
      for(const file of files)items.push({packId,file,category:categoryFor(packId,file)});
    }
  }
  const unique=[...new Map(items.map(x=>[x.file,x])).values()].sort((a,b)=>a.file.localeCompare(b.file));
  const filtered=selectedCategory?unique.filter(x=>x.category===selectedCategory):unique;
  document.getElementById("summary").textContent=filtered.length+" canonical SVG assets from dist/assets.json. Every asset is shown on light and dark surfaces.";
  document.getElementById("grid").innerHTML=filtered.map(item=>{
    const src="../../../"+item.file;
    return '<article class="card"><header><strong>'+esc(item.packId)+'</strong><code>'+esc(item.file)+'</code></header><div class="previews"><div class="preview light"><img loading="lazy" src="'+esc(src)+'" alt="'+esc(item.file)+' on light background"></div><div class="preview dark"><img loading="lazy" src="'+esc(src)+'" alt="'+esc(item.file)+' on dark background"></div></div></article>';
  }).join("");
});
</script></body></html>\n`;
}

const packIndex=await readJson("moonwitness/asset-packs.json");
const classification=await readJson("moonwitness/asset-classification.json");
const packRoots=packIndex.packs.map(pack=>({id:pack.id,manifest:pack.manifest,root:posix(path.dirname(pack.manifest))})).sort((a,b)=>b.root.length-a.root.length);
const kindByPack=new Map();
for(const rule of classification.rules)for(const id of rule.collectionIds??[])kindByPack.set(id,rule.assetKind);

const allFiles=(await walk(path.join(root,"moonwitness"))).map(f=>posix(path.relative(root,f)));
const svgFiles=allFiles.filter(f=>f.toLowerCase().endsWith(".svg"));
const canonical=[];
const fontMap=new Map(),colorMap=new Map(),strokeMap=new Map(),radiusMap=new Map(),geometryMap=new Map();
let themeAwareAssets=0,fixedThemeAssets=0,filesWithText=0,filesWithEmbeddedRaster=0;
const primitiveViolations=[];

for(const file of svgFiles){
  const pack=packRoots.find(p=>file===p.root||file.startsWith(p.root+"/"));
  if(!pack)continue;
  const source=await readFile(path.join(root,file),"utf8");
  const packId=pack.id,assetKind=kindByPack.get(packId)??null;
  const themeAware=/currentColor|var\(--/i.test(source);
  const containsText=/<text\b/i.test(source);
  const embeddedRaster=/<image\b[^>]+(?:data:image|\.(?:png|jpe?g|webp))/i.test(source);
  themeAware?themeAwareAssets++:fixedThemeAssets++;
  if(containsText)filesWithText++;
  if(embeddedRaster)filesWithEmbeddedRaster++;
  for(const m of source.matchAll(/font-family\s*=\s*(['"])(.*?)\1/gi))addCount(fontMap,normalizeFont(m[2]),file);
  for(const m of source.matchAll(/font-family\s*:\s*([^;"'}]+)/gi))addCount(fontMap,normalizeFont(m[1]),file);
  for(const m of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g))addCount(colorMap,normalizeHex(m[0]),file);
  for(const m of source.matchAll(/stroke-width\s*=\s*(['"])(.*?)\1/gi))addCount(strokeMap,m[2].trim(),file);
  for(const m of source.matchAll(/stroke-width\s*:\s*([^;"'}]+)/gi))addCount(strokeMap,m[1].trim(),file);
  for(const m of source.matchAll(/\b(?:rx|ry)\s*=\s*(['"])(.*?)\1/gi))addCount(radiusMap,m[2].trim(),file);
  if(/(?:graph|correlation|topology|network|node|architecture|data-viz)/i.test(packId+"/"+file)){
    const tags=["circle","ellipse","rect","polygon","polyline","line","path"];
    const signature=tags.map(tag=>`${tag}:${(source.match(new RegExp(`<${tag}\\b`,"gi"))??[]).length}`).join("|");
    addCount(geometryMap,signature,file);
  }
  if(assetKind==="primitive"){
    if(containsText)primitiveViolations.push({file,rule:"primitive-must-not-contain-text"});
    if(embeddedRaster)primitiveViolations.push({file,rule:"primitive-must-not-embed-raster"});
    if(!themeAware)primitiveViolations.push({file,rule:"primitive-must-be-theme-aware"});
  }
  canonical.push({file,packId,assetKind,category:categoryFor(packId,file),themeAware,containsText,embeddedRaster,exactHash:sha(normalizeSvgExact(source)),structuralHash:sha(normalizeSvgStructure(source))});
}

const colors=grouped(colorMap),crimsonRedValues=colors.filter(x=>isCrimsonLike(x.value));
const categories=["primitives","product-icons","graph-data-viz","dashboard-widgets","evidence-correlation","editorial-document","cinematic-heroes","motion-first-frames","rocksoul-character-persona"];
const exactDuplicates=groupDuplicates(canonical,"exactHash"),structuralDuplicates=groupDuplicates(canonical,"structuralHash");
const audit={
  schemaVersion:1,generatedBy:"tools/assets/generate-visual-system-v2-audit.mjs",generatedForVersion:packIndex.version,
  canonicalPackFamilies:packIndex.packs.length,canonicalSvgFiles:canonical.length,
  counts:{
    uniqueFontFamilyDeclarations:fontMap.size,uniqueFixedPaletteColors:colorMap.size,uniqueCrimsonRedValues:crimsonRedValues.length,
    uniqueStrokeWidths:strokeMap.size,uniqueRadiusValues:radiusMap.size,graphGeometrySignatures:geometryMap.size,
    themeAwareAssets,fixedThemeAssets,filesWithText,filesWithEmbeddedRaster,
    exactDuplicateCandidateGroups:exactDuplicates.length,structuralNearDuplicateCandidateGroups:structuralDuplicates.length,
    productionPrimitiveViolations:primitiveViolations.length
  },
  fontFamilies:grouped(fontMap).map(({value,count,files})=>({value,count,files:files.slice(0,10)})),
  paletteColors:colors.map(({value,count})=>({value,count})),
  crimsonRedValues:crimsonRedValues.map(({value,count,files})=>({value,count,files:files.slice(0,10)})),
  strokeWidths:grouped(strokeMap).map(({value,count})=>({value,count})),
  radiusValues:grouped(radiusMap).map(({value,count})=>({value,count})),
  graphGeometrySignatures:grouped(geometryMap).map(({value,count,files})=>({value,count,files:files.slice(0,3)})),
  duplicateCandidates:{exact:exactDuplicates,structural:structuralDuplicates},
  productionPrimitiveViolations:primitiveViolations,
  packClassifications:packIndex.packs.map(pack=>({id:pack.id,assetKind:kindByPack.get(pack.id)??"non-visual"})),
  categories:Object.fromEntries(categories.map(name=>[name,canonical.filter(x=>x.category===name).length]))
};
const report=`# ROCKSOUL Visual System 2.0 — Baseline Audit

This file is generated from canonical SVG sources by \`tools/assets/generate-visual-system-v2-audit.mjs\`. Do not hand-edit measurements.

## Baseline

| Metric | Count |
| --- | ---: |
| Canonical pack families | ${audit.canonicalPackFamilies} |
| Canonical SVG files | ${audit.canonicalSvgFiles} |
| Unique font-family declarations | ${audit.counts.uniqueFontFamilyDeclarations} |
| Unique fixed palette colors | ${audit.counts.uniqueFixedPaletteColors} |
| Unique crimson/red values | ${audit.counts.uniqueCrimsonRedValues} |
| Unique stroke widths | ${audit.counts.uniqueStrokeWidths} |
| Unique radius values | ${audit.counts.uniqueRadiusValues} |
| Graph geometry signatures | ${audit.counts.graphGeometrySignatures} |
| Theme-aware SVG assets | ${audit.counts.themeAwareAssets} |
| Fixed-theme SVG assets | ${audit.counts.fixedThemeAssets} |
| SVG files containing text | ${audit.counts.filesWithText} |
| SVG files embedding raster media | ${audit.counts.filesWithEmbeddedRaster} |
| Exact duplicate candidate groups | ${audit.counts.exactDuplicateCandidateGroups} |
| Structural near-duplicate candidate groups | ${audit.counts.structuralNearDuplicateCandidateGroups} |
| Production primitive violations | ${audit.counts.productionPrimitiveViolations} |

## Contact sheets

- [Master](generated/visual-system-v2/contact-sheet-master.html)
${categories.map(name=>`- [${name}](generated/visual-system-v2/contact-sheet-${name}.html) — ${audit.categories[name]} assets`).join("\n")}

Every contact sheet renders light and dark comparison boards.

## Typography inventory

${audit.fontFamilies.length?audit.fontFamilies.map(x=>`- \`${x.value}\` — ${x.count} declarations`).join("\n"):"- No font-family declarations found."}

## Crimson/red inventory

${audit.crimsonRedValues.length?audit.crimsonRedValues.map(x=>`- \`${x.value}\` — ${x.count} uses`).join("\n"):"- No crimson/red fixed values found."}

## Observed stroke widths

${audit.strokeWidths.slice(0,30).map(x=>`- \`${x.value}\` — ${x.count} uses`).join("\n")||"- None found."}

## Observed radii

${audit.radiusValues.slice(0,30).map(x=>`- \`${x.value}\` — ${x.count} uses`).join("\n")||"- None found."}

## Pack classification

| Pack | Classification |
| --- | --- |
${audit.packClassifications.map(x=>`| \`${x.id}\` | \`${x.assetKind}\` |`).join("\n")}

## Duplicate candidates

Exact duplicate groups: **${audit.counts.exactDuplicateCandidateGroups}**. Structural near-duplicate groups: **${audit.counts.structuralNearDuplicateCandidateGroups}**. Full evidence and file lists live in \`docs/generated/visual-system-audit.json\`.

## Phase-0 interpretation

This baseline is descriptive evidence, not permission to preserve drift. Visual System 2.0 contracts in \`docs/ART-DIRECTION-V2.md\`, \`docs/GRAPH-GRAMMAR-V2.md\`, and \`docs/DATA-VIZ-GRAMMAR-V2.md\` define the target. Existing undocumented fonts, crimson variants, geometry signatures, and near-duplicates are migration input for later phases.
`;

const out=new Map([
  ["docs/generated/visual-system-audit.json",JSON.stringify(audit,null,2)+"\n"],
  ["docs/VISUAL-AUDIT-V2.md",report],
  ["docs/generated/visual-system-v2/contact-sheet-master.html",contactSheet("ROCKSOUL Visual System 2.0 — Master Contact Sheet")]
]);
for(const category of categories)out.set(`docs/generated/visual-system-v2/contact-sheet-${category}.html`,contactSheet(`ROCKSOUL Visual System 2.0 — ${category}`,category));

if(checkMode){
  const drift=[];
  for(const [rel,expected] of out){
    try{if(await readFile(path.join(root,rel),"utf8")!==expected)drift.push(rel)}catch{drift.push(rel)}
  }
  if(drift.length){console.error("Visual audit generated output is stale: "+drift.join(", "));process.exit(1)}
}else{
  for(const [rel,value] of out){await mkdir(path.dirname(path.join(root,rel)),{recursive:true});await writeFile(path.join(root,rel),value)}
}
console.log(JSON.stringify({canonicalPackFamilies:audit.canonicalPackFamilies,canonicalSvgFiles:audit.canonicalSvgFiles,counts:audit.counts,categories:audit.categories},null,2));
