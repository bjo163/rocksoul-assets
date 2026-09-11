import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const read=async rel=>readFile(path.join(root,rel),"utf8");
const load=async rel=>JSON.parse(await read(rel));
const exists=async rel=>{try{await access(path.join(root,rel));return true}catch{return false}};
const errors=[],warnings=[];

const [tokens,severity,debtPolicy,waivers,rules,registry,migrations,semanticIds,corpus,negativeFixtures,deps,ai,freeze,conformance,attest,debt,coverage,waiverMetrics,contractInventory,provenance,impact,consumer]=await Promise.all([
  load("moonwitness/tokens/visual-system-v2.json"),
  load("moonwitness/governance/severity-model.json"),
  load("moonwitness/governance/visual-debt-policy.json"),
  load("moonwitness/governance/waivers.json"),
  load("moonwitness/governance/rule-registry.json"),
  load("moonwitness/contracts/registry.json"),
  load("moonwitness/contracts/migrations.json"),
  load("moonwitness/contracts/semantic-ids.json"),
  load("moonwitness/fixtures/visual-golden-corpus/corpus.json"),
  load("moonwitness/fixtures/visual-governance-negative.json"),
  load("moonwitness/contracts/dependencies.json"),
  load("moonwitness/ai/contribution-policy.json"),
  load("moonwitness/governance/visual-freeze.json"),
  load("moonwitness/governance/conformance-policy.json"),
  load("moonwitness/governance/manual-attestations.json"),
  load("docs/generated/visual-debt.json"),
  load("docs/generated/rule-coverage.json"),
  load("docs/generated/waiver-metrics.json"),
  load("docs/generated/contract-inventory.json"),
  load("moonwitness/provenance/design-provenance.json"),
  load("docs/generated/visual-impact-graph.json"),
  load("dist/contracts/visual-system.json")
]);

const uniq=(items,label)=>{
  const seen=new Set();
  for(const id of items){if(seen.has(id))errors.push(label+" duplicate: "+id);seen.add(id)}
  return seen;
};
const personalities=["operator","forensic","editorial","archive","cinematic","community"];
const density=["compact","comfortable","editorial"];
const severityIds=["BLOCKER","ERROR","DEBT","WARNING","INFO"];

if(tokens.schemaVersion!==1||tokens.visualSystemVersion!==2)errors.push("token contract must be schema v1 / visual system v2");
const semanticSet=uniq(Object.keys(tokens.semantics??{}),"semantic token");
const aliasSet=uniq(Object.keys(tokens.presentationAliases??{}),"presentation alias");
for(const [id,a] of Object.entries(tokens.presentationAliases??{})){
  if(!semanticSet.has(a.semanticSource))errors.push(id+": unresolved semanticSource "+a.semanticSource);
  if(a.semanticSource==="semantic.status.info"&&a.prohibitedReinterpretations?.includes("brand")!==true)errors.push(id+": info presentation alias must prohibit brand reinterpretation");
  if(a.allowedChannels?.includes("brand-emphasis")&&a.semanticSource!=="semantic.brand.crimson")errors.push(id+": brand channel must derive from semantic.brand.crimson");
}
if(JSON.stringify([...tokens.surfacePersonalities].sort())!==JSON.stringify([...personalities].sort()))errors.push("surface personality set differs from frozen constitution");
if(JSON.stringify(Object.keys(tokens.density??{}).sort())!==JSON.stringify([...density].sort()))errors.push("density set differs from frozen constitution");

if(JSON.stringify(Object.keys(severity.levels??{}))!==JSON.stringify(severityIds))errors.push("severity model must be BLOCKER/ERROR/DEBT/WARNING/INFO in canonical order");
for(const [id,p] of Object.entries(debtPolicy.metrics??{})){
  if(!severityIds.includes(p.severity))errors.push(id+": invalid debt severity");
  if(!Number.isFinite(p.ceiling)||p.ceiling<0)errors.push(id+": invalid ceiling");
  if(!p.owner||!p.remediationIssue)errors.push(id+": missing debt ownership");
}
if(debt.totals?.violations!==0)errors.push("visual debt exceeds frozen ceiling: "+debt.totals.violations);
for(const m of debt.metrics??[])if(!m.withinCeiling)errors.push("debt regression: "+m.id+" current="+m.current+" ceiling="+m.ceiling);

const ruleIds=uniq((rules.rules??[]).map(x=>x.ruleId),"rule");
const fixtureIds=uniq([...(corpus.scenarios??[]).map(x=>x.id),...(corpus.invalid??[]).map(x=>x.id),...(negativeFixtures.fixtures??[]).map(x=>x.id)],"fixture");
for(const rule of rules.rules??[]){
  if(!severityIds.includes(rule.severity))errors.push(rule.ruleId+": invalid severity");
  if(!["AUTOMATED","VISUAL","MANUAL","INFORMATIONAL"].includes(rule.enforcementType))errors.push(rule.ruleId+": invalid enforcement type");
  if(!rule.owner||!rule.normativeText||!rule.source)errors.push(rule.ruleId+": incomplete rule metadata");
  if(!(await exists(rule.source)))errors.push(rule.ruleId+": missing source "+rule.source);
  if(["BLOCKER","ERROR"].includes(rule.severity)&&(!rule.validator||!(rule.fixtures??[]).length))errors.push(rule.ruleId+": BLOCKER/ERROR requires validator and fixture");
  for(const fixture of rule.fixtures??[])if(!fixtureIds.has(fixture))errors.push(rule.ruleId+": missing registered fixture "+fixture);
}
if(coverage.uncovered!==0)errors.push("rule registry has uncovered rules: "+coverage.uncovered);
if(coverage.blockerErrorCoveragePercent!==100)errors.push("BLOCKER/ERROR traceability must be 100%");
if(coverage.evidenceCoveragePercent!==100)errors.push("normative rule evidence coverage must be 100%");

for(const w of waivers.waivers??[]){
  if(!w.waiverId||!w.owner||!w.approver||!w.reason||!w.expiresAt||!w.remediationIssue||!w.evidence)errors.push("waiver incomplete: "+(w.waiverId??"unknown"));
  if(!Array.isArray(w.ruleIds)||!w.ruleIds.length)errors.push(w.waiverId+": waiver has no rule");
  for(const rid of w.ruleIds??[])if(!ruleIds.has(rid))errors.push(w.waiverId+": unknown rule "+rid);
  if(JSON.stringify(w.scope??{}).includes("*"))errors.push(w.waiverId+": wildcard waiver forbidden");
  if(w.severity==="BLOCKER")errors.push(w.waiverId+": BLOCKER waiver forbidden");
  if(w.status==="active"&&Date.parse(w.expiresAt)<=Date.now())errors.push(w.waiverId+": expired active waiver");
}
if(waiverMetrics.expired!==0)errors.push("expired waiver count must be zero");

const entryIds=uniq((registry.entries??[]).map(x=>x.contractId),"contract registry id");
for(const e of registry.entries??[]){
  if(!e.path||!e.schemaId||!e.owner||!e.stability)errors.push(e.contractId+": incomplete contract registry entry");
  if(!(await exists(e.path)))errors.push(e.contractId+": registered path missing "+e.path);
}
if((contractInventory.unregistered??[]).length)errors.push("unregistered canonical JSON contracts: "+contractInventory.unregistered.join(", "));

const allSemantic=[];
for(const ids of Object.values(semanticIds.namespaces??{}))allSemantic.push(...ids);
uniq(allSemantic,"stable semantic id");
for(const m of migrations.migrations??[])if(!m.id||!m.contractId||!m.from||!m.to||!m.compatibility||!m.strategy)errors.push("invalid migration entry");
for(const e of deps.edges??[])if(!(deps.allowedEdgeTypes??[]).includes(e.type))errors.push("unknown dependency edge type "+e.type);

if((corpus.scenarios??[]).length<20)errors.push("golden corpus needs at least 20 valid scenarios");
if((corpus.invalid??[]).length<5)errors.push("golden corpus needs at least 5 invalid fixtures");
uniq((corpus.scenarios??[]).map(x=>x.id),"golden scenario");
uniq((corpus.invalid??[]).map(x=>x.id),"invalid golden fixture");
for(const f of negativeFixtures.fixtures??[]){if(!ruleIds.has(f.ruleId))errors.push(f.id+": fixture references unknown rule "+f.ruleId);if(!["FAIL","MANUAL_REVIEW"].includes(f.expected))errors.push(f.id+": invalid expected outcome");}
for(const s of corpus.scenarios??[]){
  if(!(s.representations??[]).length)errors.push(s.id+": no cross-surface representation");
  for(const [dimension,value] of Object.entries(s.epistemic??{})){
    const allowed=corpus.dimensions?.[dimension];
    if(allowed&&!allowed.includes(value))errors.push(s.id+": invalid "+dimension+" "+value);
  }
}

if(freeze.status!=="FROZEN")errors.push("Visual System freeze must remain FROZEN");
if(freeze.baseline?.release!=="v1.7.0"||freeze.baseline?.sha!=="fd6a545160312bfe4b3419d846961abbcd7bfabd")errors.push("freeze baseline must bind to sealed v1.7.0 SHA");
if(JSON.stringify(freeze.frozen?.surfacePersonalities??[])!==JSON.stringify(personalities))errors.push("freeze personality order/set changed");
if(JSON.stringify(freeze.frozen?.densityModes??[])!==JSON.stringify(density))errors.push("freeze density set changed");

const forbidden=["self-approve-waiver","lower-rule-severity","increase-debt-ceiling","complete-manual-review"];
for(const action of forbidden)if(!(ai.prohibitedAutonomousActions??[]).includes(action))errors.push("AI policy missing prohibited action "+action);
if(!String(ai.hiddenReasoningPolicy??"").startsWith("forbidden"))errors.push("AI provenance policy must exclude hidden reasoning");
if(ai.contributionManifestRequiredForCanonicalChanges!==true)errors.push("AI canonical changes must require contribution manifest");

if(provenance.coverage?.missingProvenance!==0)errors.push("provenance coverage has missing entries");
if(provenance.coverage?.canonicalArtifacts!==provenance.coverage?.withProvenance)errors.push("provenance coverage incomplete");
uniq((provenance.entries??[]).map(x=>x.provenanceId),"provenance id");
for(const p of provenance.entries??[])if(!p.sourceSha256||!p.sourcePath||!p.semanticOwner||!p.authoredMode)errors.push("incomplete provenance "+p.provenanceId);

const nodeIds=uniq((impact.nodes??[]).map(x=>x.id),"impact node");
for(const e of impact.edges??[]){
  if(!nodeIds.has(e.from))errors.push("impact edge missing source node "+e.from);
  if(!nodeIds.has(e.to))errors.push("impact edge missing target node "+e.to);
  if(!(impact.edgeTypes??[]).includes(e.type))errors.push("impact edge uses unknown type "+e.type);
}

if(consumer.visualSystemVersion!==2)errors.push("consumer contract must be V2");
if(consumer.ruleCoverage?.blockerErrorCoveragePercent!==100)errors.push("consumer contract lacks full critical rule coverage");
if(consumer.debt?.violations!==0)errors.push("consumer contract reports visual debt violation");
if(consumer.provenanceCoverage?.missingProvenance!==0)errors.push("consumer contract provenance incomplete");
if(consumer.goldenCorpus?.scenarioCount<20)errors.push("consumer contract lacks golden corpus");
if(consumer.freeze?.status!=="FROZEN")errors.push("consumer contract freeze status invalid");

for(const [name,profile] of Object.entries(conformance.profiles??{}))if(typeof profile.releaseAllowed!=="boolean"||!(profile.criteria??[]).length)errors.push("invalid conformance profile "+name);
if(conformance.manualGatePolicy?.automationCannotCompleteManualGate!==true)errors.push("manual gates must not be completed by automation");
if(conformance.exactShaRequired!==true)errors.push("conformance must bind exact SHA");
if(!Array.isArray(attest.attestations))errors.push("manual attestation ledger malformed");

for(const warning of warnings)console.warn("WARN "+warning);
if(errors.length){
  for(const error of errors)console.error("ERROR "+error);
  console.error(JSON.stringify({status:"fail",errors:errors.length,warnings:warnings.length},null,2));
  process.exit(1);
}
console.log(JSON.stringify({
  status:"pass",errors:0,warnings:warnings.length,
  contracts:registry.entries.length,
  stableSemanticIds:allSemantic.length,
  rules:rules.rules.length,
  goldenScenarios:corpus.scenarios.length,
  provenance:provenance.coverage,
  impact:impact.coverage,
  debt:debt.totals,
  activeWaivers:waiverMetrics.active
},null,2));
