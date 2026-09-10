import { getArg, gitMaybe, jsonResult, readJson, readText, parseSemver, compareSemver, fail } from "./lib.mjs";

try{
  const mode=String(getArg("mode","working"));
  const version=(await readText("VERSION")).trim(); parseSemver(version);
  const manifest=await readJson("manifest.json");
  const packs=await readJson("moonwitness/asset-packs.json");
  const dist=await readJson("dist/assets.json");
  const mismatches=[];
  for(const [surface,v] of [["manifest.release.version",manifest.release?.version],["moonwitness/asset-packs.json",packs.version],["dist/assets.json",dist.version]]){
    if(v!==version) mismatches.push({surface,expected:version,actual:v??null});
  }
  if(mismatches.length) throw new Error(`version mismatch: ${JSON.stringify(mismatches)}`);

  const tag=`v${version}`;
  const head=getArg("sha")||gitMaybe(["rev-parse","HEAD"]).stdout.trim()||null;
  const branch=getArg("branch")||process.env.GITHUB_REF_NAME||null;
  const tagLookup=gitMaybe(["rev-parse",`refs/tags/${tag}^{}`]);
  const tagSha=tagLookup.status===0?tagLookup.stdout.trim():null;
  const latestTagRun=gitMaybe(["describe","--tags","--abbrev=0","--match","v[0-9]*"]);
  const latestTag=latestTagRun.status===0?latestTagRun.stdout.trim():null;
  let latestVersion=null;
  if(latestTag) { try { latestVersion=latestTag.replace(/^v/,""); parseSemver(latestVersion); } catch {} }

  if(mode==="publish"){
    if(branch && branch!=="main") throw new Error(`publish requires canonical main, got ${branch}`);
    if(!head || !/^[0-9a-f]{40}$/i.test(head)) throw new Error("publish requires exact 40-character SHA");
    if(tagSha && tagSha!==head) throw new Error(`historical tag ${tag} already points to ${tagSha}; refusing to move it`);
    if(tagSha===head) throw new Error(`${tag} already exists at this SHA; publication is idempotent and should not recreate it`);
    if(latestVersion && compareSemver(version,latestVersion)<=0) throw new Error(`publish version ${version} must be greater than latest ${latestVersion}`);
  }

  const result={ok:true,mode,identity:{version,tag,sha:head,branch},tagSha,latestTag,latestVersion,status:tagSha===head?"PUBLISHED_SHA":"UNRELEASED"};
  jsonResult(result);
}catch(e){ fail(e.message); }
