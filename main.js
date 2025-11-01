const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
let scale = 1, offsetX = 0, offsetY = 0;
const terrain = new Image();

terrain.src = 'data/terrain/Loka_Terrain_relief.png';
terrain.onload = draw;

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.drawImage(terrain, 0, 0, terrain.width, terrain.height);
  ctx.restore();
}

window.addEventListener('wheel', e => {
  e.preventDefault();
  const zoom = e.deltaY < 0 ? 1.1 : 0.9;
  scale *= zoom;
  draw();
});

let dragging = false, lastX, lastY;
canvas.addEventListener('mousedown', e => {
  dragging = true; lastX = e.clientX; lastY = e.clientY;
});
canvas.addEventListener('mouseup', () => dragging = false);
canvas.addEventListener('mousemove', e => {
  if (!dragging) return;
  offsetX += (e.clientX - lastX);
  offsetY += (e.clientY - lastY);
  lastX = e.clientX; lastY = e.clientY;
  draw();
});

window.addEventListener('resize', draw);
