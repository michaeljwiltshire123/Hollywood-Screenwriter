import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Layers,
  FileText,
  BarChart3,
  Search,
  Brain,
  Grid,
  Clock,
  Zap,
  HelpCircle,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface BreakGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetBackToWork?: () => void;
  playedGames: string[];
  onGameCompleted: (gameId: string) => void;
}

const ALL_GAMES = [
  { id: 'pairs', name: 'Find the Pairs', desc: 'Match screenwriting terms with their definitions.', icon: Layers, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'emoji', name: 'Emoji Plotter', desc: 'Guess the iconic screenplay plot from emojis.', icon: Sparkles, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'scramble', name: 'Word Scramble', desc: 'Unscramble industry production terms with hints.', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'trivia', name: 'Script Trivia', desc: 'Test your Hollywood lore and formatting specs.', icon: Brain, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'sudoku', name: '9x9 Mini Sudoku', desc: 'Solve a 9x9 logic puzzle with Writer\'s Block Nuke.', icon: BarChart3, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'wordsearch', name: 'Word Search', desc: 'Two-tap letter search for ACT, SCENE, CUT, PLOT.', icon: Search, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
];

export const BreakGameModal: React.FC<BreakGameModalProps> = ({
  isOpen,
  onClose,
  onGetBackToWork,
  playedGames,
  onGameCompleted,
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  // Popcorn Meter Points
  const [popcornPoints, setPopcornPoints] = useState<number>(0);

  // 5-Minute Time Cap (300 Seconds)
  const [breakSecondsRemaining, setBreakSecondsRemaining] = useState<number>(300);

  // In-Modal Toast Banner State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Timer Effect when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setBreakSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Reset function
  const handleResetModal = () => {
    setActiveGameId(null);
    setGameState('playing');
    setBreakSecondsRemaining(300);
    setPopcornPoints(0);
    setToast(null);
  };

  const handleReturnToWork = () => {
    handleResetModal();
    if (onGetBackToWork) {
      onGetBackToWork();
    } else {
      onClose();
    }
  };

  // 1. Pairs State
  const [pairsCards, setPairsCards] = useState(() =>
    [
      { id: 1, text: 'SCENE', match: 'Heading', flipped: false, matched: false },
      { id: 2, text: 'Heading', match: 'SCENE', flipped: false, matched: false },
      { id: 3, text: 'CHARACTER', match: 'Name', flipped: false, matched: false },
      { id: 4, text: 'Name', match: 'CHARACTER', flipped: false, matched: false },
      { id: 5, text: 'ACTION', match: 'Visual', flipped: false, matched: false },
      { id: 6, text: 'Visual', match: 'ACTION', flipped: false, matched: false },
    ].sort(() => Math.random() - 0.5)
  );
  const [firstSelectedCard, setFirstSelectedCard] = useState<number | null>(null);

  // 2. Emoji Plotter State
  const emojiQuestionsData = useMemo(
    () => [
      { emojis: '🚢 🧊 🌊 💔', correct: 'Titanic', options: ['Jaws', 'Titanic', 'Avatar', 'Cast Away'].sort(() => Math.random() - 0.5) },
      { emojis: '🦈 🏖️ 😱 ⛵', correct: 'Jaws', options: ['Jaws', 'Aquaman', 'Finding Nemo', 'Moana'].sort(() => Math.random() - 0.5) },
      { emojis: '🪐 👨‍🚀 ⏳ 📚', correct: 'Interstellar', options: ['Interstellar', 'Star Wars', 'Gravity', 'Alien'].sort(() => Math.random() - 0.5) },
      { emojis: '🦖 🌴 ⚡ 🚙', correct: 'Jurassic Park', options: ['Jurassic Park', 'King Kong', 'Avatar', 'Godzilla'].sort(() => Math.random() - 0.5) },
    ],
    []
  );
  const [emojiIndex, setEmojiIndex] = useState(0);

  // 3. Word Scramble State
  const scrambleItems = useMemo(
    () => [
      { word: 'SCREENPLAY', hint: 'EXT. HOLLYWOOD BLVD - DAY. He holds the finished ________.' },
      { word: 'DIRECTOR', hint: 'INT. SOUNDSTAGE - DAY. The ________ shouts ACTION!' },
      { word: 'STORYBOARD', hint: 'INT. WRITER ROOM - NIGHT. The walls are covered in ________ panels.' },
      { word: 'DIALOGUE', hint: 'CHARACTER: These lines of ________ are golden.' },
      { word: 'MONTAGE', hint: 'A fast-paced sequence showing training in a ________.' },
    ],
    []
  );
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userScrambleGuess, setUserScrambleGuess] = useState('');
  const [showScrambleHint, setShowScrambleHint] = useState(false);

  // Shuffle word helper
  const shuffleWordLetters = (w: string) => {
    let arr = w.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join(' ');
  };

  useEffect(() => {
    if (scrambleItems[scrambleIdx]) {
      setScrambledWord(shuffleWordLetters(scrambleItems[scrambleIdx].word));
      setUserScrambleGuess('');
      setShowScrambleHint(false);
    }
  }, [scrambleIdx, scrambleItems]);

  // 4. Script Trivia State
  const triviaQuestions = useMemo(
    () => [
      {
        q: 'What font is universally required for standard screenplays?',
        correct: 'Courier 12pt',
        options: ['Courier 12pt', 'Arial 12pt', 'Comic Sans', 'Times New Roman'].sort(() => Math.random() - 0.5),
      },
      {
        q: 'In screenplay formatting, which element is typed in ALL CAPS?',
        correct: 'Character Names',
        options: ['Character Names', 'Action Descriptions', 'Page Numbers', 'Dialogue Body'].sort(() => Math.random() - 0.5),
      },
      {
        q: 'How many minutes of screen time does 1 formatted page equal?',
        correct: '1 Minute',
        options: ['1 Minute', '30 Seconds', '2 Minutes', '5 Minutes'].sort(() => Math.random() - 0.5),
      },
      {
        q: 'What is the Hollywood term for the final shot of a filming day?',
        correct: 'The Martini Shot',
        options: ['The Martini Shot', 'The Wrap Shot', 'The Hero Shot', 'The Closing Cut'].sort(() => Math.random() - 0.5),
      },
    ],
    []
  );
  const [triviaIdx, setTriviaIdx] = useState(0);

  // 5. 9x9 Sudoku State
  const [sudokuDifficulty, setSudokuDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [nukeUsed, setNukeUsed] = useState(false);

  // Sample valid 9x9 base solution
  const baseSudokuSolution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const generatePuzzleGrid = (diff: 'easy' | 'medium' | 'hard') => {
    const blanksCount = diff === 'easy' ? 25 : diff === 'medium' ? 40 : 55;
    const grid = baseSudokuSolution.map((row) => [...row]);
    let removed = 0;
    while (removed < blanksCount) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (grid[r][c] !== 0) {
        grid[r][c] = 0;
        removed++;
      }
    }
    return grid;
  };

  const [sudokuGrid, setSudokuGrid] = useState<number[][]>(() => generatePuzzleGrid('easy'));

  const handleDifficultyChange = (d: 'easy' | 'medium' | 'hard') => {
    setSudokuDifficulty(d);
    setNukeUsed(false);
    setSudokuGrid(generatePuzzleGrid(d));
  };

  const handleNukeCell = () => {
    if (nukeUsed) {
      showToast('Nuke already deployed!', 'error');
      return;
    }
    // Find first empty cell
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (sudokuGrid[r][c] === 0) {
          const newGrid = sudokuGrid.map((row) => [...row]);
          newGrid[r][c] = baseSudokuSolution[r][c];
          setSudokuGrid(newGrid);
          setNukeUsed(true);
          setPopcornPoints((p) => p + 10);
          showToast("Writer's Block Nuked! 💣", 'success');
          return;
        }
      }
    }
  };

  // 6. Word Search State (6x6 Grid)
  const targetWords = useMemo(() => ['ACT', 'SCENE', 'CUT', 'PLOT'], []);
  const grid6x6 = useMemo(
    () => [
      ['A', 'C', 'T', 'X', 'P', 'L'],
      ['S', 'C', 'E', 'N', 'E', 'O'],
      ['U', 'O', 'Y', 'R', 'T', 'T'],
      ['C', 'U', 'T', 'A', 'Z', 'S'],
      ['K', 'L', 'M', 'P', 'L', 'O'],
      ['W', 'R', 'I', 'T', 'E', 'R'],
    ],
    []
  );

  const [foundSearchWords, setFoundSearchWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);

  const handleCellClick = (r: number, c: number) => {
    if (selectedCells.length === 0) {
      setSelectedCells([{ r, c }]);
    } else if (selectedCells.length === 1) {
      const first = selectedCells[0];
      // Construct word between first and second
      let word = '';
      if (first.r === r) {
        // Horizontal
        const start = Math.min(first.c, c);
        const end = Math.max(first.c, c);
        for (let col = start; col <= end; col++) {
          word += grid6x6[r][col];
        }
      } else if (first.c === c) {
        // Vertical
        const start = Math.min(first.r, r);
        const end = Math.max(first.r, r);
        for (let row = start; row <= end; row++) {
          word += grid6x6[row][c];
        }
      } else {
        word = grid6x6[first.r][first.c] + grid6x6[r][c];
      }

      if (targetWords.includes(word) && !foundSearchWords.includes(word)) {
        const nextFound = [...foundSearchWords, word];
        setFoundSearchWords(nextFound);
        setPopcornPoints((p) => p + 15);
        showToast(`Greenlit! Found "${word}" 🎬`, 'success');
        if (nextFound.length === targetWords.length) {
          handleWin('wordsearch');
        }
      } else {
        showToast('Invalid selection or already found!', 'error');
      }
      setSelectedCells([]);
    }
  };

  if (!isOpen) return null;

  const handleWin = (gameId: string) => {
    setGameState('won');
    onGameCompleted(gameId);
    showToast('Oscar Contender! Game Complete 🏆', 'success');
  };

  const selectedGame = ALL_GAMES.find((g) => g.id === activeGameId);
  const isTimeExpired = breakSecondsRemaining <= 0;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 font-mono text-slate-100">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Toast Feedback Overlay */}
        {toast && (
          <div
            className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full shadow-2xl border text-xs font-bold transition-all duration-300 animate-bounce flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-amber-950 border-amber-400 text-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-sm uppercase text-emerald-300 flex items-center gap-2">
                Break Box Suite {selectedGame ? `• ${selectedGame.name}` : ''}
              </h2>
            </div>
          </div>

          {/* Right Header Stats & Close */}
          <div className="flex items-center gap-3">
            {/* Popcorn Meter */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
              <span className="text-base">🍿</span>
              <span>{popcornPoints} PTS</span>
            </div>

            {/* 5-Min Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                breakSecondsRemaining < 60
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {Math.floor(breakSecondsRemaining / 60)}:
                {String(breakSecondsRemaining % 60).padStart(2, '0')}
              </span>
            </div>

            {activeGameId && !isTimeExpired && (
              <button
                onClick={() => {
                  setActiveGameId(null);
                  setGameState('playing');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition flex items-center gap-1"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            )}

            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 flex flex-col justify-center items-center text-center">
          {/* Time Expired Lockout Screen */}
          {isTimeExpired ? (
            <div className="space-y-6 py-10 my-auto text-center">
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto text-amber-400 animate-pulse">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-amber-300 uppercase tracking-wider">Break Time Over!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You've enjoyed 5 minutes of creative refreshment. Time to lock back in and finish your screenplay draft.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReturnToWork}
                  className="font-mono uppercase font-black tracking-widest bg-amber-500 hover:bg-amber-400 text-slate-950 px-8 py-4 rounded-xl border-2 border-amber-300 shadow-2xl text-sm flex items-center justify-center gap-3 mx-auto transition hover:scale-105 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : !activeGameId ? (
            /* Game Selection Grid */
            <div className="w-full space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">Select Your Arcade Break</h3>
                <p className="text-xs text-slate-400">Earn popcorn points and refresh your creative focus before returning to your script.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                {ALL_GAMES.map((game) => {
                  const IconComponent = game.icon;
                  const isPlayed = playedGames.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      onClick={() => {
                        setActiveGameId(game.id);
                        setGameState('playing');
                      }}
                      className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 group hover:scale-[1.02] shadow-sm cursor-pointer ${game.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {isPlayed && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                            CLEARED
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition">{game.name}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{game.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Return Button */}
              <div className="pt-4">
                <button
                  onClick={handleReturnToWork}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs transition border border-slate-700 flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : gameState === 'won' ? (
            /* Game Victory Screen */
            <div className="space-y-4 py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-emerald-300">Break Game Completed!</h3>
              <p className="text-xs text-slate-400">Great job refreshing your mind. Ready to return to your screenplay?</p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveGameId(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
                >
                  Pick Another Game
                </button>
                <button
                  onClick={handleReturnToWork}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Game Screen */
            <div className="w-full space-y-4">
              <p className="text-xs text-slate-400">{selectedGame?.desc}</p>

              {/* Game 1: Find the Pairs */}
              {activeGameId === 'pairs' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {pairsCards.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (c.matched || c.flipped) return;
                          const nextCards = [...pairsCards];
                          nextCards[idx].flipped = true;
                          setPairsCards(nextCards);

                          if (firstSelectedCard === null) {
                            setFirstSelectedCard(idx);
                          } else {
                            const first = pairsCards[firstSelectedCard];
                            if (first.text === c.match) {
                              nextCards[firstSelectedCard].matched = true;
                              nextCards[idx].matched = true;
                              setFirstSelectedCard(null);
                              setPairsCards(nextCards);
                              setPopcornPoints((p) => p + 10);
                              showToast('Greenlit Match! 🎬', 'success');
                              if (nextCards.every((item) => item.matched)) {
                                handleWin('pairs');
                              }
                            } else {
                              showToast('Draft Rejected by Intern! 💥', 'error');
                              setTimeout(() => {
                                nextCards[firstSelectedCard].flipped = false;
                                nextCards[idx].flipped = false;
                                setPairsCards([...nextCards]);
                                setFirstSelectedCard(null);
                              }, 700);
                            }
                          }
                        }}
                        className={`p-4 rounded-xl border text-xs font-bold transition h-20 flex items-center justify-center cursor-pointer ${
                          c.matched
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 opacity-60'
                            : c.flipped
                            ? 'bg-slate-800 border-amber-400 text-amber-300'
                            : 'bg-slate-950 border-slate-700 hover:border-slate-500 text-slate-500'
                        }`}
                      >
                        {c.flipped || c.matched ? c.text : '❓'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 2: Emoji Plotter */}
              {activeGameId === 'emoji' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-4xl tracking-widest py-2">{emojiQuestionsData[emojiIndex].emojis}</div>
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {emojiQuestionsData[emojiIndex].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === emojiQuestionsData[emojiIndex].correct) {
                            setPopcornPoints((p) => p + 10);
                            showToast('Your Agent Loves This! 📞', 'success');
                            if (emojiIndex + 1 < emojiQuestionsData.length) {
                              setEmojiIndex(emojiIndex + 1);
                            } else {
                              handleWin('emoji');
                            }
                          } else {
                            showToast('Studio Executive Passed! ❌', 'error');
                          }
                        }}
                        className="px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-400 rounded-xl text-xs font-bold text-slate-200 transition cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 3: Word Scramble */}
              {activeGameId === 'scramble' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-2xl font-black tracking-widest text-amber-300 py-1">
                    {scrambledWord}
                  </div>

                  {showScrambleHint && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-200 italic">
                      "{scrambleItems[scrambleIdx].hint}"
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <input
                      type="text"
                      value={userScrambleGuess}
                      onChange={(e) => setUserScrambleGuess(e.target.value.toUpperCase())}
                      placeholder="Type correct word..."
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-400 uppercase"
                    />
                    <button
                      onClick={() => {
                        if (userScrambleGuess.trim() === scrambleItems[scrambleIdx].word) {
                          setPopcornPoints((p) => p + 10);
                          showToast('Oscar Contender! 🏆', 'success');
                          if (scrambleIdx + 1 < scrambleItems.length) {
                            setScrambleIdx(scrambleIdx + 1);
                          } else {
                            handleWin('scramble');
                          }
                        } else {
                          showToast('Not quite right! Try again.', 'error');
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Submit
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 pt-2 text-xs">
                    <button
                      onClick={() => setScrambledWord(shuffleWordLetters(scrambleItems[scrambleIdx].word))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      Reshuffle
                    </button>
                    <button
                      onClick={() => setShowScrambleHint(!showScrambleHint)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showScrambleHint ? 'Hide Hint' : 'Script Hint'}
                    </button>
                  </div>
                </div>
              )}

              {/* Game 4: Script Trivia */}
              {activeGameId === 'trivia' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-sm font-bold text-slate-200">{triviaQuestions[triviaIdx].q}</div>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {triviaQuestions[triviaIdx].options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === triviaQuestions[triviaIdx].correct) {
                            setPopcornPoints((p) => p + 10);
                            showToast('Pitch Accepted! 🎬', 'success');
                            if (triviaIdx + 1 < triviaQuestions.length) {
                              setTriviaIdx(triviaIdx + 1);
                            } else {
                              handleWin('trivia');
                            }
                          } else {
                            showToast('Pass! Wrong answer.', 'error');
                          }
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-purple-400 rounded-xl text-xs font-bold text-slate-200 transition text-left cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 5: 9x9 Sudoku */}
              {activeGameId === 'sudoku' && (
                <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between items-center px-2 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-slate-400 font-bold">Difficulty:</span>
                      {(['easy', 'medium', 'hard'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => handleDifficultyChange(d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            sudokuDifficulty === d
                              ? 'bg-rose-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleNukeCell}
                      disabled={nukeUsed}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      Writer's Block Nuke
                    </button>
                  </div>

                  <div className="grid grid-cols-9 gap-0.5 bg-slate-800 p-1 rounded-lg max-w-[320px] mx-auto">
                    {sudokuGrid.map((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <input
                          key={`${rIdx}-${cIdx}`}
                          type="number"
                          min={1}
                          max={9}
                          value={cell === 0 ? '' : cell}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = sudokuGrid.map((r, ri) =>
                              r.map((v, ci) => (ri === rIdx && ci === cIdx ? val : v))
                            );
                            setSudokuGrid(next);
                            if (next.every((r) => r.every((v) => v > 0))) {
                              setPopcornPoints((p) => p + 20);
                              handleWin('sudoku');
                            }
                          }}
                          className={`w-7 h-7 bg-slate-950 border text-center text-xs font-bold focus:outline-none focus:border-rose-400 ${
                            cell > 0 ? 'text-slate-100 font-black' : 'text-rose-400'
                          } ${
                            (Math.floor(rIdx / 3) + Math.floor(cIdx / 3)) % 2 === 0
                              ? 'border-slate-800'
                              : 'border-slate-700/80 bg-slate-900'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Game 6: Word Search */}
              {activeGameId === 'wordsearch' && (
                <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">
                    Tap first letter, then tap second letter to swipe-select word. Target words:
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    {targetWords.map((w) => (
                      <span
                        key={w}
                        className={`px-2.5 py-1 rounded text-xs font-bold border ${
                          foundSearchWords.includes(w)
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}
                      >
                        {w}
                      </span>
                    ))}
                  </div>

                  {/* 6x6 Letter Grid */}
                  <div className="grid grid-cols-6 gap-2 max-w-[240px] mx-auto pt-2">
                    {grid6x6.map((row, rIdx) =>
                      row.map((char, cIdx) => {
                        const isSelected = selectedCells.some((sc) => sc.r === rIdx && sc.c === cIdx);
                        return (
                          <button
                            key={`${rIdx}-${cIdx}`}
                            onClick={() => handleCellClick(rIdx, cIdx)}
                            className={`w-8 h-8 rounded-lg font-black text-sm flex items-center justify-center transition border cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 border-amber-300 scale-110 shadow-lg'
                                : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-600'
                            }`}
                          >
                            {char}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
