import { TimbrePreset, VoiceGender } from './tableReadTypes';

const FEMALE_NAMES = [
  'female', 'woman', 'girl', 'jenny', 'sonia', 'libby', 'maisie', 'aria', 'ava', 'emma',
  'michelle', 'ana', 'natasha', 'clara', 'emily', 'neerja', 'molly', 'leah', 'luna', 'hazel',
  'susan', 'samantha', 'karen', 'serena', 'zira', 'victoria', 'eva', 'fiona', 'tessa', 'moira',
  'veena', 'kate', 'kathy', 'princess', 'vicki', 'agnes', 'catherine', 'rosa', 'google us english',
  'google uk english female', 'allison', 'joelle', 'cora', 'steffani', 'sara', 'nora', 'olivia',
];

const MALE_NAMES = [
  'male', 'man', 'boy', 'guy', 'ryan', 'daniel', 'david', 'george', 'oliver', 'thomas',
  'richard', 'mark', 'alex', 'fred', 'aaron', 'arthur', 'gordon', 'rishi', 'lee', 'liam',
  'connor', 'wayne', 'william', 'christopher', 'eric', 'steffan', 'andrew', 'brian', 'prabhat',
  'abeo', 'elimu', 'luke', 'mitchell', 'james', 'sean', 'nick', 'ralph', 'albert', 'bruce',
  'junior', 'jorge', 'google uk english male', 'tony', 'jason', 'davis', 'roger', 'alfie',
];

function matchesWholeWord(haystack: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i').test(haystack);
}

export function classifyVoiceGender(voice: SpeechSynthesisVoice): VoiceGender {
  const name = (voice.name || '').toLowerCase();
  if (matchesWholeWord(name, 'female') || FEMALE_NAMES.some((k) => matchesWholeWord(name, k))) {
    return 'FEMALE';
  }
  if (matchesWholeWord(name, 'male') || MALE_NAMES.some((k) => matchesWholeWord(name, k))) {
    return 'MALE';
  }
  return 'NEUTRAL';
}

export function autoDetectCharacterTimbre(name: string): TimbrePreset {
  const upper = name.toUpperCase();
  const femaleWords = [
    'MARY', 'SARAH', 'EMMA', 'LUCY', 'ANNA', 'JANE', 'LILY', 'CLAIRE', 'SOPHIE', 'ELENA',
    'RACHEL', 'KATE', 'ALICE', 'GRACE', 'MAYA', 'CHLOE', 'MOM', 'MOTHER', 'GIRL', 'WOMAN', 'QUEEN', 'LADY',
  ];
  const oldWords = ['OLD', 'ELDER', 'GRANDPA', 'GRANDMA', 'DOCTOR', 'PROFESSOR', 'FATHER', 'PRIEST', 'VETERAN'];
  const childWords = ['BABY', 'KID', 'CHILD', 'BOY', 'LITTLE', 'TODDLER', 'PUPPY'];
  const alienWords = ['ALIEN', 'ROBOT', 'DROID', 'CYBORG', 'CREATURE', 'MONSTER'];

  if (femaleWords.some((w) => matchesWholeWord(upper, w))) return 'FEMALE';
  if (oldWords.some((w) => matchesWholeWord(upper, w))) return 'OLD';
  if (childWords.some((w) => matchesWholeWord(upper, w))) return 'BABY';
  if (alienWords.some((w) => matchesWholeWord(upper, w))) return 'ALIEN';
  return 'MALE';
}

export function getVoiceRateCalibration(voice?: SpeechSynthesisVoice): number {
  if (!voice) return 1.0;
  const n = voice.name.toLowerCase();
  // Normalise famously fast or slow OS/Browser synthesisers so cast members match pace
  if (n.includes('google us english')) return 0.92;
  if (n.includes('zira') || n.includes('hazel')) return 1.06;
  if (n.includes('daniel') || n.includes('george')) return 1.04;
  return 1.0;
}
