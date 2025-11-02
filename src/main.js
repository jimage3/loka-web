import { loka_json } from "./config.js";

const $ = (s) => document.querySelector(s);

async function txt(url){ const r=await fetch(url,{cache:"no-cache"}); if(!r.ok) throw new Error(url); return r.text(); }
async function json(url){ const r=await fetch(url,{cache:"no-cache"}); if(!r.ok) throw new Error(url); return r.json(); }

async function boot(){
  $("#status").textContent = "loading loka.json…";
  const meta = await json(loka_json);

  // relief เป็นพื้นหลัง (fallback สำหรับ iPad)
  $("#status").textContent = "loading relief…";
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = meta.assets.terrain_relief;
  try { await img.decode(); } catch { await new Promise(ok => img.onload = ok); }
  $("#terrain").style.backgroundImage = `url("${img.src}")`;

  // landmass (svg) เป็น overlay + บังคับโปร่งใสด้วย style แทรก
  $("#status").textContent = "loading landmass…";
  const svg = await txt(meta.assets.landmass_svg);
  const enforced = svg.replace(
    "<svg",
    `<svg><style>
      *{ vector-effect:non-scaling-stroke }
      path,polygon,polyline,rect,circle,ellipse { fill: none !important; stroke: #ffe58a !important; stroke-width: 1.2px; }
      text { fill: #fffa; font-family: system-ui, sans-serif; font-size: 14px; }
    </style>`
  );
  $("#landmass").innerHTML = enforced;

  $("#status").textContent = "ready";
}

window.onerror = (m,src,l,c)=>{ $("#status").textContent = `error: ${m}`; };
boot().catch(e=>{ console.error(e); $("#status").textContent=`error: ${e.message}`; });
