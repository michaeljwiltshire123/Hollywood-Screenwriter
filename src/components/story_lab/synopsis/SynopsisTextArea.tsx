import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ModalThemeStyles } from '../../../lib/modalTheme';

interface SynopsisTextAreaProps {
  text: string;
  onChangeText: (val: string) => void;
  words: number;
  isTooLong: boolean;
  isTooShort: boolean;
  hasGrammarAlert: boolean;
  mt: ModalThemeStyles;
}

export const SynopsisTextArea: React.FC<SynopsisTextAreaProps> = ({
  text, onChangeText, words, isTooLong, isTooShort, hasGrammarAlert, mt,
}) => {
  return (
    <>
      <div className="flex items-center justify-between text-xs font-bold shrink-0">
        <span>Full Synopsis Draft (Agent Recommended: 350–500 words)</span>
        <span
          className={`font-mono text-xs font-black tabular-nums px-2 py-0.5 rounded border ${
            isTooLong
              ? 'bg-rose-500/15 text-rose-700 border-rose-300'
              : isTooShort
              ? 'bg-amber-500/15 text-amber-800 border-amber-300'
              : 'bg-emerald-500/15 text-emerald-800 border-emerald-300'
          }`}
        >
          {words} words {isTooShort ? '(Aim for 350+)' : isTooLong ? '(Over 800 limit)' : '(Optimal)'}
        </span>
      </div>

      <textarea
        rows={12}
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="Write your synopsis here in present tense and third person. Summarise all main events and write out the complete ending..."
        className={`w-full flex-1 min-h-[260px] rounded-xl border-2 p-4 text-sm leading-relaxed focus:outline-none transition ${
          isTooLong ? 'border-rose-500 bg-rose-50/20 text-rose-950' : ''
        }`}
        style={!isTooLong ? mt.inputStyle : undefined}
      />

      {hasGrammarAlert && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg border bg-amber-500/10 text-amber-900 text-xs font-semibold shrink-0" style={mt.borderStyle}>
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Tip: Industry standard prefers <strong>present tense</strong> and <strong>third person</strong> (he/she/they).</span>
        </div>
      )}
    </>
  );
};
