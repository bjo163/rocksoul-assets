import { readJson, writeJson, getArg, jsonResult, fail } from "../release/lib.mjs";
import { execFileSync } from "node:child_process";

try{
  const todo=await readJson("ROCKSOUL-TODO.json");
  const commit=String(getArg("commit",process.env.GITHUB_SHA??""));
  const runId=Number(getArg("run-id",process.env.GITHUB_RUN_ID??0));
  const workflow=String(getArg("workflow",process.env.GITHUB_WORKFLOW??"Release Gate"));
  const conclusion=String(getArg("conclusion","success"));
  const ids=String(getArg("ids","")).split(",").map(x=>x.trim()).filter(Boolean);
  const promote=getArg("promote")==="true";

  if(!/^[0-9a-f]{40}$/i.test(commit)||!Number.isInteger(runId)||runId<=0) throw new Error("exact commit and positive run-id are required");
  if(conclusion!=="success") throw new Error(`verification requires conclusion=success, got ${conclusion}`);
  if(!workflow.trim()) throw new Error("verification workflow is required");

  const repository=process.env.GITHUB_REPOSITORY;
  const token=process.env.GH_TOKEN||process.env.GITHUB_TOKEN;
  if(repository && token){
    const raw=execFileSync("gh",["api",`repos/${repository}/actions/runs/${runId}`],{encoding:"utf8",env:{...process.env,GH_TOKEN:token}});
    const run=JSON.parse(raw);
    if(run.head_sha!==commit) throw new Error(`verification commit ${commit} does not match GitHub run head ${run.head_sha}`);
    if(run.conclusion!=="success") throw new Error(`GitHub run ${runId} conclusion is ${run.conclusion}`);
    if(workflow!==run.name) throw new Error(`verification workflow ${workflow} does not match GitHub run name ${run.name}`);
  }

  const now=new Date().toISOString();
  let changed=0;
  let selected=0;
  for(const t of todo.tasks??[]){
    if(ids.length&&!ids.includes(t.id)) continue;
    selected++;
    if(t.status==="VERIFIED"||promote){
      t.status="VERIFIED";
      t.verification={workflow,runId,commit,conclusion,verifiedAt:now};
      changed++;
    }
  }

  todo.schema="rocksoul.todo.v2";
  await writeJson("ROCKSOUL-TODO.json",todo);
  jsonResult({ok:true,changed,selected,commit,runId,workflow,conclusion,verifiedAt:now});
}catch(e){ fail(e.message); }
