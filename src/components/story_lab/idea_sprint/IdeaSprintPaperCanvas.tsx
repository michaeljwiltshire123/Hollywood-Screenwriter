import React from 'react';
import { playPaperTypewriterClick } from './ideaSprintAudio';
import { Star, ShieldAlert } from 'lucide-react';

interface PaperCanvasProps {
  value: string;
  onChangeValue: (val: string) => void;
  flowMode: boolean;
  question: string;
}

export const IdeaSprintPaperCanvas: React.FC<PaperCanvasProps> = ({
  value, onChangeValue, question,
}) => {
  const lines = value.split('\n');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'z')) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      playPaperTypewriterClick();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    if (nextVal.length < value.length) return;
    onChangeValue(nextVal);
  };

  return (
    <div className="relative bg-[#FAF7EC] border-2 border-amber-200/90 rounded-xl shadow-2xl overflow-hidden font-sans text-xs text-slate-900 min-h-[320px] flex flex-col">
      <div className="bg-amber-100 border-b-2 border-amber-300 px-4 py-3 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase font-mono tracking-wider bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
            Brainstorm Question
          </span>
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-rose-900 uppercase font-mono tracking-wider bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
            <ShieldAlert className="w-3 h-3 text-rose-700" />
            <span>No Deletion Active</span>
          </div>
        </div>
        <p className="text-sm sm:text-base font-black text-amber-950 leading-snug break-words">
          "{question}"
        </p>
      </div>

      <div className="relative flex-1 p-3 flex [background-image:linear-gradient(to_bottom,transparent_27px,#cbd5e1_28px)] [background-size:100%_28px] pt-2">
        <div className="absolute top-0 bottom-0 left-12 w-[2px] bg-rose-400/90 z-10 pointer-events-none" />

        <div className="w-8 pr-3 text-right select-none font-bold font-mono leading-[28px] shrink-0">
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isGoldenLine = lineNum % 4 === 0;
            return (
              <div
                key={idx}
                className={`flex items-center justify-end gap-1 ${
                  isGoldenLine ? 'text-amber-600 font-extrabold' : 'text-slate-400'
                }`}
                title={isGoldenLine ? "High-Stakes Hero Line!" : undefined}
              >
                {isGoldenLine && <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-600 inline" />}
                <span>{lineNum}</span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 pl-5">
          <textarea
            rows={10}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCut={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            placeholder="Type your raw ideas here... Nothing can be deleted until time runs out! Forward momentum only!"
            className="w-full h-full bg-transparent border-none focus:outline-none resize-none leading-[28px] font-serif text-slate-900 text-sm font-medium placeholder:text-slate-400 placeholder:italic"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
