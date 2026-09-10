import { getArg, readText, sha256File, jsonResult, fail } from "./lib.mjs";
try{
  const file=String(getArg("file","")),checksum=String(getArg("checksum",`${file}.sha256`));
  if(!file) throw new Error("--file is required");
  const expected=(await readText(checksum)).trim().split(/\s+/)[0],actual=await sha256File(file);
  if(expected!==actual) throw new Error(`checksum mismatch: expected ${expected}, got ${actual}`);
  jsonResult({ok:true,file,sha256:actual});
}catch(e){ fail(e.message); }
