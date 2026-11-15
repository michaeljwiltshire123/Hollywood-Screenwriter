import React from 'react';
import { Sparkles } from 'lucide-react';
import { LoglineData } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { LOGLINE_QUESTIONS } from './loglineConstants';

interface LoglineQuestionsColumnProps {
  formData: LoglineData;
  onChangeField: (field: keyof Omit<LoglineData, 'order' | 'text'>, value: string) => void;
  onBrainstormField: (field: keyof Omit<LoglineData, 'order' | 'text'>, label: string) => void;
  mt: ModalThemeStyles;
}

export const LoglineQuestionsColumn: React.FC<LoglineQuestionsColumnProps> = ({
  formData, onChangeField, onBrainstormField, mt,
}) => {
  return (
    <div className="space-y-3.5 pr-1">
      {LOGLINE_QUESTIONS.map((q) => (
        <div key={q.id} className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor={`logline-${q.id}`} className="text-xs font-extrabold">{q.label}</label>
            <button
              type="button"
              onClick={() => onBrainstormField(q.id, q.label)}
              className="text-[10px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              title="Quick idea spark for this question"
            >
              <Sparkles className="w-3 h-3 text-amber-600" /><span>Brainstorm</span>
            </button>
          </div>
          <input
            id={`logline-${q.id}`}
            type="text"
            value={formData[q.id]}
            onChange={(e) => onChangeField(q.id, e.target.value)}
            placeholder={q.placeholder}
            className="w-full rounded-lg border px-3 py-2 text-xs focus:outline-none transition"
            style={mt.inputStyle}
          />
          <div className="text-[10px] opacity-65">{q.hint}</div>
        </div>
      ))}
    </div>
  );
};
