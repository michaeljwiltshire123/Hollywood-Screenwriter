import React from 'react';
import { Mic } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';
import { TableReadNarratorCard } from './TableReadNarratorCard';
import { TableReadCharacterCard } from './TableReadCharacterCard';
import { CharacterVoiceConfig, TimbrePreset } from '../../lib/tableReadTypes';

interface TableReadCastPanelProps {
  m: ModalTheme;
  characterNames: string[];
  mutedCharacters: Record<string, boolean>;
  onToggleMute: (name: string) => void;
  voiceMap: Record<string, CharacterVoiceConfig>;
  onUpdateCharacterVoice: (name: string, update: Partial<CharacterVoiceConfig>, idx: number) => void;
  narratorVoice: CharacterVoiceConfig;
  onUpdateNarratorVoice: (update: Partial<CharacterVoiceConfig>) => void;
  onTestVoice: (cfg: CharacterVoiceConfig, label: string, idx: number) => void;
  availableVoices: SpeechSynthesisVoice[];
}

export const TableReadCastPanel: React.FC<TableReadCastPanelProps> = ({
  m, characterNames, mutedCharacters, onToggleMute, voiceMap,
  onUpdateCharacterVoice, narratorVoice, onUpdateNarratorVoice, onTestVoice, availableVoices,
}) => {
  return (
    <div className="w-full md:w-72 border-b md:border-b-0 md:border-r p-3 overflow-y-auto space-y-3 shrink-0" style={m.subCardStyle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase" style={m.accentStyle}>
          <Mic className="w-4 h-4" />
          <span>Cast & Rehearsal</span>
        </div>
        <span className="text-[10px] font-mono" style={m.mutedStyle}>{characterNames.length} Roles</span>
      </div>

      <p className="text-[10px] leading-relaxed" style={m.mutedStyle}>
        Mute a role to rehearse live, or cast distinct Male, Female &amp; FX voices.
      </p>

      <TableReadNarratorCard
        m={m}
        voices={availableVoices}
        selectedVoiceURI={narratorVoice.voiceURI}
        selectedTimbre={narratorVoice.timbre}
        onChangeVoice={(voiceURI) => onUpdateNarratorVoice({ voiceURI })}
        onChangeTimbre={(timbre: TimbrePreset) => onUpdateNarratorVoice({ timbre })}
        onTestVoice={() => onTestVoice(narratorVoice, 'Interior, dusty study, night. Arthur turns toward the camera.', 0)}
      />

      <div className="space-y-2 pt-1">
        {characterNames.length === 0 ? (
          <div className="text-xs italic p-3 border rounded-lg text-center" style={m.cardStyle}>
            No speaking roles detected yet.
          </div>
        ) : (
          characterNames.map((name, idx) => {
            const config = voiceMap[name] || { voiceURI: '', timbre: 'MALE' };
            const isMuted = !!mutedCharacters[name];
            return (
              <TableReadCharacterCard
                key={name}
                characterName={name}
                isMuted={isMuted}
                onToggleMute={() => onToggleMute(name)}
                voices={availableVoices}
                selectedVoiceURI={config.voiceURI}
                selectedTimbre={config.timbre}
                onChangeVoice={(voiceURI) => onUpdateCharacterVoice(name, { voiceURI }, idx)}
                onChangeTimbre={(timbre) => onUpdateCharacterVoice(name, { timbre }, idx)}
                onTestVoice={() => onTestVoice(config, `Hello, I am ready to read lines for ${name.toLowerCase()}.`, idx)}
                m={m}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
