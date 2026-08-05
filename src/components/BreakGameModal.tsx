import React, { useState } from 'react';
import { X, Gamepad2, Sparkles, CheckCircle2, RefreshCw, Layers, FileText, BarChart3, Search, Brain, Grid } from 'lucide-react';

interface BreakGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  playedGames: string[];
  onGameCompleted: (gameId: string) => void;
}

const ALL_GAMES = [
  { id: 'pairs', name: 'Find the Pairs', desc: 'Match screenwriting terms with their definitions.', icon: Layers, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'emoji', name: 'Emoji Plotter', desc: 'Guess the iconic screenplay plot from emojis.', icon: Sparkles, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'scramble', name: 'Word Scramble', desc: 'Unscramble industry production terms.', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'trivia', name: 'Script Trivia', desc: 'Test your knowledge of screenwriting craft.', icon: Brain, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'sudoku', name: 'Mini Sudoku', desc: 'Sharpen your logic with a 4x4 number puzzle.', icon: BarChart3, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'wordsearch', name: 'Word Search', desc: 'Find hidden filmmaking words in the letter grid.', icon: Search, color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
];

export const BreakGameModal: React.FC<BreakGameModalProps> = ({
  isOpen,
  onClose,
  playedGames,
  onGameCompleted,
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  React.useEffect(() => {
    if (isOpen) {
      setActiveGameId(null);
      setGameState('playing');
    }
  }, [isOpen]);

  // Specific Game States
  // 1. Pairs
  const [pairsCards, setPairsCards] = useState([
    { id: 1, text: 'SCENE', match: 'Heading', flipped: false, matched: false },
    { id: 2, text: 'Heading', match: 'SCENE', flipped: false, matched: false },
    { id: 3, text: 'CHARACTER', match: 'Name', flipped: false, matched: false },
    { id: 4, text: 'Name', match: 'CHARACTER', flipped: false, matched: false },
    { id: 5, text: 'ACTION', match: 'Visual', flipped: false, matched: false },
    { id: 6, text: 'Visual', match: 'ACTION', flipped: false, matched: false },
  ].sort(() => Math.random() - 0.5));
  const [firstSelectedCard, setFirstSelectedCard] = useState<number | null>(null);

  // 2. Emoji Plotter
  const [emojiIndex, setEmojiIndex] = useState(0);
  const emojiQuestions = [
    { emojis: '🚢 🧊 🌊 💔', options: ['Titanic', 'Jaws', 'Avatar', 'Cast Away'], correct: 0 },
    { emojis: '🦈 🏖️ 😱 ⛵', options: ['Jaws', 'Aquaman', 'Finding Nemo', 'Moana'], correct: 0 },
    { emojis: '🪐 👨‍🚀 ⏳ 📚', options: ['Interstellar', 'Star Wars', 'Gravity', 'Alien'], correct: 0 },
    { emojis: '🦖 🌴 ⚡ 🚙', options: ['Jurassic Park', 'King Kong', 'Avatar', 'Godzilla'], correct: 0 },
  ];

  // 3. Word Scramble
  const [scrambleList] = useState(['SCREENPLAY', 'DIRECTOR', 'STORYBOARD', 'DIALOGUE']);
  const [scrambleWordIdx, setScrambleWordIdx] = useState(0);
  const [userGuess, setUserGuess] = useState('');

  // 4. Trivia
  const [triviaIdx, setTriviaIdx] = useState(0);
  const triviaQuestions = [
    { q: 'What font is universally required for standard Hollywood screenplays?', options: ['Courier 12pt', 'Arial 12pt', 'Comic Sans', 'Times New Roman'], correct: 0 },
    { q: 'In screenplay formatting, which element is typed in ALL CAPS?', options: ['Character Names', 'Action Descriptions', 'Page Numbers', 'Dialogue body'], correct: 0 },
  ];

  // 5. Sudoku (4x4)
  const [sudokuGrid, setSudokuGrid] = useState<number[][]>([
    [1, 2, 0, 4],
    [3, 4, 1, 0],
    [0, 1, 4, 3],
    [4, 3, 2, 0],
  ]);

  // 6. Word Search
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const targetWords = ['ACT', 'SCENE', 'CUT', 'PLOT'];

  if (!isOpen) return null;

  const handleWin = () => {
    setGameState('won');
    if (activeGameId) {
      onGameCompleted(activeGameId);
    }
  };

  const selectedGame = ALL_GAMES.find((g) => g.id === activeGameId);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-slate-100">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm uppercase text-emerald-300">
              Break Box & Minigame Suite {selectedGame ? `• ${selectedGame.name}` : ''}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {activeGameId && (
              <button
                onClick={() => {
                  setActiveGameId(null);
                  setGameState('playing');
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold transition flex items-center gap-1"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Another Game</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 flex flex-col justify-center items-center text-center">
          {!activeGameId ? (
            <div className="w-full space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">Select Your Break</h3>
                <p className="text-xs text-slate-400">Choose a relaxing minigame to refresh your creative mind before returning to writing.</p>
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
                      className={`p-4 rounded-xl border text-left transition flex flex-col justify-between gap-3 group hover:scale-[1.02] shadow-sm ${game.color}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/50">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {isPlayed && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/40">
                            COMPLETED
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
            </div>
          ) : gameState === 'won' ? (
            <div className="space-y-4 py-8">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-emerald-300">Break Game Completed!</h3>
              <p className="text-xs text-slate-400">Great job refreshing your mind. Ready to return to your screenplay?</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveGameId(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
                >
                  Pick Another Game
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg"
                >
                  Return to Editor
                </button>
              </div>
            </div>
          ) : (
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
                              if (nextCards.every((item) => item.matched)) {
                                handleWin();
                              }
                            } else {
                              setTimeout(() => {
                                nextCards[firstSelectedCard].flipped = false;
                                nextCards[idx].flipped = false;
                                setPairsCards([...nextCards]);
                                setFirstSelectedCard(null);
                              }, 700);
                            }
                          }
                        }}
                        className={`p-4 rounded-xl border text-xs font-bold transition h-20 flex items-center justify-center ${
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
                  <div className="text-3xl tracking-widest">{emojiQuestions[emojiIndex].emojis}</div>
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {emojiQuestions[emojiIndex].options.map((opt, oIdx) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (oIdx === emojiQuestions[emojiIndex].correct) {
                            if (emojiIndex + 1 < emojiQuestions.length) {
                              setEmojiIndex(emojiIndex + 1);
                            } else {
                              handleWin();
                            }
                          } else {
                            alert('Incorrect! Try again.');
                          }
                        }}
                        className="px-4 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-400 rounded-xl text-xs font-bold text-slate-200 transition"
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
                  <div className="text-xl font-bold tracking-widest text-amber-300">
                    {scrambleList[scrambleWordIdx].split('').sort(() => Math.random() - 0.5).join(' ')}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
                      placeholder="Type correct word..."
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      onClick={() => {
                        if (userGuess.trim() === scrambleList[scrambleWordIdx]) {
                          if (scrambleWordIdx + 1 < scrambleList.length) {
                            setScrambleWordIdx(scrambleWordIdx + 1);
                            setUserGuess('');
                          } else {
                            handleWin();
                          }
                        } else {
                          alert('Not quite right! Try again.');
                        }
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-xs transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Game 4: Trivia */}
              {activeGameId === 'trivia' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-sm font-bold text-slate-200">{triviaQuestions[triviaIdx].q}</div>
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {triviaQuestions[triviaIdx].options.map((opt, oIdx) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (oIdx === triviaQuestions[triviaIdx].correct) {
                            if (triviaIdx + 1 < triviaQuestions.length) {
                              setTriviaIdx(triviaIdx + 1);
                            } else {
                              handleWin();
                            }
                          } else {
                            alert('Incorrect answer!');
                          }
                        }}
                        className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-purple-400 rounded-xl text-xs font-bold text-slate-200 transition text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 5: Sudoku */}
              {activeGameId === 'sudoku' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="grid grid-cols-4 gap-2 max-w-[200px] mx-auto">
                    {sudokuGrid.map((row, rIdx) =>
                      row.map((cell, cIdx) => (
                        <input
                          key={`${rIdx}-${cIdx}`}
                          type="number"
                          min={1}
                          max={4}
                          value={cell === 0 ? '' : cell}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const next = sudokuGrid.map((r, ri) =>
                              r.map((v, ci) => (ri === rIdx && ci === cIdx ? val : v))
                            );
                            setSudokuGrid(next);
                            if (next.every((r) => r.every((v) => v > 0))) {
                              handleWin();
                            }
                          }}
                          className="w-10 h-10 bg-slate-900 border border-slate-700 rounded text-center text-rose-300 font-bold text-sm focus:outline-none focus:border-rose-400"
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Game 6: Word Search */}
              {activeGameId === 'wordsearch' && (
                <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <div className="text-xs text-slate-400">Find and type the words: ACT, SCENE, CUT, PLOT</div>
                  <div className="flex gap-2 justify-center pt-2">
                    <input
                      type="text"
                      value={userGuess}
                      onChange={(e) => setUserGuess(e.target.value.toUpperCase())}
                      placeholder="Type found word..."
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-teal-400"
                    />
                    <button
                      onClick={() => {
                        const clean = userGuess.trim();
                        if (targetWords.includes(clean) && !foundWords.includes(clean)) {
                          const next = [...foundWords, clean];
                          setFoundWords(next);
                          setUserGuess('');
                          if (next.length === targetWords.length) {
                            handleWin();
                          }
                        } else {
                          alert('Word not in target list or already found.');
                        }
                      }}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-xs transition"
                    >
                      Found
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {targetWords.map((w) => (
                      <span
                        key={w}
                        className={`px-2 py-1 rounded text-xs font-bold border ${
                          foundWords.includes(w)
                            ? 'bg-teal-950/60 border-teal-500 text-teal-300'
                            : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
                        }`}
                      >
                        {w}
                      </span>
                    ))}
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
