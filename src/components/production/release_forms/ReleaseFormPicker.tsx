import React from 'react';
import {
  FileCheck, MapPin, Megaphone, Music, Palette, Plus, User, UserPlus, Users,
} from 'lucide-react';
import { ReleaseFormItem } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { RELEASE_FORM_OPTIONS, ReleaseFormOption } from './releaseFormOptions';

interface ReleaseFormPickerProps {
  mt: ModalThemeStyles;
  variant: 'empty' | 'toolbar';
  onSelect: (type: ReleaseFormItem['formType']) => void;
}

const ICONS: Record<ReleaseFormItem['formType'], React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  TALENT: User,
  MINOR: Users,
  LOCATION: MapPin,
  EXTRA: UserPlus,
  MATERIALS: Palette,
  MUSIC: Music,
  CROWD_NOTICE: Megaphone,
};

const PillButton: React.FC<{
  opt: ReleaseFormOption;
  mt: ModalThemeStyles;
  spacious: boolean;
  onSelect: (type: ReleaseFormItem['formType']) => void;
}> = ({ opt, mt, spacious, onSelect }) => {
  const Icon = ICONS[opt.type];
  return (
    <button
      type="button"
      onClick={() => onSelect(opt.type)}
      title={opt.hint}
      className={
        spacious
          ? 'group flex items-center gap-3 px-5 py-3.5 rounded-full border text-left transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'
          : 'group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-95'
      }
      style={mt.secondaryBtnStyle}
    >
      <span
        className={spacious ? 'w-9 h-9 rounded-full flex items-center justify-center shrink-0' : 'w-6 h-6 rounded-full flex items-center justify-center shrink-0'}
        style={{ backgroundColor: mt.theme.topBottomBars, color: mt.theme.accentText }}
      >
        <Icon className={spacious ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </span>
      <span className="min-w-0">
        <span className={spacious ? 'flex items-center gap-1.5 text-sm font-bold leading-tight' : 'flex items-center gap-1 whitespace-nowrap'}>
          <Plus className="w-3.5 h-3.5 shrink-0 opacity-75 group-hover:opacity-100" style={mt.accentStyle} />
          <span>{spacious ? opt.title : opt.pillLabel}</span>
        </span>
        {spacious && <span className="block text-xs mt-0.5 opacity-80" style={mt.mutedStyle}>{opt.hint}</span>}
      </span>
    </button>
  );
};

export const ReleaseFormPicker: React.FC<ReleaseFormPickerProps> = ({ mt, variant, onSelect }) => {
  if (variant === 'toolbar') {
    return (
      <div id="tour-releases-selector" className="flex flex-wrap items-center gap-2">
        {RELEASE_FORM_OPTIONS.map((opt) => (
          <PillButton key={opt.type} opt={opt} mt={mt} spacious={false} onSelect={onSelect} />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border p-6 sm:p-10 text-center space-y-6" style={mt.cardStyle}>
      <div className="max-w-xl mx-auto space-y-2">
        <div className="w-11 h-11 rounded-full mx-auto flex items-center justify-center border" style={{ ...mt.subCardStyle, ...mt.accentStyle }}>
          <FileCheck className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold tracking-tight">Choose a Release Form to Create</h3>
        <p className="text-sm leading-relaxed" style={mt.mutedStyle}>
          Your release library is empty. Pick any form below to customise the wording, add cast or location details, and print ready-to-sign copies.
        </p>
      </div>

      <div id="tour-releases-selector" className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
        {RELEASE_FORM_OPTIONS.map((opt) => (
          <PillButton key={opt.type} opt={opt} mt={mt} spacious={true} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};
