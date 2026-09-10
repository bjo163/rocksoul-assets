import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const docsRoot=path.join(root,"docs");
const read=p=>readFile(path.join(root,p),"utf8");
const version=(await read("VERSION")).trim();
const markdown=(await readdir(docsRoot)).filter(x=>x.endsWith(".md")).sort();
const home=await read("docs/README.md");
const errors=[];
for(const name of markdown.filter(x=>x!=="README.md")) if(!home.includes(`(${name})`)&&!home.includes(`/${name})`)) errors.push(`docs/README.md does not index ${name}`);
const linkRe=/\[[^\]]*\]\(([^)]+\.md(?:#[^)\s]+)?)\)/g;
for(const name of markdown){
  const content=await read(`docs/${name}`);
  for(const match of content.matchAll(linkRe)){
    const raw=match[1].split("#")[0];
    if(/^https?:/i.test(raw)) continue;
    const target=path.resolve(docsRoot,raw);
    if(!target.startsWith(root+path.sep)){errors.push(`${name}: link escapes repository: ${raw}`);continue;}
    try{await access(target);}catch{errors.push(`${name}: broken markdown link ${raw}`);}
  }
  for(const match of content.matchAll(/(?:current\s+release|\|\s*Release\s*\|)[^\n]*?v(\d+\.\d+\.\d+)/gi)){
    if(match[1]!==version) errors.push(`${name}: stale current-release claim v${match[1]} (VERSION=${version})`);
  }
}
if(!home.includes(`| Release | **v${version}** |`)) errors.push(`docs/README.md current release row must be v${version}`);
const dist=JSON.parse(await read("dist/assets.json"));
const packs=JSON.parse(await read("moonwitness/asset-packs.json"));
if(dist.version!==version) errors.push(`dist/assets.json version ${dist.version} != ${version}`);
if(packs.version!==version) errors.push(`asset-packs version ${packs.version} != ${version}`);
if(Number(dist.coverage?.packFamilies)!==packs.packs.length) errors.push("document/runtime pack count source is inconsistent");
if(errors.length){console.error(JSON.stringify({ok:false,version,docs:markdown.length,errors},null,2));process.exit(1);}
console.log(JSON.stringify({ok:true,version,docs:markdown.length,indexed:markdown.length-1,brokenLinks:0,staleCurrentClaims:0,packFamilies:packs.packs.length,deliveryFiles:dist.coverage?.deliveryFiles,showcaseCoverage:dist.coverage?.coveragePercent},null,2));
