const RAW_BASE="https://raw.githubusercontent.com/bjo163/rocksoul-assets/main/";
const REGISTRY_URL=RAW_BASE+"dist/assets.json";
const PACK_INDEX_URL=RAW_BASE+"moonwitness/asset-packs.json";
const assetUrl=(path)=>path.startsWith("http")?path:RAW_BASE+path.replace(/^\//,"");
const manifestDescriptions={
  "product-icons":"Core navigation, action, domain and status icons.",
  "dashboard":"Modular dashboard widgets for operator and research surfaces.",
  "data-viz":"Reusable charts, matrices, timelines and provenance visuals.",
  "hero-backgrounds":"Large vector background fields for editorial and product heroes.",
  "state-illustrations":"Empty, error, loading, offline and completion illustrations.",
  "motion":"Canonical animated SVG motion references.",
  "sfx":"Procedural interface and product sound cues.",
  "graph-vector":"Graph and chart components for data-heavy surfaces.",
  "badge-status":"Evidence, review and system status badges.",
  "source-file":"Source, document and media type vocabulary.",
  "geospatial":"Pins, clusters, routes, boundaries and map overlays.",
  "cursor-interaction":"Graph, map, timeline and annotation interaction cursors.",
  "persona-avatar":"Reusable user and system personas in multiple raster sizes.",
  "social-campaign":"Platform-native campaign and social templates.",
  "platform-delivery":"Store, launcher, splash and install delivery assets.",
  "onboarding":"Reusable tutorial and onboarding illustrations.",
  "document-report":"Report covers, citations and document modules.",
  "notification":"Email, push, inbox and system notice templates.",
  "editorial":"Vector editorial imagery for articles and campaigns.",
  "evidence-media":"Annotation and evidence-inspection overlays.",
  "correlation-semantics":"Canonical evidence graph node and edge semantics.",
  "kanban-workflow":"Cards, columns, WIP, SLA and drag/drop workflow states.",
  "calendar-temporal":"Event, recurrence, timezone, range and deadline assets.",
  "chat-collaboration":"Messages, threads, presence, delivery and attachment states.",
  "ai-workspace":"AI state, tool-call, retrieval, citation and confidence assets.",
  "authorization-security":"Roles, permissions, MFA, passkeys, sessions and access states.",
  "data-grid":"Tables, rows, sorting, filtering and pagination states.",
  "form-controls":"Inputs, selects, toggles, validation and search controls.",
  "theme-accessibility":"Theme, contrast, focus, keyboard and reduced-motion assets.",
  "privacy-redaction":"PII, redaction, protected witness and confidentiality semantics.",
  "evidence-integrity":"Hash, signature, provenance and chain-of-custody assets.",
  "export-seal":"QR, watermark, evidence seal and export vocabulary.",
  "rocksoul-character":"Rocksoul character poses and product-state scenes.",
  "command-keyboard":"Keycaps, command palette and keyboard navigation hints.",
  "texture-material":"Vector-safe material treatments and background texture fields.",
  "architecture-diagram":"System nodes, arrows, trust zones and architecture primitives.",
  "device-mockup":"Browser, phone, tablet and desktop presentation frames.",
  "jurisdiction-locale":"Data-driven legal, timezone, governance and locale markers.",
  "cinematic-hero":"Large-format cinematic vector scenes.",
  "runtime-motion":"Animated SVG, APNG, WebM and Lottie runtime delivery.",
  "developer-distribution":"Generated JSON, TypeScript, CSS and SVG sprite registries."
};
const categoryMap={
  "Core":["product-icons","dashboard","data-viz","hero-backgrounds","state-illustrations","motion","sfx","graph-vector","badge-status","source-file"],
  "Investigation":["geospatial","evidence-media","correlation-semantics","privacy-redaction","evidence-integrity","export-seal","jurisdiction-locale"],
  "Workflow":["kanban-workflow","calendar-temporal","chat-collaboration","ai-workspace","authorization-security","data-grid","form-controls","command-keyboard"],
  "Identity":["persona-avatar","rocksoul-character","theme-accessibility","cursor-interaction"],
  "Media":["social-campaign","platform-delivery","onboarding","document-report","notification","editorial","cinematic-hero","texture-material","device-mockup"],
  "System":["architecture-diagram","runtime-motion","developer-distribution"]
};
const accents=["#ff2a3d","#21d1c2","#3b82f6","#d4a15a","#10b981","#8b5cf6","#f59e0b"];
let registry=null, packIndex=null, selectedCategory="All", query="", view="grid";
let currentPack=null;

const $=(s)=>document.querySelector(s);
const grid=$("#packGrid"), filters=$("#filters"), search=$("#searchInput"), dialog=$("#assetDialog");
const categoryOf=(id)=>Object.entries(categoryMap).find(([,ids])=>ids.includes(id))?.[0]??"System";
const prettify=(id)=>id.replaceAll("-"," ").replace(/\b\w/g,m=>m.toUpperCase());
const assetEntries=(pack)=>Object.entries(pack.svg??{});
const pngEntries=(pack)=>Object.entries(pack.png??{});
const allAssetNames=(pack)=>[...Object.keys(pack.svg??{}),...Object.keys(pack.png??{})];
const formatsFor=(id,pack)=>{
  const f=[]; if(Object.keys(pack.svg??{}).length)f.push("SVG"); if(Object.keys(pack.png??{}).length)f.push("PNG");
  if(id==="sfx")f.push("WAV","OGG"); if(id==="runtime-motion")f.push("APNG","WEBM","LOTTIE");
  if(id==="developer-distribution")f.push("TS","JSON","CSS");
  return [...new Set(f)];
};

function packPreview(id,pack,index){
  const svgs=assetEntries(pack).slice(0,3);
  if(svgs.length===1)return '<img loading="lazy" src="'+assetUrl(svgs[0][1])+'" alt="" />';
  if(svgs.length>1)return '<div class="preview-icon-set">'+svgs.map(([,p])=>'<img loading="lazy" src="'+assetUrl(p)+'" alt="" />').join("")+'</div>';
  if(id==="sfx")return '<div class="preview-fallback">∿</div>';
  if(id==="developer-distribution")return '<div class="preview-fallback">{ }</div>';
  return '<div class="preview-fallback">'+String(index+1).padStart(2,"0")+'</div>';
}
function createCard(id,pack,index){
  const cat=categoryOf(id), formats=formatsFor(id,pack), accent=accents[index%accents.length];
  const article=document.createElement("article"); article.className="pack-card"; article.tabIndex=0; article.style.setProperty("--accent",accent);
  article.dataset.id=id; article.dataset.category=cat;
  article.innerHTML='<div class="pack-preview">'+packPreview(id,pack,index)+'</div>'+
    '<div class="pack-content"><div class="pack-index"><span class="pack-number">'+String(index+1).padStart(2,"0")+' / '+String(Object.keys(registry.packs).length).padStart(2,"0")+'</span><span class="pack-category">'+cat+'</span></div>'+
    '<div><h3 class="pack-title">'+prettify(id)+'</h3><p class="pack-description">'+(manifestDescriptions[id]??"Production MoonWitness asset pack.")+'</p></div>'+
    '<div class="pack-footer"><span class="pack-count">'+pack.count+' assets</span><div class="format-row">'+formats.slice(0,4).map(f=>'<span class="format-badge">'+f+'</span>').join("")+'</div></div></div>';
  article.addEventListener("click",()=>openPack(id));
  article.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openPack(id)}});
  return article;
}
function renderFilters(){
  const cats=["All",...Object.keys(categoryMap)];
  filters.innerHTML="";
  cats.forEach(cat=>{const b=document.createElement("button");b.type="button";b.className="filter-button"+(cat===selectedCategory?" active":"");b.textContent=cat;b.onclick=()=>{selectedCategory=cat;renderFilters();render()};filters.appendChild(b)});
}
function matches(id,pack){
  if(selectedCategory!=="All"&&categoryOf(id)!==selectedCategory)return false;
  if(!query)return true;
  const hay=[id,categoryOf(id),manifestDescriptions[id],...allAssetNames(pack)].join(" ").toLowerCase();
  return hay.includes(query);
}
function render(){
  if(!registry)return;
  grid.classList.toggle("compact",view==="compact"); grid.innerHTML="";
  const entries=Object.entries(registry.packs); let shown=0;
  entries.forEach(([id,pack],i)=>{if(matches(id,pack)){grid.appendChild(createCard(id,pack,i));shown++}});
  $("#resultCount").textContent=shown+" of "+entries.length+" pack families";
  $("#emptyResults").hidden=shown!==0;
}
function normalizePng(value){
  if(typeof value==="string")return value;
  if(value&&typeof value==="object")return Object.values(value)[0];
  return null;
}
function openPack(id){
  const pack=registry.packs[id]; currentPack={id,pack};
  $("#dialogCategory").textContent=categoryOf(id)+" / Asset pack";
  $("#dialogTitle").textContent=prettify(id);
  $("#dialogMeta").textContent=pack.count+" canonical assets · "+formatsFor(id,pack).join(" · ");
  $("#dialogManifest").href=assetUrl(pack.manifest);
  $("#dialogSearch").value="";
  const firstSvg=assetEntries(pack)[0]?.[1];
  if(firstSvg)$("#dialogPreview").innerHTML='<img src="'+assetUrl(firstSvg)+'" alt="'+prettify(id)+' preview" />';
  else if(id==="sfx")$("#dialogPreview").innerHTML='<div class="preview-fallback">∿ AUDIO</div>';
  else $("#dialogPreview").innerHTML='<div class="preview-fallback">{ }</div>';
  renderAssetList("");
  dialog.showModal();
  history.replaceState(null,"","#pack="+encodeURIComponent(id));
}
function renderAssetList(filter){
  if(!currentPack)return;
  const {id,pack}=currentPack, q=filter.trim().toLowerCase(), list=$("#assetList");list.innerHTML="";
  const assets=assetEntries(pack).filter(([name])=>!q||name.toLowerCase().includes(q));
  if(!assets.length&&id==="sfx"){
    list.innerHTML='<div class="asset-row"><div class="asset-thumb">∿</div><div class="asset-name"><strong>14 procedural cues</strong><span>WAV + OGG generated derivatives</span></div><div class="asset-actions"><button class="tiny-button" data-copy="moonwitness/sfx/generated/" title="Copy path">⧉</button></div></div>';
  } else if(!assets.length&&id==="developer-distribution"){
    ["dist/assets.json","dist/assets.ts","dist/assets.css","dist/sprite.svg"].forEach(p=>list.appendChild(assetRow(p.split("/").pop(),p,null)));
  } else assets.forEach(([name,path])=>list.appendChild(assetRow(name,path,path)));
  list.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async e=>{e.stopPropagation();await navigator.clipboard.writeText(b.dataset.copy);toast("Path copied")});
}
function assetRow(name,path,thumb){
  const row=document.createElement("div");row.className="asset-row";
  row.innerHTML='<div class="asset-thumb">'+(thumb?'<img loading="lazy" src="'+assetUrl(thumb)+'" alt="" />':'↗')+'</div><div class="asset-name"><strong>'+prettify(name)+'</strong><span>'+path+'</span></div><div class="asset-actions"><button class="tiny-button" data-copy="'+path+'" title="Copy path">⧉</button><a class="tiny-button" href="'+assetUrl(path)+'" target="_blank" rel="noreferrer" title="Open raw asset" style="display:grid;place-items:center">↗</a></div>';
  if(thumb)row.onclick=()=>{$("#dialogPreview").innerHTML='<img src="'+assetUrl(thumb)+'" alt="'+prettify(name)+' preview" />'};
  return row;
}
let toastTimer;function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1400)}

async function init(){
  try{
    const [r,i]=await Promise.all([fetch(REGISTRY_URL),fetch(PACK_INDEX_URL)]); if(!r.ok)throw new Error("Registry unavailable");
    registry=await r.json(); packIndex=i.ok?await i.json():null;
    const packs=Object.entries(registry.packs); $("#statPacks").textContent=packs.length; $("#statAssets").textContent=packs.reduce((n,[,p])=>n+(Number(p.count)||0),0).toLocaleString(); $("#statVersion").textContent="v"+registry.version;
    $("#registryState").innerHTML='<span class="status-dot"></span> Registry v'+registry.version;
    renderFilters();render();
    const hash=new URLSearchParams(location.hash.replace(/^#/,"")); const pack=hash.get("pack"); if(pack&&registry.packs[pack])openPack(pack);
  }catch(err){$("#registryState").textContent="Registry unavailable";$("#resultCount").textContent="Unable to load asset registry";grid.innerHTML='<div class="empty-results"><strong>Registry could not be loaded.</strong><p>'+err.message+'</p></div>'}
}

search.addEventListener("input",()=>{query=search.value.trim().toLowerCase();render()});
$("#resetSearch").onclick=()=>{search.value="";query="";selectedCategory="All";renderFilters();render()};
document.querySelectorAll(".view-button").forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll(".view-button").forEach(x=>x.classList.toggle("active",x===b));render()});
$("#themeToggle").onclick=()=>{const root=document.documentElement;const next=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=next;localStorage.setItem("mw-theme",next)};
const saved=localStorage.getItem("mw-theme");if(saved)document.documentElement.dataset.theme=saved;
$("#dialogClose").onclick=()=>dialog.close();
dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener("close",()=>{if(location.hash.startsWith("#pack="))history.replaceState(null,"",location.pathname+location.search)});
$("#dialogSearch").addEventListener("input",e=>renderAssetList(e.target.value));
window.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();if(!dialog.open)search.focus()}});
init();
