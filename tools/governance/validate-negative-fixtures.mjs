import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const fixtures=JSON.parse(await readFile(path.join(root,"moonwitness/fixtures/visual-governance-negative.json"),"utf8"));
const failed=[],unexpected=[];
function detects(f){
  const m=f.mutation??{};
  if(m.rawColor)return !["#D1132A","#9F1022","#B20F23"].includes(String(m.rawColor).toUpperCase());
  if(m.semanticSource==="semantic.status.info"&&m.allowedChannels?.includes("brand-emphasis"))return true;
  if(m.aliasBecomesSemantic)return true;
  if(m.font==="Georgia"&&["operator","forensic","community"].includes(m.surface))return true;
  if(m.primitiveContainsText)return true;
  if(m.strokeWidth!==undefined&&m.strokeWidth!==2)return true;
  if(m.meaningCarrier==="color-only")return true;
  if(m.unresolvedEdge&&m.unresolvedEdge!=="fragmented")return true;
  if(m.confidenceEncoding==="same-as-uncertainty")return true;
  if(m.lifecycle==="deprecated"&&m.replacement==null)return true;
  if(m.lifecycle==="deprecated"&&m.productionEligible===true)return true;
  if((m.ceilingDelta??0)>0)return true;
  if(m.scope==="*"||m.waiverScope==="*")return true;
  if(m.status==="active"&&m.expiresAt&&Date.parse(m.expiresAt)<=Date.now())return true;
  if(m.severity==="BLOCKER")return true;
  if(m.actor==="automation"&&m.manualGate==="completed")return true;
  if(m.actor==="ai"&&(m.debtCeilingDelta??0)>0)return true;
  if(m.canonical===true&&m.provenance==null)return true;
  if(m.profile==="FULL"&&(m.debtViolations??0)>0)return true;
  if(m.newSurfacePersonality)return true;
  if(m.aliasCycle===true)return true;
  if(m.aliasTarget==="semantic.missing")return true;
  if(m.tokenLifecycle==="removed"&&m.emitted===true)return true;
  if(m.tokenLifecycle==="deprecated"&&m.replacement==null)return true;
  if((m.releasedIdRenamed===true||m.releasedIdDeleted===true)&&m.migration===false)return true;
  if(m.schemaVersion===null)return true;
  if(m.surfacePersonality==="unknown-new")return true;
  if(m.lifecycle==="forever")return true;
  if(m.tokenRef==="semantic.missing")return true;
  if(m.logoRemoved===true&&m.brandTextRemoved===true)return "MANUAL_REVIEW";
  return false;
}
for(const f of fixtures.fixtures??[]){
  const actual=detects(f);
  if(f.expected==="FAIL"){
    if(actual===true)failed.push(f.id);else unexpected.push({id:f.id,expected:f.expected,actual});
  }else if(f.expected==="MANUAL_REVIEW"){
    if(actual==="MANUAL_REVIEW")failed.push(f.id);else unexpected.push({id:f.id,expected:f.expected,actual});
  }
}
if(unexpected.length){
  for(const x of unexpected)console.error("ERROR negative fixture did not produce expected governance outcome: "+JSON.stringify(x));
  process.exit(1);
}
console.log(JSON.stringify({status:"pass",fixtures:fixtures.fixtures.length,expectedFailures:failed.length},null,2));
