import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function scrollElementToEyeLevel(element: Element) {
  const scrollContainer = document.getElementById('production-modal-scroll-container');
  if (!scrollContainer) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    return;
  }
  const containerRect = scrollContainer.getBoundingClientRect();
  const elRect = element.getBoundingClientRect();
  const relativeTop = elRect.top - containerRect.top;

  if (relativeTop >= containerRect.height * 0.15 && relativeTop <= containerRect.height * 0.55) {
    return;
  }

  const desiredTop = containerRect.height * 0.25;
  const scrollDiff = relativeTop - desiredTop;
  scrollContainer.scrollBy({ top: scrollDiff, behavior: 'smooth' });
}

export function useElementTracker(targetSelector: string | null) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const rafRef = useRef<number | null>(null);

  const updateRect = useCallback(() => {
    if (!targetSelector) {
      setRect(null);
      return;
    }
    const element = document.querySelector(targetSelector);
    if (!element) {
      setRect(null);
      return;
    }
    const r = element.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [targetSelector]);

  useEffect(() => {
    updateRect();
    if (!targetSelector) return;

    const element = document.querySelector(targetSelector);
    if (element) {
      scrollElementToEyeLevel(element);
    }

    const startTime = Date.now();
    const glideLoop = () => {
      updateRect();
      if (Date.now() - startTime < 650) {
        rafRef.current = requestAnimationFrame(glideLoop);
      }
    };
    rafRef.current = requestAnimationFrame(glideLoop);

    const handleScrollOrResize = () => updateRect();
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    let observer: ResizeObserver | null = null;
    if (element) {
      observer = new ResizeObserver(() => updateRect());
      observer.observe(element);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      if (observer) observer.disconnect();
    };
  }, [targetSelector, updateRect]);

  return rect;
}
