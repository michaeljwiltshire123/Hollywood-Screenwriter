import React, { useRef, useEffect } from 'react';
import { ScreenplayElement } from '../../types';
import { ModalTheme } from '../../lib/modalTheme';
import { WordBoundary } from '../../lib/tableReadTypes';
import { TableReadElementCard } from './TableReadElementCard';

interface TableReadScriptViewerProps {
  elements: ScreenplayElement[];
  currentIndex: number;
  mutedCharacters: Record<string, boolean>;
  wordBoundary: WordBoundary | null;
  rehearsalSecondsLeft: number;
  onAdvanceLine: () => void;
  onSelectIndex: (idx: number) => void;
  m: ModalTheme;
}

export const TableReadScriptViewer: React.FC<TableReadScriptViewerProps> = ({
  elements,
  currentIndex,
  mutedCharacters,
  wordBoundary,
  rehearsalSecondsLeft,
  onAdvanceLine,
  onSelectIndex,
  m,
}) => {
  const activeElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    activeElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentIndex]);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono">
      {elements.map((elem, idx) => {
        const isActive = idx === currentIndex;
        let activeCharName = '';
        if (elem.type === 'CHARACTER') {
          activeCharName = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
        } else if (elem.type === 'DIALOGUE' && idx > 0) {
          const prev = elements[idx - 1];
          if (prev?.type === 'CHARACTER') {
            activeCharName = prev.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
          }
        }
        const isMuted = !!(activeCharName && mutedCharacters[activeCharName]);

        return (
          <TableReadElementCard
            key={elem.id}
            elem={elem}
            isActive={isActive}
            isMuted={isMuted}
            wordBoundary={isActive ? wordBoundary : null}
            rehearsalSecondsLeft={rehearsalSecondsLeft}
            onAdvanceLine={onAdvanceLine}
            onSelect={() => onSelectIndex(idx)}
            cardRef={isActive ? activeElementRef : null}
            m={m}
          />
        );
      })}
    </div>
  );
};
