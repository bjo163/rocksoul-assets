import { getArg, git, jsonResult, readJson, fail } from "./lib.mjs";

const policy=await readJson("tools/release/release-relevant.json");
const normalize=(s)=>s.replaceAll("\\","/").replace(/^\.\//,"");
function matches(pattern,file){
  pattern=normalize(pattern); file=normalize(file);
  if(pattern.endsWith("/**")) return file===pattern.slice(0,-3)||file.startsWith(pattern.slice(0,-2));
  return pattern===file;
}
let files=[];
const explicit=getArg("files");
try{
  if(explicit){
    files=String(explicit).split(",").map(s=>s.trim()).filter(Boolean);
  }else{
    const base=getArg("base",process.env.BASE_SHA);
    const head=getArg("head",process.env.HEAD_SHA||"HEAD");
    if(!base) throw new Error("base SHA/ref is required when --files is omitted");
    files=git(["diff","--name-only",base,head]).stdout.split(/\r?\n/).filter(Boolean);
  }
  const matched=files.filter(f=>policy.include.some(p=>matches(p,f)));
  const result={ok:true,releaseRelevant:matched.length>0,files,matched};
  if(process.env.GITHUB_OUTPUT){
    const {appendFileSync}=await import("node:fs");
    appendFileSync(process.env.GITHUB_OUTPUT,`release_relevant=${result.releaseRelevant}\n`);
    appendFileSync(process.env.GITHUB_OUTPUT,`changed_count=${files.length}\n`);
  }
  jsonResult(result);
}catch(e){ fail(e.message); }
