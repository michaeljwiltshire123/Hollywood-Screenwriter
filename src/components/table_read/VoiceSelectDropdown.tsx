import React from 'react';
import { Play } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';
import { TimbrePreset } from '../../lib/tableReadTypes';
import { classifyVoiceGender, getPersonasForTimbre, isFxTimbre, TIMBRE_PRESETS } from '../../lib/speechVoiceManager';

interface VoiceSelectDropdownProps {
  characterName: string;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  selectedTimbre: TimbrePreset;
  onChangeVoice: (voiceURI: string) => void;
  onTestVoice: () => void;
  m: ModalTheme;
}

export const VoiceSelectDropdown: React.FC<VoiceSelectDropdownProps> = ({
  characterName, voices, selectedVoiceURI, selectedTimbre, onChangeVoice, onTestVoice, m,
}) => {
  const fxActive = isFxTimbre(selectedTimbre);
  const fxDef = TIMBRE_PRESETS[selectedTimbre];
  const isFemale = selectedTimbre === 'FEMALE' || selectedTimbre === 'BABY' || selectedTimbre === 'CHIPMUNK';
  const targetGender = isFemale ? 'FEMALE' : 'MALE';
  const personas = getPersonasForTimbre(selectedTimbre);
  const genderVoices = voices.filter((v) => classifyVoiceGender(v) === targetGender);
  const neutralVoices = voices.filter((v) => classifyVoiceGender(v) === 'NEUTRAL');

  return (
    <div className="flex items-center gap-1">
      <select
        value={fxActive ? `FX:${selectedTimbre}` : selectedVoiceURI}
        disabled={fxActive}
        onChange={(e) => onChangeVoice(e.target.value)}
        className="flex-1 min-w-0 text-[10px] p-1.5 rounded border font-mono truncate disabled:opacity-90"
        style={m.inputStyle}
        title={fxActive ? `Standalone FX voice: ${fxDef.description}` : `Select ${targetGender.toLowerCase()} voice`}
      >
        {fxActive ? (
          <option value={`FX:${selectedTimbre}`}>Standalone FX: {fxDef.label} ({fxDef.description})</option>
        ) : (
          <optgroup label={`${isFemale ? 'Female' : 'Male'} Character Styles (${personas.length})`}>
            {personas.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </optgroup>
        )}
        {!fxActive && genderVoices.length > 0 && (
          <optgroup label={`System ${isFemale ? 'Female' : 'Male'} Voices (${genderVoices.length})`}>
            {genderVoices.map((v) => (
              <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>{v.name}</option>
            ))}
          </optgroup>
        )}
        {!fxActive && neutralVoices.length > 0 && (
          <optgroup label="Other System Voices">
            {neutralVoices.map((v) => (
              <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>{v.name}</option>
            ))}
          </optgroup>
        )}
      </select>
      <button
        onClick={onTestVoice}
        className="p-1.5 rounded border cursor-pointer hover:opacity-80 shrink-0"
        style={m.secondaryBtnStyle}
        title={`Audition ${characterName}'s voice`}
      >
        <Play className="w-3 h-3" style={m.accentStyle} />
      </button>
    </div>
  );
};
