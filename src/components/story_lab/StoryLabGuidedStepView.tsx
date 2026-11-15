import React from 'react';
import { StoryLabStepEmotionClimax } from './StoryLabStepEmotionClimax';
import { StoryLabStepRhymeMiddle } from './StoryLabStepRhymeMiddle';

interface StoryLabGuidedStepViewProps {
  step: number;
  emotion: string;
  value: string;
  onChangeValue: (val: string) => void;
  onLaunchSprint?: (question: string) => void;
}

export const StoryLabGuidedStepView: React.FC<StoryLabGuidedStepViewProps> = ({
  step, emotion, value, onChangeValue, onLaunchSprint,
}) => {
  if (step <= 1) {
    return (
      <StoryLabStepEmotionClimax
        step={step}
        emotion={emotion}
        value={value}
        onChangeValue={onChangeValue}
        onLaunchSprint={onLaunchSprint}
      />
    );
  }

  return (
    <StoryLabStepRhymeMiddle
      step={step}
      value={value}
      onChangeValue={onChangeValue}
      onLaunchSprint={onLaunchSprint}
    />
  );
};

