import { BreakCategory } from './breakGameTypes';

export interface GameDef {
  id: string;
  title: string;
  desc: string;
  category: BreakCategory;
  duration: string;
}

export const GAMES_LIST: GameDef[] = [
  { id: 'stacker', title: 'Block Stacker', desc: 'Stack moving blocks before time runs out.', category: 'Arcade', duration: '3 Min' },
  { id: 'bubble', title: 'Bubble Wrap Pop', desc: 'Pop 30 bubbles with fun sound effects.', category: 'Arcade', duration: '1 Min' },
  { id: 'target', title: 'Target Tap Blitz', desc: 'Tap targets for points; avoid red decoys.', category: 'Arcade', duration: '1 Min' },
  { id: 'maze', title: 'Marble Tilt Maze', desc: 'Navigate sliding physics through mazes.', category: 'Arcade', duration: '2 Min' },
  { id: 'unscramble', title: 'Word Unscramble', desc: 'Unscramble jumbled screenwriting & film terms before time runs out.', category: 'Word and Trivia', duration: '3 Min' },
  { id: 'wordsearch', title: 'Film Term Word Search', desc: 'Drag across the letter grid to find hidden screenwriting terms.', category: 'Word and Trivia', duration: '2 Min' },
  { id: 'trivia', title: 'Trivia Blitz', desc: '4 cinema trivia multiple-choice questions.', category: 'Word and Trivia', duration: '2 Min' },
  { id: 'emoji', title: 'Emoji Plotter', desc: 'Guess famous films and TV shows from emoji clues.', category: 'Word and Trivia', duration: '2 Min' },
  { id: 'sliding', title: 'Sliding 3x3 Puzzle', desc: 'Slide 8 poster art fragments into place.', category: 'Logic and Puzzle', duration: '3 Min' },
  { id: 'memory', title: '12-Card Memory Match', desc: 'Pair 6 matching cinema card sets.', category: 'Logic and Puzzle', duration: '1 Min' },
  { id: 'sudoku', title: 'Sudoku Challenge', desc: 'Solve 4x4 Easy, 6x6 Medium, or 9x9 Hard grids.', category: 'Logic and Puzzle', duration: '2-5 Min' },
  { id: 'simon', title: 'Pattern Simon Says', desc: 'Memorise and repeat tone sequences.', category: 'Logic and Puzzle', duration: '2 Min' },
];
