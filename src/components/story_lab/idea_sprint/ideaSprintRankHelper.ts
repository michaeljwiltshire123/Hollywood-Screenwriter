export function calculateSprintRank(ideaCount: number): { rankTitle: string; badgeColor: string } {
  if (ideaCount >= 15) {
    return { rankTitle: 'Brainstorming Legend', badgeColor: 'bg-amber-500 text-slate-950 font-black' };
  }
  if (ideaCount >= 10) {
    return { rankTitle: 'Sprint Master', badgeColor: 'bg-emerald-600 text-white font-bold' };
  }
  if (ideaCount >= 6) {
    return { rankTitle: 'Breakthrough Writer', badgeColor: 'bg-blue-600 text-white font-bold' };
  }
  if (ideaCount >= 3) {
    return { rankTitle: 'Warm-up Champion', badgeColor: 'bg-indigo-600 text-white font-semibold' };
  }
  return { rankTitle: 'Idea Explorer', badgeColor: 'bg-slate-600 text-white font-medium' };
}

export function calculateIdeasPerMinute(ideaCount: number, elapsedSeconds: number): string {
  if (elapsedSeconds <= 0) return '0.0';
  const mins = elapsedSeconds / 60;
  return (ideaCount / mins).toFixed(1);
}
