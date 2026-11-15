import { useState, useEffect } from 'react';
import { getRandomStoryTwist } from './ideaSprintTwists';
import { SprintPhase } from './ideaSprintTypes';

export function useIdeaSprintActiveState(isOpen: boolean, initialQuestion: string) {
  const [phase, setPhase] = useState<SprintPhase>('LAUNCHER');
  const [question, setQuestion] = useState(initialQuestion);
  const [durationMins, setDurationMins] = useState(3);
  const [remainingSecs, setRemainingSecs] = useState(180);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [livesRemaining, setLivesRemaining] = useState(3);
  const [flowMode, setFlowMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [idleSeconds, setIdleSeconds] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPhase('LAUNCHER');
      setQuestion(initialQuestion);
      setDurationMins(3);
      setRawText('');
      setLivesRemaining(3);
      setStreakCount(0);
      setIdleSeconds(0);
    }
  }, [isOpen, initialQuestion]);

  useEffect(() => {
    let timer: number;
    if (phase === 'ACTIVE' && remainingSecs > 0) {
      timer = window.setInterval(() => {
        setRemainingSecs((s) => s - 1);
        setElapsedSecs((e) => e + 1);
        setIdleSeconds((i) => i + 1);
      }, 1000);
    } else if (phase === 'ACTIVE' && remainingSecs === 0) {
      setPhase('SUMMARY');
    }
    return () => clearInterval(timer);
  }, [phase, remainingSecs]);

  const handleStart = () => {
    setRemainingSecs(durationMins * 60);
    setElapsedSecs(0);
    setIdleSeconds(0);
    setStreakCount(0);
    setPhase('ACTIVE');
  };

  const handleUseLife = () => {
    if (livesRemaining > 0) {
      setLivesRemaining((l) => l - 1);
      const twist = getRandomStoryTwist();
      setRawText((prev) => (prev ? `${prev}\n⚡ TWIST: ${twist}` : `⚡ TWIST: ${twist}`));
    }
  };

  const handleTextChange = (val: string) => {
    setRawText(val);
    setIdleSeconds(0);
    setStreakCount((s) => s + 1);
  };

  const surgeMultiplier = streakCount >= 10 ? '3X SUPER SURGE ⚡' : streakCount >= 4 ? '2X FLOW SURGE 🔥' : null;
  const isBurnRateActive = idleSeconds >= 7 && phase === 'ACTIVE';

  return {
    phase, setPhase, question, setQuestion, durationMins, setDurationMins,
    remainingSecs, elapsedSecs, livesRemaining, flowMode, setFlowMode,
    rawText, surgeMultiplier, isBurnRateActive, handleStart, handleUseLife, handleTextChange,
  };
}
