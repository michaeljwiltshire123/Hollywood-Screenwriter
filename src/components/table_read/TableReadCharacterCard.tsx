import React from 'react';
import { Volume2, VolumeX, User } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';
import { TimbrePreset } from '../../lib/tableReadTypes';
import { TIMBRE_PRESETS } from '../../lib/speechVoiceManager';
import { VoiceSelectDropdown } from './VoiceSelectDropdown';

interface TableReadCharacterCardProps {
  characterName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  selectedTimbre: TimbrePreset;
  onChangeVoice: (voiceURI: string) => void;
  onChangeTimbre: (timbre: TimbrePreset) => void;
  onTestVoice: () => void;
  m: ModalTheme;
}

const TIMBRES: TimbrePreset[] = [
  'MALE', 'FEMALE', 'OLD', 'BABY', 'ALIEN', 'CHIPMUNK', 'MONSTER', 'SURFER', 'ROBOT', 'GHOST',
];

export const TableReadCharacterCard: React.FC<TableReadCharacterCardProps> = ({
  characterName, isMuted, onToggleMute, voices, selectedVoiceURI,
  selectedTimbre, onChangeVoice, onChangeTimbre, onTestVoice, m,
}) => {
  return (
    <div className="p-2.5 border rounded-xl space-y-2 shadow-2xs transition" style={m.cardStyle}>
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <User className="w-3.5 h-3.5 shrink-0" style={m.accentStyle} />
          <span className="font-bold text-xs truncate" title={characterName}>{characterName}</span>
        </div>
        <button
          onClick={onToggleMute}
          className="px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border shrink-0"
          style={isMuted ? { backgroundColor: '#BE123C', borderColor: '#BE123C', color: '#FFFFFF' } : m.headerStyle}
          title={isMuted ? 'Character is muted for live rehearsal' : 'Character is voiced'}
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" style={m.accentStyle} />}
          <span>{isMuted ? 'MUTED' : 'VOICED'}</span>
        </button>
      </div>

      {!isMuted && (
        <div className="space-y-1.5 pt-0.5">
          <VoiceSelectDropdown
            characterName={characterName}
            voices={voices}
            selectedVoiceURI={selectedVoiceURI}
            selectedTimbre={selectedTimbre}
            onChangeVoice={onChangeVoice}
            onTestVoice={onTestVoice}
            m={m}
          />
          <div className="flex flex-wrap gap-1">
            {TIMBRES.map((tKey) => {
              const def = TIMBRE_PRESETS[tKey];
              return (
                <button
                  key={tKey}
                  onClick={() => onChangeTimbre(tKey)}
                  className="text-[9px] px-1.5 py-0.5 rounded border font-sans font-medium transition cursor-pointer"
                  style={selectedTimbre === tKey ? m.primaryBtnStyle : m.secondaryBtnStyle}
                  title={def.description}
                >
                  {def.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
