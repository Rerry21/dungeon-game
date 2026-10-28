# Dungeon Game

A real-time, Pac-Man-inspired maze game built with plain HTML, CSS and JavaScript on the Canvas API. Every level is a freshly generated cave maze with loops, so you can always run circles around the ghosts.

**Play online:** https://YOUR-USERNAME.github.io/dungeon-game/

## Features

- Randomly generated maps with loops and no dead-end traps
- Continuous movement with buffered turns
- Four ghosts with different behaviors: a hunter, an ambusher and two wanderers
- Chase and wander phases so you get breathing room
- Power pellets that turn ghosts blue so you can eat them
- Lives, score, levels and rising difficulty
- Pause and restart
- No dependencies, no build step

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

## Run locally

The game uses JavaScript modules, which browsers block on
