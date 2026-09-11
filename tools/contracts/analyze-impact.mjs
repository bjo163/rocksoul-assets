import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const arg=(name)=>{const i=process.argv.indexOf("--"+name);return i>=0?process.argv[i+1]:null};
const base=arg("base"),head=arg("head");
if(!base||!head)throw new Error("--base and --head are required");
const graph=JSON.parse(await readFile(path.join(root,"docs/generated/visual-impact-graph.json"),"utf8"));
const r=spawnSync("git",["diff","--name-only",base,head],{cwd:root,encoding:"utf8"});
if(r.status!==0)throw new Error(r.stderr||"git diff failed");
const changed=r.stdout.trim()?r.stdout.trim().split("\n"):[];
const direct=graph.nodes.filter(n=>changed.some(f=>n.path===f||n.path?.startsWith(f+"/")||f.startsWith((n.path??"")+"/"))).map(n=>n.id);
const seen=new Set(direct),queue=[...direct];
while(queue.length){
  const id=queue.shift();
  for(const e of graph.edges){
    if(e.from===id&&!seen.has(e.to)){seen.add(e.to);queue.push(e.to)}
    if(e.to===id&&!seen.has(e.from)){seen.add(e.from);queue.push(e.from)}
  }
}
const affected=[...seen].map(id=>graph.nodes.find(n=>n.id===id)).filter(Boolean);
const types=new Set(affected.map(x=>x.type));
let risk="LOCAL";
if(types.has("downstream-consumer"))risk="CROSS_REPO";
else if(types.has("semantic-id")&&types.has("asset-pack"))risk="CROSS_GRAMMAR";
else if(types.has("asset-pack")&&affected.filter(x=>x.type==="asset-pack").length>1)risk="CROSS_PACK";
else if(types.has("asset-pack"))risk="PACK";
console.log(JSON.stringify({base,head,changedFiles:changed,directNodes:direct,affectedNodes:affected.map(x=>x.id),affectedTypes:[...types].sort(),risk},null,2));
