export interface SluglineSuggestion {
  text: string;
  category: 'PREFIX' | 'LOCATION' | 'TIME';
  completionText: string;
}

export const STANDARD_PREFIXES = [
  'INT.',
  'EXT.',
  'INT./EXT.',
  'EXT./INT.',
  'I/E.',
];

export const STANDARD_TIMES_OF_DAY = [
  'DAY',
  'NIGHT',
  'CONTINUOUS',
  'LATER',
  'MOMENTS LATER',
  'MORNING',
  'EVENING',
  'AFTERNOON',
  'DUSK',
  'DAWN',
  'SAME TIME',
  'MAGIC HOUR',
];

export const COMMON_LOCATIONS = [
  'LIVING ROOM',
  'BEDROOM',
  'KITCHEN',
  'OFFICE',
  'HALLWAY',
  'BATHROOM',
  'STREET',
  'ALLEY',
  'CAR',
  'PARKING LOT',
  'WAREHOUSE',
  'RESTAURANT',
  'COFFEE SHOP',
  'BAR',
  'HOSPITAL',
  'HOTEL ROOM',
  'ROOFTOP',
  'BASEMENT',
  'PARK',
  'AIRPORT',
];

export function hasCompleteTimeOfDay(text: string): boolean {
  if (!text) return false;
  const upper = text.toUpperCase().trim();
  return STANDARD_TIMES_OF_DAY.some(
    (t) =>
      upper.endsWith(` - ${t}`) ||
      upper.endsWith(` -${t}`) ||
      upper.endsWith(`-${t}`) ||
      upper.endsWith(` ${t}`)
  );
}
