import { readJson, jsonResult, fail, git } from "../release/lib.mjs";
const statuses=new Set(["NOT_STARTED","IN_PROGRESS","WAITING_REVIEW","VERIFIED","NEEDS_REVERIFY","BLOCKED"]);
const normalize=s=>String(s).replaceAll("\\","/").replace(/^\.\//,"");
function match(pattern,file){
  const p=normalize(pattern),f=normalize(file);
  if(p.endsWith("/**")) return f===p.slice(0,-3)||f.startsWith(p.slice(0,-2));
  return p===f;
}
try{
  const todo=await readJson("ROCKSOUL-TODO.json"),errors=[],warnings=[],ids=new Set();
  const strict=todo.schema==="rocksoul.todo.v2";
  if(!["rocksoul.todo.v1","rocksoul.todo.v2"].includes(todo.schema)) errors.push(`unsupported schema ${todo.schema}`);
  for(const t of todo.tasks??[]){
    if(!t.id||ids.has(t.id)) errors.push(`duplicate/missing id ${t.id}`); ids.add(t.id);
    if(!statuses.has(t.status)) errors.push(`${t.id}: invalid status ${t.status}`);
    if(t.status!=="VERIFIED") continue;
    if(!strict) continue;
    const v=t.verification;
    if(!v||typeof v!=="object") { errors.push(`${t.id}: VERIFIED requires verification object`); continue; }
    if(!v.workflow||!Number.isInteger(v.runId)||v.runId<=0||!v.commit||!v.conclusion||!v.verifiedAt) errors.push(`${t.id}: incomplete verification`);
    if(v.commit&&!/^[0-9a-f]{40}$/i.test(v.commit)) errors.push(`${t.id}: verification commit must be 40-char SHA`);
    if(v.conclusion!=="success") errors.push(`${t.id}: VERIFIED requires conclusion=success`);
    if(v.verifiedAt&&Number.isNaN(Date.parse(v.verifiedAt))) errors.push(`${t.id}: invalid verifiedAt`);
    if(Array.isArray(t.affected_paths)&&t.affected_paths.length&&/^[0-9a-f]{40}$/i.test(String(v.commit))){
      const current=process.env.GITHUB_SHA||git(["rev-parse","HEAD"]).stdout.trim();
      if(/^[0-9a-f]{40}$/i.test(current)&&current!==v.commit){
        const diff=git(["diff","--name-only",v.commit,current]).stdout.split(/\r?\n/).filter(Boolean).map(normalize);
        const impacted=diff.filter(file=>t.affected_paths.some(pattern=>match(pattern,file)));
        if(impacted.length) warnings.push(`${t.id}: verification commit is stale for affected paths: ${impacted.join(", ")}`);
      }
    }
  }
  if(errors.length) throw new Error(errors.join("; "));
  jsonResult({ok:true,schema:todo.schema,strict,tasks:todo.tasks?.length??0,verified:(todo.tasks??[]).filter(t=>t.status==="VERIFIED").length,warnings});
}catch(e){ fail(e.message); }
