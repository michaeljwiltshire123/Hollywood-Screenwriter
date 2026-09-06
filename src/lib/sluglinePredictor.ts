import { ScreenplayElement } from '../types';

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

/**
 * Extract all unique locations used previously across the entire screenplay
 */
export function extractScriptLocations(elements: ScreenplayElement[]): string[] {
  const locations = new Set<string>();
  const prefixRegex = /^(INT\.\/EXT\.|EXT\.\/INT\.|INT\.|EXT\.|I\/E\.)\s*/i;

  elements.forEach((elem) => {
    if (elem.type === 'SCENE HEADING' && elem.content?.trim()) {
      let content = elem.content.trim().toUpperCase();
      content = content.replace(prefixRegex, '');
      const parts = content.split(/\s+-\s+/);
      const loc = parts[0]?.trim();
      if (loc && loc.length > 1 && !STANDARD_PREFIXES.includes(loc)) {
        locations.add(loc);
      }
    }
  });

  return Array.from(locations);
}

/**
 * Parses current slugline text into prefix, location, and time parts
 */
export function parseSluglineText(rawText: string): {
  prefix: string | null;
  location: string;
  hasDash: boolean;
  timeQuery: string;
} {
  const upper = rawText.toUpperCase();
  let matchedPrefix: string | null = null;

  for (const pref of STANDARD_PREFIXES) {
    if (upper.startsWith(pref)) {
      matchedPrefix = pref;
      break;
    }
  }

  if (!matchedPrefix) {
    return {
      prefix: null,
      location: upper.trim(),
      hasDash: false,
      timeQuery: '',
    };
  }

  const remainder = upper.substring(matchedPrefix.length).replace(/^\s+/, '');
  const dashIndex = remainder.indexOf(' - ');

  if (dashIndex !== -1) {
    const location = remainder.substring(0, dashIndex).trim();
    const timeQuery = remainder.substring(dashIndex + 3).trim();
    return {
      prefix: matchedPrefix,
      location,
      hasDash: true,
      timeQuery,
    };
  }

  return {
    prefix: matchedPrefix,
    location: remainder.trim(),
    hasDash: remainder.endsWith('-') || remainder.endsWith(' -'),
    timeQuery: '',
  };
}

/**
 * Computes predictive suggestions for Scene Heading typing
 */
export function getSluglineSuggestions(
  currentText: string,
  scriptLocations: string[]
): SluglineSuggestion[] {
  const upper = currentText.toUpperCase().trimStart();
  const parsed = parseSluglineText(upper);
  const suggestions: SluglineSuggestion[] = [];

  // 1. PREFIX PHASE: Empty or beginning without a full prefix
  if (!parsed.prefix) {
    const query = upper.trim();
    const matchingPrefixes = STANDARD_PREFIXES.filter(
      (p) => !query || p.startsWith(query) || p.replace(/[^A-Z]/g, '').startsWith(query.replace(/[^A-Z]/g, ''))
    );

    matchingPrefixes.forEach((p) => {
      suggestions.push({
        text: p,
        category: 'PREFIX',
        completionText: `${p} `,
      });
    });

    return suggestions;
  }

  const prefix = parsed.prefix;

  // 2. TIME OF DAY PHASE: Has dash or location followed by dash/space
  if (parsed.hasDash || upper.includes(' -')) {
    const timeQuery = parsed.timeQuery.trim();
    const matchingTimes = STANDARD_TIMES_OF_DAY.filter(
      (t) => !timeQuery || t.startsWith(timeQuery) || t.includes(timeQuery)
    );

    matchingTimes.forEach((t) => {
      suggestions.push({
        text: `- ${t}`,
        category: 'TIME',
        completionText: `${prefix} ${parsed.location} - ${t}`,
      });
    });

    return suggestions;
  }

  // 3. LOCATION PHASE: Prefix selected, now typing location
  const locQuery = parsed.location.trim();
  const allLocations = Array.from(new Set([...scriptLocations, ...COMMON_LOCATIONS]));

  const matchingLocations = allLocations.filter(
    (loc) => !locQuery || loc.includes(locQuery)
  );

  matchingLocations.slice(0, 6).forEach((loc) => {
    suggestions.push({
      text: loc,
      category: 'LOCATION',
      completionText: `${prefix} ${loc} - `,
    });
  });

  // Also offer immediate Time of Day completions if location has been typed
  if (locQuery.length >= 2) {
    STANDARD_TIMES_OF_DAY.slice(0, 4).forEach((t) => {
      suggestions.push({
        text: `${locQuery} - ${t}`,
        category: 'TIME',
        completionText: `${prefix} ${locQuery} - ${t}`,
      });
    });
  }

  return suggestions;
}

/**
 * Computes the ghost text suggestion (e.g. " - DAY") for inline Smart Compose.
 * Returns a string whenever guidance is appropriate, or null if the heading is complete.
 */
export function getGhostText(currentText: string): string | null {
  const raw = currentText || '';
  const upper = raw.toUpperCase().trimStart();
  const trimmed = upper.trim();

  // 1. If completely blank: show standard template guidance
  if (!trimmed) {
    return 'INT. LOCATION - DAY';
  }

  // 2. If heading already has a complete time of day: no ghost text needed
  const hasCompleteTime = STANDARD_TIMES_OF_DAY.some(
    (t) => upper.endsWith(` - ${t}`) || upper.endsWith(` -${t}`) || upper.endsWith(`-${t}`)
  );
  if (hasCompleteTime) {
    return null;
  }

  // 3. User is typing prefix from single letter onwards
  if (upper === 'I') return 'NT. LOCATION - DAY';
  if (upper === 'IN') return 'T. LOCATION - DAY';
  if (upper === 'INT') return '. LOCATION - DAY';
  if (upper === 'INT.') return ' LOCATION - DAY';
  if (upper === 'E') return 'XT. LOCATION - DAY';
  if (upper === 'EX') return 'T. LOCATION - DAY';
  if (upper === 'EXT') return '. LOCATION - DAY';
  if (upper === 'EXT.') return ' LOCATION - DAY';
  if (upper === 'I/' || upper === 'INT/') return 'EXT. LOCATION - DAY';
  if (upper === 'INT./' || upper === 'INT./E') return 'XT. LOCATION - DAY';

  // 4. User typed prefix with trailing space: guide location and time
  if (
    upper === 'INT. ' ||
    upper === 'EXT. ' ||
    upper === 'INT./EXT. ' ||
    upper === 'EXT./INT. ' ||
    upper === 'I/E. '
  ) {
    return 'LOCATION - DAY';
  }

  // 5. If user typed hyphen or hyphen-space at end
  if (upper.endsWith(' - ') || upper.endsWith(' -')) {
    return 'DAY';
  }
  if (upper.endsWith('-')) {
    return ' DAY';
  }

  // 6. If user typed hyphen followed by partial time of day
  const lastDashIdx = upper.lastIndexOf(' - ');
  if (lastDashIdx !== -1) {
    const typedTime = upper.substring(lastDashIdx + 3).trim();
    if (typedTime) {
      const match = STANDARD_TIMES_OF_DAY.find((t) => t.startsWith(typedTime));
      if (match && match !== typedTime) {
        return match.substring(typedTime.length);
      }
      return null;
    }
  }

  // 7. General case: User has typed location or started typing (with or without prefix)
  // e.g. "INT. OFFICE", "EXT. HIGHWAY", "INT. BEDROOM", "KITCHEN", "COFFEE SHOP"
  if (raw.endsWith(' ')) {
    return '- DAY';
  }
  return ' - DAY';
}
