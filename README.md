[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/dekakz/best-spot-the-difference-game-01-kuzu-deka/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/dekakz/best-spot-the-difference-game-01-kuzu-deka/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Mirror Cove — Spot the Difference

A complete, original spot-the-difference game that plays offline in a desktop
browser from its own static files. Two near-identical pictures side by side,
rings on the differences you find, several still unfound, and a counter of how
many remain — across 5 hand-drawn scenes that get harder as you go.

## How to play

Open `game/index.html` in a desktop browser (or serve `game/` with any static
server). Click a difference on either panel — or move the crosshair with the
arrow keys and press Enter. Each find scores 100 points plus a streak bonus;
a wrong click costs 25 points. Three hints per scene (H), pause (P), mute (M).

## Scenes

1. **Harbor at Dawn** — 7 differences, par 1:30
2. **Lantern Night Market** — 7 differences, par 1:45
3. **Winter Cabin** — 8 differences, par 2:00
4. **Coral Reef** — 8 differences, par 2:15
5. **Desert Observatory** — 9 differences, par 2:30

Every scene is drawn procedurally on canvas from a fixed seed, so the two
panels are pixel-identical except for the differences themselves. Sounds are
synthesized with WebAudio — no audio files, no network requests, nothing
leaves the `game/` folder.

## Structure

- `game/index.html` — page shell, HUD, footer
- `game/src/main.js` — boot, state machine, input, rendering
- `game/src/scenes.js` — the 5 scenes: base picture + difference list
- `game/src/draw.js` — shared canvas drawing helpers
- `game/src/rng.js` — seeded random numbers
- `game/src/audio.js` — synthesized sound effects (WebAudio)
- `game/src/hud.js` — timer, score, hints, overlays
- `game/src/shots.js` — screenshot staging via `?shot=`
- `main.ts` — hands the game in: copies `game/` + `screenshots/` to `/output`
  and writes `dossier.json` with the vendored make.fun library

## Screenshots

`1-play.jpg` is the cover: scene 2 mid-hunt, 3 differences ringed, 4 still to
find. The rest show the start, a finished scene, and scene 4 mid-hunt. All
four are real renders of this code in a desktop browser.

Built for the make.fun bounty "Make the best spot the difference game".
