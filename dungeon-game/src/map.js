export const TILE = 32;
export const COLS = 25;
export const ROWS = 18;
export const FLOOR = 0;
export const WALL = 1;

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function isWalkable(grid, x, y) {
  return grid[y]?.[x] === FLOOR;
}

function inside(x, y) {
  return x >= 1 && x < COLS - 1 && y >= 1 && y < ROWS - 1;
}

function floorNeighbors(grid, x, y) {
  return DIRS.filter(([dx, dy]) => isWalkable(grid, x + dx, y + dy)).length;
}

function addLoops(grid) {
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      if (grid[y][x] !== WALL) continue;
      const h = isWalkable(grid, x - 1, y) && isWalkable(grid, x + 1, y);
      const v = isWalkable(grid, x, y - 1) && isWalkable(grid, x, y + 1);
      if ((h || v) && Math.random() < 0.35) grid[y][x] = FLOOR;
    }
  }
}

function connectDeadEnds(grid) {
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        if (grid[y][x] !== FLOOR || floorNeighbors(grid, x, y) !== 1) continue;
        const order = [...DIRS].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of order) {
          const mx = x + dx;
          const my = y + dy;
          if (!inside(mx, my) || grid[my][mx] !== WALL) continue;
          if (isWalkable(grid, x + dx * 2, y + dy * 2)) {
            grid[my][mx] = FLOOR;
            break;
          }
        }
      }
    }
  }
}

export function generateMap() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(WALL));

  let x = Math.floor(COLS / 2);
  let y = Math.floor(ROWS / 2);
  const start = { x, y };

  const target = Math.floor(COLS * ROWS * 0.4);
  let carved = 0;

  while (carved < target) {
    if (grid[y][x] === WALL) {
      grid[y][x] = FLOOR;
      carved++;
    }
    const [dx, dy] = DIRS[Math.floor(Math.random() * DIRS.length)];
    const nx = x + dx;
    const ny = y + dy;
    if (inside(nx, ny)) {
      x = nx;
      y = ny;
    }
  }

  addLoops(grid);
  connectDeadEnds(grid);

  return { grid, start };
}

export function createPellets(grid, start) {
  const pellets = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const far = [];
  let count = 0;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] !== FLOOR) continue;
      if (x === start.x && y === start.y) continue;
      pellets[y][x] = 1;
      count++;
      if (Math.abs(x - start.x) + Math.abs(y - start.y) >= 8) far.push({ x, y });
    }
  }

  far.sort(() => Math.random() - 0.5);
  for (const spot of far.slice(0, 4)) pellets[spot.y][spot.x] = 2;

  return { pellets, count };
}