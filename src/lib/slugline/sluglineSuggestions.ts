import {
  SluglineSuggestion,
  STANDARD_PREFIXES,
  STANDARD_TIMES_OF_DAY,
  COMMON_LOCATIONS,
  hasCompleteTimeOfDay,
} from './sluglineConstants';
import { parseSluglineText } from './sluglineParser';

/**
 * Computes predictive suggestions for Scene Heading typing
 */
export function getSluglineSuggestions(
  currentText: string,
  scriptLocations: string[]
): SluglineSuggestion[] {
  const upper = currentText.toUpperCase().trimStart();

  // If the scene heading already has a completed time of day, close the suggestion box
  if (hasCompleteTimeOfDay(upper)) {
    return [];
  }

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
