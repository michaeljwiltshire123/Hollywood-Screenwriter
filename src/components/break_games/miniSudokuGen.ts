export type SudokuSize = 4 | 6 | 9;
export type SudokuDifficulty = 'Easy' | 'Medium' | 'Hard';

export const SUDOKU_MODES: Record<SudokuDifficulty, { size: SudokuSize; time: number; clues: number }> = {
  Easy: { size: 4, time: 120, clues: 7 },
  Medium: { size: 6, time: 180, clues: 15 },
  Hard: { size: 9, time: 300, clues: 34 },
};

const BOX_DIMS: Record<SudokuSize, [number, number]> = { 4: [2, 2], 6: [2, 3], 9: [3, 3] };

export interface SudokuPuzzle {
  size: SudokuSize;
  boxR: number;
  boxC: number;
  board: number[][];
  fixed: boolean[][];
  solution: number[][];
}

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

export function hasConflict(board: number[][], r: number, c: number, boxR: number, boxC: number): boolean {
  const val = board[r][c], n = board.length;
  if (!val) return false;
  for (let i = 0; i < n; i++) {
    if ((i !== c && board[r][i] === val) || (i !== r && board[i][c] === val)) return true;
  }
  const br = Math.floor(r / boxR) * boxR, bc = Math.floor(c / boxC) * boxC;
  for (let rr = br; rr < br + boxR; rr++) {
    for (let cc = bc; cc < bc + boxC; cc++) {
      if ((rr !== r || cc !== c) && board[rr][cc] === val) return true;
    }
  }
  return false;
}

function countSolutions(board: number[][], boxR: number, boxC: number, limit = 2): number {
  const n = board.length;
  let bestR = -1, bestC = -1, bestCands: number[] | null = null;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] !== 0) continue;
      const cands: number[] = [];
      for (let d = 1; d <= n; d++) {
        board[r][c] = d;
        if (!hasConflict(board, r, c, boxR, boxC)) cands.push(d);
      }
      board[r][c] = 0;
      if (cands.length === 0) return 0;
      if (!bestCands || cands.length < bestCands.length) {
        bestR = r; bestC = c; bestCands = cands;
        if (cands.length === 1) break;
      }
    }
    if (bestCands?.length === 1) break;
  }
  if (!bestCands) return 1;
  let total = 0;
  for (const d of bestCands) {
    board[bestR][bestC] = d;
    total += countSolutions(board, boxR, boxC, limit - total);
    board[bestR][bestC] = 0;
    if (total >= limit) return total;
  }
  return total;
}

export function generateSudoku(diff: SudokuDifficulty): SudokuPuzzle {
  const { size, clues: targetClues } = SUDOKU_MODES[diff];
  const [boxR, boxC] = BOX_DIMS[size];
  const digits = shuffle(Array.from({ length: size }, (_, i) => i + 1));
  const rowBands = shuffle(Array.from({ length: size / boxR }, (_, b) => shuffle(Array.from({ length: boxR }, (_, i) => b * boxR + i)))).flat();
  const colStacks = shuffle(Array.from({ length: size / boxC }, (_, s) => shuffle(Array.from({ length: boxC }, (_, i) => s * boxC + i)))).flat();

  let grid = rowBands.map((r) => colStacks.map((c) => digits[((r % boxR) * boxC + Math.floor(r / boxR) + c) % size]));
  if (boxR === boxC && Math.random() < 0.5) grid = grid[0].map((_, c) => grid.map((r) => r[c]));

  const solution = grid.map((r) => [...r]);
  const board = grid.map((r) => [...r]);
  let clues = size * size;
  for (const idx of shuffle(Array.from({ length: clues }, (_, i) => i))) {
    if (clues <= targetClues) break;
    const r = Math.floor(idx / size), c = idx % size, backup = board[r][c];
    board[r][c] = 0;
    if (countSolutions(board, boxR, boxC, 2) === 1) clues--;
    else board[r][c] = backup;
  }
  return { size, boxR, boxC, board, fixed: board.map((row) => row.map((v) => v !== 0)), solution };
}
