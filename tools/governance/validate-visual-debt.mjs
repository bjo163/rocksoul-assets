import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const load=async rel=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const arg=name=>{const i=process.argv.indexOf("--"+name);return i>=0?process.argv[i+1]:null};
const current=await load("docs/generated/visual-debt.json");
const policy=await load("moonwitness/governance/visual-debt-policy.json");
const errors=[];
for(const m of current.metrics??[]){
  if(m.current>m.ceiling)errors.push(m.id+": current "+m.current+" exceeds ceiling "+m.ceiling);
  if(m.ceiling!==policy.metrics?.[m.id]?.ceiling)errors.push(m.id+": generated ceiling differs from policy");
}
const base=arg("base");
if(base){
  const oldPolicy=spawnSync("git",["show",base+":moonwitness/governance/visual-debt-policy.json"],{cwd:root,encoding:"utf8"});
  if(oldPolicy.status===0){
    const previous=JSON.parse(oldPolicy.stdout);
    for(const [id,p] of Object.entries(policy.metrics??{})){
      const old=previous.metrics?.[id];
      if(old&&p.ceiling>old.ceiling)errors.push(id+": debt ceiling increased from "+old.ceiling+" to "+p.ceiling+" without a governance migration");
    }
  }
  const oldDebt=spawnSync("git",["show",base+":docs/generated/visual-debt.json"],{cwd:root,encoding:"utf8"});
  if(oldDebt.status===0){
    const previous=JSON.parse(oldDebt.stdout);
    const byId=new Map((previous.metrics??[]).map(x=>[x.id,x]));
    for(const m of current.metrics??[]){
      const old=byId.get(m.id);
      if(old&&m.current>old.current)errors.push(m.id+": debt regressed from "+old.current+" to "+m.current);
    }
  }
}
if(errors.length){for(const e of errors)console.error("ERROR "+e);process.exit(1)}
console.log(JSON.stringify({status:"pass",metrics:current.metrics?.length??0,violations:current.totals?.violations??0,base:base??null},null,2));
