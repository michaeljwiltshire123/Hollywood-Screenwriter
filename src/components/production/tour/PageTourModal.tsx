import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProductionTab } from './tourTypes';
import { getTourStepsForTab } from './otherTourBlueprints';
import { useElementTracker } from './useElementTracker';
import { SpotlightOverlay } from './SpotlightOverlay';
import { TourTooltipCard } from './TourTooltipCard';

interface PageTourModalProps {
  isOpen: boolean;
  activeTab: ProductionTab;
  onClose: () => void;
}

export const PageTourModal: React.FC<PageTourModalProps> = ({ isOpen, activeTab, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const steps = getTourStepsForTab(activeTab);

  useEffect(() => {
    if (isOpen) setCurrentStepIndex(0);
  }, [isOpen, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const currentStep = steps[currentStepIndex] || null;
  const targetSelector = currentStep ? currentStep.targetSelector : null;
  const rect = useElementTracker(isOpen ? targetSelector : null);

  if (!isOpen || !currentStep) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return createPortal(
    <>
      <SpotlightOverlay rect={rect} onOverlayClick={onClose} />
      <TourTooltipCard
        step={currentStep}
        rect={rect}
        currentIndex={currentStepIndex}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={onClose}
      />
    </>,
    document.body
  );
};
