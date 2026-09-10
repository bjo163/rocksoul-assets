import path from "node:path";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const load=async p=>JSON.parse(await readFile(path.resolve(root,p),"utf8"));
const repo=await load("ROCKSOUL-REPO.json"),todo=await load("ROCKSOUL-TODO.json");
const errors=[],statuses=new Set(["NOT_STARTED","IN_PROGRESS","WAITING_REVIEW","VERIFIED","NEEDS_REVERIFY","BLOCKED"]);
if(repo.schema!=="rocksoul.repository.v2") errors.push("unsupported repository schema; expected rocksoul.repository.v2");
if(!["rocksoul.todo.v1","rocksoul.todo.v2"].includes(todo.schema)) errors.push("unsupported TODO schema");
if(!repo.repository_id||todo.repository_id!==repo.repository_id) errors.push("repository_id mismatch");
const target=repo.tracking?.master_todo;
if(!target) errors.push("tracking.master_todo is required");
else{
  const resolved=path.resolve(root,target);
  if(!resolved.startsWith(root+path.sep)&&resolved!==path.join(root,"ROCKSOUL-TODO.json")) errors.push(`tracking.master_todo escapes repository root: ${target}`);
  try{await access(resolved);}catch{errors.push(`tracking.master_todo does not exist: ${target}`);}
}
const ids=new Set();
for(const task of todo.tasks??[]){
  if(!task.id||!task.title||!statuses.has(task.status)) errors.push(`invalid task: ${task.id||"<missing>"}`);
  if(ids.has(task.id)) errors.push(`duplicate task id: ${task.id}`); ids.add(task.id);
  if(task.github_issue!=null&&!/^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/.test(task.github_issue)) errors.push(`invalid github_issue: ${task.id}`);
}
if(repo.automation?.sync_enabled===true){
  const impl=repo.automation?.sync_command;
  if(!impl) errors.push("sync_enabled=true requires automation.sync_command");
  else{
    const parts=impl.trim().split(/\s+/); const script=parts.at(-1);
    try{await access(path.resolve(root,script));}catch{errors.push(`declared sync implementation missing: ${script}`);}
  }
}
if(errors.length){console.error(errors.map(e=>`FAIL: ${e}`).join("\n"));process.exit(1);}
console.log(JSON.stringify({ok:true,repository:repo.repository_id,tasks:todo.tasks?.length??0,masterTodo:target,sync:repo.automation?.sync_enabled===true},null,2));
