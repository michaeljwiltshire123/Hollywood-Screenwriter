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
  AlertTriangle,
  Clapperboard,
  Camera,
  User,
  Scissors,
  Trophy,
  Flame,
  Film,
  ChevronRight,
  ShieldCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  PAIRS_MASTER_POOL,
  EMOJI_PLOTS_MASTER,
  SCRAMBLE_MASTER,
  TRIVIA_MASTER,
  generateDynamicWordSearch,
  generateRandomSudoku,
  PairPreset,
} from '../lib/gameData';
import { gameSound } from '../lib/gameSound';

interface BreakGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetBackToWork?: () => void;
  playedGames: string[];
  onGameCompleted: (gameId: string) => void;
}

const ALL_GAMES = [
  { id: 'pairs', name: 'Find the Pairs', desc: 'Match 6 visual screenwriting term cards.', icon: Layers, color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
  { id: 'emoji', name: 'Emoji Plotter', desc: 'Decode famous movie plotlines from emojis.', icon: Sparkles, color: 'border-sky-500/40 bg-sky-500/10 text-sky-300' },
  { id: 'scramble', name: 'Word Scramble', desc: 'Unscramble industry terms with script hints.', icon: FileText, color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
  { id: 'trivia', name: 'Script Trivia', desc: 'Test your Hollywood lore and formatting specs.', icon: Brain, color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { id: 'sudoku', name: '9x9 Studio Sudoku', desc: 'Solve logic grid with Writer\'s Block Nuke.', icon: BarChart3, color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
  { id: 'wordsearch', name: 'Word Search', desc: 'Find screenwriting words on a 10x10 cyber grid.', icon: Search, color: 'border-teal-500/40 bg-teal-500/10 text-teal-300' },
];

interface PairCardItem {
  id: number;
  pairId: string;
  title: string;
  subtitle: string;
  iconName: PairPreset['iconName'];
  color: string;
  flipped: boolean;
  matched: boolean;
}

export const BreakGameModal: React.FC<BreakGameModalProps> = ({
  isOpen,
  onClose,
  onGetBackToWork,
  playedGames,
  onGameCompleted,
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Popcorn Meter Points & Combo Streak
  const [popcornPoints, setPopcornPoints] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);

  // 5-Minute Time Cap (300 Seconds)
  const [breakSecondsRemaining, setBreakSecondsRemaining] = useState<number>(300);

  // Toast Overlay
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2400);
  };

  const handleWin = (gameId: string) => {
    setGameState('won');
    onGameCompleted(gameId);
    if (soundEnabled) gameSound.playVictory();
    showToast('🏆 Oscar Contender! Arcade Break Cleared!', 'success');
  };

  // Timer Effect
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

  // Game 1: Find the Pairs State
  const [pairsCards, setPairsCards] = useState<PairCardItem[]>([]);
  const [firstCardIdx, setFirstCardIdx] = useState<number | null>(null);

  // Game 2: Emoji Plotter State
  const [emojiIdx, setEmojiIdx] = useState(0);
  const [emojiQuestions, setEmojiQuestions] = useState<any[]>([]);

  // Game 3: Word Scramble State
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userScrambleGuess, setUserScrambleGuess] = useState('');
  const [showScrambleHint, setShowScrambleHint] = useState(false);

  // Game 4: Script Trivia State
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaQuestions, setTriviaQuestions] = useState<any[]>([]);

  // Game 5: 9x9 Studio Sudoku State
  const [sudokuDifficulty, setSudokuDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [sudokuState, setSudokuState] = useState<{ puzzle: number[][]; solution: number[][] }>({
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solution: Array.from({ length: 9 }, () => Array(9).fill(0)),
  });
  const [nukeUsed, setNukeUsed] = useState(false);
  const [selectedSudokuCell, setSelectedSudokuCell] = useState<{ r: number; c: number } | null>(null);

  // Game 6: Word Search State
  const [wordSearchData, setWordSearchData] = useState<any>(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCellKeys, setFoundCellKeys] = useState<Set<string>>(new Set());
  const [selectedSearchCells, setSelectedSearchCells] = useState<{ r: number; c: number }[]>([]);

  // Initialize Game with Dynamic Sampling
  const initializeGame = (gameId: string) => {
    setActiveGameId(gameId);
    setGameState('playing');
    setComboMultiplier(1);

    if (gameId === 'pairs') {
      // Pick 6 random pairs from 10+ master pool
      const sampledPairs = [...PAIRS_MASTER_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
      const deck: PairCardItem[] = [];
      let cId = 1;
      sampledPairs.forEach((p) => {
        deck.push({ id: cId++, pairId: p.pairId, title: p.title, subtitle: p.subtitle, iconName: p.iconName, color: p.color, flipped: false, matched: false });
        deck.push({ id: cId++, pairId: p.pairId, title: p.title, subtitle: p.subtitle, iconName: p.iconName, color: p.color, flipped: false, matched: false });
      });
      setPairsCards(deck.sort(() => Math.random() - 0.5));
      setFirstCardIdx(null);
    } else if (gameId === 'emoji') {
      // Pick 5 random emoji plots with shuffled options
      const sampled = [...EMOJI_PLOTS_MASTER].sort(() => Math.random() - 0.5).slice(0, 5).map((q) => {
        const wrongOpts = EMOJI_PLOTS_MASTER.filter((item) => item.correct !== q.correct).map((item) => item.correct);
        const distractors = wrongOpts.sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [q.correct, ...distractors].sort(() => Math.random() - 0.5);
        return { ...q, options };
      });
      setEmojiQuestions(sampled);
      setEmojiIdx(0);
    } else if (gameId === 'scramble') {
      setScrambleIdx(Math.floor(Math.random() * SCRAMBLE_MASTER.length));
    } else if (gameId === 'trivia') {
      const sampled = [...TRIVIA_MASTER].sort(() => Math.random() - 0.5).slice(0, 5).map((t) => ({
        ...t,
        options: [...t.options].sort(() => Math.random() - 0.5),
      }));
      setTriviaQuestions(sampled);
      setTriviaIdx(0);
    } else if (gameId === 'sudoku') {
      const suData = generateRandomSudoku(sudokuDifficulty);
      setSudokuState(suData);
      setNukeUsed(false);
      setSelectedSudokuCell(null);
    } else if (gameId === 'wordsearch') {
      const wsData = generateDynamicWordSearch();
      setWordSearchData(wsData);
      setFoundWords([]);
      setFoundCellKeys(new Set<string>());
      setSelectedSearchCells([]);
    }
  };

  // Shuffle Scramble word
  useEffect(() => {
    if (activeGameId === 'scramble' && SCRAMBLE_MASTER[scrambleIdx]) {
      const w = SCRAMBLE_MASTER[scrambleIdx].word;
      let arr = w.split('');
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setScrambledWord(arr.join(' '));
      setUserScrambleGuess('');
      setShowScrambleHint(false);
    }
  }, [scrambleIdx, activeGameId]);

  const handleResetModal = () => {
    setActiveGameId(null);
    setGameState('playing');
    setBreakSecondsRemaining(300);
    setPopcornPoints(0);
    setComboMultiplier(1);
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

  // Icon Helper for Pair Cards
  const renderPairIcon = (iconName: PairPreset['iconName']) => {
    switch (iconName) {
      case 'Clapperboard': return <Clapperboard className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Camera': return <Camera className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'User': return <User className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Zap': return <Zap className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Scissors': return <Scissors className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Trophy': return <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Film': return <Film className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'Flame': return <Flame className="w-5 h-5 sm:w-6 sm:h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />;
    }
  };

  if (!isOpen) return null;

  const selectedGame = ALL_GAMES.find((g) => g.id === activeGameId);
  const isTimeExpired = breakSecondsRemaining <= 0;

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 font-mono text-slate-100">
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] max-w-2xl w-full overflow-hidden flex flex-col max-h-[94vh] relative">

        {/* Console Toast Overlay */}
        {toast && (
          <div
            className={`absolute top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl border-2 text-xs font-black transition-all duration-300 animate-bounce flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-emerald-900/50'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500 text-rose-200 shadow-rose-900/50'
                : 'bg-amber-950/95 border-amber-400 text-amber-200 shadow-amber-900/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Cyber HUD Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-2xl text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-sm uppercase tracking-wider text-amber-300 flex items-center gap-2">
                GAME SUITE {selectedGame ? `• ${selectedGame.name}` : ''}
              </h2>
              <div className="text-[10px] text-slate-400 font-sans flex items-center gap-2">
                <span>100% FREE FOREVER</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{comboMultiplier > 1 ? `${comboMultiplier}x COMBO 🔥` : 'READY'}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition border border-slate-700 cursor-pointer"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Popcorn Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-black text-amber-300 shadow-inner">
              <span className="text-sm">🍿</span>
              <span>{popcornPoints} PTS</span>
            </div>

            {/* Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${
                breakSecondsRemaining < 60
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse ring-2 ring-rose-500/50'
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
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black transition border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 flex flex-col justify-center items-center text-center">
          {/* Lockout Screen */}
          {isTimeExpired && !activeGameId ? (
            <div className="space-y-6 py-8 text-center my-auto">
              <div className="w-20 h-20 bg-amber-500/20 border-2 border-amber-400 rounded-3xl flex items-center justify-center mx-auto text-amber-400 animate-pulse shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-black text-amber-300 uppercase tracking-widest">Break Time Expired!</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  You've enjoyed your 5-minute break. Let's return to your screenplay draft and write your next great scene.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleReturnToWork}
                  className="font-mono uppercase font-black tracking-widest bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 px-8 py-4 rounded-2xl border-2 border-amber-300 shadow-2xl text-sm flex items-center justify-center gap-3 mx-auto transition hover:scale-105 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : !activeGameId ? (
            /* Game Selection Grid */
            <div className="w-full space-y-5 my-auto">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-100 tracking-wide uppercase flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <span>ARCADE BREAK SELECTION</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans">Procedural content pools refresh every session. Earn popcorn points!</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {ALL_GAMES.map((game) => {
                  const IconComponent = game.icon;
                  const isPlayed = playedGames.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      onClick={() => initializeGame(game.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between gap-3 group hover:scale-[1.03] shadow-lg cursor-pointer bg-slate-950/70 ${game.color} hover:border-amber-400 hover:shadow-[0_0_25px_rgba(251,191,36,0.2)]`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 group-hover:border-amber-400/60 transition">
                          <IconComponent className="w-5 h-5 text-amber-400" />
                        </div>
                        {isPlayed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            CLEARED
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="font-black text-sm text-slate-100 group-hover:text-amber-300 transition flex items-center justify-between">
                          <span>{game.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-300 transition" />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{game.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReturnToWork}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black rounded-2xl text-xs transition border border-slate-700 flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg hover:scale-105"
                >
                  <Zap className="w-4 h-4 fill-amber-300" />
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : gameState === 'won' ? (
            /* Victory Screen */
            <div className="space-y-5 py-8 my-auto">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 animate-bounce shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-emerald-300 uppercase tracking-widest">ARCADE GAME CLEARED!</h3>
                <p className="text-xs text-slate-300 font-sans max-w-sm mx-auto">
                  Outstanding performance! You earned <strong className="text-amber-300">+25 Popcorn Points</strong>.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setActiveGameId(null);
                  }}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition border border-slate-700 cursor-pointer"
                >
                  Pick Another Game
                </button>
                <button
                  onClick={handleReturnToWork}
                  className="px-7 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black rounded-xl text-xs transition shadow-xl flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>GET BACK TO WORK</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Game Screens */
            <div className="w-full space-y-4 my-auto">
              {/* Game 1: Find the Pairs */}
              {activeGameId === 'pairs' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 font-sans">
                    Match 6 visual screenwriting term pairs randomly sampled from our master vault:
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
                    {pairsCards.map((c, idx) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (c.matched || c.flipped) return;

                          const next = [...pairsCards];
                          next[idx].flipped = true;
                          setPairsCards(next);

                          if (firstCardIdx === null) {
                            setFirstCardIdx(idx);
                          } else {
                            const first = pairsCards[firstCardIdx];
                            if (first.pairId === c.pairId && first.id !== c.id) {
                              // Match!
                              next[firstCardIdx].matched = true;
                              next[idx].matched = true;
                              setPairsCards(next);
                              setFirstCardIdx(null);
                              setPopcornPoints((p) => p + 15 * comboMultiplier);
                              setComboMultiplier((m) => m + 1);
                              if (soundEnabled) gameSound.playMatch();
                              showToast(`Match: ${c.title}! 🎬`, 'success');

                              if (next.every((item) => item.matched)) {
                                handleWin('pairs');
                              }
                            } else {
                              // Mismatch
                              if (soundEnabled) gameSound.playMismatch();
                              setComboMultiplier(1);
                              showToast('Mismatch! Cards resetting...', 'error');
                              setTimeout(() => {
                                next[firstCardIdx].flipped = false;
                                next[idx].flipped = false;
                                setPairsCards([...next]);
                                setFirstCardIdx(null);
                              }, 750);
                            }
                          }
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all duration-300 h-28 flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-lg ${
                          c.matched
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 opacity-70 ring-2 ring-emerald-500/40'
                            : c.flipped
                            ? `${c.color} shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-105`
                            : 'bg-slate-950 border-slate-800 hover:border-slate-600 text-slate-500 hover:scale-[1.02]'
                        }`}
                      >
                        {c.flipped || c.matched ? (
                          <>
                            <div className="p-1.5 rounded-lg bg-slate-950/60">
                              {renderPairIcon(c.iconName)}
                            </div>
                            <div className="font-black text-[10px] leading-tight uppercase">{c.title}</div>
                            <div className="text-[9px] text-slate-400 font-sans line-clamp-1">{c.subtitle}</div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Film className="w-6 h-6 text-slate-700" />
                            <span className="text-[10px] text-slate-600 font-black">REVEAL</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 2: Emoji Plotter */}
              {activeGameId === 'emoji' && emojiQuestions[emojiIdx] && (
                <div className="space-y-5 bg-slate-950 p-6 rounded-3xl border-2 border-slate-800 max-w-lg mx-auto shadow-2xl">
                  <div className="space-y-1">
                    <div className="text-[10px] text-amber-400 font-black tracking-widest uppercase">
                      PLOT {emojiIdx + 1} OF {emojiQuestions.length}
                    </div>
                    <div className="text-4xl tracking-[0.2em] py-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                      {emojiQuestions[emojiIdx].emojis}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {emojiQuestions[emojiIdx].options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === emojiQuestions[emojiIdx].correct) {
                            if (soundEnabled) gameSound.playMatch();
                            setPopcornPoints((p) => p + 15 * comboMultiplier);
                            setComboMultiplier((m) => m + 1);
                            showToast('Greenlit Pitch! Correct Movie! 🎬', 'success');
                            if (emojiIdx + 1 < emojiQuestions.length) {
                              setEmojiIdx(emojiIdx + 1);
                            } else {
                              handleWin('emoji');
                            }
                          } else {
                            if (soundEnabled) gameSound.playMismatch();
                            setComboMultiplier(1);
                            showToast('Studio Exec Passed! Try another.', 'error');
                          }
                        }}
                        className="p-3.5 bg-slate-900 hover:bg-slate-850 border-2 border-slate-800 hover:border-sky-400 rounded-2xl text-xs font-black text-slate-200 transition-all hover:scale-105 cursor-pointer shadow-md"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 3: Word Scramble */}
              {activeGameId === 'scramble' && (
                <div className="space-y-5 bg-slate-950 p-6 rounded-3xl border-2 border-slate-800 max-w-lg mx-auto shadow-2xl">
                  <div className="space-y-2">
                    <div className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">UNSCRAMBLE INDUSTRY TERM</div>
                    <div className="text-3xl font-black tracking-[0.25em] text-amber-300 py-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                      {scrambledWord}
                    </div>
                  </div>

                  {showScrambleHint && (
                    <div className="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-xs font-mono text-amber-200 italic shadow-inner">
                      "{SCRAMBLE_MASTER[scrambleIdx].hint}"
                    </div>
                  )}

                  <div className="flex gap-2 justify-center pt-2">
                    <input
                      type="text"
                      value={userScrambleGuess}
                      onChange={(e) => setUserScrambleGuess(e.target.value.toUpperCase())}
                      placeholder="TYPE ANSWER..."
                      className="bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 font-black focus:outline-none focus:border-emerald-400 uppercase tracking-widest w-full max-w-[220px]"
                    />
                    <button
                      onClick={() => {
                        if (userScrambleGuess.trim() === SCRAMBLE_MASTER[scrambleIdx].word) {
                          if (soundEnabled) gameSound.playMatch();
                          setPopcornPoints((p) => p + 15 * comboMultiplier);
                          showToast('Greenlit Word! 🏆', 'success');
                          handleWin('scramble');
                        } else {
                          if (soundEnabled) gameSound.playMismatch();
                          showToast('Incorrect spelling! Try again.', 'error');
                        }
                      }}
                      className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-lg hover:scale-105"
                    >
                      SUBMIT
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 pt-1 text-xs">
                    <button
                      onClick={() => {
                        setScrambleIdx((scrambleIdx + 1) % SCRAMBLE_MASTER.length);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      New Word
                    </button>
                    <button
                      onClick={() => {
                        setShowScrambleHint(!showScrambleHint);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showScrambleHint ? 'Hide Hint' : 'Script Hint'}
                    </button>
                  </div>
                </div>
              )}

              {/* Game 4: Script Trivia */}
              {activeGameId === 'trivia' && triviaQuestions[triviaIdx] && (
                <div className="space-y-5 bg-slate-950 p-6 rounded-3xl border-2 border-slate-800 max-w-lg mx-auto shadow-2xl">
                  <div className="space-y-1">
                    <div className="text-[10px] text-purple-400 font-black tracking-widest uppercase">QUESTION {triviaIdx + 1} OF {triviaQuestions.length}</div>
                    <div className="text-sm font-black text-slate-100 py-2 leading-snug">{triviaQuestions[triviaIdx].q}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {triviaQuestions[triviaIdx].options.map((opt: string) => (
                      <button
                        key={opt}
                        onClick={() => {
                          if (opt === triviaQuestions[triviaIdx].correct) {
                            if (soundEnabled) gameSound.playMatch();
                            setPopcornPoints((p) => p + 15 * comboMultiplier);
                            setComboMultiplier((m) => m + 1);
                            showToast('Hollywood Master! Correct Answer! 🎬', 'success');
                            if (triviaIdx + 1 < triviaQuestions.length) {
                              setTriviaIdx(triviaIdx + 1);
                            } else {
                              handleWin('trivia');
                            }
                          } else {
                            if (soundEnabled) gameSound.playMismatch();
                            setComboMultiplier(1);
                            showToast('Wrong answer! Try another option.', 'error');
                          }
                        }}
                        className="px-4 py-3 bg-slate-900 hover:bg-slate-850 border-2 border-slate-800 hover:border-purple-400 rounded-2xl text-xs font-black text-slate-200 transition text-left cursor-pointer flex items-center justify-between group hover:scale-[1.01]"
                      >
                        <span>{opt}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 5: 9x9 Studio Sudoku */}
              {activeGameId === 'sudoku' && (
                <div className="space-y-4 bg-slate-950 p-4 sm:p-5 rounded-3xl border-2 border-slate-800 max-w-md mx-auto shadow-2xl">
                  <div className="flex justify-between items-center px-1 text-xs">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-slate-400 font-bold">Difficulty:</span>
                      {(['easy', 'medium', 'hard'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setSudokuDifficulty(d);
                            setSudokuState(generateRandomSudoku(d));
                            setNukeUsed(false);
                            setSelectedSudokuCell(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                            sudokuDifficulty === d
                              ? 'bg-rose-500 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (nukeUsed) return;
                        if (soundEnabled) gameSound.playNuke();

                        // Find first empty cell and reveal true solution
                        for (let r = 0; r < 9; r++) {
                          for (let c = 0; c < 9; c++) {
                            if (sudokuState.puzzle[r][c] === 0) {
                              const next = sudokuState.puzzle.map((row) => [...row]);
                              next[r][c] = sudokuState.solution[r][c];
                              setSudokuState({ ...sudokuState, puzzle: next });
                              setNukeUsed(true);
                              setPopcornPoints((p) => p + 15);
                              showToast("Writer's Block Nuked! 💣", 'success');
                              return;
                            }
                          }
                        }
                      }}
                      disabled={nukeUsed}
                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 disabled:opacity-40 text-slate-950 font-black rounded-lg text-[10px] flex items-center gap-1 cursor-pointer shadow-md"
                    >
                      <Zap className="w-3 h-3 fill-slate-950" />
                      Writer's Block Nuke
                    </button>
                  </div>

                  {/* 9x9 Grid */}
                  <div className="grid grid-cols-9 gap-0.5 bg-slate-800 p-1.5 rounded-2xl max-w-[320px] mx-auto shadow-inner border border-slate-700">
                    {sudokuState.puzzle.map((row, rIdx) =>
                      row.map((cell, cIdx) => {
                        const isSelected = selectedSudokuCell?.r === rIdx && selectedSudokuCell?.c === cIdx;
                        return (
                          <button
                            key={`${rIdx}-${cIdx}`}
                            onClick={() => {
                              setSelectedSudokuCell({ r: rIdx, c: cIdx });
                            }}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-black transition border cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-300 scale-105 z-10'
                                : cell > 0
                                ? 'bg-slate-950 text-slate-100 border-slate-800'
                                : 'bg-slate-900/90 text-rose-400 border-slate-800 hover:bg-slate-850'
                            }`}
                          >
                            {cell > 0 ? cell : ''}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Number Keypad */}
                  <div className="flex gap-1.5 justify-center pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          if (!selectedSudokuCell) {
                            showToast('Tap a grid cell first!', 'info');
                            return;
                          }

                          const { r, c } = selectedSudokuCell;
                          const nextP = sudokuState.puzzle.map((row, ri) =>
                            row.map((val, ci) => (ri === r && ci === c ? num : val))
                          );
                          setSudokuState({ ...sudokuState, puzzle: nextP });

                          // Check if puzzle matches solution
                          let matches = true;
                          for (let ri = 0; ri < 9; ri++) {
                            for (let ci = 0; ci < 9; ci++) {
                              if (nextP[ri][ci] !== sudokuState.solution[ri][ci]) {
                                matches = false;
                                break;
                              }
                            }
                          }
                          if (matches) {
                            setPopcornPoints((p) => p + 30);
                            handleWin('sudoku');
                          }
                        }}
                        className="w-7 h-8 bg-slate-800 hover:bg-rose-500 hover:text-slate-950 text-slate-200 font-black rounded-lg text-xs transition border border-slate-700 cursor-pointer shadow-sm"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game 6: Word Search */}
              {activeGameId === 'wordsearch' && wordSearchData && (
                <div className="space-y-4 bg-slate-950 p-4 sm:p-5 rounded-3xl border-2 border-slate-800 max-w-md mx-auto shadow-2xl">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-teal-400 font-black tracking-widest uppercase">
                      CATEGORY: {wordSearchData.categoryName}
                    </span>
                    <button
                      onClick={() => {
                        const wsData = generateDynamicWordSearch();
                        setWordSearchData(wsData);
                        setFoundWords([]);
                        setFoundCellKeys(new Set<string>());
                        setSelectedSearchCells([]);
                      }}
                      className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <RefreshCw className="w-3 h-3 text-amber-400" />
                      New Category
                    </button>
                  </div>

                  {/* Target Word Badges */}
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {wordSearchData.targetWords.map((w: string) => {
                      const isFound = foundWords.includes(w);
                      return (
                        <span
                          key={w}
                          className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                            isFound
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 line-through scale-95 opacity-80'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {w}
                        </span>
                      );
                    })}
                  </div>

                  {/* 10x10 Grid */}
                  <div className="grid grid-cols-10 gap-1 max-w-[330px] mx-auto pt-1">
                    {wordSearchData.grid.map((row: string[], rIdx: number) =>
                      row.map((char: string, cIdx: number) => {
                        const cellKey = `${rIdx}-${cIdx}`;
                        const isFoundCell = foundCellKeys.has(cellKey);
                        const isSelected = selectedSearchCells.some((sc) => sc.r === rIdx && sc.c === cIdx);

                        return (
                          <button
                            key={cellKey}
                            onClick={() => {
                              if (selectedSearchCells.length === 0) {
                                setSelectedSearchCells([{ r: rIdx, c: cIdx }]);
                              } else if (selectedSearchCells.length === 1) {
                                const first = selectedSearchCells[0];
                                if (first.r === rIdx && first.c === cIdx) {
                                  setSelectedSearchCells([]);
                                  return;
                                }

                                const dr = Math.sign(rIdx - first.r);
                                const dc = Math.sign(cIdx - first.c);
                                const stepsR = Math.abs(rIdx - first.r);
                                const stepsC = Math.abs(cIdx - first.c);

                                if (!(first.r === rIdx || first.c === cIdx || stepsR === stepsC)) {
                                  if (soundEnabled) gameSound.playMismatch();
                                  showToast('Select letters in a straight line!', 'error');
                                  setSelectedSearchCells([]);
                                  return;
                                }

                                const path: Array<{ r: number; c: number }> = [];
                                let curR = first.r;
                                let curC = first.c;
                                let constructed = '';

                                while (true) {
                                  path.push({ r: curR, c: curC });
                                  constructed += wordSearchData.grid[curR][curC];
                                  if (curR === rIdx && curC === cIdx) break;
                                  curR += dr;
                                  curC += dc;
                                }

                                if (wordSearchData.targetWords.includes(constructed) && !foundWords.includes(constructed)) {
                                  const nextFound = [...foundWords, constructed];
                                  setFoundWords(nextFound);

                                  const nextKeys = new Set(foundCellKeys);
                                  path.forEach((pt) => nextKeys.add(`${pt.r}-${pt.c}`));
                                  setFoundCellKeys(nextKeys);

                                  setPopcornPoints((p) => p + 20 * comboMultiplier);
                                  setComboMultiplier((m) => m + 1);
                                  if (soundEnabled) gameSound.playMatch();
                                  showToast(`Greenlit! Found "${constructed}" 🎬`, 'success');

                                  if (nextFound.length === wordSearchData.targetWords.length) {
                                    handleWin('wordsearch');
                                  }
                                } else {
                                  if (soundEnabled) gameSound.playMismatch();
                                  showToast('Not a target word or already found!', 'error');
                                }

                                setSelectedSearchCells([]);
                              }
                            }}
                            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center transition border cursor-pointer ${
                              isFoundCell
                                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)] scale-105 z-10'
                                : isSelected
                                ? 'bg-amber-400 text-slate-950 border-amber-300 scale-110 shadow-lg ring-2 ring-amber-300'
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
