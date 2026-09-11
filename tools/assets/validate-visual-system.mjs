import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=async(rel)=>readFile(path.join(root,rel),"utf8");
const readJson=async(rel)=>JSON.parse(await read(rel));
async function walk(dir){
  const out=[];
  for(const e of await readdir(path.join(root,dir),{withFileTypes:true})){
    const rel=path.posix.join(dir,e.name);
    if(e.isDirectory())out.push(...await walk(rel)); else out.push(rel);
  }
  return out;
}

const contract=await readJson("moonwitness/visual-system-v2.json");
const audit=await readJson("docs/generated/visual-system-audit.json");
const lifecycle=await readJson("moonwitness/asset-lifecycle.json");
const index=await readJson("moonwitness/asset-packs.json");
const registry=await readJson("dist/assets.json");
const tokens=await readJson("penpot/tokens/moonwitness.tokens.json");
const errors=[],warnings=[];

const requiredPersonalities=["operator","forensic","editorial","archive","cinematic","community"];
const requiredDensities=["compact","comfortable","editorial"];
const requiredNodes=["canonical-record","evidence","source","person","event","story","rgbl-text","legal-state","external-reference","unresolved-record","inferred-candidate-record","missing-record","system-provider-resource"];
const requiredEdges=["supports","contradicts","references","temporal","identity","legal","provenance","dependency","routes-to","unresolved-candidate"];
const requiredCharts=["line","area","bar","stacked-bar","heat-strip","donut","time-series","threshold-boundary","confidence-uncertainty"];
const migratedPacks=new Set(["product-icons","semantic-primitives","data-viz","graph-vector","correlation-semantics","architecture-diagram","dashboard","cinematic-hero","editorial"]);
const allowedLifecycle=new Set(contract.lifecycle?.statuses??[]);
const requiredEntryFields=["lifecycle","visualSystemVersion","surfacePersonalities","semanticRole","grammarFamily","allowedUsage","prohibitedUsage"];

function requireSet(actual,required,label){
  const set=new Set(actual);
  for(const value of required)if(!set.has(value))errors.push(`${label} missing: ${value}`);
}
function collectTokenColors(value,out=new Set()){
  if(typeof value==="string"&&/^#[0-9a-f]{6}$/i.test(value))out.add(value.toUpperCase());
  else if(Array.isArray(value))for(const item of value)collectTokenColors(item,out);
  else if(value&&typeof value==="object"){
    if(typeof value.$value==="string"&&/^#[0-9a-f]{6}$/i.test(value.$value))out.add(value.$value.toUpperCase());
    for(const item of Object.values(value))collectTokenColors(item,out);
  }
  return out;
}
function crimsonLike(hex){
  const base=hex.slice(0,7).toUpperCase();
  if(!/^#[0-9A-F]{6}$/.test(base))return false;
  const r=parseInt(base.slice(1,3),16)/255,g=parseInt(base.slice(3,5),16)/255,b=parseInt(base.slice(5,7),16)/255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
  if(delta<0.12||r<0.35)return false;
  let h=0;
  if(delta){
    if(max===r)h=60*(((g-b)/delta)%6);
    else if(max===g)h=60*(((b-r)/delta)+2);
    else h=60*(((r-g)/delta)+4);
  }
  if(h<0)h+=360;
  return (h<=20||h>=340)&&(max===0?0:delta/max)>=0.35;
}

if(contract.schemaVersion!==1)errors.push("visual-system-v2 schemaVersion must be 1");
if(contract.layers?.moonwitness?.role!=="rigorous-system")errors.push("MoonWitness layer role must be rigorous-system");
if(contract.layers?.rocksoul?.role!=="human-intervention")errors.push("ROCKSOUL layer role must be human-intervention");
requireSet(Object.keys(contract.surfacePersonalities??{}),requiredPersonalities,"surface personality");
requireSet(Object.keys(contract.densityModes??{}),requiredDensities,"density mode");
requireSet((contract.graphGrammar?.nodes??[]).map(x=>x.id),requiredNodes,"graph node");
requireSet((contract.graphGrammar?.edges??[]).map(x=>x.id),requiredEdges,"graph edge");
requireSet((contract.dataVizGrammar?.charts??[]).map(x=>x.id),requiredCharts,"chart grammar");
if(contract.graphGrammar?.grayscaleRequired!==true)errors.push("graph grammar must require grayscale legibility");
if(contract.dataVizGrammar?.forcedColorFallback!==true)errors.push("data-viz grammar must require forced-color fallback");

if(lifecycle.schemaVersion!==1||lifecycle.visualSystemVersion!==2)errors.push("asset lifecycle registry must be schema v1 / Visual System v2");
requireSet(lifecycle.statuses??[],[...allowedLifecycle],"lifecycle registry status");
const indexedIds=index.packs.map(x=>x.id);
requireSet(Object.keys(lifecycle.packs??{}),indexedIds,"lifecycle pack");
for(const id of Object.keys(lifecycle.packs??{}))if(!indexedIds.includes(id))errors.push(`lifecycle registry contains unknown pack: ${id}`);
for(const id of ["brand-system","baseline-v1"])if(!lifecycle.collections?.[id])errors.push(`lifecycle collection missing: ${id}`);

for(const [id,policy] of Object.entries(lifecycle.packs??{})){
  if(!allowedLifecycle.has(policy.lifecycle))errors.push(`${id}: invalid lifecycle ${policy.lifecycle}`);
  if(!Array.isArray(policy.surfacePersonalities)||policy.surfacePersonalities.length===0)errors.push(`${id}: missing surface personalities`);
  for(const p of policy.surfacePersonalities??[])if(!requiredPersonalities.includes(p))errors.push(`${id}: unknown personality ${p}`);
  for(const [assetId,override] of Object.entries(policy.assetOverrides??{})){
    if(!allowedLifecycle.has(override.lifecycle))errors.push(`${id}/${assetId}: invalid lifecycle override`);
    if(override.lifecycle==="deprecated"&&!override.replacement)errors.push(`${id}/${assetId}: deprecated asset requires replacement`);
  }
}
const crosshair=lifecycle.packs?.["cursor-interaction"]?.assetOverrides?.crosshair;
if(crosshair?.lifecycle!=="deprecated"||crosshair?.replacement!=="geospatial/crosshair")errors.push("cursor crosshair duplicate must resolve to canonical geospatial/crosshair");
if(!registry.packs?.geospatial?.svg?.crosshair)errors.push("crosshair replacement target geospatial/crosshair does not exist");

if(registry.lifecycleSchemaVersion!==1||registry.visualSystemVersion!==2)errors.push("dist registry is missing lifecycle/V2 schema projection");
for(const [id,entry] of [...Object.entries(registry.packs??{}),...Object.entries(registry.collections??{})]){
  for(const field of requiredEntryFields)if(entry[field]===undefined)errors.push(`${id}: dist entry missing ${field}`);
  if(!allowedLifecycle.has(entry.lifecycle))errors.push(`${id}: dist entry lifecycle invalid`);
  if(!Array.isArray(entry.productionFiles))errors.push(`${id}: dist entry missing productionFiles`);
  for(const [file,asset] of Object.entries(entry.visualAssets??{})){
    for(const field of requiredEntryFields)if(asset[field]===undefined)errors.push(`${file}: visual metadata missing ${field}`);
    if(asset.lifecycle==="deprecated"&&!asset.replacement)errors.push(`${file}: deprecated visual delivery requires replacement`);
    if(asset.productionEligible&&asset.assetKind!=="primitive")errors.push(`${file}: non-primitive marked production eligible`);
    if(asset.productionEligible&&!["canonical","active"].includes(asset.lifecycle))errors.push(`${file}: non-canonical lifecycle marked production eligible`);
    if((entry.productionFiles??[]).includes(file)!==Boolean(asset.productionEligible))errors.push(`${file}: productionFiles disagrees with productionEligible`);
  }
}

for(const id of migratedPacks){
  const entry=registry.packs?.[id];
  if(!entry)errors.push(`${id}: migrated pack missing from dist`);
  else if(entry.visualSystemVersion!==2)errors.push(`${id}: migrated pack is not Visual System v2`);
}
for(const rel of ["moonwitness/data-viz/data-viz.json","moonwitness/graph-pack/manifest.json","moonwitness/correlation-semantics-pack/manifest.json","moonwitness/architecture-diagram-pack/manifest.json","moonwitness/dashboard-pack/dashboard-pack.json","moonwitness/cinematic-hero-pack/manifest.json","moonwitness/editorial-pack/manifest.json","moonwitness/icons/icons.json","moonwitness/semantic-primitives-pack/manifest.json"]){
  const m=await readJson(rel);
  if(m.visualSystemVersion!==2||m.lifecycle!=="canonical")errors.push(`${rel}: missing canonical V2 manifest metadata`);
  if(!m.grammarFamily||!m.semanticRole||!Array.isArray(m.surfacePersonalities))errors.push(`${rel}: incomplete V2 semantic metadata`);
}

const iconManifest=await readJson("moonwitness/icons/icons.json");
requireSet(iconManifest.sizes??[],[16,20,24,32],"product icon raster size");
if(iconManifest.strokeWidth!==2)errors.push("product icon canonical stroke width must be 2");
const semanticManifest=await readJson("moonwitness/semantic-primitives-pack/manifest.json");
requireSet(semanticManifest.opticalReviewSizes??[],[16,20,24,32],"semantic primitive optical size");
if(semanticManifest.strokeWidth!==2)errors.push("semantic primitive canonical stroke width must be 2");

const svgFiles=(await walk("moonwitness")).filter(x=>x.endsWith(".svg"));
const mutableSvg=svgFiles.filter(x=>!x.startsWith("moonwitness/ui/v1/screens/"));
const tokenColors=collectTokenColors(tokens);
for(const file of mutableSvg){
  const raw=await read(file);
  if(/#FF2A3D/i.test(raw))errors.push(`${file}: historical #FF2A3D is forbidden in mutable V2 sources`);
  for(const match of raw.matchAll(/#[0-9a-f]{6}(?:[0-9a-f]{2})?\b/gi)){
    const value=match[0].toUpperCase();
    if(crimsonLike(value)&&!tokenColors.has(value.slice(0,7)))errors.push(`${file}: undocumented crimson/red value ${value}`);
  }
  if(/Georgia\s*,/i.test(raw)&&!file.startsWith("moonwitness/cinematic-hero-pack/")&&!file.startsWith("moonwitness/editorial-pack/")){
    errors.push(`${file}: Archive Serif is outside approved cinematic/editorial surfaces`);
  }
}

for(const id of ["data-viz","graph-vector","correlation-semantics","architecture-diagram"]){
  const entry=registry.packs?.[id];
  for(const file of Object.values(entry?.svg??{})){
    const raw=await read(file);
    if(!/role="img"/.test(raw))errors.push(`${file}: V2 graph/data specimen requires role=img`);
    if(/#FF2A3D/i.test(raw))errors.push(`${file}: legacy signal red remains in migrated graph/data source`);
  }
}
const nodeProof=await read("moonwitness/data-viz/charts/graph-nodes.svg");
for(const label of ["CANONICAL","EVIDENCE","SOURCE","PERSON","EVENT","STORY","RGBL","LEGAL","EXTERNAL","CANDIDATE"])if(!nodeProof.includes(label))errors.push(`graph-nodes proof missing ${label}`);
const edgeProof=await read("moonwitness/data-viz/charts/edge-styles.svg");
for(const label of ["SUPPORTS","CONTRADICTS","REFERENCES","TEMPORAL","IDENTITY","LEGAL","PROVENANCE","DEPENDENCY","ROUTES-TO","UNRESOLVED"])if(!edgeProof.includes(label))errors.push(`edge-styles proof missing ${label}`);

for(const v of audit.productionPrimitiveViolations??[])errors.push(`${v.rule}: ${v.file}`);
if(!audit.canonicalSvgFiles)errors.push("visual audit contains no canonical SVG files");
const fontNeedles=(contract.typography?.roles??[]).flatMap(x=>[x.family,...(x.fallbacks??[])]).filter(Boolean).map(x=>x.toLowerCase());
for(const font of audit.fontFamilies??[]){
  const n=font.value.toLowerCase();
  if(!fontNeedles.some(needle=>n.includes(needle))&&!n.includes("arial"))warnings.push(`unclassified font-family declaration: ${font.value} (${font.count} uses)`);
}
function lifecycleOverrideForFile(file){
  for(const [packId,entry] of Object.entries(registry.packs??{})){
    const assetId=Object.entries(entry.svg??{}).find(([,pathname])=>pathname===file)?.[0];
    if(assetId){
      const override=lifecycle.packs?.[packId]?.assetOverrides?.[assetId];
      if(override)return {packId,assetId,...override};
    }
  }
  return null;
}
for(const group of [...(audit.duplicateCandidates?.exact??[]),...(audit.duplicateCandidates?.structural??[])]){
  const resolutions=(group.files??[]).map(lifecycleOverrideForFile).filter(Boolean);
  if(!resolutions.some(x=>["deprecated","frozen-reference","legacy"].includes(x.lifecycle)&&x.replacement)){
    errors.push(`duplicate candidate lacks lifecycle resolution: ${group.files?.join(", ")}`);
  }
}

const sprite=await read("dist/sprite.svg");
if(/#FF2A3D/i.test(sprite))errors.push("production sprite contains legacy crimson");
if(/<text\b/i.test(sprite))errors.push("production sprite contains text");
const allProduction=[...Object.values(registry.packs??{}),...Object.values(registry.collections??{})].flatMap(x=>x.productionFiles??[]);
for(const file of allProduction){
  const meta=registry.packs?.["product-icons"]?.visualAssets?.[file]??registry.packs?.["semantic-primitives"]?.visualAssets?.[file];
  if(meta&&meta.lifecycle==="deprecated")errors.push(`${file}: deprecated asset entered production distribution`);
}

for(const warning of warnings)console.warn("WARN "+warning);
if(errors.length){
  for(const error of errors)console.error("ERROR "+error);
  console.error(JSON.stringify({status:"fail",errors:errors.length,warnings:warnings.length},null,2));
  process.exit(1);
}
console.log(JSON.stringify({status:"pass",errors:0,warnings:warnings.length,packs:indexedIds.length,canonicalSvgFiles:audit.canonicalSvgFiles,productionEligibleFiles:registry.coverage?.productionEligibleFiles??0,deprecatedVisualFiles:registry.coverage?.deprecatedVisualFiles??0},null,2));
