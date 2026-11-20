import React from 'react';
import { GameScreenProps } from './breakGameTypes';
import { BlockStackerGame } from './BlockStackerGame';
import { BubbleWrapGame } from './BubbleWrapGame';
import { TargetTapGame } from './TargetTapGame';
import { MarbleMazeGame } from './MarbleMazeGame';
import { WordUnscrambleGame } from './WordUnscrambleGame';
import { WordSearchGame } from './WordSearchGame';
import { TriviaBlitzGame } from './TriviaBlitzGame';
import { EmojiPlotterGame } from './EmojiPlotterGame';
import { SlidingPuzzleGame } from './SlidingPuzzleGame';
import { MemoryMatchGame } from './MemoryMatchGame';
import { MiniSudokuGame } from './MiniSudokuGame';
import { SimonSaysGame } from './SimonSaysGame';

interface BreakGameRouterProps extends GameScreenProps {
  selectedGameId: string | null;
}

export const BreakGameRouter: React.FC<BreakGameRouterProps> = ({ selectedGameId, ...props }) => {
  switch (selectedGameId) {
    case 'stacker': return <BlockStackerGame {...props} />;
    case 'bubble': return <BubbleWrapGame {...props} />;
    case 'target': return <TargetTapGame {...props} />;
    case 'maze': return <MarbleMazeGame {...props} />;
    case 'unscramble': return <WordUnscrambleGame {...props} />;
    case 'wordsearch': return <WordSearchGame {...props} />;
    case 'trivia': return <TriviaBlitzGame {...props} />;
    case 'emoji': return <EmojiPlotterGame {...props} />;
    case 'sliding': return <SlidingPuzzleGame {...props} />;
    case 'memory': return <MemoryMatchGame {...props} />;
    case 'sudoku': return <MiniSudokuGame {...props} />;
    case 'simon': return <SimonSaysGame {...props} />;
    default: return null;
  }
};
