import React, { useState } from 'react';
import { X, Database, Check, Copy, Layers, Activity, FileJson } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface DebugDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  latencyMs: number;
  themeConfig?: AppThemeConfig;
}

export const DebugDashboardModal: React.FC<DebugDashboardModalProps> = ({
  isOpen, onClose, script, latencyMs, themeConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'raw' | 'scene_sample' | 'breakdown'>('scene_sample');
  if (!isOpen) return null;

  const m = getModalTheme(themeConfig);
  const breakdown: { [key: string]: number } = {};
  script.elements.forEach((e) => { breakdown[e.type] = (breakdown[e.type] || 0) + 1; });

  const firstSceneIndex = script.elements.findIndex((e) => e.type === 'SCENE HEADING');
  let sceneBlock = [];
  if (firstSceneIndex !== -1) {
    sceneBlock.push(script.elements[firstSceneIndex]);
    for (let i = firstSceneIndex + 1; i < script.elements.length; i++) {
      if (script.elements[i].type === 'SCENE HEADING') break;
      sceneBlock.push(script.elements[i]);
    }
  } else { sceneBlock = script.elements.slice(0, 5); }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono" style={m.overlayStyle}>
      <div className="border rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[85vh]" style={m.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between" style={m.headerStyle}>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" style={m.accentStyle} />
            <h2 className="font-bold text-sm uppercase" style={m.accentStyle}>INDEXEDDB PHYSICAL TRUTH DEBUG DASHBOARD</h2>
            <span className="text-[10px] border px-2 py-0.5 rounded font-bold" style={m.cardStyle}>ATOMIC WRITE: {latencyMs}ms</span>
          </div>
          <button onClick={onClose} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="border-b px-4 py-2 flex items-center gap-2 text-xs" style={m.cardStyle}>
          {[
            { id: 'scene_sample' as const, label: 'Single Scene Block JSON', icon: Layers },
            { id: 'breakdown' as const, label: `Categorized Element Breakdown (${script.elements.length})`, icon: Activity },
            { id: 'raw' as const, label: 'Full Script IndexedDB Payload', icon: FileJson },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="px-3 py-1.5 rounded font-bold transition flex items-center gap-1.5 border cursor-pointer hover:opacity-90"
                style={activeTab === tab.id ? m.primaryBtnStyle : m.secondaryBtnStyle}
              >
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-xs">
          {activeTab === 'scene_sample' && (
            <div className="space-y-3">
              <div className="p-3 border rounded-lg flex items-center justify-between" style={m.cardStyle}>
                <div>
                  <h3 className="font-bold uppercase text-xs" style={m.accentStyle}>Sample "Scene Block" Raw JSON Structure</h3>
                  <p className="text-[11px] mt-0.5" style={m.mutedStyle}>Demonstrating physical truth matching between IndexedDB persistence and UI state representation.</p>
                </div>
                <button onClick={() => handleCopy(JSON.stringify(sceneBlock, null, 2))} className="px-3 py-1.5 border rounded font-bold text-xs flex items-center gap-1 cursor-pointer" style={m.secondaryBtnStyle}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Scene JSON'}
                </button>
              </div>
              <pre className="p-4 border rounded-lg overflow-x-auto text-[11px] leading-relaxed select-text font-mono" style={m.inputStyle}>
                {JSON.stringify({ scriptId: script.id, scriptTitle: script.title, sceneHeading: sceneBlock[0]?.content || 'INT. LOCATION - DAY', elementsInScene: sceneBlock }, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(breakdown).map(([type, count]) => (
                  <div key={type} className="p-3 border rounded-lg text-center" style={m.cardStyle}>
                    <span className="text-[10px] font-bold block uppercase" style={m.mutedStyle}>{type}</span>
                    <span className="text-xl font-bold font-mono" style={m.accentStyle}>{count}</span>
                  </div>
                ))}
              </div>
              <div className="border rounded-lg overflow-hidden" style={m.borderStyle}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-[10px] uppercase" style={{ ...m.headerStyle, ...m.mutedStyle }}>
                      <th className="p-2.5">ID</th><th className="p-2.5">Categorized Type</th><th className="p-2.5">Content Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-mono text-[11px]" style={m.borderStyle}>
                    {script.elements.map((e) => (
                      <tr key={e.id} style={m.cardStyle}>
                        <td className="p-2" style={m.mutedStyle}>{e.id}</td>
                        <td className="p-2"><span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{ ...m.headerStyle, ...m.accentStyle }}>{e.type}</span></td>
                        <td className="p-2 max-w-md truncate">{e.content || '<empty>'}</td>
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
                <span className="text-[11px]" style={m.mutedStyle}>Complete IndexedDB Document Record JSON Payload</span>
                <button onClick={() => handleCopy(JSON.stringify(script, null, 2))} className="px-3 py-1 border rounded text-xs flex items-center gap-1 font-bold cursor-pointer" style={m.secondaryBtnStyle}>
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Full DB Document'}
                </button>
              </div>
              <pre className="p-4 border rounded-lg overflow-x-auto text-[11px] leading-relaxed select-text font-mono max-h-[60vh]" style={m.inputStyle}>
                {JSON.stringify(script, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="p-3 border-t flex justify-between items-center text-xs" style={m.headerStyle}>
          <span style={m.mutedStyle}>Local-First IndexedDB Store: "screenwriter_db" • Store: "scripts"</span>
          <button onClick={onClose} className="px-4 py-1.5 font-bold rounded cursor-pointer hover:opacity-90" style={m.primaryBtnStyle}>Close Dashboard</button>
        </div>
      </div>
    </div>
  );
};
