import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const load=async rel=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const exists=async rel=>{try{await readFile(path.join(root,rel));return true}catch{return false}};
const errors=[];

function typeOk(value,type){
  if(type==="object")return value&&typeof value==="object"&&!Array.isArray(value);
  if(type==="array")return Array.isArray(value);
  if(type==="string")return typeof value==="string";
  if(type==="integer")return Number.isInteger(value);
  if(type==="number")return typeof value==="number"&&Number.isFinite(value);
  if(type==="boolean")return typeof value==="boolean";
  return true;
}
function validate(value,schema,pointer="$"){
  if(schema.const!==undefined&&JSON.stringify(value)!==JSON.stringify(schema.const))errors.push(pointer+": const mismatch");
  if(schema.enum&&!schema.enum.some(x=>JSON.stringify(x)===JSON.stringify(value)))errors.push(pointer+": value not in enum");
  if(schema.type&&!typeOk(value,schema.type))errors.push(pointer+": expected "+schema.type);
  if(schema.minItems!==undefined&&Array.isArray(value)&&value.length<schema.minItems)errors.push(pointer+": minItems "+schema.minItems);
  if(schema.uniqueItems&&Array.isArray(value)){
    const seen=new Set();for(const x of value){const k=JSON.stringify(x);if(seen.has(k))errors.push(pointer+": duplicate array item");seen.add(k)}
  }
  if(schema.type==="object"&&value&&typeof value==="object"&&!Array.isArray(value)){
    for(const req of schema.required??[])if(!(req in value))errors.push(pointer+": missing required "+req);
    const props=schema.properties??{};
    if(schema.additionalProperties===false)for(const k of Object.keys(value))if(!(k in props))errors.push(pointer+": unknown field "+k);
    for(const [k,s] of Object.entries(props))if(k in value)validate(value[k],s,pointer+"."+k);
    if(schema.additionalProperties&&typeof schema.additionalProperties==="object"){
      for(const [k,v] of Object.entries(value))if(!(k in props))validate(v,schema.additionalProperties,pointer+"."+k);
    }
  }
  if(schema.type==="array"&&Array.isArray(value)&&schema.items)for(let i=0;i<value.length;i++)validate(value[i],schema.items,pointer+"["+i+"]");
}

const registry=await load("moonwitness/contracts/registry.json");
const schemaMap={
  tokens:"schemas/visual-token-contract.schema.json",
  severity:"schemas/severity-model.schema.json",
  "debt-policy":"schemas/visual-debt-policy.schema.json",
  waivers:"schemas/waiver-ledger.schema.json",
  rules:"schemas/rule-registry.schema.json",
  "golden-corpus":"schemas/golden-corpus.schema.json",
  "ai-contribution":"schemas/ai-contribution.schema.json",
  "conformance-policy":"schemas/conformance-policy.schema.json",
  "contract-registry":"schemas/contract-registry.schema.json"
};
let validated=0;
for(const entry of registry.entries??[]){
  const schemaPath=schemaMap[entry.contractId];
  if(!schemaPath)continue;
  if(!(await exists(schemaPath))){errors.push(entry.contractId+": schema missing "+schemaPath);continue}
  const [value,schema]=await Promise.all([load(entry.path),load(schemaPath)]);
  const before=errors.length;validate(value,schema,entry.path);
  if(errors.length===before)validated++;
}
const schemaFiles=(await readdir(path.join(root,"schemas"))).filter(x=>x.endsWith(".schema.json"));
for(const file of schemaFiles){
  const s=await load("schemas/"+file);
  if(s.$schema!=="https://json-schema.org/draft/2020-12/schema")errors.push(file+": unsupported or missing $schema");
  if(!s.$id)errors.push(file+": missing $id");
}
if(errors.length){for(const e of errors)console.error("ERROR "+e);process.exit(1)}
console.log(JSON.stringify({status:"pass",validatedContracts:validated,schemaFiles:schemaFiles.length},null,2));
