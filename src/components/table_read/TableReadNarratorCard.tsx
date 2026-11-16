import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';
import { TimbrePreset } from '../../lib/tableReadTypes';
import { TIMBRE_PRESETS, classifyVoiceGender, getPersonasForTimbre } from '../../lib/speechVoiceManager';

interface TableReadNarratorCardProps {
  m: ModalTheme;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  selectedTimbre: TimbrePreset;
  onChangeVoice: (voiceURI: string) => void;
  onChangeTimbre: (timbre: TimbrePreset) => void;
  onTestVoice: () => void;
}

export const TableReadNarratorCard: React.FC<TableReadNarratorCardProps> = ({
  m, voices, selectedVoiceURI, selectedTimbre, onChangeVoice, onChangeTimbre, onTestVoice,
}) => {
  const personas = getPersonasForTimbre(selectedTimbre);
  const filteredVoices = selectedTimbre === 'NARRATOR'
    ? voices
    : voices.filter((v) => {
        const g = classifyVoiceGender(v);
        return selectedTimbre === 'FEMALE' ? g === 'FEMALE' : g === 'MALE';
      });

  return (
    <div className="p-2.5 border rounded-xl space-y-2 shadow-2xs" style={m.cardStyle}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <BookOpen className="w-3.5 h-3.5" style={m.accentStyle} />
          <span style={m.accentStyle}>Narrator</span>
        </div>
        <span className="text-[9px] font-sans font-semibold px-2 py-0.5 rounded border" style={m.borderStyle}>
          Headings & Action
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <select
            value={selectedVoiceURI}
            onChange={(e) => onChangeVoice(e.target.value)}
            className="flex-1 min-w-0 text-[10px] p-1.5 rounded border font-mono truncate"
            style={m.inputStyle}
            title="Select narrator voice"
          >
            <option value="">System Default Narrator</option>
            <optgroup label={`Narrator Styles (${personas.length})`}>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </optgroup>
            {filteredVoices.length > 0 && (
              <optgroup label="System Voices">
                {filteredVoices.map((v) => (
                  <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>{v.name}</option>
                ))}
              </optgroup>
            )}
          </select>
          <button
            onClick={onTestVoice}
            className="p-1.5 rounded border cursor-pointer hover:opacity-80 shrink-0"
            style={m.secondaryBtnStyle}
            title="Audition Narrator voice"
          >
            <Play className="w-3 h-3" style={m.accentStyle} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1">
          {(['NARRATOR', 'MALE', 'FEMALE', 'OLD'] as TimbrePreset[]).map((tKey) => {
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
    </div>
  );
};
