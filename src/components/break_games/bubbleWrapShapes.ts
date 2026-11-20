export type BubbleShape = 'Square' | 'Circle' | 'Diamond' | 'Heart';

export const BUBBLE_LEVELS: BubbleShape[] = ['Square', 'Circle', 'Diamond', 'Heart'];
export const SHEET_W = 360;
export const SHEET_H = 290;

export interface BubbleNode {
  x: number;
  y: number;
  r: number;
  popped: boolean;
  popTime: number;
}

export interface PopFx {
  x: number;
  y: number;
  r: number;
  text: string;
  startTime: number;
}

const makeNode = (x: number, y: number, r: number): BubbleNode => ({
  x, y, r, popped: false, popTime: 0,
});

export function buildBubbleSheet(shape: BubbleShape): BubbleNode[] {
  const cx = SHEET_W / 2;
  const cy = SHEET_H / 2;
  const nodes: BubbleNode[] = [];

  if (shape === 'Square') {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 6; col++) {
        nodes.push(makeNode(50 + col * 52, 45 + row * 50, 21));
      }
    }
    return nodes;
  }

  if (shape === 'Circle') {
    nodes.push(makeNode(cx, cy, 16));
    const rings = [
      { count: 6, rad: 40, offset: 0 },
      { count: 11, rad: 78, offset: 0.15 },
      { count: 12, rad: 115, offset: 0 },
    ];
    rings.forEach(({ count, rad, offset }) => {
      for (let i = 0; i < count; i++) {
        const a = (i * Math.PI * 2) / count + offset;
        nodes.push(makeNode(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 15.5));
      }
    });
    return nodes;
  }

  if (shape === 'Diamond') {
    const counts = [1, 3, 5, 6, 6, 5, 3, 1];
    counts.forEach((n, row) => {
      const y = cy + (row - 3.5) * 32;
      for (let i = 0; i < n; i++) {
        const x = cx + (i - (n - 1) / 2) * 40;
        nodes.push(makeNode(x, y, 14.5));
      }
    });
    return nodes;
  }

  const heartRows: number[][] = [
    [-2.2, -1.2, 1.2, 2.2],
    [-2.8, -1.8, -0.8, 0.8, 1.8, 2.8],
    [-3, -2, -1, 0, 1, 2, 3],
    [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5],
    [-1.5, -0.5, 0.5, 1.5],
    [-0.5, 0.5],
    [0],
  ];
  heartRows.forEach((cols, row) => {
    const y = cy + (row - 3) * 36;
    cols.forEach((col) => nodes.push(makeNode(cx + col * 42, y, 15.5)));
  });
  return nodes;
}
