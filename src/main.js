import { loka_json } from "./config.js";
const $=(s)=>document.querySelector(s);

async function j(url){const r=await fetch(url,{cache:"no-cache"});if(!r.ok)throw new Error(url);return r.json();}
async function t(url){const r=await fetch(url,{cache:"no-cache"});if(!r.ok)throw new Error(url);return r.text();}

async function boot(){
  $("#status").textContent="loading loka.json…";
  const meta=await j(loka_json);

  // relief bg (fallback สำหรับ iPad)
  $("#status").textContent="loading relief…";
  const img=new Image(); img.crossOrigin="anonymous"; img.src=meta.assets.terrain_relief;
  try{await img.decode();}catch{await new Promise(ok=>img.onload=ok);}
  $("#terrain").style.backgroundImage=`url("${img.src}")`;

  // landmass svg overlay (บังคับโปร่งใส)
  $("#status").textContent="loading landmass…";
  const raw=await t(meta.assets.landmass_svg);
  const svg=raw.replace("<svg", `<svg><style>
    *{vector-effect:non-scaling-stroke}
    path,polygon,polyline,rect,circle,ellipse{fill:none !important;stroke:#ffe58a !important;stroke-width:1.2px}
    text{fill:#fffa;font-family:system-ui,sans-serif;font-size:14px}
  </style>`);
  $("#landmass").innerHTML=svg;

  // UI
  const opacity = $("#opacity");
  opacity.addEventListener("input", ()=> { $("#landmass").style.opacity = opacity.value; });
  $("#toggle-land").onclick=()=>{$("#landmass").classList.toggle("hide");};
  $("#toggle-relief").onclick=()=>{$("#terrain").classList.toggle("hide");};

  $("#status").textContent="ready";
}
window.onerror=(m,src,l,c)=>{$("#status").textContent=`error: ${m}`;};
boot().catch(e=>{$("#status").textContent=`error: ${e.message}`;});
