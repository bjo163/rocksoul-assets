import { readJson, writeJson, getArg, jsonResult, fail, git } from "../release/lib.mjs";

const normalize=s=>String(s).replaceAll("\\","/").replace(/^\.\//,"");
function match(pattern,file){
  const p=normalize(pattern),f=normalize(file);
  if(p.endsWith("/**")) return f===p.slice(0,-3)||f.startsWith(p.slice(0,-2));
  return p===f;
}

try{
  const todo=await readJson("ROCKSOUL-TODO.json");
  const head=String(getArg("head",process.env.GITHUB_SHA||git(["rev-parse","HEAD"]).stdout.trim()));
  if(!/^[0-9a-f]{40}$/i.test(head)) throw new Error("exact current HEAD SHA is required");

  let changed=0;
  const reconciled=[];
  for(const task of todo.tasks??[]){
    if(task.status!=="VERIFIED"||!task.verification?.commit||!Array.isArray(task.affected_paths)||!task.affected_paths.length) continue;
    const verifiedCommit=String(task.verification.commit);
    if(!/^[0-9a-f]{40}$/i.test(verifiedCommit)||verifiedCommit===head) continue;

    const diff=git(["diff","--name-only",verifiedCommit,head]).stdout.split(/\r?\n/).filter(Boolean).map(normalize);
    const impacted=diff.filter(file=>task.affected_paths.some(pattern=>match(pattern,file)));
    if(!impacted.length) continue;

    task.status="NEEDS_REVERIFY";
    task.reverification={
      reason:"release-relevant change touched affected paths after verification",
      previousCommit:verifiedCommit,
      currentCommit:head,
      affectedFiles:impacted,
      detectedAt:new Date().toISOString()
    };
    changed++;
    reconciled.push({id:task.id,affectedFiles:impacted});
  }

  todo.schema="rocksoul.todo.v2";
  if(changed>0||getArg("write","true")==="true") await writeJson("ROCKSOUL-TODO.json",todo);
  jsonResult({ok:true,changed,currentCommit:head,reconciled});
}catch(e){ fail(e.message); }
