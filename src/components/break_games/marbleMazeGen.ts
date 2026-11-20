export interface MazeLevel {
  grid: number[][];
  start: { r: number; c: number };
  goal: { r: number; c: number };
}

export function slidePos(grid: number[][], r: number, c: number, dr: number, dc: number, goal?: { r: number; c: number }) {
  let nr = r, nc = c;
  while (grid[nr + dr]?.[nc + dc] === 0) {
    nr += dr;
    nc += dc;
    if (goal && nr === goal.r && nc === goal.c) return { r: nr, c: nc };
  }
  return { r: nr, c: nc };
}

function minSlides(grid: number[][], start: { r: number; c: number }, goal: { r: number; c: number }): number {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const q: { r: number; c: number; d: number }[] = [{ ...start, d: 0 }];
  const seen = new Set<string>([`${start.r},${start.c}`]);
  while (q.length > 0) {
    const cur = q.shift()!;
    if (cur.r === goal.r && cur.c === goal.c) return cur.d;
    for (const [dr, dc] of dirs) {
      const nxt = slidePos(grid, cur.r, cur.c, dr, dc, goal);
      const key = `${nxt.r},${nxt.c}`;
      if (!seen.has(key)) {
        seen.add(key);
        q.push({ r: nxt.r, c: nxt.c, d: cur.d + 1 });
      }
    }
  }
  return -1;
}

export function generateSlideMaze(size = 9): MazeLevel {
  for (let attempt = 0; attempt < 150; attempt++) {
    const grid = Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (__, c) => (r === 0 || c === 0 || r === size - 1 || c === size - 1 ? 1 : Math.random() < 0.24 ? 1 : 0))
    );
    const start = { r: 1, c: 1 };
    const goal = { r: size - 2, c: size - 2 };
    grid[start.r][start.c] = 0;
    grid[goal.r][goal.c] = 0;
    const steps = minSlides(grid, start, goal);
    if (steps >= 5 && steps <= 16) return { grid, start, goal };
  }
  return {
    grid: [
      [1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,1],
      [1,0,1,0,0,0,1,0,1],
      [1,0,0,0,1,0,0,0,1],
      [1,1,0,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,1],
      [1,0,1,1,0,1,0,0,1],
      [1,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,1,1],
    ],
    start: { r: 1, c: 1 },
    goal: { r: 7, c: 7 },
  };
}
