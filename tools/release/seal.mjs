import { getArg, readText, writeJson, jsonResult, fail } from "./lib.mjs";
try{
  const version=(await readText("VERSION")).trim(),sha=String(getArg("sha",process.env.GITHUB_SHA??""));
  const gateRunId=Number(getArg("gate-run-id",process.env.GITHUB_RUN_ID??0));
  if(!/^[0-9a-f]{40}$/i.test(sha)||!Number.isInteger(gateRunId)||gateRunId<=0) throw new Error("seal requires exact SHA and gate run id");
  const release={schema:"rocksoul.release.v1",state:"SEALED",version,tag:`v${version}`,branch:"main",commit:sha,gate:{workflow:"Release Gate",runId:gateRunId,conclusion:"success",commit:sha}};
  await writeJson(".release/out/release.json",release);
  jsonResult({ok:true,...release});
}catch(e){ fail(e.message); }
