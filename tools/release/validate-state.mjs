import { getArg, jsonResult, fail } from "./lib.mjs";
const transitions={
  DRAFT:["VALIDATING","INVALID"],
  VALIDATING:["VALIDATED","INVALID"],
  VALIDATED:["VERSIONED","INVALID"],
  VERSIONED:["SEALED","INVALID"],
  SEALED:["TAGGED","INVALID"],
  TAGGED:["PUBLISHED","INVALID"],
  INVALID:["DRAFT","VALIDATING"]
};
try{
  const from=String(getArg("from","")).toUpperCase(),to=String(getArg("to","")).toUpperCase();
  if(!transitions[from]) throw new Error(`unknown state: ${from}`);
  if(!transitions[from].includes(to)) throw new Error(`invalid release transition: ${from} -> ${to}`);
  const required=to==="SEALED"?["version","sha","tag","gateRunId"]:to==="PUBLISHED"?["version","sha","tag","releaseId","inventorySha256","bundleSha256"]:[];
  const missing=required.filter(k=>!getArg(k));
  if(missing.length) throw new Error(`${to} missing evidence: ${missing.join(", ")}`);
  jsonResult({ok:true,from,to});
}catch(e){ fail(e.message); }
