import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Gamepad2, Trophy, Clock, ArrowLeft, Play } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { BreakCategory, ScriptWordEntry } from './breakGameTypes';
import { GAMES_LIST } from './breakGameConstants';
import { BreakGameRouter } from './BreakGameRouter';

interface BreakGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetBackToWork?: () => void;
  playedGames: string[];
  onGameCompleted: (gameId: string) => void;
  themeConfig?: AppThemeConfig;
  scriptWords?: ScriptWordEntry[];
}

export const BreakGameModal: React.FC<BreakGameModalProps> = ({
  isOpen, onClose, onGetBackToWork, playedGames, onGameCompleted, themeConfig, scriptWords,
}) => {
  const [activeTab, setActiveTab] = useState<BreakCategory>('Arcade');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const mt = getModalTheme(themeConfig);

  if (!isOpen) return null;
  const filteredGames = GAMES_LIST.filter((g) => g.category === activeTab);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs font-sans" style={mt.overlayStyle}>
      <div className="border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" style={mt.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between shrink-0" style={mt.borderStyle}>
          <div className="flex items-center gap-2">
            {selectedGameId ? (
              <button onClick={() => setSelectedGameId(null)} className="p-1.5 rounded-lg border flex items-center gap-1 text-xs font-bold cursor-pointer" style={mt.secondaryBtnStyle}>
                <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Menu</span>
              </button>
            ) : (
              <>
                <Gamepad2 className="w-5 h-5" style={mt.accentStyle} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Focus Break Suite (12 Games)</h3>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onGetBackToWork && (
              <button onClick={onGetBackToWork} className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer" style={mt.primaryBtnStyle}>
                Resume Writing
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg border transition cursor-pointer hover:opacity-80" style={mt.secondaryBtnStyle}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className={selectedGameId ? 'p-4 overflow-y-auto flex-1' : 'p-6 overflow-y-auto flex-1 space-y-5'}>
          {selectedGameId ? (
            <BreakGameRouter selectedGameId={selectedGameId} onBackToMenu={() => setSelectedGameId(null)} onGameWin={() => { if (selectedGameId) onGameCompleted(selectedGameId); }} mt={mt} themeConfig={themeConfig} scriptWords={scriptWords} />
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl border" style={mt.subCardStyle}>
                {(['Arcade', 'Word and Trivia', 'Logic and Puzzle'] as BreakCategory[]).map((cat) => (
                  <button key={cat} onClick={() => setActiveTab(cat)} className="flex-1 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer"
                    style={activeTab === cat ? mt.primaryBtnStyle : { color: mt.theme.primaryText, backgroundColor: 'transparent' }}>{cat}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredGames.map((game) => {
                  const isCompleted = playedGames.includes(game.id);
                  return (
                    <button key={game.id} onClick={() => setSelectedGameId(game.id)}
                      className="p-4 border rounded-xl text-left space-y-2 transition cursor-pointer hover:opacity-90 flex flex-col justify-between group" style={mt.cardStyle}>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs group-hover:underline" style={mt.accentStyle}>{game.title}</span>
                          {isCompleted && <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] leading-snug line-clamp-2" style={mt.mutedStyle}>{game.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t text-[10px]" style={mt.borderStyle}>
                        <span className="flex items-center gap-1" style={mt.mutedStyle}><Clock className="w-3 h-3" />{game.duration}</span>
                        <span className="font-bold flex items-center gap-1" style={mt.accentStyle}>Play <Play className="w-3 h-3 fill-current" /></span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
