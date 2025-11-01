// src/main.js
import { LOKA_JSON } from "./config.js";

async function fetchText(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.text();
}
async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.json();
}

async function boot() {
  const status = document.getElementById("status");
  status.textContent = "loading loka.json…";
  const loka = await fetchJSON(LOKA_JSON);

  // โหลด relief เป็นพื้นหลัง
  status.textContent = "loading terrain relief…";
  const reliefImg = new Image();
  reliefImg.crossOrigin = "anonymous";
  reliefImg.src = loka.assets.terrain_relief;
  await reliefImg.decode();
  const terrain = document.getElementById("terrain");
  terrain.style.backgroundImage = `url("${reliefImg.src}")`;

  // โหลด landmass svg ซ้อนทับ
  status.textContent = "loading landmass svg…";
  const svgText = await fetchText(loka.assets.landmass_svg);
  document.getElementById("landmass").innerHTML = svgText;

  status.textContent = "ready";
}

boot().catch((e) => {
  console.error(e);
  document.getElementById("status").textContent = `error: ${e.message}`;
});
