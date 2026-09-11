import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../..");
const load=async rel=>JSON.parse(await readFile(path.join(root,rel),"utf8"));
const text=async rel=>readFile(path.join(root,rel),"utf8");
const [tokens,consumer,penpot]=await Promise.all([
  load("moonwitness/tokens/visual-system-v2.json"),
  load("dist/contracts/visual-system.json"),
  load("penpot/generated/visual-system.tokens.json")
]);
const css=await text("dist/contracts/tokens.css");
const ts=await text("dist/contracts/tokens.ts");
const errors=[];
const semantics=new Set(Object.keys(tokens.semantics??{}));
const aliases=new Set(Object.keys(tokens.presentationAliases??{}));
for(const id of aliases)if(semantics.has(id))errors.push("token ID is both semantic and presentation alias: "+id);
for(const [id,a] of Object.entries(tokens.presentationAliases??{})){
  if(!semantics.has(a.semanticSource))errors.push(id+": unresolved semantic source "+a.semanticSource);
  if(aliases.has(a.semanticSource))errors.push(id+": alias-to-alias dependency is forbidden");
  if(!["active","deprecated","removed"].includes(a.lifecycle))errors.push(id+": invalid alias lifecycle");
  if(a.lifecycle==="deprecated"&&!a.replacement)errors.push(id+": deprecated alias requires replacement");
  if(a.lifecycle==="removed"&&(css.includes(id)||ts.includes(id)))errors.push(id+": removed alias emitted to consumer distribution");
}
for(const [id,s] of Object.entries(tokens.semantics??{})){
  if(!["active","deprecated","removed"].includes(s.lifecycle))errors.push(id+": invalid semantic lifecycle");
  if(s.lifecycle==="deprecated"&&!s.replacement)errors.push(id+": deprecated semantic token requires replacement");
  if(s.lifecycle==="removed"&&(css.includes(id)||ts.includes(id)))errors.push(id+": removed semantic token emitted to consumer distribution");
  if(typeof s.value==="string"&&s.value.startsWith("#")){
    const all=JSON.stringify(tokens.primitives.color??{}).toUpperCase();
    if(!all.includes(s.value.toUpperCase()))errors.push(id+": semantic color is not backed by primitive palette "+s.value);
  }
}
const personalities=new Set(tokens.surfacePersonalities??[]);
for(const [id,r] of Object.entries(tokens.typographyRoles??{})){
  for(const p of r.allowedPersonalities??[])if(!personalities.has(p))errors.push(id+": unknown typography personality "+p);
}
for(const name of ["compact","comfortable","editorial"])if(!tokens.density?.[name])errors.push("missing density "+name);
for(const id of ["presentation.brand.crimsonUi.dark","presentation.brand.crimsonUi.light"])if(!tokens.presentationAliases?.[id])errors.push("missing theme pair "+id);
if(consumer.tokenHash===undefined)errors.push("consumer contract missing token fingerprint");
if(consumer.minimumCompatibleUiContract!==tokens.compatibility?.minimumCompatibleUiContract)errors.push("consumer compatibility level differs from canonical token contract");
for(const id of [...semantics,...aliases]){
  if(!css.includes(id.replace(/([a-z0-9])([A-Z])/g,"$1-$2").replace(/[^a-zA-Z0-9]+/g,"-").toLowerCase()))errors.push(id+": missing CSS output");
  if(!JSON.stringify(penpot).includes(id))errors.push(id+": missing Penpot output");
}
if(!ts.includes("PresentationAliasId")||!ts.includes("SemanticTokenId"))errors.push("TypeScript consumer types missing");
if(errors.length){for(const e of errors)console.error("ERROR "+e);process.exit(1)}
console.log(JSON.stringify({status:"pass",semanticTokens:semantics.size,presentationAliases:aliases.size,personalities:personalities.size,densityModes:Object.keys(tokens.density??{}).length},null,2));
