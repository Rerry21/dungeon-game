import { TILE, COLS, ROWS, WALL } from "./map.js";

const canvas = document.getElementById("game");
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;
const ctx = canvas.getContext("2d");

function drawPlayer(state) {
  const p = state.player;
  const cx = p.x * TILE + TILE / 2;
  const cy = p.y * TILE + TILE / 2;
  const r = TILE / 2 - 3;
  const moving = p.dir[0] !== 0 || p.dir[1] !== 0;
  const mouth = moving ? Math.abs(Math.sin(state.time / 90)) * 0.6 + 0.05 : 0.25;
  ctx.fillStyle = "#ffe11a";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, p.face + mouth, p.face + Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
}

function drawGhost(state, g) {
  const cx = g.x * TILE + TILE / 2;
  const cy = g.y * TILE + TILE / 2;
  const r = TILE / 2 - 3;
  const scared = state.fright > 0;
  const flash = scared && state.fright < 1500 && Math.floor(state.time / 200) % 2 === 0;

  ctx.globalAlpha = g.delay > 0 ? 0.35 : 1;
  ctx.fillStyle = scared ? (flash ? "#ffffff" : "#2a4bff") : g.color;
  ctx.beginPath();
  ctx.arc(cx, cy - 1, r, Math.PI, 0);
  ctx.lineTo(cx + r, cy + r);
  ctx.lineTo(cx + r / 2, cy + r - 4);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r / 2, cy + r - 4);
  ctx.lineTo(cx - r, cy + r);
  ctx.closePath();
  ctx.fill();

  if (scared) {
    ctx.fillStyle = flash ? "#2a4bff" : "#ffffff";
    ctx.fillRect(cx - 6, cy - 5, 4, 4);
    ctx.fillRect(cx + 2, cy - 5, 4, 4);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 3, 4, 0, Math.PI * 2);
    ctx.arc(cx + 5, cy - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101040";
    ctx.beginPath();
    ctx.arc(cx - 5 + g.last[0] * 2, cy - 3 + g.last[1] * 2, 2, 0, Math.PI * 2);
    ctx.arc(cx + 5 + g.last[0] * 2, cy - 3 + g.last[1] * 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function banner(text, sub, color) {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, canvas.height / 2 - 50, canvas.width, 100);
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 6);
  if (sub) {
    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 34);
  }
  ctx.textAlign = "left";
}

export function render(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.fillStyle = state.grid[y][x] === WALL ? "#1b2a7a" : "#08080f";
      ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      const v = state.pellets[y][x];
      if (v === 0) continue;
      ctx.fillStyle = "#ffd9a0";
      ctx.beginPath();
      const radius = v === 1 ? 3 : 7 + Math.sin(state.time / 150) * 1.5;
      ctx.arc(x * TILE + TILE / 2, y * TILE + TILE / 2, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (const g of state.ghosts) drawGhost(state, g);
  drawPlayer(state);

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, 24);
  ctx.fillStyle = "white";
  ctx.font = "14px sans-serif";
  ctx.fillText(
    `Score: ${state.score}    Lives: ${state.lives}    Level: ${state.level}    Dots left: ${state.left}`,
    8,
    17
  );

  if (state.over) banner("GAME OVER", `Score ${state.score} · press R to restart`, "crimson");
  else if (state.paused) banner("PAUSED", "press P to resume", "white");
  else if (state.ready > 0) banner("GET READY", "", "#ffe11a");
}