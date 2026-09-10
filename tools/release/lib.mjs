import { createHash } from "node:crypto";
import { access, readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const resolveRoot = (p="") => path.resolve(ROOT, p);
export async function exists(p){ try { await access(resolveRoot(p)); return true; } catch { return false; } }
export async function readText(p){ return readFile(resolveRoot(p), "utf8"); }
export async function readJson(p){ return JSON.parse(await readText(p)); }
export async function writeText(p, value){ const abs=resolveRoot(p); await mkdir(path.dirname(abs),{recursive:true}); await writeFile(abs,value); }
export async function writeJson(p, value){ await writeText(p, JSON.stringify(value,null,2)+"\n"); }
export function parseSemver(v){
  const m=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/.exec(String(v).trim());
  if(!m) throw new Error(`invalid semver: ${v}`);
  return {major:+m[1],minor:+m[2],patch:+m[3],prerelease:m[4]??null,build:m[5]??null};
}
export function compareSemver(a,b){
  const A=parseSemver(a),B=parseSemver(b);
  for(const k of ["major","minor","patch"]) if(A[k]!==B[k]) return A[k]<B[k]?-1:1;
  if(A.prerelease===B.prerelease) return 0;
  if(A.prerelease===null) return 1;
  if(B.prerelease===null) return -1;
  return A.prerelease.localeCompare(B.prerelease);
}
export function bumpSemver(v,impact){
  const x=parseSemver(v);
  if(impact==="major") return `${x.major+1}.0.0`;
  if(impact==="minor") return `${x.major}.${x.minor+1}.0`;
  if(impact==="patch") return `${x.major}.${x.minor}.${x.patch+1}`;
  if(impact==="none") return `${x.major}.${x.minor}.${x.patch}`;
  throw new Error(`unknown impact: ${impact}`);
}
export function run(cmd,args=[],opts={}){
  const r=spawnSync(cmd,args,{cwd:ROOT,encoding:"utf8",stdio:opts.stdio??"pipe",env:{...process.env,...opts.env}});
  if(r.status!==0 && !opts.allowFailure) throw new Error(`${cmd} ${args.join(" ")} failed (${r.status}): ${(r.stderr||r.stdout||"").trim()}`);
  return {status:r.status,stdout:r.stdout??"",stderr:r.stderr??""};
}
export function git(args,opts={}){ return run("git",args,opts); }
export function gitMaybe(args){ return git(args,{allowFailure:true}); }
export function sha256Buffer(buf){ return createHash("sha256").update(buf).digest("hex"); }
export async function sha256File(p){ return sha256Buffer(await readFile(resolveRoot(p))); }
export async function walk(dir){
  const out=[]; const root=resolveRoot(dir);
  async function visit(abs,rel){
    for(const e of await readdir(abs,{withFileTypes:true})){
      const childAbs=path.join(abs,e.name), childRel=path.posix.join(rel,e.name);
      if(e.isDirectory()) await visit(childAbs,childRel); else out.push(childRel);
    }
  }
  if(await exists(dir)) await visit(root,dir.replaceAll("\\","/").replace(/\/$/,""));
  return out.sort();
}
export function jsonResult(value){ process.stdout.write(JSON.stringify(value,null,2)+"\n"); }
export function fail(message,extra={}){
  const err={ok:false,error:message,...extra};
  process.stderr.write(JSON.stringify(err,null,2)+"\n");
  process.exitCode=1;
  return err;
}
export function getArg(name, fallback=null){
  const p=`--${name}`; const i=process.argv.indexOf(p);
  if(i>=0) return process.argv[i+1] ?? true;
  const eq=process.argv.find(x=>x.startsWith(`${p}=`));
  return eq?eq.slice(p.length+1):fallback;
}
export function hasArg(name){ return process.argv.includes(`--${name}`) || process.argv.some(x=>x.startsWith(`--${name}=`)); }
export async function fileSize(p){ return (await stat(resolveRoot(p))).size; }
