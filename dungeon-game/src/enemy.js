import { COLS, ROWS, FLOOR, isWalkable } from "./map.js";

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const KINDS = [
  { kind: "hunter", color: "#ff3b3b" },
  { kind: "ambusher", color: "#ff9bd2" },
  { kind: "wanderer", color: "#3be0e0" },
  { kind: "wanderer", color: "#ffa43b" },
];

export function spawnGhosts(grid, player, level) {
  const count = Math.min(4, 2 + level);
  const spots = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const far = Math.abs(x - player.x) + Math.abs(y - player.y) >= 8;
      if (grid[y][x] === FLOOR && far) spots.push({ x, y });
    }
  }
  const ghosts = [];
  for (let i = 0; i < count && spots.length; i++) {
    const idx = Math.floor(Math.random() * spots.length);
    const [spot] = spots.splice(idx, 1);
    ghosts.push({
      x: spot.x,
      y: spot.y,
      homeX: spot.x,
      homeY: spot.y,
      kind: KINDS[i].kind,
      color: KINDS[i].color,
      delay: 2500 + i * 2000,
      last: [0, 0],
      slow: false,
    });
  }
  return ghosts;
}

export function resetGhosts(ghosts) {
  ghosts.forEach((g, i) => {
    g.x = g.homeX;
    g.y = g.homeY;
    g.delay = 1500 + i * 1500;
    g.last = [0, 0];
  });
}

function bfsNext(grid, from, to) {
  const key = (x, y) => y * COLS + x;
  const prev = new Map([[key(from.x, from.y), null]]);
  const queue = [{ x: from.x, y: from.y }];

  while (queue.length) {
    const cur = queue.shift();
    if (cur.x === to.x && cur.y === to.y) {
      let node = cur;
      let parent = prev.get(key(node.x, node.y));
      while (parent && prev.get(key(parent.x, parent.y)) !== null) {
        node = parent;
        parent = prev.get(key(node.x, node.y));
      }
      return parent ? node : null;
    }
    for (const [dx, dy] of DIRS) {
      const nx = cur.x + dx;
      const ny = cur.y + dy;
      if (!isWalkable(grid, nx, ny) || prev.has(key(nx, ny))) continue;
      prev.set(key(nx, ny), cur);
      queue.push({ x: nx, y: ny });
    }
  }
  return null;
}

function options(grid, g) {
  return DIRS
    .map((d) => ({ x: g.x + d[0], y: g.y + d[1], d }))
    .filter((o) => isWalkable(grid, o.x, o.y));
}

function randomStep(grid, g) {
  const all = options(grid, g);
  const forward = all.filter((o) => !(o.d[0] === -g.last[0] && o.d[1] === -g.last[1]));
  const pool = forward.length ? forward : all;
  return pool[Math.floor(Math.random() * pool.length)] || null;
}

function fleeStep(grid, g, player) {
  if (Math.random() < 0.3) return randomStep(grid, g);
  const all = options(grid, g);
  all.sort(
    (a, b) =>
      Math.abs(b.x - player.x) + Math.abs(b.y - player.y) -
      (Math.abs(a.x - player.x) + Math.abs(a.y - player.y))
  );
  return all[0] || null;
}

function aheadOf(grid, player) {
  let x = player.x;
  let y = player.y;
  for (let i = 0; i < 3; i++) {
    const nx = x + player.dir[0];
    const ny = y + player.dir[1];
    if (!isWalkable(grid, nx, ny)) break;
    x = nx;
    y = ny;
  }
  return { x, y };
}

function chaseStep(state, g) {
  const { grid, player } = state;
  let target = player;
  let chance = 0.8;

  if (g.kind === "ambusher") {
    const ahead = aheadOf(grid, player);
    if (ahead.x !== g.x || ahead.y !== g.y) target = ahead;
  }
  if (g.kind === "wanderer") chance = 0.4;

  if (Math.random() < chance) {
    return bfsNext(grid, g, target) || randomStep(grid, g);
  }
  return randomStep(grid, g);
}

function stepGhost(state, g) {
  let next = null;

  if (state.fright > 0) {
    if (g.slow) {
      g.slow = false;
      return;
    }
    g.slow = true;
    next = fleeStep(state.grid, g, state.player);
  } else if (state.phase === "scatter") {
    next = randomStep(state.grid, g);
  } else {
    next = chaseStep(state, g);
  }

  if (next) {
    g.last = [next.x - g.x, next.y - g.y];
    g.x = next.x;
    g.y = next.y;
  }
}

export function moveGhosts(state) {
  for (const g of state.ghosts) {
    if (g.delay > 0) continue;
    stepGhost(state, g);
  }
}