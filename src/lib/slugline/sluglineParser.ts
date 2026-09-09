import { ScreenplayElement } from '../../types';
import { STANDARD_PREFIXES } from './sluglineConstants';

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
