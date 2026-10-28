import { isWalkable } from "./map.js";

export function createPlayer(x, y) {
  return { x, y, dir: [0, 0], next: [0, 0], face: 0 };
}

function angleOf(dir) {
  if (dir[0] === 1) return 0;
  if (dir[0] === -1) return Math.PI;
  if (dir[1] === 1) return Math.PI / 2;
  return Math.PI * 1.5;
}

export function stepPlayer(player, grid) {
  const [nx, ny] = player.next;
  if ((nx !== 0 || ny !== 0) && isWalkable(grid, player.x + nx, player.y + ny)) {
    player.dir = [nx, ny];
  }
  const [dx, dy] = player.dir;
  if ((dx !== 0 || dy !== 0) && isWalkable(grid, player.x + dx, player.y + dy)) {
    player.x += dx;
    player.y += dy;
    player.face = angleOf(player.dir);
    return true;
  }
  return false;
}