import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");
const workflowDir=path.join(root,".github/workflows");
const files=(await readdir(workflowDir)).filter((name)=>/\.ya?ml$/i.test(name)).sort();
const violations=[];

function parseInline(value){
  const trimmed=value.trim();
  if(!trimmed.startsWith("[")||!trimmed.endsWith("]"))return null;
  return trimmed.slice(1,-1).split(",").map((x)=>x.trim().replace(/^['"]|['"]$/g,"")).filter(Boolean);
}

for(const name of files){
  const content=await readFile(path.join(workflowDir,name),"utf8");
  const lines=content.split(/\r?\n/);

  for(let i=0;i<lines.length;i++){
    const match=lines[i].match(/^(\s*)branches:\s*(.*)$/);
    if(!match)continue;

    const indent=match[1].length;
    const inline=parseInline(match[2]);
    let branches=[];

    if(inline){
      branches=inline;
    }else{
      for(let j=i+1;j<lines.length;j++){
        const raw=lines[j];
        if(!raw.trim())continue;
        const currentIndent=raw.match(/^\s*/)[0].length;
        if(currentIndent<=indent)break;
        const item=raw.trim().match(/^-\s*['"]?([^'"]+)['"]?\s*$/);
        if(item)branches.push(item[1].trim());
      }
    }

    for(const branch of branches){
      if(branch!=="main"){
        violations.push({workflow:name,line:i+1,branch});
      }
    }
  }
}

if(violations.length){
  console.error("Workflow branch policy violations:");
  for(const v of violations){
    console.error(`- ${v.workflow}:${v.line} -> ${v.branch}`);
  }
  throw new Error("Active workflows may target only the long-lived main branch.");
}

console.log(JSON.stringify({
  workflowFiles:files.length,
  longLivedBranches:["main"],
  violations:0
},null,2));
