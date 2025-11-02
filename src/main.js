// โหลด loka.json → วาง relief เป็นพื้นหลัง → ซ้อน landmass.svg เป็น overlay
import { loka_json } from "./config.js";

const $ = (s) => document.querySelector(s);

async function fetchJSON(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.json();
}
async function fetchText(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.text();
}

async function boot() {
  $("#status").textContent = "loading loka.json…";
  const meta = await fetchJSON(loka_json);

  // 1) terrain relief (background) + fallback สำหรับ iPad (หลบ EncodingError)
  $("#status").textContent = "loading terrain relief…";
  const relief = new Image();
  relief.crossOrigin = "anonymous";
  relief.src = meta.assets.terrain_relief;
  try {
    await relief.decode();
  } catch {
    await new Promise((ok) => (relief.onload = ok));
  }
  $("#terrain").style.backgroundImage = `url("${relief.src}")`;

  // 2) landmass svg (overlay)
  $("#status").textContent = "loading landmass svg…";
  const svgText = await fetchText(meta.assets.landmass_svg);
  $("#landmass").innerHTML = svgText;

  $("#status").textContent = "ready";
}

// debug เล็ก ๆ บน iPad (โชว์ error ในหน้า)
window.onerror = (msg, src, line, col) => {
  const s = document.getElementById("status");
  s.textContent = `error: ${msg} @ ${src}:${line}:${col}`;
};

boot().catch((e) => {
  console.error(e);
  $("#status").textContent = `error: ${e.message}`;
});
