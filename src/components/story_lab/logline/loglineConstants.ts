export interface LoglineQuestionDef {
  id: keyof Omit<import('../../../types').LoglineData, 'order' | 'text'>;
  label: string;
  placeholder: string;
  hint: string;
}

export const LOGLINE_QUESTIONS: LoglineQuestionDef[] = [
  {
    id: 'protagonist',
    label: '1. Who is your main protagonist?',
    placeholder: 'e.g., A reckless teenager, a cynical blacksmith, a gentle arcade villain',
    hint: 'Give their name or role plus one defining flaw or unique trait.',
  },
  {
    id: 'goal',
    label: '2. What do they want?',
    placeholder: 'e.g., get their parents to fall in love, rescue their true love, win a gold medal',
    hint: 'State their clear, driving objective for the story.',
  },
  {
    id: 'obstacle',
    label: '3. What is standing in their way?',
    placeholder: 'e.g., erasing themselves from existence, an evil prince, being hated by everyone',
    hint: 'The major force, antagonist, or trap blocking their path.',
  },
  {
    id: 'stakes',
    label: '4. What is at stake (why does it matter)?',
    placeholder: 'e.g., or they will never be born, or the princess marries the villain forever',
    hint: 'The catastrophic consequence if they fail.',
  },
  {
    id: 'hook',
    label: '5. What is the attention hook?',
    placeholder: 'e.g., using a DeLorean time machine, in a fantasy book read by a grandfather',
    hint: 'The unique concept, unusual setting, or clever twist.',
  },
];

export interface ClassicLoglineExample {
  title: string;
  hook: string;
  protagonist: string;
  goal: string;
  obstacle: string;
  stakes: string;
  logline: string;
}

export const CLASSIC_LOGLINE_EXAMPLES: ClassicLoglineExample[] = [
  {
    title: 'Back to the Future',
    hook: 'Using a plutonium-powered DeLorean time machine',
    protagonist: 'a quirky California teenager',
    goal: 'must unite his teenage high school parents',
    obstacle: 'while avoiding his mother’s romantic advances',
    stakes: 'or accidentally erase himself and his siblings from existence.',
    logline: 'Using a plutonium-powered DeLorean time machine, a quirky California teenager must unite his teenage high school parents while avoiding his mother’s romantic advances, or erase himself from existence.',
  },
  {
    title: 'The Princess Bride',
    hook: 'In a magical fairy tale realm',
    protagonist: 'a farmhand-turned-pirate',
    goal: 'must rescue his kidnapped childhood sweetheart',
    obstacle: 'surviving sword fights, rodents of unusual size, and an evil prince',
    stakes: 'before she is forced into a loveless marriage.',
    logline: 'In a magical fairy tale realm, a farmhand-turned-pirate must rescue his kidnapped childhood sweetheart, surviving sword fights and an evil prince before she is forced into a loveless marriage.',
  },
  {
    title: 'Wreck-It Ralph',
    hook: 'Inside a bustling arcade cabinet',
    protagonist: 'a tired 30-year video game villain',
    goal: 'sneaks into a modern shooter game to win a hero’s gold medal',
    obstacle: 'but accidentally unleashes a deadly cyber-virus',
    stakes: 'that threatens to unplug every game in the arcade.',
    logline: 'Inside a bustling arcade cabinet, a tired 30-year video game villain sneaks into a modern shooter to win a hero’s medal, but accidentally unleashes a cyber-virus threatening every game in the arcade.',
  },
];
