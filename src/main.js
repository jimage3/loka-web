import { loka_json } from "./config.js";
const $=(s)=>document.querySelector(s);

async function j(u){const r=await fetch(u,{cache:"no-cache"});if(!r.ok)throw new Error(u);return r.json();}
async function t(u){const r=await fetch(u,{cache:"no-cache"});if(!r.ok)throw new Error(u);return r.text();}

async function boot(){
  $("#status").textContent="loading loka.json…";
  const meta=await j(loka_json);

  $("#status").textContent="loading relief…";
  const img=new Image(); img.crossOrigin="anonymous"; img.src=meta.assets.terrain_relief;
  try{await img.decode();}catch{await new Promise(ok=>img.onload=ok);}
  $("#terrain").style.backgroundImage=`url("${img.src}")`;

  $("#status").textContent="loading landmass…";
  const raw=await t(meta.assets.landmass_svg);
  const svg=raw.replace("<svg", `<svg><style>
    *{vector-effect:non-scaling-stroke}
    path,polygon,polyline,rect,circle,ellipse{fill:none !important;stroke:#ffe58a !important;stroke-width:1.2px}
    text{fill:#fffa;font-family:system-ui,sans-serif;font-size:14px}
  </style>`);
  $("#landmass").innerHTML=svg;

  const op=$("#opacity");
  op.addEventListener("input",()=>{$("#landmass").style.opacity=op.value;});
  $("#toggle-land").onclick=()=>{$("#landmass").classList.toggle("hide");};
  $("#toggle-relief").onclick=()=>{$("#terrain").classList.toggle("hide");};

  $("#status").textContent="ready";
}
window.onerror=(m)=>{$("#status").textContent=`error: ${m}`;};
boot().catch(e=>{$("#status").textContent=`error: ${e.message}`;});
