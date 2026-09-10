import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const dir=path.join(root,".github/workflows");
const files=(await readdir(dir)).filter(x=>/\.ya?ml$/.test(x)).sort();
const deprecated=new Set([
  "11d5960a326750d5838078e36cf38b85af677262",
  "49933ea5288caeca8642d1e84afbd3f7d6820020",
  "a26af69be951a213d495a4c3e4e4022e16d87065",
  "ea165f8d65b6e75b540449e92b4886f43607fa02",
  "d3f86a106a0bac45b974a628896c90dbdf5c8093"
]);
const uses=[],errors=[];
for(const file of files){
  const text=await readFile(path.join(dir,file),"utf8");
  for(const m of text.matchAll(/uses:\s*(actions\/[A-Za-z0-9_.-]+)@([^\s#]+)/g)){
    const [,action,ref]=m;uses.push({file,action,ref});
    if(!/^[0-9a-f]{40}$/i.test(ref)) errors.push(`${file}: ${action} must be pinned to a full commit SHA`);
    if(deprecated.has(ref)) errors.push(`${file}: ${action}@${ref} is a deprecated runtime pin`);
  }
}
if(errors.length){console.error(JSON.stringify({ok:false,errors,uses},null,2));process.exit(1);}
console.log(JSON.stringify({ok:true,workflows:files.length,actionPins:uses.length,allImmutable:true,deprecatedPins:0},null,2));
