import { STANDARD_TIMES_OF_DAY, hasCompleteTimeOfDay } from './sluglineConstants';

/**
 * Computes the ghost text suggestion (e.g. " - DAY") for inline Smart Compose.
 */
export function getGhostText(currentText: string): string | null {
  const raw = currentText || '';
  const upper = raw.toUpperCase().trimStart();
  const trimmed = upper.trim();

  if (!trimmed) {
    return 'INT. LOCATION - DAY';
  }

  if (hasCompleteTimeOfDay(upper)) {
    return null;
  }

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

  if (
    upper === 'INT. ' ||
    upper === 'EXT. ' ||
    upper === 'INT./EXT. ' ||
    upper === 'EXT./INT. ' ||
    upper === 'I/E. '
  ) {
    return 'LOCATION - DAY';
  }

  if (upper.endsWith(' - ') || upper.endsWith(' -')) {
    return 'DAY';
  }
  if (upper.endsWith('-')) {
    return ' DAY';
  }

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

  if (raw.endsWith(' ')) {
    return '- DAY';
  }
  return ' - DAY';
}
