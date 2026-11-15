import React, { useEffect } from 'react';

interface StoryArcTabContentProps {
  onOpenStoryArc: () => void;
}

export const StoryArcTabContent: React.FC<StoryArcTabContentProps> = ({ onOpenStoryArc }) => {
  useEffect(() => {
    onOpenStoryArc();
  }, [onOpenStoryArc]);

  return null;
};
