import { getArg, git, jsonResult, readJson, fail } from "./lib.mjs";

const policy=await readJson("tools/release/release-relevant.json");
const rank={none:0,patch:1,minor:2,major:3};
const normalize=s=>s.replaceAll("\\","/").replace(/^\.\//,"");
function match(pattern,file){
  if(pattern.endsWith("/**")) return file===pattern.slice(0,-3)||file.startsWith(pattern.slice(0,-2));
  return pattern===file;
}
function classify(status,file){
  file=normalize(file);
  const publicContract=policy.publicContractRoots.some(p=>match(p,file));
  const metadata=policy.metadataOnly.some(p=>match(p,file));
  if(status==="D" && publicContract) return "major";
  if(status==="R" && publicContract) return "major";
  if(status==="A" && (file.startsWith("moonwitness/") || file.startsWith("dist/"))) return "minor";
  if(status==="A" && file.includes("-pack/")) return "minor";
  if(publicContract && !metadata) return "minor";
  return "patch";
}
let changes=[];
try{
  const explicit=getArg("changes");
  if(explicit){
    changes=String(explicit).split(",").filter(Boolean).map(raw=>{
      const [status,...rest]=raw.split(":"); return {status:status||"M",file:rest.join(":")};
    });
  }else{
    const base=getArg("base",process.env.BASE_REF);
    const head=getArg("head",process.env.HEAD_REF||"HEAD");
    if(!base) throw new Error("base ref is required when --changes is omitted");
    changes=git(["diff","--name-status","--find-renames",base,head]).stdout.split(/\r?\n/).filter(Boolean).map(line=>{
      const parts=line.split(/\t+/); const raw=parts[0]; const status=raw[0]==="R"?"R":raw[0];
      return {status,file:status==="R"?parts[2]:parts[1]};
    });
  }
  let impact="none";
  const classified=changes.map(c=>({...c,impact:classify(c.status,c.file)}));
  for(const c of classified) if(rank[c.impact]>rank[impact]) impact=c.impact;
  jsonResult({ok:true,impact,changes:classified});
}catch(e){ fail(e.message); }
