import React from 'react';
import { ModalThemeStyles } from '../../lib/modalTheme';
import { SudokuPuzzle, hasConflict } from './miniSudokuGen';

interface SudokuBoardGridProps {
  puzzle: SudokuPuzzle;
  sel: [number, number] | null;
  onSelect: (pos: [number, number]) => void;
  mt: ModalThemeStyles;
}

export const SudokuBoardGrid: React.FC<SudokuBoardGridProps> = ({ puzzle, sel, onSelect, mt }) => {
  const { size, boxR, boxC, board, fixed } = puzzle;
  const boxesPerRow = size / boxC;
  const boxRowsCount = size / boxR;
  const selVal = sel ? board[sel[0]][sel[1]] : 0;
  const outerCols = size === 9 ? 'grid-cols-3' : 'grid-cols-2';
  const innerCols = size === 4 ? 'grid-cols-2' : 'grid-cols-3';
  const cellCls = size === 4 ? 'w-14 h-14 text-xl' : size === 6 ? 'w-11 h-11 text-base' : 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base';

  return (
    <div className={`grid ${outerCols} gap-1.5 sm:gap-2 p-2 rounded-xl border`} style={mt.subCardStyle}>
      {Array.from({ length: boxRowsCount * boxesPerRow }, (_, boxIdx) => {
        const br = Math.floor(boxIdx / boxesPerRow) * boxR;
        const bc = (boxIdx % boxesPerRow) * boxC;
        return (
          <div key={boxIdx} className={`grid ${innerCols} gap-1 p-1 rounded-lg border`} style={mt.borderStyle}>
            {Array.from({ length: size }, (_, i) => {
              const r = br + Math.floor(i / boxC), c = bc + (i % boxC), val = board[r][c];
              const isSel = sel?.[0] === r && sel?.[1] === c;
              const bad = hasConflict(board, r, c, boxR, boxC);
              const isPeer = sel && (sel[0] === r || sel[1] === c || (selVal > 0 && val === selVal));
              return (
                <button key={`${r}-${c}`} type="button" onClick={() => onSelect([r, c])}
                  className={`${cellCls} rounded-md border flex items-center justify-center cursor-pointer transition ${fixed[r][c] ? 'font-black' : 'font-bold'} ${bad ? 'border-rose-500 text-rose-500' : ''} ${isPeer && !isSel ? 'ring-1 ring-inset opacity-95' : ''}`}
                  style={isSel ? mt.primaryBtnStyle : fixed[r][c] ? mt.subCardStyle : mt.inputStyle}
                >{val || ''}</button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
