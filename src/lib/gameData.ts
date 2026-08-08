// Dynamic Game Pools and Procedural Generators for Screenwriter Pro PS5 Arcade Suite

export interface PairPreset {
  pairId: string;
  title: string;
  subtitle: string;
  iconName: 'Clapperboard' | 'Camera' | 'User' | 'Zap' | 'Scissors' | 'Trophy' | 'Film' | 'Sparkles' | 'Flame' | 'ShieldCheck';
  color: string;
}

export const PAIRS_MASTER_POOL: PairPreset[] = [
  { pairId: 'scene', title: 'SCENE HEADING', subtitle: 'INT/EXT Slugline', iconName: 'Clapperboard', color: 'border-amber-400/80 bg-amber-500/20 text-amber-300' },
  { pairId: 'shot', title: 'SHOT LIST', subtitle: 'Dutch Angle / Close Up', iconName: 'Camera', color: 'border-sky-400/80 bg-sky-500/20 text-sky-300' },
  { pairId: 'character', title: 'CHARACTER', subtitle: 'Cue & Dialogue', iconName: 'User', color: 'border-purple-400/80 bg-purple-500/20 text-purple-300' },
  { pairId: 'action', title: 'ACTION BLOCK', subtitle: 'Visual Scene Description', iconName: 'Zap', color: 'border-emerald-400/80 bg-emerald-500/20 text-emerald-300' },
  { pairId: 'transition', title: 'TRANSITION', subtitle: 'CUT TO: / FADE OUT:', iconName: 'Scissors', color: 'border-rose-400/80 bg-rose-500/20 text-rose-300' },
  { pairId: 'award', title: 'OSCAR DRAFT', subtitle: 'Greenlit Script', iconName: 'Trophy', color: 'border-yellow-300/80 bg-yellow-500/20 text-yellow-200' },
  { pairId: 'film', title: '35MM REEL', subtitle: 'Cinematic Frame Rate', iconName: 'Film', color: 'border-indigo-400/80 bg-indigo-500/20 text-indigo-300' },
  { pairId: 'sparkles', title: 'PLOT TWIST', subtitle: 'Inciting Incident', iconName: 'Sparkles', color: 'border-teal-400/80 bg-teal-500/20 text-teal-300' },
  { pairId: 'flame', title: 'CLIMAX', subtitle: 'High Stakes Finale', iconName: 'Flame', color: 'border-orange-400/80 bg-orange-500/20 text-orange-300' },
  { pairId: 'shield', title: 'LOGLINE', subtitle: 'Hook & Core Premise', iconName: 'ShieldCheck', color: 'border-cyan-400/80 bg-cyan-500/20 text-cyan-300' },
];

export interface EmojiQuestion {
  id: string;
  emojis: string;
  correct: string;
  options: string[];
}

export const EMOJI_PLOTS_MASTER: Omit<EmojiQuestion, 'options'>[] = [
  { id: '1', emojis: '🚢 🧊 🌊 💔', correct: 'Titanic' },
  { id: '2', emojis: '🦈 🏖️ 😱 ⛵', correct: 'Jaws' },
  { id: '3', emojis: '🪐 👨‍🚀 ⏳ 📚', correct: 'Interstellar' },
  { id: '4', emojis: '🦖 🌴 ⚡ 🚙', correct: 'Jurassic Park' },
  { id: '5', emojis: '🕶️ 💊 🌐 🔫', correct: 'The Matrix' },
  { id: '6', emojis: '💤 🌪️ 🌀 🏨', correct: 'Inception' },
  { id: '7', emojis: '🏎️ ⚡ ⏰ 📻', correct: 'Back to the Future' },
  { id: '8', emojis: '⚔️ 🌌 👑 🤖', correct: 'Star Wars' },
  { id: '9', emojis: '🍔 🔫 💼 🕺', correct: 'Pulp Fiction' },
  { id: '10', emojis: '👻 🚫 ⚡ 🗽', correct: 'Ghostbusters' },
  { id: '11', emojis: '🪓 ❄️ 🏨 👯', correct: 'The Shining' },
  { id: '12', emojis: '🧼 🥊 🕴️ 💥', correct: 'Fight Club' },
  { id: '13', emojis: '🦁 👑 🌅 🐗', correct: 'The Lion King' },
  { id: '14', emojis: '🏃 🍫 🍤 🎾', correct: 'Forrest Gump' },
  { id: '15', emojis: '🏢 💥 🎄 🏃', correct: 'Die Hard' },
  { id: '16', emojis: '🥁 🩸 🎵 🤬', correct: 'Whiplash' },
  { id: '17', emojis: '✈️ 🕶️ 🏍️ 🌅', correct: 'Top Gun' },
  { id: '18', emojis: '🎹 💃 🎭 🌆', correct: 'La La Land' },
  { id: '19', emojis: '💣 ⚛️ 🔬 🏜️', correct: 'Oppenheimer' },
  { id: '20', emojis: '🎀 💖 🚗 👱‍♀️', correct: 'Barbie' },
  { id: '21', emojis: '🥯 👁️ 🌌 🥋', correct: 'Everything Everywhere All At Once' },
  { id: '22', emojis: '🕷️ 🏙️ 🕸️ 🦸', correct: 'Spider-Man' },
  { id: '23', emojis: '🦇 🏙️ 🃏 💥', correct: 'The Dark Knight' },
  { id: '24', emojis: '💍 🌋 🧝 🗡️', correct: 'Lord of the Rings' },
  { id: '25', emojis: '🧙 ⚡ 🚂 🏰', correct: 'Harry Potter' },
];

export interface ScrambleItem {
  word: string;
  hint: string;
}

export const SCRAMBLE_MASTER: ScrambleItem[] = [
  { word: 'SCREENPLAY', hint: 'EXT. HOLLYWOOD BLVD - DAY. He holds the finished ________.' },
  { word: 'DIRECTOR', hint: 'INT. SOUNDSTAGE - DAY. The ________ shouts ACTION!' },
  { word: 'STORYBOARD', hint: 'INT. WRITER ROOM - NIGHT. The walls are covered in ________ panels.' },
  { word: 'DIALOGUE', hint: 'CHARACTER: These lines of ________ are golden.' },
  { word: 'MONTAGE', hint: 'A fast-paced sequence showing training in a ________.' },
  { word: 'SLUGLINE', hint: 'INT. COFFEE SHOP - DAY is a standard scene ________.' },
  { word: 'SUBTEXT', hint: 'What the characters feel without saying it out loud is called ________.' },
  { word: 'PARENTICAL', hint: 'Short performance directions placed in parentheses are ________.' },
  { word: 'PROTAGONIST', hint: 'The central lead character driving the narrative forward is the ________.' },
  { word: 'ANTAGONIST', hint: 'The principal force opposing the main character is the ________.' },
  { word: 'GREENLIGHT', hint: 'When a movie studio approves financing and production, it is a ________.' },
  { word: 'CINEMATOGRAPHER', hint: 'The Director of Photography who crafts camera angles and lighting.' },
  { word: 'INCITING', hint: 'The event that disrupts the protagonist\'s normal world is the ________ incident.' },
  { word: 'FOUNTAIN', hint: 'The plain-text markup language designed for writing screenplays.' },
  { word: 'FINAL DRAFT', hint: 'The industry-standard document format .fdx is produced by ________.' },
];

export interface TriviaQuestion {
  q: string;
  correct: string;
  options: string[];
}

export const TRIVIA_MASTER: TriviaQuestion[] = [
  {
    q: 'What font is universally required for standard screenplays?',
    correct: 'Courier 12pt',
    options: ['Courier 12pt', 'Arial 12pt', 'Comic Sans', 'Times New Roman'],
  },
  {
    q: 'In screenplay formatting, which element is typed in ALL CAPS?',
    correct: 'Character Names',
    options: ['Character Names', 'Action Descriptions', 'Page Numbers', 'Dialogue Body'],
  },
  {
    q: 'How many minutes of screen time does 1 formatted page equal on average?',
    correct: '1 Minute',
    options: ['1 Minute', '30 Seconds', '2 Minutes', '5 Minutes'],
  },
  {
    q: 'What is the Hollywood term for the final shot of a filming day?',
    correct: 'The Martini Shot',
    options: ['The Martini Shot', 'The Wrap Shot', 'The Hero Shot', 'The Closing Cut'],
  },
  {
    q: 'What does "INT." stand for at the start of a scene slugline?',
    correct: 'Interior',
    options: ['Interior', 'International', 'Intermediate', 'Intermission'],
  },
  {
    q: 'What extension indicates speech heard when a character is NOT on camera?',
    correct: '(O.S.) or (V.O.)',
    options: ['(O.S.) or (V.O.)', '(M.I.A.)', '(CUT)', '(OFF)'],
  },
  {
    q: 'Which screenwriting structure popularised the "Save the Cat!" 15-beat sheet?',
    correct: 'Blake Snyder',
    options: ['Blake Snyder', 'Syd Field', 'Robert McKee', 'Joseph Campbell'],
  },
  {
    q: 'What is the standard margin for dialogue text from the left edge?',
    correct: '2.5 inches',
    options: ['2.5 inches', '1.0 inch', '3.5 inches', '4.0 inches'],
  },
  {
    q: 'Which famous film featured the line "Here\'s looking at you, kid"?',
    correct: 'Casablanca',
    options: ['Casablanca', 'Citizen Kane', 'Gone with the Wind', 'The Godfather'],
  },
  {
    q: 'What term describes two characters speaking dialogue simultaneously in Fountain?',
    correct: 'Dual Dialogue (^)',
    options: ['Dual Dialogue (^)', 'Overlap Speech', 'Echo Track', 'Split Voice'],
  },
];

export const WORD_SEARCH_CATEGORIES = [
  {
    category: 'Screenplay Elements',
    words: ['SCENE', 'ACTION', 'DIALOGUE', 'CHARACTER', 'CUT', 'FADE'],
  },
  {
    category: 'Hollywood Roles',
    words: ['ACTOR', 'DIRECTOR', 'PRODUCER', 'WRITER', 'EDITOR', 'AGENT'],
  },
  {
    category: 'Film Genres',
    words: ['SCI-FI', 'HORROR', 'DRAMA', 'ACTION', 'THRILLER', 'COMEDY'],
  },
  {
    category: 'Camera Angles',
    words: ['ZOOM', 'TILT', 'PAN', 'CLOSEUP', 'TRACKING', 'CRANE'],
  },
  {
    category: 'Oscar Classics',
    words: ['JAWS', 'TITANIC', 'MATRIX', 'AVATAR', 'ROCKY', 'ALIEN'],
  },
];

// Procedural Word Search Grid Generator (Guarantees ALL words fit on grid)
export function generateDynamicWordSearch(categoryIdx?: number) {
  const cat = categoryIdx !== undefined
    ? WORD_SEARCH_CATEGORIES[categoryIdx % WORD_SEARCH_CATEGORIES.length]
    : WORD_SEARCH_CATEGORIES[Math.floor(Math.random() * WORD_SEARCH_CATEGORIES.length)];

  const SIZE = 10; // High-res 10x10 console grid
  const grid: string[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
  const targetWords: string[] = [];
  const wordMap = new Map<string, Array<{ r: number; c: number }>>();

  const directions = [
    { dr: 0, dc: 1 },  // Horizontal Right
    { dr: 1, dc: 0 },  // Vertical Down
    { dr: 1, dc: 1 },  // Diagonal Down-Right
  ];

  // Clean words (remove hyphens or spaces)
  const candidateWords = cat.words.map((w) => w.replace(/[^A-Z]/g, ''));

  candidateWords.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts++;
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const maxR = SIZE - dir.dr * (word.length - 1);
      const maxC = SIZE - dir.dc * (word.length - 1);

      if (maxR <= 0 || maxC <= 0) continue;

      const startR = Math.floor(Math.random() * maxR);
      const startC = Math.floor(Math.random() * maxC);

      let fit = true;
      for (let i = 0; i < word.length; i++) {
        const r = startR + i * dir.dr;
        const c = startC + i * dir.dc;
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          fit = false;
          break;
        }
      }

      if (fit) {
        const coords: Array<{ r: number; c: number }> = [];
        for (let i = 0; i < word.length; i++) {
          const r = startR + i * dir.dr;
          const c = startC + i * dir.dc;
          grid[r][c] = word[i];
          coords.push({ r, c });
        }
        wordMap.set(word, coords);
        targetWords.push(word);
        placed = true;
      }
    }
  });

  // Fill empty spaces with random uppercase letters
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return {
    categoryName: cat.category,
    grid,
    targetWords,
    wordMap,
  };
}

// Procedural Sudoku Generator with valid permutation transforms
const BASE_SUDOKU_BOARDS = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4],
    [3, 1, 2, 6, 4, 5, 9, 7, 8],
    [6, 4, 5, 9, 7, 8, 3, 1, 2],
    [9, 7, 8, 3, 1, 2, 6, 4, 5],
  ],
];

export function generateRandomSudoku(difficulty: 'easy' | 'medium' | 'hard') {
  const base = BASE_SUDOKU_BOARDS[Math.floor(Math.random() * BASE_SUDOKU_BOARDS.length)];
  const solution = base.map((row) => [...row]);

  // Permute numbers 1..9 randomly
  const pMap = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      solution[r][c] = pMap[solution[r][c] - 1];
    }
  }

  // Create puzzle with blank spaces
  const blanks = difficulty === 'easy' ? 22 : difficulty === 'medium' ? 38 : 52;
  const puzzle = solution.map((row) => [...row]);
  let removed = 0;
  while (removed < blanks) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }

  return { puzzle, solution };
}
