// src/main.js
import { loka_json } from "./config.js";

const $ = (sel) => document.querySelector(sel);

async function get_json(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.json();
}

async function get_text(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(`fetch failed: ${url}`);
  return r.text();
}

async function boot() {
  $("#status").textContent = "loading: loka.json";
  const meta = await get_json(loka_json);

  // พื้นหลังเป็น relief
  $("#status").textContent = "loading: terrain relief";
  const relief = new Image();
  relief.crossOrigin = "anonymous";
  relief.src = meta.assets.terrain_relief;
  await relief.decode();
  $("#terrain").style.backgroundImage = `url("${relief.src}")`;

  // ซ้อน landmass เป็น overlay (vector)
  $("#status").textContent = "loading: landmass svg";
  const svg = await get_text(meta.assets.landmass_svg);
  $("#landmass").innerHTML = svg;

  $("#status").textContent = "ready";
}

boot().catch((e) => {
  console.error(e);
  $("#status").textContent = `error: ${e.message}`;
});
