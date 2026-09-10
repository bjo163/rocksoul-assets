import { git, gitMaybe, jsonResult, readText, bumpSemver, compareSemver, fail } from "./lib.mjs";
try{
  const head=git(["rev-parse","HEAD"]).stdout.trim();
  const latest=gitMaybe(["describe","--tags","--abbrev=0","--match","v[0-9]*"]);
  if(latest.status!==0){ jsonResult({ok:true,stale:true,reason:"no-published-tag",head}); process.exit(0); }
  const tag=latest.stdout.trim(),tagSha=git(["rev-parse",`${tag}^{}`]).stdout.trim();
  const current=(await readText("VERSION")).trim(),published=tag.replace(/^v/,"");
  const stale=head!==tagSha;
  let impact="none",candidate=current;
  if(stale){
    const r=git(["diff","--name-status",tag,head]).stdout.split(/\r?\n/).filter(Boolean);
    let max=0; const ranks={patch:1,minor:2,major:3}; let i="patch";
    for(const line of r){
      const [st,...parts]=line.split(/\t/); const f=parts.at(-1)||"";
      const x=st.startsWith("D")&&/^(moonwitness|dist)\//.test(f)?"major":
        st.startsWith("A")&&/^(moonwitness|dist)\//.test(f)?"minor":
        /^(moonwitness|dist)\//.test(f)?"minor":"patch";
      if(ranks[x]>max){max=ranks[x];i=x;}
    }
    impact=i;
    candidate=bumpSemver(published,impact);
    if(compareSemver(current,candidate)>0) candidate=current;
  }
  jsonResult({ok:true,stale,head,published:{tag,version:published,sha:tagSha},impact,candidate});
}catch(e){ fail(e.message); }
