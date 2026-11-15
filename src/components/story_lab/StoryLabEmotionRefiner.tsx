import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { fetchSemanticEmotionSuggestions, EmotionCategory } from './semanticEmotionLookup';

interface StoryLabEmotionRefinerProps {
  selectedWords: string[];
  onSelectRefined: (refinedWord: string) => void;
}

export const StoryLabEmotionRefiner: React.FC<StoryLabEmotionRefinerProps> = ({
  selectedWords,
  onSelectRefined,
}) => {
  const [activeTab, setActiveTab] = useState<EmotionCategory>('Positive');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    setIsLoading(true);

    fetchSemanticEmotionSuggestions(selectedWords, activeTab).then((list) => {
      if (isSubscribed) {
        setSuggestions(list);
        setIsLoading(false);
      }
    });

    return () => { isSubscribed = false; };
  }, [selectedWords, activeTab]);

  const categories: EmotionCategory[] = ['Positive', 'Negative', 'Neutral'];

  return (
    <div className="pt-2 font-sans space-y-2">
      <div className="flex items-center gap-4 text-xs border-b border-slate-200 pb-1">
        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`pb-1 px-1 text-xs transition-colors cursor-pointer border-b-2 ${
                isActive
                  ? 'border-amber-500 text-amber-950 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {cat}
            </button>
          );
        })}
        {isLoading && <RefreshCw className="w-3 h-3 text-amber-600 animate-spin ml-auto" />}
      </div>

      <div className="flex flex-wrap gap-1.5 pt-0.5 max-h-36 overflow-y-auto pr-1">
        {suggestions.map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => onSelectRefined(word)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-md text-xs font-medium transition cursor-pointer active:scale-95"
            title={`Add "${word}"`}
          >
            + {word}
          </button>
        ))}
      </div>
    </div>
  );
};



