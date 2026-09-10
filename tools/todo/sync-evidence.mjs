import { readJson, writeJson, getArg, jsonResult, fail } from "../release/lib.mjs";
try{
  const todo=await readJson("ROCKSOUL-TODO.json");
  const commit=String(getArg("commit",process.env.GITHUB_SHA??""));
  const runId=Number(getArg("run-id",process.env.GITHUB_RUN_ID??0));
  const workflow=String(getArg("workflow",process.env.GITHUB_WORKFLOW??"Release Gate"));
  const conclusion=String(getArg("conclusion","success"));
  const ids=String(getArg("ids","")).split(",").map(x=>x.trim()).filter(Boolean);
  if(!/^[0-9a-f]{40}$/i.test(commit)||!Number.isInteger(runId)||runId<=0) throw new Error("exact commit and positive run-id are required");
  const now=new Date().toISOString(); let changed=0;
  for(const t of todo.tasks??[]){
    if(ids.length&&!ids.includes(t.id)) continue;
    if(t.status==="VERIFIED"||getArg("promote")==="true"){
      t.status="VERIFIED";
      t.verification={workflow,runId,commit,conclusion,verifiedAt:now};
      changed++;
    }
  }
  todo.schema="rocksoul.todo.v2";
  await writeJson("ROCKSOUL-TODO.json",todo);
  jsonResult({ok:true,changed,commit,runId});
}catch(e){ fail(e.message); }
