import React from 'react';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { SynopsisHowToGuide } from './SynopsisHowToGuide';
import { SynopsisCompsInput } from './SynopsisCompsInput';

interface SynopsisTopControlsProps {
  isGuideOpen: boolean;
  onToggleGuide: () => void;
  comps: string;
  onChangeComps: (val: string) => void;
  mt: ModalThemeStyles;
}

export const SynopsisTopControls: React.FC<SynopsisTopControlsProps> = ({
  isGuideOpen, onToggleGuide, comps, onChangeComps, mt,
}) => {
  return (
    <div className="shrink-0 space-y-2.5">
      {!isGuideOpen ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-7">
            <SynopsisHowToGuide isOpen={false} onToggle={onToggleGuide} mt={mt} />
          </div>
          <div className="md:col-span-5">
            <SynopsisCompsInput comps={comps} onChangeComps={onChangeComps} mt={mt} />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <SynopsisHowToGuide isOpen={true} onToggle={onToggleGuide} mt={mt} />
          <div className="max-w-md">
            <SynopsisCompsInput comps={comps} onChangeComps={onChangeComps} mt={mt} />
          </div>
        </div>
      )}
    </div>
  );
};
