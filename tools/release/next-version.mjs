import { bumpSemver, compareSemver, getArg, jsonResult, fail } from "./lib.mjs";
try{
  const current=String(getArg("current","")).trim();
  const impact=String(getArg("impact","")).trim();
  const minimum=getArg("minimum");
  const next=bumpSemver(current,impact);
  if(compareSemver(next,current)<0) throw new Error("resolver attempted to downgrade version");
  if(minimum && compareSemver(next,minimum)<0) throw new Error(`resolved ${next} is below minimum ${minimum}`);
  jsonResult({ok:true,current,impact,next});
}catch(e){ fail(e.message); }
