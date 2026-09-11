import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");
const readJson=async(rel)=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const contract=await readJson("moonwitness/visual-system-v2.json");
const audit=await readJson("docs/generated/visual-system-audit.json");

const requiredPersonalities=["operator","forensic","editorial","archive","cinematic","community"];
const requiredDensities=["compact","comfortable","editorial"];
const requiredNodes=["canonical-record","evidence","source","person","event","story","rgbl-text","legal-state","external-reference","unresolved-record","inferred-candidate-record","missing-record","system-provider-resource"];
const requiredEdges=["supports","contradicts","references","temporal","identity","legal","provenance","dependency","routes-to","unresolved-candidate"];
const requiredCharts=["line","area","bar","stacked-bar","heat-strip","donut","time-series","threshold-boundary","confidence-uncertainty"];
const errors=[],warnings=[];

function requireKeys(actual,required,label){
  const set=new Set(actual);
  for(const item of required)if(!set.has(item))errors.push(`${label} missing: ${item}`);
}
if(contract.schemaVersion!==1)errors.push("visual-system-v2 schemaVersion must be 1");
if(contract.layers?.moonwitness?.role!=="rigorous-system")errors.push("MoonWitness layer role must be rigorous-system");
if(contract.layers?.rocksoul?.role!=="human-intervention")errors.push("ROCKSOUL layer role must be human-intervention");
requireKeys(Object.keys(contract.surfacePersonalities??{}),requiredPersonalities,"surface personality");
requireKeys(Object.keys(contract.densityModes??{}),requiredDensities,"density mode");
requireKeys((contract.graphGrammar?.nodes??[]).map(x=>x.id),requiredNodes,"graph node");
requireKeys((contract.graphGrammar?.edges??[]).map(x=>x.id),requiredEdges,"graph edge");
requireKeys((contract.dataVizGrammar?.charts??[]).map(x=>x.id),requiredCharts,"chart grammar");

const fontNeedles=(contract.typography?.roles??[]).flatMap(x=>[x.family,...(x.fallbacks??[])]).filter(Boolean).map(x=>x.toLowerCase());
for(const font of audit.fontFamilies??[]){
  const n=font.value.toLowerCase();
  if(!fontNeedles.some(needle=>n.includes(needle)))warnings.push(`undocumented font-family declaration: ${font.value} (${font.count} uses)`);
}
const approvedReds=new Set((contract.palette?.crimsonRoles??[]).map(x=>x.value.toUpperCase()));
for(const red of audit.crimsonRedValues??[])if(!approvedReds.has(red.value.toUpperCase()))warnings.push(`undocumented crimson/red value: ${red.value} (${red.count} uses)`);
const strokes=new Set((contract.geometry?.strokeWidths??[]).flatMap(x=>[String(x),`${x}px`]));
for(const s of audit.strokeWidths??[])if(!strokes.has(s.value))warnings.push(`non-canonical stroke width: ${s.value} (${s.count} uses)`);
const radii=new Set((contract.geometry?.radii??[]).flatMap(x=>[String(x),`${x}px`]));
for(const r of audit.radiusValues??[])if(!radii.has(r.value))warnings.push(`non-canonical radius: ${r.value} (${r.count} uses)`);

for(const v of audit.productionPrimitiveViolations??[])errors.push(`${v.rule}: ${v.file}`);
if(!audit.canonicalSvgFiles||audit.canonicalSvgFiles<1)errors.push("visual audit contains no canonical SVG files");
if(!contract.lifecycle?.statuses?.includes("canonical")||!contract.lifecycle?.statuses?.includes("deprecated"))errors.push("lifecycle contract is incomplete");
if(contract.graphGrammar?.grayscaleRequired!==true)errors.push("graph grammar must require grayscale legibility");
if(contract.dataVizGrammar?.forcedColorFallback!==true)errors.push("data-viz grammar must require forced-color fallback");

for(const warning of warnings)console.warn("WARN "+warning);
if(errors.length){for(const error of errors)console.error("ERROR "+error);process.exit(1)}
console.log(JSON.stringify({status:"pass",errors:0,warnings:warnings.length,canonicalSvgFiles:audit.canonicalSvgFiles},null,2));
