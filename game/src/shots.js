// Screenshot staging: the maker drives the game to a chosen state with a URL
// query (?shot=start|play|end&seed=N), exactly like the kit's starter. The
// screenshots the entry hands in are real renders of this code in a browser:
//   start — scene 1 untouched, 0 found, full timer
//   play  — scene 2 mid-hunt: 3 differences ringed, 4 still to find, timer half
//   end   — scene 1 finished: every difference ringed, "Scene complete!" card
//   reef  — scene 4 mid-hunt: 2 found, 6 to find, a different scene on show
// Seed picks the scene and the found set deterministically; nothing here runs
// in normal play (no query means the title screen).
export function parseShot() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  const seed = parseInt(q.get('seed') || '1', 10) || 1;
  return { shot, seed };
}

// Which differences are already found for a staged mid-hunt shot.
export function stagedFound(scene, shot) {
  if (shot === 'play') return scene.diffs.slice(0, 3).map((d) => d.id);
  if (shot === 'reef') return scene.diffs.slice(0, 2).map((d) => d.id);
  if (shot === 'end') return scene.diffs.map((d) => d.id);
  return [];
}

export function stagedSceneIndex(shot) {
  if (shot === 'play') return 1;
  if (shot === 'reef') return 3;
  return 0;
}

export function stagedTimeLeft(scene, shot) {
  if (shot === 'play') return Math.floor(scene.par / 2);
  if (shot === 'reef') return Math.floor(scene.par * 0.6);
  if (shot === 'end') return 42;
  return scene.par;
}
