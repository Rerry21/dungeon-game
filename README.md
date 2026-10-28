# Dungeon Game

A real-time, Pac-Man-inspired maze game built with plain HTML, CSS and JavaScript on the Canvas API. Every level is a freshly generated cave maze with loops, so you can always run circles around the ghosts.

## Features

- Randomly generated maps with loops and no dead-end traps
- Continuous movement with buffered turns
- Four ghosts with different behaviors: a hunter, an ambusher and two wanderers
- Chase and wander phases so you get breathing room
- Power pellets that turn ghosts blue so you can eat them
- Lives, score, levels and rising difficulty
- Pause and restart
- No dependencies, no build step

## Getting started

### 1. Clone the repo

```
git clone https://github.com/YOUR-USERNAME/dungeon-game.git
cd dungeon-game
```

### 2. Start a local server

The game uses JavaScript modules, which browsers block when you open `index.html` directly by double-clicking it. It has to be served over http. Pick whichever option you have:

**VS Code + Live Server**

1. Install the Live Server extension.
2. Right-click `index.html` and choose **Open with Live Server**.

**Node.js**

```
npx serve .
```

**Python**

```
python -m http.server 5500
```

### 3. Open the game

Go to the address your server prints, for example `http://localhost:5500`.

No `npm install` is needed, because the project has no dependencies.

## Controls

| Key | Action |
| --- | --- |
| Arrow keys / WASD | Steer |
| P | Pause / resume |
| R | Restart |

## How to play

- Eat every dot to clear the level. Each dot is worth 10 points.
- Big pulsing dots are worth 50 points and make the ghosts vulnerable for a few seconds.
- Touching a blue ghost earns 200 points and sends it back to its start.
- Touching a normal ghost costs a life. You have 3 lives.
- Each new level has faster ghosts and shorter power-ups.

## Project structure

```
dungeon-game/
├── index.html
├── style.css
├── README.md
├── assets/
└── src/
    ├── main.js
    ├── map.js
    ├── player.js
    ├── enemy.js
    └── render.js
```

| File | Responsibility |
| --- | --- |
| `main.js` | Game state, game loop, input, scoring, lives |
| `map.js` | Random map generation, loops, pellet placement |
| `player.js` | Player movement and buffered turning |
| `enemy.js` | Ghost spawning, pathfinding (BFS) and behaviors |
| `render.js` | All canvas drawing |

Game state and drawing are kept separate: the logic files only change data, and `render.js` only reads it.

## Tuning difficulty

| Setting | Location | Effect |
| --- | --- | --- |
| `PLAYER_MS` | `main.js` | Lower is a faster player |
| `ghostMs()` | `main.js` | Higher is slower ghosts |
| `frightMs()` | `main.js` | Length of the power-up |
| `chance` | `chaseStep` in `enemy.js` | How often ghosts take the shortest path |
| Phase timers | `update()` in `main.js` | Chase and wander durations |

## Troubleshooting

- **Blank black canvas:** you probably opened `index.html` directly. Use one of the server options above.
- **Arrow keys scroll the page or do nothing:** click on the page once to give it focus.
- **Nothing happens after a code change:** hard refresh with Ctrl+Shift+R.

## Ideas for later

- Saved high scores
- Sound effects
- Bonus fruit
- Rooms-and-corridors map generation (BSP)
- Touch controls for phones

## License

MIT
