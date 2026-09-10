import { readJson, jsonResult, fail } from "../release/lib.mjs";
const statuses=new Set(["NOT_STARTED","IN_PROGRESS","WAITING_REVIEW","VERIFIED","NEEDS_REVERIFY","BLOCKED"]);
try{
  const todo=await readJson("ROCKSOUL-TODO.json"),errors=[],ids=new Set();
  const strict=todo.schema==="rocksoul.todo.v2";
  if(!["rocksoul.todo.v1","rocksoul.todo.v2"].includes(todo.schema)) errors.push(`unsupported schema ${todo.schema}`);
  for(const t of todo.tasks??[]){
    if(!t.id||ids.has(t.id)) errors.push(`duplicate/missing id ${t.id}`); ids.add(t.id);
    if(!statuses.has(t.status)) errors.push(`${t.id}: invalid status ${t.status}`);
    if(t.status==="VERIFIED" && strict){
      const v=t.verification;
      if(!v||typeof v!=="object") errors.push(`${t.id}: VERIFIED requires verification object`);
      else{
        if(!v.workflow||!Number.isInteger(v.runId)||!v.commit||!v.conclusion||!v.verifiedAt) errors.push(`${t.id}: incomplete verification`);
        if(v.commit&&!/^[0-9a-f]{40}$/i.test(v.commit)) errors.push(`${t.id}: verification commit must be 40-char SHA`);
        if(v.conclusion!=="success") errors.push(`${t.id}: VERIFIED requires conclusion=success`);
        if(v.verifiedAt&&Number.isNaN(Date.parse(v.verifiedAt))) errors.push(`${t.id}: invalid verifiedAt`);
      }
    }
  }
  if(errors.length) throw new Error(errors.join("; "));
  jsonResult({ok:true,schema:todo.schema,strict,tasks:todo.tasks?.length??0,verified:(todo.tasks??[]).filter(t=>t.status==="VERIFIED").length,legacyVerified:strict?0:(todo.tasks??[]).filter(t=>t.status==="VERIFIED").length});
}catch(e){ fail(e.message); }
