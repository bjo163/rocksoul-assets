const RAW_BASE="https://raw.githubusercontent.com/bjo163/rocksoul-assets/main/";
const REGISTRY_URL="/dist/assets.json";
const CATALOG_URL="/showcase/catalog.json";
const assetUrl=(path)=>path.startsWith("http")?path:RAW_BASE+path.replace(/^\//,"");

let registry=null;
let catalog=null;
let selectedCategory="All";
let query="";
let view="grid";
let currentEntry=null;

const $=(s)=>document.querySelector(s);
const grid=$("#packGrid");
const filters=$("#filters");
const search=$("#searchInput");
const dialog=$("#assetDialog");
const accents=["#ff2a3d","#21d1c2","#3b82f6","#d4a15a","#10b981","#8b5cf6","#f59e0b"];
const categoryOrder=["Foundations","Core","Investigation","Workflow","Identity","Media","System"];

const prettify=(id)=>id.replaceAll("-"," ").replace(/\b\w/g,(m)=>m.toUpperCase());
const escapeHtml=(value)=>String(value)
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");

function metaFor(id){
  return catalog?.entries?.[id] ?? {label:prettify(id),category:"System",description:"MoonWitness delivery collection."};
}

function registryEntry(id){
  if(registry?.packs?.[id]) return {id,kind:"pack",...registry.packs[id]};
  if(registry?.collections?.[id]) return {id,kind:"foundation",...registry.collections[id]};
  return null;
}

function allEntries(){
  const ids=Object.keys(catalog?.entries??{});
  return ids.map(registryEntry).filter(Boolean);
}

function flattenPng(png){
  const out=[];
  for(const [name,value] of Object.entries(png??{})){
    if(typeof value==="string") out.push({name,path:value});
    else if(value&&typeof value==="object"){
      for(const [size,path] of Object.entries(value)) out.push({name:name+" @"+size,path});
    }
  }
  return out;
}

function formatForPath(path,id){
  const lower=path.toLowerCase();
  if(id==="runtime-motion" && lower.includes("/png/") && lower.endsWith(".png")) return "APNG";
  if(lower.includes("/lottie/") && lower.endsWith(".json")) return "LOTTIE";
  if(lower.endsWith(".svg")) return "SVG";
  if(lower.endsWith(".png")) return "PNG";
  if(lower.endsWith(".ico")) return "ICO";
  if(lower.endsWith(".webm")) return "WEBM";
  if(lower.endsWith(".wav")) return "WAV";
  if(lower.endsWith(".ogg")) return "OGG";
  if(lower.endsWith(".json")) return "JSON";
  if(lower.endsWith(".ts")) return "TS";
  if(lower.endsWith(".css")) return "CSS";
  return path.split(".").pop()?.toUpperCase()??"FILE";
}

function fileItems(entry){
  const seen=new Set();
  const items=[];
  const push=(path,name=null,artifact=false)=>{
    if(!path||seen.has(path))return;
    seen.add(path);
    items.push({
      name:name??path.split("/").pop()?.replace(/\.[^.]+$/,"")??path,
      path,
      format:formatForPath(path,entry.id),
      artifact,
    });
  };
  for(const path of entry.files??[]) push(path);
  for(const [name,path] of Object.entries(entry.artifacts??{})) push(path,name,true);
  return items.sort((a,b)=>{
    const order=["SVG","PNG","APNG","ICO","WEBM","LOTTIE","WAV","OGG","JSON","TS","CSS"];
    const da=order.indexOf(a.format),db=order.indexOf(b.format);
    return (da-db)||a.path.localeCompare(b.path);
  });
}

function formatsFor(entry){
  return [...new Set(fileItems(entry).map((item)=>item.format))];
}

function previewCandidates(entry){
  const svgs=Object.values(entry.svg??{});
  if(svgs.length) return svgs.slice(0,3);
  const pngs=flattenPng(entry.png).map((x)=>x.path);
  if(pngs.length) return pngs.slice(0,3);
  return [];
}

function packPreview(entry,index){
  const previews=previewCandidates(entry);
  if(previews.length===1) return '<img loading="lazy" src="'+assetUrl(previews[0])+'" alt="" />';
  if(previews.length>1) return '<div class="preview-icon-set">'+previews.map((p)=>'<img loading="lazy" src="'+assetUrl(p)+'" alt="" />').join("")+'</div>';
  const formats=formatsFor(entry);
  if(formats.includes("WAV")||formats.includes("OGG")) return '<div class="preview-fallback">∿</div>';
  if(entry.id==="developer-distribution") return '<div class="preview-fallback">{ }</div>';
  return '<div class="preview-fallback">'+String(index+1).padStart(2,"0")+'</div>';
}

function createCard(entry,index,total){
  const meta=metaFor(entry.id);
  const formats=formatsFor(entry);
  const files=fileItems(entry);
  const accent=accents[index%accents.length];
  const article=document.createElement("article");
  article.className="pack-card";
  article.tabIndex=0;
  article.style.setProperty("--accent",accent);
  article.dataset.id=entry.id;
  article.dataset.category=meta.category;

  article.innerHTML=
    '<div class="pack-preview">'+packPreview(entry,index)+'</div>'+
    '<div class="pack-content">'+
      '<div class="pack-index">'+
        '<span class="pack-number">'+String(index+1).padStart(2,"0")+' / '+String(total).padStart(2,"0")+'</span>'+
        '<span class="pack-category">'+escapeHtml(meta.category)+'</span>'+
      '</div>'+
      '<div>'+
        '<h3 class="pack-title">'+escapeHtml(meta.label)+'</h3>'+
        '<p class="pack-description">'+escapeHtml(meta.description)+'</p>'+
      '</div>'+
      '<div class="pack-footer">'+
        '<span class="pack-count">'+entry.count+' canonical <span class="pack-file-count">· '+files.length+' files</span></span>'+
        '<div class="format-row">'+formats.slice(0,4).map((f)=>'<span class="format-badge">'+f+'</span>').join("")+'</div>'+
      '</div>'+
    '</div>';

  article.addEventListener("click",()=>openEntry(entry.id));
  article.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"||event.key===" "){event.preventDefault();openEntry(entry.id);}
  });
  return article;
}

function renderFilters(){
  const used=new Set(allEntries().map((entry)=>metaFor(entry.id).category));
  const cats=["All",...categoryOrder.filter((cat)=>used.has(cat))];
  filters.innerHTML="";
  cats.forEach((cat)=>{
    const button=document.createElement("button");
    button.type="button";
    button.className="filter-button"+(cat===selectedCategory?" active":"");
    button.textContent=cat;
    button.onclick=()=>{selectedCategory=cat;renderFilters();render();};
    filters.appendChild(button);
  });
}

function matches(entry){
  const meta=metaFor(entry.id);
  if(selectedCategory!=="All"&&meta.category!==selectedCategory) return false;
  if(!query) return true;
  const hay=[entry.id,meta.label,meta.category,meta.description,...fileItems(entry).flatMap((x)=>[x.name,x.path,x.format])].join(" ").toLowerCase();
  return hay.includes(query);
}

function render(){
  if(!registry||!catalog)return;
  grid.classList.toggle("compact",view==="compact");
  grid.innerHTML="";
  const entries=allEntries();
  let shown=0;
  entries.forEach((entry,index)=>{
    if(matches(entry)){
      grid.appendChild(createCard(entry,index,entries.length));
      shown++;
    }
  });
  $("#resultCount").textContent=shown+" of "+entries.length+" showcase collections · "+registry.coverage.packFamilies+" packs + "+registry.coverage.foundationCollections+" foundations";
  $("#emptyResults").hidden=shown!==0;
}

async function previewAsset(item){
  const box=$("#dialogPreview");
  const url=assetUrl(item.path);
  const label=escapeHtml(prettify(item.name));

  if(["SVG","PNG","APNG","ICO"].includes(item.format)){
    box.innerHTML='<img src="'+url+'" alt="'+label+' preview" />';
    return;
  }
  if(item.format==="WEBM"){
    box.innerHTML='<video src="'+url+'" controls autoplay loop muted playsinline aria-label="'+label+' preview"></video>';
    return;
  }
  if(["WAV","OGG"].includes(item.format)){
    box.innerHTML='<div class="preview-audio"><span>∿ AUDIO</span><audio src="'+url+'" controls preload="metadata"></audio><small>'+escapeHtml(item.path)+'</small></div>';
    return;
  }
  if(["LOTTIE","JSON","TS","CSS"].includes(item.format)){
    box.innerHTML='<pre class="text-preview">Loading '+item.format+'…</pre>';
    try{
      const response=await fetch(url);
      const text=await response.text();
      const clipped=text.length>16000?text.slice(0,16000)+"\n\n… preview truncated …":text;
      box.innerHTML='<pre class="text-preview">'+escapeHtml(clipped)+'</pre>';
    }catch{
      box.innerHTML='<pre class="text-preview">Preview unavailable. Use “Open raw asset”.</pre>';
    }
    return;
  }
  box.innerHTML='<div class="preview-fallback">'+escapeHtml(item.format)+'</div>';
}

function openEntry(id){
  const entry=registryEntry(id);
  if(!entry)return;
  currentEntry=entry;
  const meta=metaFor(id);
  const items=fileItems(entry);
  $("#dialogCategory").textContent=meta.category+" / "+(entry.kind==="foundation"?"Foundation collection":"Asset pack");
  $("#dialogTitle").textContent=meta.label;
  $("#dialogMeta").innerHTML=entry.count+' canonical assets · <span class="dialog-file-count">'+items.length+' reachable files</span> · '+formatsFor(entry).join(" · ");
  $("#dialogManifest").href=assetUrl(entry.manifest);
  $("#dialogSearch").value="";
  renderAssetList("");
  const first=items.find((x)=>x.format==="SVG")??items.find((x)=>x.format==="PNG")??items[0];
  if(first) previewAsset(first);
  dialog.showModal();
  history.replaceState(null,"","#pack="+encodeURIComponent(id));
}

function renderAssetList(filter){
  if(!currentEntry)return;
  const q=filter.trim().toLowerCase();
  const list=$("#assetList");
  list.innerHTML="";
  const items=fileItems(currentEntry).filter((item)=>!q||[item.name,item.path,item.format].join(" ").toLowerCase().includes(q));

  for(const item of items){
    const row=document.createElement("div");
    row.className="asset-row";
    row.dataset.format=item.format;

    const visual=["SVG","PNG","APNG","ICO"].includes(item.format);
    const thumb=visual
      ? '<img loading="lazy" src="'+assetUrl(item.path)+'" alt="" />'
      : '<span class="asset-format">'+item.format+'</span>';

    row.innerHTML=
      '<div class="asset-thumb">'+thumb+'</div>'+
      '<div class="asset-name">'+
        '<strong>'+escapeHtml(prettify(item.name))+' <span class="asset-format">'+item.format+'</span></strong>'+
        '<span>'+escapeHtml(item.path)+'</span>'+
      '</div>'+
      '<div class="asset-actions">'+
        '<button class="tiny-button" data-copy="'+escapeHtml(item.path)+'" title="Copy path">⧉</button>'+
        '<a class="tiny-button" href="'+assetUrl(item.path)+'" target="_blank" rel="noreferrer" title="Open raw asset" style="display:grid;place-items:center">↗</a>'+
      '</div>';

    row.addEventListener("click",(event)=>{
      if(event.target.closest("button,a"))return;
      previewAsset(item);
    });
    list.appendChild(row);
  }

  list.querySelectorAll("[data-copy]").forEach((button)=>{
    button.onclick=async(event)=>{
      event.stopPropagation();
      await navigator.clipboard.writeText(button.dataset.copy);
      toast("Path copied");
    };
  });
}

let toastTimer;
function toast(message){
  const node=$("#toast");
  node.textContent=message;
  node.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>node.classList.remove("show"),1400);
}

async function init(){
  try{
    const [registryResponse,catalogResponse]=await Promise.all([fetch(REGISTRY_URL),fetch(CATALOG_URL)]);
    if(!registryResponse.ok)throw new Error("Registry unavailable");
    if(!catalogResponse.ok)throw new Error("Showcase catalog unavailable");
    registry=await registryResponse.json();
    catalog=await catalogResponse.json();

    $("#statPacks").textContent=registry.coverage.packFamilies;
    $("#statAssets").textContent=registry.coverage.deliveryFiles.toLocaleString();
    $("#statCoverage").textContent=registry.coverage.coveragePercent+"%";
    $("#statVersion").textContent="v"+registry.version;
    $("#registryState").innerHTML='<span class="status-dot"></span> '+registry.coverage.indexedDeliveryFiles+'/'+registry.coverage.deliveryFiles+' files indexed';

    renderFilters();
    render();

    const hash=new URLSearchParams(location.hash.replace(/^#/,""));
    const id=hash.get("pack");
    if(id&&registryEntry(id))openEntry(id);
  }catch(error){
    $("#registryState").textContent="Registry unavailable";
    $("#resultCount").textContent="Unable to load complete asset registry";
    grid.innerHTML='<div class="empty-results"><strong>Registry could not be loaded.</strong><p>'+escapeHtml(error.message)+'</p></div>';
  }
}

search.addEventListener("input",()=>{query=search.value.trim().toLowerCase();render();});
$("#resetSearch").onclick=()=>{search.value="";query="";selectedCategory="All";renderFilters();render();};
document.querySelectorAll(".view-button").forEach((button)=>button.onclick=()=>{
  view=button.dataset.view;
  document.querySelectorAll(".view-button").forEach((node)=>node.classList.toggle("active",node===button));
  render();
});
$("#themeToggle").onclick=()=>{
  const root=document.documentElement;
  const next=root.dataset.theme==="dark"?"light":"dark";
  root.dataset.theme=next;
  localStorage.setItem("mw-theme",next);
};
const savedTheme=localStorage.getItem("mw-theme");
if(savedTheme)document.documentElement.dataset.theme=savedTheme;
$("#dialogClose").onclick=()=>dialog.close();
dialog.addEventListener("click",(event)=>{if(event.target===dialog)dialog.close();});
dialog.addEventListener("close",()=>{if(location.hash.startsWith("#pack="))history.replaceState(null,"",location.pathname+location.search);});
$("#dialogSearch").addEventListener("input",(event)=>renderAssetList(event.target.value));
window.addEventListener("keydown",(event)=>{
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==="k"){
    event.preventDefault();
    if(!dialog.open)search.focus();
  }
});

init();
