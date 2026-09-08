import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");

const read=(p)=>readFile(path.join(root,p),"utf8");
const version=(await read("VERSION")).trim();
const dist=JSON.parse(await read("dist/assets.json"));
const catalog=JSON.parse(await read("showcase/catalog.json"));

const checks=[
  ["README current release","README.md",`v${version}`],
  ["Docs home current release","docs/README.md",`v${version}`],
  ["Consumption current release","docs/ASSET-CONSUMPTION.md",`v${version}`],
  ["Pack catalog current release","docs/ASSET-PACK-CATALOG.md",`v${version}`],
  ["Design readiness current release","docs/DESIGN-SYSTEM-READINESS.md",`v${version}`],
  ["Release checklist current version","docs/RELEASE-CHECKLIST.md",`VERSION = ${version}`],
  ["Showcase coverage count","docs/SHOWCASE-COVERAGE.md",String(dist.coverage.deliveryFiles)],
  ["README showcase coverage count","README.md",String(dist.coverage.deliveryFiles)],
];

for(const [label,file,needle] of checks){
  const content=await read(file);
  if(!content.includes(needle)) throw new Error(`${label}: ${file} missing "${needle}"`);
}

if(catalog.version!==version) throw new Error("showcase/catalog.json version mismatch");
if(dist.version!==version) throw new Error("dist/assets.json version mismatch");
if(dist.coverage.packFamilies!==42) throw new Error("expected 42 pack families");
if(dist.coverage.coveragePercent!==100||dist.coverage.missingDeliveryFiles!==0){
  throw new Error("showcase coverage must be 100%");
}

const docs=await readdir(path.join(root,"docs"));
const markdown=docs.filter((name)=>name.endsWith(".md")&&name!=="README.md").sort();
const docsHome=await read("docs/README.md");
const missingFromHome=markdown.filter((name)=>!docsHome.includes(name));
if(missingFromHome.length){
  throw new Error(`docs/README.md does not index: ${missingFromHome.join(", ")}`);
}

const activeDocs=[
  "docs/ASSET-CONSUMPTION.md",
  "docs/DESIGN-SYSTEM-READINESS.md",
  "docs/PENPOT-LIVE-VERIFICATION.md",
  "docs/VISUAL-LANGUAGE-V1.3.md",
];
for(const file of activeDocs){
  const content=await read(file);
  if(content.includes("41 pack families")) throw new Error(`${file} still says 41 pack families`);
  if(content.includes("repository release does not fabricate") && content.includes("v1.0.0")){
    throw new Error(`${file} contains stale v1.0.0 release language`);
  }
}

console.log(JSON.stringify({
  version,
  docsIndexed:markdown.length,
  packFamilies:dist.coverage.packFamilies,
  deliveryFiles:dist.coverage.deliveryFiles,
  showcaseCoverage:dist.coverage.coveragePercent,
},null,2));
