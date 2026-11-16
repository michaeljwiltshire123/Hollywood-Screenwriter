import React, { useState } from 'react';
import { X, Download, Users, Headphones, Music, Loader2 } from 'lucide-react';
import { ScreenplayDocument } from '../../types';
import { CharacterVoiceConfig } from '../../lib/tableReadTypes';
import { ModalTheme } from '../../lib/modalTheme';
import { generateRehearsalAudio } from '../../lib/tableReadAudioExporter';
import { generateRehearsalPlayerHtml } from '../../lib/tableReadHtmlExporter';

interface TableReadExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  characterNames: string[];
  currentSpeed: number;
  voiceMap: Record<string, CharacterVoiceConfig>;
  narratorVoice: CharacterVoiceConfig;
  m: ModalTheme;
}

export const TableReadExportModal: React.FC<TableReadExportModalProps> = ({
  isOpen, onClose, script, characterNames, currentSpeed, voiceMap, narratorVoice, m,
}) => {
  const [selectedMuted, setSelectedMuted] = useState<string[]>([]);
  const [isFullScript, setIsFullScript] = useState<boolean>(true);
  const [exportProgress, setExportProgress] = useState<number | null>(null);
  if (!isOpen) return null;

  const toggleChar = (name: string) => setSelectedMuted((p) => p.includes(name) ? p.filter((c) => c !== name) : [...p, name]);

  const downloadFile = (blob: Blob, ext: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const mutedList = isFullScript ? [] : selectedMuted;
    const tag = isFullScript ? 'Full-Cast' : `Rehearsal-${mutedList.join('-') || 'Custom'}`;
    a.download = `${script.title || 'Screenplay'}-${tag}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    onClose();
  };

  const handleDownloadAudio = async (format: 'mp3' | 'wav') => {
    if (exportProgress !== null) return;
    setExportProgress(2);
    try {
      const blob = await generateRehearsalAudio(script, isFullScript ? [] : selectedMuted, currentSpeed, voiceMap, narratorVoice, format, setExportProgress);
      downloadFile(blob, format);
    } finally {
      setExportProgress(null);
    }
  };

  const handleDownloadHtml = () => {
    const html = generateRehearsalPlayerHtml(script, isFullScript ? [] : selectedMuted, currentSpeed);
    downloadFile(new Blob([html], { type: 'text/html;charset=utf-8' }), 'html');
  };

  const isBusy = exportProgress !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono">
      <div className="max-w-md w-full border rounded-2xl shadow-2xl p-5 space-y-4" style={m.windowStyle}>
        <div className="flex items-center justify-between border-b pb-3" style={m.borderStyle}>
          <div className="flex items-center gap-2"><Music className="w-4 h-4" style={m.accentStyle} /><h3 className="font-bold text-xs uppercase" style={m.accentStyle}>Export Rehearsal Audio</h3></div>
          <button onClick={onClose} disabled={isBusy} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3 text-xs">
          <div className="flex gap-2">
            <button onClick={() => setIsFullScript(true)} disabled={isBusy} className="flex-1 p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer" style={isFullScript ? m.primaryBtnStyle : m.secondaryBtnStyle}><Users className="w-3.5 h-3.5" /><span>Full Cast</span></button>
            <button onClick={() => setIsFullScript(false)} disabled={isBusy} className="flex-1 p-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer" style={!isFullScript ? m.primaryBtnStyle : m.secondaryBtnStyle}><Headphones className="w-3.5 h-3.5" /><span>Mute Character(s)</span></button>
          </div>
          {!isFullScript && (
            <div className="space-y-1 border p-2 rounded-xl max-h-32 overflow-y-auto" style={m.cardStyle}>
              <span className="text-[10px] font-bold uppercase block mb-1" style={m.mutedStyle}>Select character(s) to mute for live rehearsal:</span>
              {characterNames.map((name) => (
                <label key={name} className="flex items-center gap-2 p-1 rounded hover:bg-black/5 cursor-pointer text-[11px]"><input type="checkbox" checked={selectedMuted.includes(name)} onChange={() => toggleChar(name)} disabled={isBusy} /><span>{name}</span></label>
              ))}
            </div>
          )}
        </div>
        {isBusy && (
          <div className="p-2.5 rounded-xl border text-[11px] flex items-center gap-2" style={m.cardStyle}>
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" style={m.accentStyle} />
            <span>Synthesising spoken cast audio... {exportProgress}%</span>
          </div>
        )}
        <div className="space-y-2 pt-1">
          <button onClick={() => handleDownloadAudio('mp3')} disabled={isBusy} className="w-full py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60" style={m.primaryBtnStyle} title="Compact MP3 audio file for phone and music players"><Download className="w-4 h-4" /><span>Download Audio Track (.mp3)</span></button>
          <button onClick={() => handleDownloadAudio('wav')} disabled={isBusy} className="w-full py-2 font-bold text-xs rounded-xl border flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60" style={m.secondaryBtnStyle} title="Uncompressed lossless PCM WAV audio"><Download className="w-3.5 h-3.5" /><span>Download Lossless Audio (.wav)</span></button>
          <button onClick={handleDownloadHtml} disabled={isBusy} className="w-full py-2 font-bold text-xs rounded-xl border flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60" style={m.secondaryBtnStyle} title="Interactive web player"><span>Download Interactive Web Player (.html)</span></button>
        </div>
      </div>
    </div>
  );
};
