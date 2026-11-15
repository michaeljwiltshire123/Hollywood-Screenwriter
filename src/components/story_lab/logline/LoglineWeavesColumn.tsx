import React from 'react';
import { Shuffle } from 'lucide-react';
import { LoglineData } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { generateLiveLoglineTemplates, countLoglineWords } from './loglineHelpers';

interface LoglineWeavesColumnProps {
  formData: LoglineData;
  onChangeText: (text: string) => void;
  onShuffle: () => void;
  mt: ModalThemeStyles;
}

export const LoglineWeavesColumn: React.FC<LoglineWeavesColumnProps> = ({
  formData, onChangeText, onShuffle, mt,
}) => {
  const templates = generateLiveLoglineTemplates(formData);
  const wordCount = countLoglineWords(formData.text);
  const isOverSoft = wordCount > 50;
  const isOverSecret = wordCount > 200;

  return (
    <div className="space-y-4 flex flex-col h-full justify-between">
      <div className="space-y-3">
        <div className="rounded-xl border p-3 space-y-2.5 shadow-2xs" style={mt.cardStyle}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span>Live Answer Weaves (Click to use)</span>
            <button
              type="button"
              onClick={onShuffle}
              className="px-2.5 py-1 rounded border text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-90"
              style={mt.secondaryBtnStyle}
              title="Shuffle sentence order"
            >
              <Shuffle className="w-3 h-3" /><span>Shuffle Order</span>
            </button>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {templates.length > 0 ? templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChangeText(tpl)}
                className="w-full p-2.5 rounded-lg border text-left text-xs hover:bg-black/5 transition cursor-pointer line-clamp-3 leading-relaxed"
                style={mt.subCardStyle}
              >
                {tpl}
              </button>
            )) : (
              <div className="p-3 text-center text-xs opacity-50 italic">
                Answer the questions on the left to generate instant live weaves here...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <label htmlFor="final-logline-textarea">Final Logline (Under 50 Words)</label>
            <span className={`font-mono text-xs font-extrabold tabular-nums ${isOverSoft ? 'text-rose-600' : 'opacity-75'}`}>
              {wordCount} / 50 words
            </span>
          </div>
          <textarea
            id="final-logline-textarea"
            rows={5}
            value={formData.text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder="Type or click a generated weave above..."
            className={`w-full rounded-xl border-2 p-3 text-xs leading-relaxed focus:outline-none transition ${isOverSoft ? 'border-rose-500 bg-rose-50/20 text-rose-950' : ''}`}
            style={!isOverSoft ? mt.inputStyle : undefined}
          />
          {isOverSecret && <div className="text-[10px] text-rose-600 font-bold">Secret 200-word limit exceeded.</div>}
        </div>
      </div>
    </div>
  );
};
