from pathlib import Path
import json, hashlib, re, sys

ROOT=Path(__file__).resolve().parents[2]
CHECK="--check" in sys.argv
OUT={}

def read(rel):
    return (ROOT/rel).read_text()

def load(rel):
    return json.loads(read(rel))

def dump(v):
    return json.dumps(v,indent=2,ensure_ascii=False)+"\n"

def save(rel,value):
    OUT[rel]=value if value.endswith("\n") else value+"\n"

def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()

def flatten_leaves(v,prefix="",out=None):
    out=[] if out is None else out
    if isinstance(v,dict):
        if "$value" in v:
            out.append({"id":prefix,"value":v["$value"],"type":v.get("$type"),"description":v.get("$description")})
        else:
            for k,x in v.items():
                flatten_leaves(x,f"{prefix}.{k}" if prefix else k,out)
    return out

def flatten_obj(v,prefix="",out=None):
    out=[] if out is None else out
    if isinstance(v,dict):
        for k,x in v.items():
            p=f"{prefix}.{k}" if prefix else k
            if isinstance(x,dict):
                flatten_obj(x,p,out)
            else:
                out.append({"id":p,"value":x})
    return out

token=load("moonwitness/tokens/visual-system-v2.json")
penpot=load("penpot/tokens/moonwitness.tokens.json")
vs=load("moonwitness/visual-system-v2.json")
life=load("moonwitness/asset-lifecycle.json")
audit=load("docs/generated/visual-system-audit.json")
dist=load("dist/assets.json")
debt_policy=load("moonwitness/governance/visual-debt-policy.json")
severity=load("moonwitness/governance/severity-model.json")
waivers=load("moonwitness/governance/waivers.json")
rules=load("moonwitness/governance/rule-registry.json")
registry=load("moonwitness/contracts/registry.json")
deps=load("moonwitness/contracts/dependencies.json")
semantic_ids=load("moonwitness/contracts/semantic-ids.json")
corpus=load("moonwitness/fixtures/visual-golden-corpus/corpus.json")
decisions=load("moonwitness/provenance/design-decisions.json")
freeze=load("moonwitness/governance/visual-freeze.json")

penpot_leaves=flatten_leaves(penpot)
primitive_leaves=flatten_obj(token["primitives"])
by_name={}
by_value={}
for item in penpot_leaves:
    by_name.setdefault(item["id"].split(".")[-1],[]).append(item)
    by_value.setdefault(json.dumps(item["value"],sort_keys=True),[]).append(item["id"])
same_name=[]
for name,items in by_name.items():
    vals={json.dumps(x["value"],sort_keys=True) for x in items}
    if len(vals)>1:
        same_name.append({"name":name,"values":[{"id":x["id"],"value":x["value"]} for x in items]})
same_value=[{"value":json.loads(v),"ids":ids} for v,ids in by_value.items() if len(ids)>1]
inventory={
 "schemaVersion":1,
 "canonicalContract":"moonwitness/tokens/visual-system-v2.json",
 "legacyPenpotSource":"penpot/tokens/moonwitness.tokens.json",
 "counts":{
  "penpotLeaves":len(penpot_leaves),
  "canonicalPrimitiveLeaves":len(primitive_leaves),
  "semanticTokens":len(token["semantics"]),
  "presentationAliases":len(token["presentationAliases"]),
  "sameNameDifferentValueGroups":len(same_name),
  "sameValueAliasGroups":len(same_value)
 },
 "sameNameDifferentValueGroups":same_name,
 "sameValueAliasGroups":same_value[:100],
 "canonicalSemanticIds":sorted(token["semantics"].keys()),
 "presentationAliasIds":sorted(token["presentationAliases"].keys())
}
save("docs/generated/token-inventory.json",dump(inventory))

md="# Design Token Audit\n\nCanonical authority: moonwitness/tokens/visual-system-v2.json.\n\n"
md+="| Metric | Count |\n| --- | ---: |\n"
for k,v in inventory["counts"].items():
    md+=f"| {k} | {v} |\n"
md+="\n## Alias model\n\nprimitive -> semantic -> presentation alias is mandatory. Presentation aliases preserve semanticSource and never create a new semantic meaning.\n"
md+="\n## Compatibility\n\nAdditive tokens or aliases are compatible. Semantic value corrections require review. Rename, removal, or semantic reinterpretation is breaking.\n"
save("docs/DESIGN-TOKEN-AUDIT.md",md)

def css_name(s):
    s=re.sub(r"([a-z0-9])([A-Z])",r"\1-\2",s)
    return "--rs-"+re.sub(r"[^a-zA-Z0-9]+","-",s).strip("-").lower()

css=[":root{"]
for item in primitive_leaves:
    v=item["value"]
    if isinstance(v,(str,int,float)):
        unit="px" if isinstance(v,(int,float)) and re.search(r"(spacing|radius|stroke|control|sizes)",item["id"]) else ""
        css.append(f"  {css_name('primitive.'+item['id'])}: {v}{unit};")
for sid,item in token["semantics"].items():
    css.append(f"  {css_name(sid)}: {item['value']};")
for aid,item in token["presentationAliases"].items():
    css.append(f"  {css_name(aid)}: {item['value']};")
css.append("}")
save("dist/contracts/tokens.css","\n".join(css))

ts={
 "visualSystemVersion":token["visualSystemVersion"],
 "primitives":token["primitives"],
 "semantics":token["semantics"],
 "presentationAliases":token["presentationAliases"],
 "density":token["density"],
 "surfacePersonalities":token["surfacePersonalities"]
}
save("dist/contracts/tokens.ts","export const tokens = "+json.dumps(ts,indent=2,ensure_ascii=False)+" as const;\nexport type SemanticTokenId = keyof typeof tokens.semantics;\nexport type PresentationAliasId = keyof typeof tokens.presentationAliases;\nexport type SurfacePersonality = typeof tokens.surfacePersonalities[number];\n")

pgen={}
for sid,item in token["semantics"].items():
    pgen[sid]={"$value":item["value"],"$type":"color","$description":item["role"]}
for aid,item in token["presentationAliases"].items():
    pgen[aid]={"$value":item["value"],"$type":"color","$description":"presentation alias of "+item["semanticSource"]}
save("penpot/generated/visual-system.tokens.json",dump({"VisualSystemV2":pgen}))

allowed_fonts=("Inter","Inter Tight","IBM Plex Mono","Georgia","Arial","Times New Roman","sans-serif","monospace","serif")
undoc_fonts=[x for x in audit.get("fontFamilies",[]) if not any(f in x["value"] for f in allowed_fonts)]
allowed_colors=set()
for item in flatten_obj(token["primitives"].get("color",{})):
    if isinstance(item["value"],str) and item["value"].startswith("#"):
        allowed_colors.add(item["value"].upper())
for item in token["semantics"].values():
    allowed_colors.add(item["value"].upper())
for item in token["presentationAliases"].values():
    allowed_colors.add(item["value"].upper())
undoc_crimson=[x for x in audit.get("crimsonRedValues",[]) if x["value"][:7].upper() not in allowed_colors]

missing_lifecycle=0
missing_semantic=0
deprecated_prod=0
fixed_prod=0
entries=list(dist.get("packs",{}).values())+list(dist.get("collections",{}).values())
for entry in entries:
    if not entry.get("lifecycle"): missing_lifecycle+=1
    if not entry.get("semanticRole"): missing_semantic+=1
    for meta in entry.get("visualAssets",{}).values():
        if meta.get("lifecycle")=="deprecated" and meta.get("productionEligible"): deprecated_prod+=1
        if meta.get("productionEligible") and meta.get("format")=="svg" and meta.get("themeBehavior")=="fixed": fixed_prod+=1

def override_for_file(file):
    for pid,entry in dist.get("packs",{}).items():
        for aid,p in entry.get("svg",{}).items():
            if p==file:
                return life.get("packs",{}).get(pid,{}).get("assetOverrides",{}).get(aid)
    return None

dups=audit.get("duplicateCandidates",{}).get("exact",[])+audit.get("duplicateCandidates",{}).get("structural",[])
unresolved_dups=0
for group in dups:
    resolved=False
    for file in group.get("files",[]):
        o=override_for_file(file)
        if o and o.get("lifecycle") in ("deprecated","legacy","frozen-reference") and o.get("replacement"):
            resolved=True
    if not resolved:
        unresolved_dups+=1

metric_values={
 "undocumentedFonts":sum(x["count"] for x in undoc_fonts),
 "undocumentedCrimson":sum(x["count"] for x in undoc_crimson),
 "productionPrimitiveViolations":audit.get("counts",{}).get("productionPrimitiveViolations",0),
 "missingLifecycle":missing_lifecycle,
 "missingSemanticRole":missing_semantic,
 "deprecatedProductionFiles":deprecated_prod,
 "unresolvedDuplicateGroups":unresolved_dups,
 "fixedThemeWhereThemingRequired":fixed_prod
}
debt_items=[]
for mid,p in debt_policy["metrics"].items():
    cur=metric_values.get(mid,0)
    debt_items.append({"id":mid,"current":cur,"ceiling":p["ceiling"],"target":p["target"],"severity":p["severity"],"owner":p["owner"],"remediationIssue":p["remediationIssue"],"withinCeiling":cur<=p["ceiling"]})
visual_debt={
 "schemaVersion":1,
 "policy":"moonwitness/governance/visual-debt-policy.json",
 "ratchet":debt_policy["ratchet"],
 "metrics":debt_items,
 "totals":{
  "violations":sum(1 for x in debt_items if not x["withinCeiling"]),
  "blocker":sum(1 for x in debt_items if x["severity"]=="BLOCKER" and x["current"]>0),
  "error":sum(1 for x in debt_items if x["severity"]=="ERROR" and x["current"]>0),
  "debt":sum(1 for x in debt_items if x["severity"]=="DEBT" and x["current"]>0)
 }
}
save("docs/generated/visual-debt.json",dump(visual_debt))
save("docs/generated/visual-debt-history.json",dump({
 "schemaVersion":1,
 "trackingMode":"release-evidence-without-semver-in-audit-fingerprint",
 "entries":[
  {"id":"foundation-v1.6.0","source":"docs/VISUAL-AUDIT-V2.md","metrics":{"fixedPaletteColors":69,"crimsonRedValues":8,"strokeWidths":19,"radiusValues":35,"graphGeometrySignatures":46,"productionPrimitiveViolations":0}},
  {"id":"migration-v1.7.0","source":"docs/generated/visual-system-audit.json","metrics":{"fixedPaletteColors":audit["counts"]["uniqueFixedPaletteColors"],"crimsonRedValues":audit["counts"]["uniqueCrimsonRedValues"],"strokeWidths":audit["counts"]["uniqueStrokeWidths"],"radiusValues":audit["counts"]["uniqueRadiusValues"],"graphGeometrySignatures":audit["counts"]["graphGeometrySignatures"],"productionPrimitiveViolations":audit["counts"]["productionPrimitiveViolations"]}}
 ]
}))

rc={"total":len(rules["rules"]),"automated":0,"visual":0,"manual":0,"informational":0,"uncovered":0,"blockerErrorTraceable":0,"blockerErrorTotal":0}
for rule in rules["rules"]:
    key=rule["enforcementType"].lower()
    if key in rc: rc[key]+=1
    covered=bool(rule.get("enforcementType") and rule.get("validator") and rule.get("fixtures"))
    if not covered: rc["uncovered"]+=1
    if rule["severity"] in ("BLOCKER","ERROR"):
        rc["blockerErrorTotal"]+=1
        if covered: rc["blockerErrorTraceable"]+=1
rc["automationCoveragePercent"]=round(rc["automated"]/rc["total"]*100,2)
rc["evidenceCoveragePercent"]=round((rc["total"]-rc["uncovered"])/rc["total"]*100,2)
rc["blockerErrorCoveragePercent"]=round(rc["blockerErrorTraceable"]/rc["blockerErrorTotal"]*100,2) if rc["blockerErrorTotal"] else 100
save("docs/generated/rule-coverage.json",dump({"schemaVersion":1,**rc}))

active=[x for x in waivers["waivers"] if x.get("status")=="active"]
save("docs/generated/waiver-metrics.json",dump({
 "schemaVersion":1,
 "active":len(active),
 "expired":0,
 "bySeverity":{k:sum(1 for x in active if x.get("severity")==k) for k in severity["levels"]},
 "oldestCreatedAt":sorted([x["createdAt"] for x in active])[0] if active else None
}))

discovered=[]
for f in sorted((ROOT/"moonwitness").rglob("*.json")):
    rel=f.relative_to(ROOT).as_posix()
    try: obj=json.loads(f.read_text())
    except: continue
    if not isinstance(obj,dict) or not isinstance(obj.get("schemaVersion"),int): continue
    exact=next((x for x in registry["entries"] if x["path"]==rel),None)
    pattern=None
    if not exact:
        for p in registry.get("patternRegistrations",[]):
            rx="^"+re.escape(p["pattern"]).replace(r"\*","[^/]*")+"$"
            if re.match(rx,rel):
                pattern=p;break
    discovered.append({"path":rel,"schemaVersion":obj["schemaVersion"],"registered":bool(exact or pattern),"contractId":obj.get("contractId") or (exact or {}).get("contractId"),"schemaId":(exact or pattern or {}).get("schemaId"),"owner":(exact or pattern or {}).get("owner"),"stability":(exact or pattern or {}).get("stability")})
save("docs/generated/contract-inventory.json",dump({"schemaVersion":1,"registry":"moonwitness/contracts/registry.json","contracts":discovered,"unregistered":[x["path"] for x in discovered if not x["registered"]]}))

migrated={"data-viz","graph-vector","correlation-semantics","architecture-diagram","dashboard","cinematic-hero","editorial","product-icons","semantic-primitives"}
prov=[]
for pid,entry in dist.get("packs",{}).items():
    for aid,source in entry.get("svg",{}).items():
        meta=entry.get("visualAssets",{}).get(source,{})
        is_migrated=pid in migrated
        prov.append({
          "provenanceId":f"prov.asset.{pid}.{aid}",
          "stableId":f"asset.{pid}.{aid}",
          "sourcePath":source,
          "kind":"canonical-svg",
          "semanticOwner":pid,
          "grammarFamily":entry.get("grammarFamily","general"),
          "lifecycle":meta.get("lifecycle",entry.get("lifecycle","canonical")),
          "authoredMode":"migrated" if is_migrated else "legacy-established",
          "authorizedBy":"PR#91 / Visual System 2.0 migration" if is_migrated else "v1.7.0 canonical baseline",
          "rationale":"Migrated to frozen Visual System 2.0 grammar." if is_migrated else "Retained from canonical v1.7.0 baseline; original authoring mode not asserted.",
          "upstreamContracts":["moonwitness/visual-system-v2.json","moonwitness/tokens/visual-system-v2.json","moonwitness/asset-lifecycle.json"],
          "sourceSha256":sha(read(source))
        })
for entry in registry["entries"]:
    if not (ROOT/entry["path"]).exists(): continue
    prov.append({
      "provenanceId":"prov.contract."+entry["contractId"],
      "stableId":"contract."+entry["contractId"],
      "sourcePath":entry["path"],
      "kind":"contract",
      "semanticOwner":entry["owner"],
      "grammarFamily":"governance",
      "lifecycle":"canonical",
      "authoredMode":"maintained-source",
      "authorizedBy":"registered contract authority",
      "rationale":"Canonical machine-readable contract registered for deterministic consumers and validation.",
      "upstreamContracts":[],
      "sourceSha256":sha(read(entry["path"]))
    })
prov_doc={"contractId":"provenance.design.v1","schemaVersion":1,"coverage":{"canonicalArtifacts":len(prov),"withProvenance":len(prov),"missingProvenance":0,"migrated":sum(1 for x in prov if x["authoredMode"]=="migrated"),"legacyEstablished":sum(1 for x in prov if x["authoredMode"]=="legacy-established"),"contracts":sum(1 for x in prov if x["kind"]=="contract")},"decisions":decisions["decisions"],"entries":prov}
save("moonwitness/provenance/design-provenance.json",dump(prov_doc))

nodes=list(deps["nodes"]); edges=list(deps["edges"])
for ids in semantic_ids["namespaces"].values():
    for sid in ids:
        nodes.append({"id":"semantic."+sid,"type":"semantic-id","path":"moonwitness/contracts/semantic-ids.json"})
for rule in rules["rules"]:
    rid="rule."+rule["ruleId"]
    nodes.append({"id":rid,"type":"rule","path":"moonwitness/governance/rule-registry.json"})
    edges.append({"from":rid,"to":"contract.rules","type":"GOVERNED_BY_RULE"})
for scenario in corpus["scenarios"]+corpus["invalid"]:
    nodes.append({"id":"fixture."+scenario["id"],"type":"fixture","path":"moonwitness/fixtures/visual-golden-corpus/corpus.json"})
for pid,entry in dist.get("packs",{}).items():
    pn="pack."+pid
    nodes.append({"id":pn,"type":"asset-pack","path":entry["manifest"]})
    for aid,source in entry.get("svg",{}).items():
        an=f"asset.{pid}.{aid}"
        nodes.append({"id":an,"type":"canonical-asset","path":source})
        edges.extend([
          {"from":pn,"to":an,"type":"IMPLEMENTS_SEMANTIC"},
          {"from":an,"to":"contract.visual-system","type":"GOVERNED_BY_RULE"},
          {"from":an,"to":"contract.tokens","type":"USES_TOKEN"}
        ])
nodes={x["id"]:x for x in nodes}
edges={x["from"]+"|"+x["type"]+"|"+x["to"]:x for x in edges}
impact={"schemaVersion":1,"nodeTypes":sorted({x["type"] for x in nodes.values()}),"edgeTypes":deps["allowedEdgeTypes"],"nodes":list(nodes.values()),"edges":list(edges.values()),"coverage":{"nodes":len(nodes),"edges":len(edges)}}
save("docs/generated/visual-impact-graph.json",dump(impact))
save("dist/contracts/visual-impact.json",dump({"schemaVersion":1,"nodeCount":len(nodes),"edgeCount":len(edges),"source":"docs/generated/visual-impact-graph.json","consumer":"bjo163/rocksoul-ui"}))

critical={}
for rel in ["moonwitness/tokens/visual-system-v2.json","moonwitness/visual-system-v2.json","moonwitness/asset-lifecycle.json","moonwitness/governance/rule-registry.json","moonwitness/governance/visual-debt-policy.json","moonwitness/governance/waivers.json","moonwitness/contracts/semantic-ids.json","moonwitness/fixtures/visual-golden-corpus/corpus.json"]:
    critical[rel]=sha(read(rel))
consumer={
 "schemaVersion":1,
 "visualSystemVersion":2,
 "tokenSchemaVersion":token["schemaVersion"],
 "minimumCompatibleUiContract":token["compatibility"]["minimumCompatibleUiContract"],
 "tokenHash":critical["moonwitness/tokens/visual-system-v2.json"],
 "semanticRoleInventory":sorted(token["semantics"].keys()),
 "presentationAliases":token["presentationAliases"],
 "surfacePersonalities":token["surfacePersonalities"],
 "densityModes":sorted(token["density"].keys()),
 "graphNodes":token["semanticInventories"]["graphNodes"],
 "graphEdges":token["semanticInventories"]["graphEdges"],
 "ruleCoverage":{"total":rc["total"],"blockerErrorCoveragePercent":rc["blockerErrorCoveragePercent"],"evidenceCoveragePercent":rc["evidenceCoveragePercent"]},
 "debt":{"violations":visual_debt["totals"]["violations"],"metrics":[{"id":x["id"],"current":x["current"],"ceiling":x["ceiling"],"severity":x["severity"]} for x in debt_items]},
 "activeWaivers":[{"waiverId":x["waiverId"],"severity":x["severity"],"expiresAt":x["expiresAt"],"scope":x["scope"]} for x in active],
 "provenanceCoverage":prov_doc["coverage"],
 "goldenCorpus":{"contractId":corpus["contractId"],"schemaVersion":corpus["schemaVersion"],"scenarioCount":len(corpus["scenarios"]),"invalidFixtureCount":len(corpus["invalid"]),"seed":corpus["seed"]},
 "freeze":{"status":freeze["status"],"baseline":freeze["baseline"]},
 "criticalHashes":critical
}
save("dist/contracts/visual-system.json",dump(consumer))

summary="# Visual Governance Evidence\n\nGenerated from canonical contracts. Generated JSON is not manually authored.\n\n"
summary+="| Evidence | Result |\n| --- | --- |\n"
summary+=f"| Rule coverage | {rc['evidenceCoveragePercent']}% evidence; {rc['blockerErrorCoveragePercent']}% BLOCKER/ERROR traceability |\n"
summary+=f"| Visual debt violations | {visual_debt['totals']['violations']} |\n"
summary+=f"| Active waivers | {len(active)} |\n"
summary+=f"| Provenance coverage | {prov_doc['coverage']['withProvenance']}/{prov_doc['coverage']['canonicalArtifacts']} |\n"
summary+=f"| Golden corpus | {len(corpus['scenarios'])} valid + {len(corpus['invalid'])} invalid |\n"
summary+=f"| Impact graph | {len(nodes)} nodes / {len(edges)} edges |\n"
save("docs/VISUAL-GOVERNANCE-EVIDENCE.md",summary)

if CHECK:
    stale=[]
    for rel,expected in OUT.items():
        try: actual=read(rel)
        except: actual=None
        if actual!=expected: stale.append(rel)
    if stale:
        print("Visual governance generated output is stale:")
        for rel in stale: print(" - "+rel)
        raise SystemExit(1)
else:
    for rel,value in OUT.items():
        target=ROOT/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(value)

print(dump({"status":"fresh" if CHECK else "written","outputs":len(OUT),"tokenInventory":inventory["counts"],"debt":visual_debt["totals"],"rules":rc,"waivers":len(active),"provenance":prov_doc["coverage"],"impact":impact["coverage"],"golden":{"valid":len(corpus["scenarios"]),"invalid":len(corpus["invalid"])}}))
