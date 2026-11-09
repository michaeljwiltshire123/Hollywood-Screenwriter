import React, { useRef } from 'react';

export function useTimeWheelScroller(onStep: (direction: number) => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = (direction: number) => {
    onStep(direction);
    stopHold();
    timerRef.current = setInterval(() => onStep(direction), 120);
  };

  const stopHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    onStep(e.deltaY > 0 ? 1 : -1);
  };

  return { startHold, stopHold, handleWheel };
}
