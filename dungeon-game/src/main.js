import { generateMap, createPellets } from "./map.js";
import { createPlayer, stepPlayer } from "./player.js";
import { spawnGhosts, resetGhosts, moveGhosts } from "./enemy.js";
import { render } from "./render.js";

const PLAYER_MS = 130;

const state = {
  level: 1,
  score: 0,
  lives: 3,
  time: 0,
  pAcc: 0,
  gAcc: 0,
};

function ghostMs() {
  return Math.max(120, 240 - (state.level - 1) * 15);
}

function frightMs() {
  return Math.max(2500, 7000 - state.level * 500);
}

function startLevel() {
  const { grid, start } = generateMap();
  const { pellets, count } = createPellets(grid, start);
  state.grid = grid;
  state.start = start;
  state.pellets = pellets;
  state.left = count;
  state.player = createPlayer(start.x, start.y);
  state.ghosts = spawnGhosts(grid, state.player, state.level);
  state.fright = 0;
  state.phase = "chase";
  state.phaseTimer = 6000;
  state.ready = 1800;
  state.over = false;
  state.paused = false;
  state.pAcc = 0;
  state.gAcc = 0;
}

function newGame() {
  state.level = 1;
  state.score = 0;
  state.lives = 3;
  startLevel();
}

function resetPositions() {
  state.player.x = state.start.x;
  state.player.y = state.start.y;
  state.player.dir = [0, 0];
  state.player.next = [0, 0];
  resetGhosts(state.ghosts);
  state.fright = 0;
  state.ready = 1500;
  state.pAcc = 0;
  state.gAcc = 0;
}

function eatPellet() {
  const { x, y } = state.player;
  const v = state.pellets[y][x];
  if (v === 0) return false;
  state.pellets[y][x] = 0;
  state.left--;
  if (v === 1) state.score += 10;
  if (v === 2) {
    state.score += 50;
    state.fright = frightMs();
  }
  if (state.left === 0) {
    state.level++;
    startLevel();
    return true;
  }
  return false;
}

function checkCollisions() {
  for (const g of state.ghosts) {
    if (g.delay > 0) continue;
    if (g.x !== state.player.x || g.y !== state.player.y) continue;
    if (state.fright > 0) {
      state.score += 200;
      g.x = g.homeX;
      g.y = g.homeY;
      g.delay = 3000;
      g.last = [0, 0];
    } else {
      state.lives--;
      if (state.lives <= 0) state.over = true;
      else resetPositions();
      return true;
    }
  }
  return false;
}

function update(dt) {
  if (state.over || state.paused) return;
  if (state.ready > 0) {
    state.ready -= dt;
    return;
  }

  state.phaseTimer -= dt;
  if (state.phaseTimer <= 0) {
    if (state.phase === "chase") {
      state.phase = "scatter";
      state.phaseTimer = 5000;
    } else {
      state.phase = "chase";
      state.phaseTimer = 7000;
    }
  }

  if (state.fright > 0) state.fright -= dt;
  for (const g of state.ghosts) if (g.delay > 0) g.delay -= dt;

  state.pAcc += dt;
  if (state.pAcc >= PLAYER_MS) {
    state.pAcc -= PLAYER_MS;
    stepPlayer(state.player, state.grid);
    if (eatPellet()) return;
    if (checkCollisions()) return;
  }

  state.gAcc += dt;
  if (state.gAcc >= ghostMs()) {
    state.gAcc -= ghostMs();
    moveGhosts(state);
    checkCollisions();
  }
}

const KEYS = {
  ArrowUp: [0, -1], w: [0, -1],
  ArrowDown: [0, 1], s: [0, 1],
  ArrowLeft: [-1, 0], a: [-1, 0],
  ArrowRight: [1, 0], d: [1, 0],
};

addEventListener("keydown", (e) => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  if (k === "r") return newGame();
  if (k === "p") {
    if (!state.over) state.paused = !state.paused;
    return;
  }

  const dir = KEYS[k];
  if (!dir) return;
  e.preventDefault();
  state.player.next = dir;
});

let last = performance.now();
function frame(now) {
  const dt = Math.min(now - last, 50);
  last = now;
  state.time = now;
  update(dt);
  render(state);
  requestAnimationFrame(frame);
}

newGame();
requestAnimationFrame(frame);