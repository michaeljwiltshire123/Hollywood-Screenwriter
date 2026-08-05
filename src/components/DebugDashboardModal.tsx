import React, { useState } from 'react';
import { X, Database, Code, Check, Copy, Layers, Activity, FileJson } from 'lucide-react';
import { ScreenplayDocument } from '../types';

interface DebugDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  latencyMs: number;
}

export const DebugDashboardModal: React.FC<DebugDashboardModalProps> = ({
  isOpen,
  onClose,
  script,
  latencyMs,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'raw' | 'scene_sample' | 'breakdown'>('scene_sample');

  // Element breakdown stats
  const breakdown: { [key: string]: number } = {};
  script.elements.forEach((e) => {
    breakdown[e.type] = (breakdown[e.type] || 0) + 1;
  });

  // Extract a single complete "Scene" block (Scene Heading + associated Action / Characters / Dialogue)
  const firstSceneIndex = script.elements.findIndex((e) => e.type === 'SCENE HEADING');
  let sceneBlock = [];
  if (firstSceneIndex !== -1) {
    sceneBlock.push(script.elements[firstSceneIndex]);
    for (let i = firstSceneIndex + 1; i < script.elements.length; i++) {
      if (script.elements[i].type === 'SCENE HEADING') break;
      sceneBlock.push(script.elements[i]);
    }
  } else {
    sceneBlock = script.elements.slice(0, 5);
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm uppercase text-amber-300">
              INDEXEDDB PHYSICAL TRUTH DEBUG DASHBOARD
            </h2>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
              ATOMIC WRITE: {latencyMs}ms
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('scene_sample')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scene_sample'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Single Scene Block JSON
          </button>

          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Categorized Element Breakdown ({script.elements.length})
          </button>

          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 ${
              activeTab === 'raw'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            Full Script IndexedDB Payload
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950/90 text-xs">
          {activeTab === 'scene_sample' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-amber-300 uppercase text-xs">
                    Sample "Scene Block" Raw JSON Structure
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Demonstrating physical truth matching between IndexedDB persistence and UI state representation.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(JSON.stringify(sceneBlock, null, 2))}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded font-bold text-xs flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Scene JSON'}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 overflow-x-auto text-[11px] leading-relaxed select-text font-mono">
                {JSON.stringify(
                  {
                    scriptId: script.id,
                    scriptTitle: script.title,
                    sceneHeading: sceneBlock[0]?.content || 'INT. LOCATION - DAY',
                    elementsInScene: sceneBlock,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(breakdown).map(([type, count]) => (
                  <div key={type} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{type}</span>
                    <span className="text-xl font-bold text-amber-400 font-mono">{count}</span>
                  </div>
                ))}
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Categorized Type</th>
                      <th className="p-2.5">Content Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {script.elements.map((e, idx) => (
                      <tr key={e.id} className="hover:bg-slate-900/50">
                        <td className="p-2 text-slate-500">{e.id}</td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              e.type === 'SCENE HEADING'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                : e.type === 'CHARACTER'
                                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                : e.type === 'DIALOGUE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {e.type}
                          </span>
                        </td>
                        <td className="p-2 text-slate-300 max-w-md truncate">{e.content || '<empty>'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400">Complete IndexedDB Document Record JSON Payload</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(script, null, 2))}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-xs flex items-center gap-1 font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Full DB Document'}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 overflow-x-auto text-[11px] leading-relaxed select-text font-mono max-h-[60vh]">
                {JSON.stringify(script, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Local-First IndexedDB Store: "screenwriter_db" • Store: "scripts"</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
