import { readJson, writeJson, jsonResult, fail } from "../release/lib.mjs";
try{
  const todo=await readJson("ROCKSOUL-TODO.json"); let changed=0;
  for(const t of todo.tasks??[]){
    if(t.status==="VERIFIED" && (!t.verification || typeof t.verification!=="object")){
      if(Array.isArray(t.evidence)&&t.evidence.length){ t.legacy_evidence=t.evidence; delete t.evidence; }
      t.status="NEEDS_REVERIFY"; changed++;
    }
  }
  todo.schema="rocksoul.todo.v2";
  await writeJson("ROCKSOUL-TODO.json",todo);
  jsonResult({ok:true,changed,schema:todo.schema});
}catch(e){ fail(e.message); }
