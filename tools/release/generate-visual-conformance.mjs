import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const arg=(name,fallback=null)=>{const i=process.argv.indexOf("--"+name);return i>=0?(process.argv[i+1]??true):fallback};
const sha=String(arg("sha",process.env.GITHUB_SHA??""));
if(!/^[0-9a-f]{40}$/i.test(sha))throw new Error("exact 40-character --sha required");
const load=async rel=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const hash=async rel=>createHash("sha256").update(await readFile(path.join(root,rel))).digest("hex");
const version=(await readFile(path.join(root,"VERSION"),"utf8")).trim();
const [policy,debt,rules,waivers,provenance,inventory,visual,consumer]=await Promise.all([
  load("moonwitness/governance/conformance-policy.json"),
  load("docs/generated/visual-debt.json"),
  load("docs/generated/rule-coverage.json"),
  load("docs/generated/waiver-metrics.json"),
  load("moonwitness/provenance/design-provenance.json"),
  load("docs/generated/contract-inventory.json"),
  load("docs/generated/visual-system-audit.json"),
  load("dist/contracts/visual-system.json")
]);
const evidenceFiles=[
 "moonwitness/governance/conformance-policy.json",
 "docs/generated/visual-debt.json",
 "docs/generated/rule-coverage.json",
 "docs/generated/waiver-metrics.json",
 "moonwitness/provenance/design-provenance.json",
 "docs/generated/contract-inventory.json",
 "docs/generated/visual-system-audit.json",
 "dist/contracts/visual-system.json"
];
const evidenceHashes={};
for(const file of evidenceFiles)evidenceHashes[file]=await hash(file);
const activeErrorWaivers=Object.entries(waivers.bySeverity??{}).filter(([k,v])=>["BLOCKER","ERROR"].includes(k)&&v>0);
const checks={
 exactSha:/^[0-9a-f]{40}$/i.test(sha),
 zeroBlocker:(debt.totals?.blocker??0)===0,
 zeroError:(debt.totals?.error??0)===0,
 debtWithinCeiling:(debt.totals?.violations??0)===0,
 noExpiredWaiver:(waivers.expired??0)===0,
 noBlockingWaiver:activeErrorWaivers.length===0,
 criticalRuleCoverage:rules.blockerErrorCoveragePercent===100,
 evidenceCoverage:rules.evidenceCoveragePercent===100,
 provenanceComplete:provenance.coverage?.missingProvenance===0&&provenance.coverage?.canonicalArtifacts===provenance.coverage?.withProvenance,
 schemasRegistered:(inventory.unregistered??[]).length===0,
 visualPrimitiveIntegrity:(visual.counts?.productionPrimitiveViolations??0)===0,
 consumerContractV2:consumer.visualSystemVersion===2
};
const full=Object.values(checks).every(Boolean);
const profile=full?"FULL":"NONCONFORMANT";
if(!policy.profiles?.[profile])throw new Error("unknown conformance profile "+profile);
const certificate={
 schema:"rocksoul.visual-conformance.v1",
 schemaVersion:1,
 repository:"bjo163/rocksoul-assets",
 version,
 tag:"v"+version,
 commit:sha,
 visualSystemVersion:2,
 profile,
 releaseAllowed:policy.profiles[profile].releaseAllowed,
 checks,
 debt:{totals:debt.totals,metrics:debt.metrics},
 waivers:{active:waivers.active,expired:waivers.expired,bySeverity:waivers.bySeverity},
 ruleCoverage:{total:rules.total,automationCoveragePercent:rules.automationCoveragePercent,evidenceCoveragePercent:rules.evidenceCoveragePercent,blockerErrorCoveragePercent:rules.blockerErrorCoveragePercent},
 provenance:provenance.coverage,
 schemaRegistry:{contracts:inventory.contracts?.length??0,unregistered:inventory.unregistered??[]},
 visualAudit:{canonicalSvgFiles:visual.canonicalSvgFiles,productionPrimitiveViolations:visual.counts?.productionPrimitiveViolations??0},
 consumerContract:{minimumCompatibleUiContract:consumer.minimumCompatibleUiContract,tokenHash:consumer.tokenHash},
 evidenceHashes
};
if(!certificate.releaseAllowed)throw new Error("visual conformance is "+profile+": "+JSON.stringify(checks));
const out=path.join(root,".release/out");
await mkdir(out,{recursive:true});
await writeFile(path.join(out,"visual-conformance.json"),JSON.stringify(certificate,null,2)+"\n");
await writeFile(path.join(out,"visual-conformance.md"),"# Visual Conformance Certificate\n\n- Profile: **"+profile+"**\n- Version: "+version+"\n- Commit: "+sha+"\n- Visual System: 2\n- Rule evidence coverage: "+rules.evidenceCoveragePercent+"%\n- BLOCKER/ERROR traceability: "+rules.blockerErrorCoveragePercent+"%\n- Active waivers: "+waivers.active+"\n- Visual debt violations: "+debt.totals.violations+"\n- Provenance: "+provenance.coverage.withProvenance+"/"+provenance.coverage.canonicalArtifacts+"\n");
console.log(JSON.stringify({ok:true,profile,version,sha,checks},null,2));
