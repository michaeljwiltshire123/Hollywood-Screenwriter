import React, { useState, useEffect, useMemo } from 'react';
import {
  Map,
  Users,
  BarChart3,
  History,
  Camera,
  Layers,
  Search,
  Sparkles,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Plus,
  Trash2,
  Check,
  Edit3,
  Printer,
  Upload,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Calendar,
} from 'lucide-react';
import { SceneShotPlannerModal } from './navigator/shot_planner/SceneShotPlannerModal';
import { printHtmlInPlace } from '../lib/print/printHtmlInPlace';
import {
  ScreenplayDocument,
  SceneInfo,
  CharacterInfo,
  RevisionHistoryItem,
  CharacterMetadata,
  StoryArcCard,
  StoryArcStructure,
  ShotInfo,
} from '../types';
import { extractScenes, extractCharacters, calculatePageEstimate } from '../lib/screenplayUtils';
import { ActorHighlightToggle } from './character_bible/ActorHighlightToggle';
import { PastelSwatchPicker } from './character_bible/PastelSwatchPicker';
import { getCharacterHighlightColor } from '../lib/actorHighlighting';
import { PreProductionDocButton } from './navigator/PreProductionDocButton';
import { StoryArcTabContent } from './navigator/StoryArcTabContent';
import { StoryLabModal } from './story_lab/StoryLabModal';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';
import { generateSpark, dismissSparkNudge, SparkResult } from '../utils/sparkEngine';

interface NavigatorSidePanelProps {
  script: ScreenplayDocument;
  isOpen: boolean;
  onClose: () => void;
  onJumpToElementIndex: (index: number) => void;
  onChangeScript: (updated: ScreenplayDocument) => void;
  revisions: RevisionHistoryItem[];
  onRollbackRevision: (rev: RevisionHistoryItem) => void;
  onOpenProductionSchedule?: () => void;
  themeConfig?: AppThemeConfig;
}


const SHOT_TYPES = [
  'WIDE',
  'MEDIUM',
  'CLOSE-UP',
  'EXTREME CLOSE-UP',
  'ESTABLISHING',
  'POV',
  'OVER-THE-SHOULDER',
  'INSERT',
  'AERIAL',
  'OTHER',
] as const;

const STANDARD_KITS = ['Tripod', 'Gimbal', 'Dolly', 'Handheld'];

export const NavigatorSidePanel: React.FC<NavigatorSidePanelProps> = ({
  script,
  isOpen,
  onClose,
  onJumpToElementIndex,
  onChangeScript,
  revisions,
  onRollbackRevision,
  onOpenProductionSchedule,
  themeConfig,
}) => {
  const mt = getModalTheme(themeConfig);
  const tabNavRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'scenes' | 'shotlist' | 'arc' | 'inspiration' | 'characters' | 'stats'>('scenes');
  const [sceneSearch, setSceneSearch] = useState('');

  // Fullscreen Whiteboard & Character Bible States
  const [isWhiteboardMaximized, setIsWhiteboardMaximized] = useState(false);
  const [isCharacterBibleMaximized, setIsCharacterBibleMaximized] = useState(false);

  // Stripboard Sort Toggles
  const [groupByLocation, setGroupByLocation] = useState(true);
  const [outdoorPriority, setOutdoorPriority] = useState(true);

  // Active scene modal for managing shots
  const [activeShotSceneId, setActiveShotSceneId] = useState<string | null>(null);

  // Performance Audit: 500ms Debounced Script elements for heavy Story Arc & Scene Analysis
  const [debouncedScript, setDebouncedScript] = useState(script);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedScript(script);
    }, 500);
    return () => clearTimeout(timer);
  }, [script]);

  // Handle ESC key to close maximized views safely
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCharacterBibleMaximized) setIsCharacterBibleMaximized(false);
        if (isWhiteboardMaximized) setIsWhiteboardMaximized(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCharacterBibleMaximized, isWhiteboardMaximized]);

  // Master's Toolkit Spark Engine State
  const [currentSpark, setCurrentSpark] = useState<SparkResult>(() => generateSpark(script));
  const [isSparkModalOpen, setIsSparkModalOpen] = useState<boolean>(false);

  const handleShuffleProvocation = () => {
    if (currentSpark.isFeatureNudge && currentSpark.nudgeId) dismissSparkNudge(currentSpark.nudgeId);
    setCurrentSpark(generateSpark(script, currentSpark.text));
  };

  const handleCloseSparkModal = () => {
    if (currentSpark.isFeatureNudge && currentSpark.nudgeId) dismissSparkNudge(currentSpark.nudgeId);
    setIsSparkModalOpen(false);
  };

  const handleOpenSparkModal = () => {
    setCurrentSpark(generateSpark(script, currentSpark.text));
    setIsSparkModalOpen(true);
  };

  // Character Manual Bible Editing State (AAA Show Don't Tell Workbook)
  const [editingCharacterName, setEditingCharacterName] = useState<string | null>(null);
  const [tempAge, setTempAge] = useState('');
  const [tempAppearance, setTempAppearance] = useState('');
  const [tempAttitude, setTempAttitude] = useState('');
  const [tempActionInFirstScene, setTempActionInFirstScene] = useState('');
  const [tempFlaw, setTempFlaw] = useState('');
  const [tempMotivation, setTempMotivation] = useState('');
  const [tempVisual, setTempVisual] = useState('');
  const [tempActorNotes, setTempActorNotes] = useState('');

  const scenes = useMemo(() => extractScenes(debouncedScript.elements), [debouncedScript.elements]);
  const characters = useMemo(() => extractCharacters(debouncedScript.elements), [debouncedScript.elements]);
  const pageStats = useMemo(() => calculatePageEstimate(debouncedScript.elements), [debouncedScript.elements]);

  // Target length & pacing
  const targetLength = script.targetLength || 90;
  const estRuntimeMin = Math.ceil(pageStats.pages);
  const isOverLength = estRuntimeMin > targetLength;

  // Action vs Dialogue ratio for heartbeat pacing overlay
  const actionCount = debouncedScript.elements.filter((e) => e.type === 'ACTION').length;
  const dialogueCount = debouncedScript.elements.filter((e) => e.type === 'DIALOGUE').length;
  const totalActDiag = actionCount + dialogueCount || 1;
  const actionPct = Math.round((actionCount / totalActDiag) * 100);
  const dialoguePct = 100 - actionPct;

  // Storage size calculation for guardrail
  const jsonStringSize = useMemo(() => JSON.stringify(script).length, [script]);
  const isStorageHeavy = jsonStringSize > 5 * 1024 * 1024; // > 5MB

  if (!isOpen) return null;

  const filteredScenes = scenes.filter(
    (s) =>
      s.heading.toLowerCase().includes(sceneSearch.toLowerCase()) ||
      s.characters.some((c) => c.toLowerCase().includes(sceneSearch.toLowerCase()))
  );


  // Character Bible Saving & Real-Time Sync
  const handleOpenCharacterEdit = (charName: string) => {
    setEditingCharacterName(charName);
    const existing = script.characterBibles?.[charName];
    setTempAge(existing?.age || '');
    setTempAppearance(existing?.appearance || '');
    setTempAttitude(existing?.attitude || '');
    setTempActionInFirstScene(existing?.actionInFirstScene || '');
    setTempFlaw(existing?.internalFlaw || '');
    setTempMotivation(existing?.coreMotivation || '');
    setTempVisual(existing?.visualDescription || '');
    setTempActorNotes(existing?.actorNotes || '');
  };

  const handleUpdateCharacterField = (field: string, value: string) => {
    if (!editingCharacterName) return;

    if (field === 'age') setTempAge(value);
    if (field === 'appearance') setTempAppearance(value);
    if (field === 'attitude') setTempAttitude(value);
    if (field === 'actionInFirstScene') setTempActionInFirstScene(value);
    if (field === 'internalFlaw') setTempFlaw(value);
    if (field === 'coreMotivation') setTempMotivation(value);
    if (field === 'visualDescription') setTempVisual(value);
    if (field === 'actorNotes') setTempActorNotes(value);

    const currentBibles = script.characterBibles || {};
    const existing = currentBibles[editingCharacterName] || {};
    const updatedChar = {
      ...existing,
      [field]: value
    };

    const updatedBibles = {
      ...currentBibles,
      [editingCharacterName]: updatedChar
    };

    onChangeScript({
      ...script,
      characterBibles: updatedBibles
    });
  };

  const handleUpdateCharacterColor = (charName: string, hexColor: string) => {
    const currentBibles = script.characterBibles || {};
    const existing = currentBibles[charName] || {};
    const updatedBibles = {
      ...currentBibles,
      [charName]: {
        ...existing,
        highlightColor: hexColor,
      },
    };
    onChangeScript({
      ...script,
      characterBibles: updatedBibles,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveCharacterBible = () => {
    if (editingCharacterName) {
      const currentBibles = script.characterBibles || {};
      const updatedBibles = {
        ...currentBibles,
        [editingCharacterName]: {
          ...currentBibles[editingCharacterName],
          age: tempAge,
          appearance: tempAppearance,
          attitude: tempAttitude,
          actionInFirstScene: tempActionInFirstScene,
          internalFlaw: tempFlaw,
          coreMotivation: tempMotivation,
          visualDescription: tempVisual,
          actorNotes: tempActorNotes,
        }
      };
      onChangeScript({
        ...script,
        characterBibles: updatedBibles
      });
    }
    setEditingCharacterName(null);
  };

  // Shot Management Handlers
  const shots: ShotInfo[] = script.shots || [];

  const handleAddShot = (sceneHeadingId: string) => {
    const sceneShots = shots.filter((s) => s.sceneHeadingId === sceneHeadingId);
    const newShotNum = `${sceneShots.length + 1}A`;
    const newShot: ShotInfo = {
      id: `shot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sceneHeadingId,
      shotNumber: newShotNum,
      shotType: 'Wide Shot',
      angle: '',
      lens: '',
      equipment: '',
      description: '',
      estimatedTimeMin: 15,
    };
    onChangeScript({
      ...script,
      shots: [...shots, newShot]
    });
  };

  const handleUpdateShot = (shotId: string, updatedFields: Partial<ShotInfo>) => {
    const updated = shots.map((s) => (s.id === shotId ? { ...s, ...updatedFields } : s));
    onChangeScript({
      ...script,
      shots: updated
    });
  };

  const handleDeleteShot = (shotId: string) => {
    const updated = shots.filter((s) => s.id !== shotId);
    onChangeScript({
      ...script,
      shots: updated
    });
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>, shotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      handleUpdateShot(shotId, { sketchDataUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // Print Shot List Function
  const handlePrintShotList = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${script.title || 'Screenplay'} - Production Shot List</title>
          <style>
            body { font-family: monospace; padding: 20px; color: #111; background: #fff; }
            h1 { font-size: 20px; border-bottom: 2px solid #111; padding-bottom: 8px; }
            h2 { font-size: 16px; margin-top: 24px; color: #333; }
            .meta { font-size: 12px; margin-bottom: 20px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
            th { background: #eee; font-weight: bold; }
            .notes { margin-top: 20px; padding: 10px; border: 1px dashed #666; background: #f9f9f9; }
            img { max-width: 80px; max-height: 60px; display: block; margin-top: 4px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>PRODUCTION SHOT LIST: ${script.title || 'Untitled'}</h1>
          <div class="meta">
            Author: ${script.author || 'Unknown'} | Date: ${new Date().toLocaleDateString()} | Draft: ${script.draftStatus}
          </div>
          ${script.productionNotes ? `<div class="notes"><strong>Production Notes:</strong><br/>${script.productionNotes.replace(/\n/g, '<br/>')}</div>` : ''}
          
          ${scenes.map((scene) => {
            const sceneShots = shots.filter((s) => s.sceneHeadingId === scene.id);
            if (sceneShots.length === 0) return '';
            return `
              <div>
                <h2>Scene #${scene.sceneNumber}: ${scene.heading}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Shot #</th>
                      <th>Type</th>
                      <th>Angle</th>
                      <th>Lens</th>
                      <th>Equipment</th>
                      <th>Time</th>
                      <th>Sketch / Ref</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sceneShots.map((sh) => `
                      <tr>
                        <td><strong>${sh.shotNumber}</strong></td>
                        <td>${sh.shotType}</td>
                        <td>${sh.angle}</td>
                        <td>${sh.lens}</td>
                        <td>${sh.equipment}</td>
                        <td>${sh.estimatedTimeMin} min</td>
                        <td>${sh.sketchDataUrl ? `<img src="${sh.sketchDataUrl}" />` : 'No sketch'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `;
          }).join('')}
        </body>
      </html>
    `;
    printHtmlInPlace(htmlContent);
  };

  if (!isOpen) return null;

  return (
    <>
      <aside
        className="w-full h-full flex flex-col select-none overflow-hidden transition-colors"
        style={{
          backgroundColor: themeConfig?.sidebarPanel || '#0f172a',
          color: themeConfig?.primaryText || '#e2e8f0',
          borderColor: themeConfig?.borders || '#1e293b',
        }}
      >
        {/* Panel Header */}
        <div
          className="p-3 border-b flex items-center justify-between shrink-0"
          style={{
            backgroundColor: themeConfig?.topBottomBars || '#020617',
            borderColor: themeConfig?.borders || '#1e293b',
            color: themeConfig?.primaryText || '#e2e8f0',
          }}
        >
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 shrink-0" style={{ color: themeConfig?.accentText || '#fbbf24' }} />
            <span
              className="font-mono font-bold text-xs uppercase truncate"
              style={{ color: themeConfig?.accentText || '#fcd34d' }}
            >
              NAVIGATOR • PRODUCTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded shrink-0 cursor-pointer hover:opacity-75 transition"
            style={{ color: themeConfig?.primaryText || '#e2e8f0' }}
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Storage Heavy Warning Banner */}
        {isStorageHeavy && (
          <div className="bg-rose-950/90 border-b border-rose-500/50 p-2.5 flex items-start gap-2 text-[11px] text-rose-200 shrink-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">STORAGE WARNING:</strong> Base64 images exceed 5MB. IndexedDB JSON size is high ({Math.round(jsonStringSize / (1024 * 1024))}MB). Consider smaller sketches.
            </div>
          </div>
        )}

        {/* 5-Tab Single-Row Icon Grid */}
        <div
          className="flex flex-row w-full justify-between items-center border-b p-1 shrink-0"
          style={{
            backgroundColor: themeConfig?.topBottomBars || '#020617',
            borderColor: themeConfig?.borders || '#1e293b',
          }}
        >
          {[
            { id: 'scenes', label: 'SCENES', title: 'Scene Heading Navigator', icon: Layers, active: activeTab === 'scenes', onClick: () => setActiveTab('scenes') },
            { id: 'arc', label: 'STORY LAB', title: 'Open Story Lab', icon: TrendingUp, active: isWhiteboardMaximized, onClick: () => setIsWhiteboardMaximized(true) },
            { id: 'inspiration', label: 'SPARK', title: 'Creative Inspirations & Provocations', icon: Lightbulb, active: activeTab === 'inspiration', onClick: () => setActiveTab('inspiration') },
            { id: 'characters', label: 'CHARACTERS', title: 'Character Bibles & Appearance Logs', icon: Users, active: activeTab === 'characters', onClick: () => setActiveTab('characters') },
            { id: 'stats', label: 'STATS', title: 'Script Page Stats & Breakdown', icon: BarChart3, active: activeTab === 'stats', onClick: () => setActiveTab('stats') },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={tab.onClick}
                className="flex-1 min-w-0 py-1.5 text-center border-b-2 transition flex flex-col items-center justify-center gap-1 group cursor-pointer rounded-t"
                style={{
                  borderColor: tab.active ? (themeConfig?.accentButtons || '#fbbf24') : 'transparent',
                  backgroundColor: tab.active ? (themeConfig?.sidebarPanel || 'transparent') : 'transparent',
                  color: tab.active ? (themeConfig?.accentText || '#fcd34d') : (themeConfig?.primaryText || '#94a3b8'),
                  opacity: tab.active ? 1 : 0.7,
                }}
                title={tab.title}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[8px] uppercase tracking-wider font-bold truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-3">
          {/* TAB 1: SCENE NAVIGATOR & SHOT MANAGER MODAL */}
          {activeTab === 'scenes' && (
            <div className="space-y-3">
              <PreProductionDocButton
                onOpenProductionSchedule={onOpenProductionSchedule}
                themeConfig={themeConfig}
              />

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-60" />
                <input
                  type="text"
                  placeholder="Filter scenes or characters..."
                  value={sceneSearch}
                  onChange={(e) => setSceneSearch(e.target.value)}
                  className="w-full border rounded pl-8 pr-3 py-1.5 text-xs focus:outline-none"
                  style={{
                    backgroundColor: themeConfig?.topBottomBars || '#020617',
                    borderColor: themeConfig?.borders || '#1e293b',
                    color: themeConfig?.primaryText || '#e2e8f0',
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] opacity-80 font-bold uppercase tracking-wider px-1">
                <span>{filteredScenes.length} SCENES DETECTED</span>
                <span>PAGE ESTIMATE: ~{pageStats.pages}</span>
              </div>

              <div className="space-y-2">
                {filteredScenes.length === 0 ? (
                  <div className="text-center py-8 opacity-65 italic">
                    No scene headings found. Add "INT. LOCATION - DAY" to create scenes.
                  </div>
                ) : (
                  filteredScenes.map((scene) => {
                    const sceneShots = shots.filter((s) => s.sceneHeadingId === scene.id);
                    const estPageFraction = (scene.lengthLines / 54).toFixed(1);
                    return (
                      <div
                        key={scene.id}
                        className="p-3 border rounded transition space-y-2 shadow-2xs"
                        style={{
                          backgroundColor: themeConfig?.sceneCards || '#1e293b',
                          borderColor: themeConfig?.borders || '#334155',
                          color: themeConfig?.primaryText || '#e2e8f0',
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <div
                            onClick={() => onJumpToElementIndex(scene.elementIndex)}
                            className="font-bold flex items-center gap-1.5 cursor-pointer hover:underline flex-1 min-w-0"
                            style={{ color: themeConfig?.accentText || '#fcd34d' }}
                            title="Jump to scene in script"
                          >
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded border shrink-0"
                              style={{
                                backgroundColor: themeConfig?.topBottomBars || '#020617',
                                borderColor: themeConfig?.borders || '#1e293b',
                                color: themeConfig?.primaryText || '#fcd34d',
                              }}
                            >
                              #{scene.sceneNumber}
                            </span>
                            <span className="truncate min-w-0">{scene.heading}</span>
                          </div>
                          <button
                            onClick={() => setActiveShotSceneId(scene.id)}
                            className="px-2 py-1 border rounded font-bold text-[10px] flex items-center gap-1 shrink-0 transition cursor-pointer hover:opacity-90"
                            style={{
                              backgroundColor: themeConfig?.accentButtons || '#8C6239',
                              borderColor: themeConfig?.accentButtons || '#8C6239',
                              color: '#FFFFFF',
                            }}
                          >
                            <Camera className="w-3 h-3 text-white shrink-0" />
                            <span>Shots ({sceneShots.length})</span>
                          </button>
                        </div>

                        {scene.characters.length > 0 && (
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {scene.characters.map((char) => (
                              <span
                                key={char}
                                className="px-1.5 py-0.5 rounded border font-bold"
                                style={{
                                  backgroundColor: themeConfig?.topBottomBars || '#020617',
                                  borderColor: themeConfig?.borders || '#1e293b',
                                  color: themeConfig?.primaryText || '#fcd34d',
                                }}
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        )}

                        <div
                          className="flex items-center justify-between text-[10px] opacity-75 pt-1 border-t"
                          style={{ borderColor: themeConfig?.borders || '#334155' }}
                        >
                          <span>
                            {scene.lengthLines} lines (~{estPageFraction} pgs)
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: THE FULL SHOT LIST (THE STRIPBOARD) */}
          {activeTab === 'shotlist' && (
            <div className="space-y-4">
              <div className="p-3.5 border rounded-lg space-y-3" style={mt.cardStyle}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono" style={mt.accentStyle}>
                    <Camera className="w-4 h-4" />
                    <span>PRODUCTION SCHEDULE & SHOTS</span>
                  </div>
                  <span className="text-[10px] border px-2 py-0.5 rounded font-bold" style={{ ...mt.subCardStyle, ...mt.accentStyle }}>
                    {shots.length} SHOTS LOGGED
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed" style={mt.mutedStyle}>
                  Logistical blueprint mapping all script scenes into actionable production shots, lenses, and equipment.
                </p>

                {onOpenProductionSchedule && (
                  <button
                    onClick={onOpenProductionSchedule}
                    className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md my-1 hover:opacity-90"
                    style={mt.primaryBtnStyle}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Open Full Call Sheet, H&S & Production Suite</span>
                  </button>
                )}

                {/* Sort Toggles */}
                <div className="pt-2 border-t space-y-2" style={mt.borderStyle}>
                  <div className="text-[10px] uppercase font-bold flex items-center gap-1" style={mt.mutedStyle}>
                    <SlidersHorizontal className="w-3 h-3" style={mt.accentStyle} />
                    <span>"Sort to Shoot" Logistics Toggles:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded border cursor-pointer text-[11px]" style={mt.subCardStyle}>
                      <input
                        type="checkbox"
                        checked={groupByLocation}
                        onChange={(e) => setGroupByLocation(e.target.checked)}
                        className="rounded focus:ring-0"
                        style={{ accentColor: mt.theme.accentButtons }}
                      />
                      <span>Group by Location</span>
                    </label>

                    <label className="flex items-center gap-2 p-2 rounded border cursor-pointer text-[11px]" style={mt.subCardStyle}>
                      <input
                        type="checkbox"
                        checked={outdoorPriority}
                        onChange={(e) => setOutdoorPriority(e.target.checked)}
                        className="rounded focus:ring-0"
                        style={{ accentColor: mt.theme.accentButtons }}
                      />
                      <span>Outdoor Priority (EXT)</span>
                    </label>
                  </div>
                </div>

                {/* Global Production Notes */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] uppercase font-bold" style={mt.mutedStyle}>
                    Global Production / Transition Notes for Crew:
                  </label>
                  <textarea
                    rows={2}
                    value={script.productionNotes || ''}
                    onChange={(e) => onChangeScript({ ...script, productionNotes: e.target.value })}
                    placeholder="Enter crew safety notes, lighting setup rules, catering schedules..."
                    className="w-full border rounded p-2 text-xs focus:outline-none resize-none"
                    style={mt.inputStyle}
                  />
                </div>
              </div>

              {/* Stripboard Render List */}
              <div className="space-y-3">
                {(() => {
                  let sortedScenes = [...scenes];

                  if (groupByLocation) {
                    sortedScenes.sort((a, b) => {
                      const locA = a.heading.split('-')[0].trim();
                      const locB = b.heading.split('-')[0].trim();
                      if (locA !== locB) return locA.localeCompare(locB);
                      if (outdoorPriority) {
                        const isExtA = a.heading.includes('EXT.');
                        const isExtB = b.heading.includes('EXT.');
                        if (isExtA && !isExtB) return -1;
                        if (!isExtA && isExtB) return 1;
                      }
                      return 0;
                    });
                  } else if (outdoorPriority) {
                    sortedScenes.sort((a, b) => {
                      const isExtA = a.heading.includes('EXT.');
                      const isExtB = b.heading.includes('EXT.');
                      if (isExtA && !isExtB) return -1;
                      if (!isExtA && isExtB) return 1;
                      return 0;
                    });
                  }

                  if (sortedScenes.length === 0) {
                    return (
                      <div className="text-center py-8 italic" style={mt.mutedStyle}>
                        No scenes available for shot list.
                      </div>
                    );
                  }

                  return sortedScenes.map((scene) => {
                    const sceneShots = shots.filter((s) => s.sceneHeadingId === scene.id);
                    return (
                      <div
                        key={scene.id}
                        className="p-3 border rounded-lg space-y-2.5 shadow-sm"
                        style={mt.cardStyle}
                      >
                        <div className="flex items-center justify-between border-b pb-2 min-w-0 gap-2" style={mt.borderStyle}>
                          <div className="font-bold flex items-center gap-1.5 flex-1 min-w-0">
                            <span className="text-[10px] px-1.5 py-0.5 rounded border shrink-0" style={{ ...mt.subCardStyle, ...mt.accentStyle }}>
                              #{scene.sceneNumber}
                            </span>
                            <span className="truncate min-w-0">{scene.heading}</span>
                          </div>
                          <button
                            onClick={() => setActiveShotSceneId(scene.id)}
                            className="px-2 py-1 border rounded text-[10px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer hover:opacity-85"
                            style={mt.secondaryBtnStyle}
                          >
                            <Plus className="w-3 h-3" style={mt.accentStyle} />
                            <span>Add Shot</span>
                          </button>
                        </div>

                        {sceneShots.length === 0 ? (
                          <div className="text-[11px] italic py-1" style={mt.mutedStyle}>
                            No shots logged yet. Click "Add Shot" to plan camera setups.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {sceneShots.map((sh) => (
                              <div
                                key={sh.id}
                                className="p-2.5 border rounded space-y-1.5 text-[11px]"
                                style={mt.subCardStyle}
                              >
                                <div className="flex items-center justify-between font-bold">
                                  <div className="flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 rounded border" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
                                      {sh.shotNumber}
                                    </span>
                                    <span>{sh.shotType}</span>
                                  </div>
                                  <span style={mt.mutedStyle}>{sh.estimatedTimeMin} min</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-[10px] pt-1" style={mt.mutedStyle}>
                                  <div><strong>Angle:</strong> {sh.angle}</div>
                                  <div><strong>Lens:</strong> {sh.lens}</div>
                                  <div><strong>Equip:</strong> {sh.equipment}</div>
                                </div>
                                {sh.sketchDataUrl && (
                                  <div className="pt-1">
                                    <img
                                      src={sh.sketchDataUrl}
                                      alt="Shot sketch"
                                      className="w-16 h-12 object-cover rounded border"
                                      style={mt.borderStyle}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: STORY ARC SANDBOX */}
          {activeTab === 'arc' && (
            <StoryArcTabContent onOpenStoryArc={() => setIsWhiteboardMaximized(true)} />
          )}

          {/* TAB 4: THE MASTER'S INSPIRATIONS */}
          {activeTab === 'inspiration' && (
            <div className="space-y-4 py-6 px-2 text-center">
              <div
                className="p-4 border rounded-xl space-y-3"
                style={{
                  backgroundColor: themeConfig?.sceneCards || '#020617',
                  borderColor: themeConfig?.borders || '#1e293b',
                }}
              >
                <div
                  className="flex items-center justify-center gap-2 font-bold text-xs uppercase"
                  style={{ color: themeConfig?.accentText || '#fcd34d' }}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>Master’s Inspirations</span>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Break through writer's block with lighthearted creative play. Click below to draw a random scene provocation.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenSparkModal}
                    className="w-full py-3.5 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform active:scale-95 cursor-pointer hover:opacity-90"
                    style={{ backgroundColor: themeConfig?.accentButtons || '#8C6239' }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                    <span>Spark Provocation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHARACTERS */}
          {activeTab === 'characters' && (
            <div className="space-y-3">
              <div
                className="flex items-center justify-between pb-2 border-b px-1 gap-1.5 flex-wrap"
                style={{ borderColor: themeConfig?.borders || '#1e293b' }}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <Users className="w-4 h-4" style={{ color: themeConfig?.accentText || '#fbbf24' }} />
                  <span className="font-bold text-xs uppercase">{characters.length} Screenplay Characters</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <ActorHighlightToggle
                    isActive={Boolean(script.isActorHighlightingActive)}
                    onToggle={() => {
                      onChangeScript({
                        ...script,
                        isActorHighlightingActive: !script.isActorHighlightingActive,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsCharacterBibleMaximized(true)}
                    className="px-3.5 py-2 border-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-150 cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-95 group shrink-0"
                    style={{
                      backgroundColor: themeConfig?.isDark ? '#181A20' : '#FFFBEB',
                      borderColor: themeConfig?.isDark ? '#F59E0B' : '#D97706',
                      color: themeConfig?.isDark ? '#F8FAFC' : '#1C1917',
                      boxShadow: '0 4px 12px -2px rgba(217, 119, 6, 0.25)',
                    }}
                    title="Maximise Character Bible"
                  >
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: '#D97706' }}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                    <span>Maximise</span>
                  </button>
                </div>
              </div>

              {editingCharacterName ? (
                <div
                  className="p-4 border rounded-xl space-y-3 shadow-xl"
                  style={{
                    backgroundColor: themeConfig?.sceneCards || '#1e293b',
                    borderColor: themeConfig?.accentButtons || '#fbbf24',
                  }}
                >
                  <div
                    className="flex items-center justify-between pb-2 border-b"
                    style={{ borderColor: themeConfig?.borders || '#334155' }}
                  >
                    <span
                      className="font-bold uppercase text-xs"
                      style={{ color: themeConfig?.accentText || '#fcd34d' }}
                    >
                      Character Bible: {editingCharacterName}
                    </span>
                    <button
                      onClick={() => setEditingCharacterName(null)}
                      className="p-1 opacity-70 hover:opacity-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {[
                      { label: 'Age / Era', val: tempAge, field: 'age', ph: 'e.g., Mid 40s' },
                      { label: 'Attitude / Vibe', val: tempAttitude, field: 'attitude', ph: 'e.g., Cynical, hyper-vigilant' },
                      { label: "Appearance (Show, Don't Tell)", val: tempAppearance, field: 'appearance', ph: 'e.g., Frayed tweed jacket' },
                      { label: 'Action in First Scene', val: tempActionInFirstScene, field: 'actionInFirstScene', ph: 'What do they do before speaking?' },
                      { label: 'Internal Flaw', val: tempFlaw, field: 'internalFlaw', ph: 'e.g., Blind pride' },
                      { label: 'Core Motivation', val: tempMotivation, field: 'coreMotivation', ph: 'e.g., To win approval at all costs' },
                    ].map((f) => (
                      <div key={f.field}>
                        <label className="block text-[10px] opacity-80 uppercase font-bold mb-1">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          value={f.val}
                          onChange={(e) => handleUpdateCharacterField(f.field, e.target.value)}
                          placeholder={f.ph}
                          className="w-full border rounded px-2.5 py-1.5 text-xs focus:outline-none"
                          style={{
                            backgroundColor: themeConfig?.topBottomBars || '#020617',
                            borderColor: themeConfig?.borders || '#334155',
                            color: themeConfig?.primaryText || '#f1f5f9',
                          }}
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-[10px] opacity-80 uppercase font-bold mb-1">
                        Visual Description & Notes
                      </label>
                      <textarea
                        rows={2}
                        value={tempVisual}
                        onChange={(e) => handleUpdateCharacterField('visualDescription', e.target.value)}
                        placeholder="Directorial notes for visual presence..."
                        className="w-full border rounded p-2 text-xs focus:outline-none resize-none"
                        style={{
                          backgroundColor: themeConfig?.topBottomBars || '#020617',
                          borderColor: themeConfig?.borders || '#334155',
                          color: themeConfig?.primaryText || '#f1f5f9',
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCharacterName(null)}
                      className="px-3 py-1.5 border rounded text-xs font-bold cursor-pointer hover:opacity-80"
                      style={{
                        backgroundColor: themeConfig?.topBottomBars || '#0f172a',
                        borderColor: themeConfig?.borders || '#334155',
                        color: themeConfig?.primaryText || '#cbd5e1',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCharacterBible}
                      className="px-3.5 py-1.5 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: themeConfig?.accentButtons || '#8C6239' }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Bible</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {characters.length === 0 ? (
                    <div className="text-center py-8 opacity-65 italic">
                      No character dialogue lines detected yet. Add CHARACTER elements to begin.
                    </div>
                  ) : (
                    characters.map((char) => {
                      const bible = script.characterBibles?.[char.name];
                      const allSpeakingCharNames = characters.map((c) => c.name);
                      const assignedColor = getCharacterHighlightColor(
                        char.name,
                        script.characterBibles,
                        allSpeakingCharNames
                      );
                      const hasNotes = Boolean(
                        bible?.age || bible?.appearance || bible?.attitude || bible?.actionInFirstScene || bible?.internalFlaw || bible?.coreMotivation
                      );

                      const charScenes = scenes.filter((s) => s.characters.includes(char.name));

                      return (
                        <div
                          key={char.name}
                          onClick={() => handleOpenCharacterEdit(char.name)}
                          className="p-3.5 rounded-xl cursor-pointer transition space-y-2.5 shadow-sm border"
                          style={{
                            backgroundColor: themeConfig?.sceneCards || '#1e293b',
                            borderColor: hasNotes ? (themeConfig?.borders || '#334155') : (themeConfig?.accentButtons || '#fbbf24'),
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 border shadow-xs"
                                style={{ backgroundColor: assignedColor, borderColor: themeConfig?.borders || '#475569' }}
                                title={`Assigned colour: ${assignedColor}`}
                              />
                              <span className="font-bold text-sm">{char.name}</span>
                              {!hasNotes && (
                                <span
                                  className="px-1.5 py-0.5 rounded text-white text-[9px] font-bold uppercase tracking-wider"
                                  style={{ backgroundColor: themeConfig?.accentButtons || '#8C6239' }}
                                >
                                  NEW
                                </span>
                              )}
                            </div>
                            <span
                              className="text-[10px] font-bold flex items-center gap-1"
                              style={{ color: themeConfig?.accentText || '#fbbf24' }}
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit Bible
                            </span>
                          </div>

                          <PastelSwatchPicker
                            selectedColor={assignedColor}
                            onSelectColor={(hex) => handleUpdateCharacterColor(char.name, hex)}
                            themeConfig={themeConfig}
                          />

                          {hasNotes ? (
                            <div
                              className="text-[11px] space-y-1 p-2 rounded border opacity-90"
                              style={{
                                backgroundColor: themeConfig?.topBottomBars || '#020617',
                                borderColor: themeConfig?.borders || '#1e293b',
                              }}
                            >
                              {bible?.age && <div><strong>Age:</strong> {bible.age}</div>}
                              {bible?.appearance && <div><strong>Appearance:</strong> {bible.appearance}</div>}
                              {bible?.actionInFirstScene && <div><strong>First Scene Action:</strong> {bible.actionInFirstScene}</div>}
                              {bible?.internalFlaw && <div><strong>Flaw:</strong> {bible.internalFlaw}</div>}
                            </div>
                          ) : (
                            <div className="text-[11px] opacity-75 italic">
                              Click to complete Workbook: Age, Appearance, Attitude, First Scene Action...
                            </div>
                          )}

                          <div
                            className="pt-2 border-t space-y-1"
                            style={{ borderColor: themeConfig?.borders || '#334155' }}
                          >
                            <div className="text-[9px] opacity-75 uppercase font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" style={{ color: themeConfig?.accentText || '#fbbf24' }} />
                              <span>Appearance Log ({charScenes.length} scenes):</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {charScenes.length > 0 ? (
                                charScenes.map((s) => (
                                  <span
                                    key={s.id}
                                    className="px-1.5 py-0.5 rounded text-[9px] border"
                                    style={{
                                      backgroundColor: themeConfig?.topBottomBars || '#020617',
                                      borderColor: themeConfig?.borders || '#1e293b',
                                    }}
                                  >
                                    #{s.sceneNumber}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] opacity-65 italic">No direct scene heading link</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] opacity-80 pt-1">
                            <span>Dialogue Lines: <strong style={{ color: themeConfig?.accentText || '#fcd34d' }}>{char.dialogueCount}</strong></span>
                            <span>{char.wordCount} words</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SCRIPT STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div
                className="p-3 border rounded-lg space-y-2"
                style={{
                  backgroundColor: themeConfig?.sceneCards || '#1e293b',
                  borderColor: themeConfig?.borders || '#334155',
                }}
              >
                <div className="text-[10px] opacity-75 uppercase font-bold tracking-wider">
                  HOLLYWOOD PAGE ESTIMATE
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold" style={{ color: themeConfig?.accentText || '#fbbf24' }}>{pageStats.pages}</span>
                  <span className="text-xs opacity-75">PAGES (~54 lines/page)</span>
                </div>
                <div
                  className="text-[11px] opacity-85 flex items-center gap-1.5 pt-1 border-t"
                  style={{ borderColor: themeConfig?.borders || '#334155' }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: themeConfig?.accentText || '#fbbf24' }} />
                  <span>Est. Screen Runtime: ~{Math.ceil(pageStats.pages)} minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div
                  className="p-2.5 border rounded"
                  style={{
                    backgroundColor: themeConfig?.sceneCards || '#1e293b',
                    borderColor: themeConfig?.borders || '#334155',
                  }}
                >
                  <div className="text-[10px] opacity-75 uppercase font-bold">TOTAL WORDS</div>
                  <div className="text-base font-bold mt-1">{pageStats.totalWords}</div>
                </div>
                <div
                  className="p-2.5 border rounded"
                  style={{
                    backgroundColor: themeConfig?.sceneCards || '#1e293b',
                    borderColor: themeConfig?.borders || '#334155',
                  }}
                >
                  <div className="text-[10px] opacity-75 uppercase font-bold">TOTAL ELEMENTS</div>
                  <div className="text-base font-bold mt-1">{script.elements.length}</div>
                </div>
              </div>

              <div
                className="p-3 border rounded space-y-2"
                style={{
                  backgroundColor: themeConfig?.sceneCards || '#1e293b',
                  borderColor: themeConfig?.borders || '#334155',
                }}
              >
                <div className="text-[10px] opacity-75 uppercase font-bold tracking-wider">
                  ELEMENT TYPES BREAKDOWN
                </div>
                {['SCENE HEADING', 'ACTION', 'CHARACTER', 'DIALOGUE', 'PARENTICAL', 'TRANSITION'].map((type) => {
                  const count = script.elements.filter((e) => e.type === type).length;
                  const pct = script.elements.length ? Math.round((count / script.elements.length) * 100) : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="font-bold">{type}</span>
                        <span style={{ color: themeConfig?.accentText || '#fbbf24' }}>{count} ({pct}%)</span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded overflow-hidden"
                        style={{ backgroundColor: themeConfig?.topBottomBars || '#020617' }}
                      >
                        <div
                          className="h-full"
                          style={{ width: `${pct}%`, backgroundColor: themeConfig?.accentButtons || '#fbbf24' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* SCENE SHOT PLANNER MODAL */}
      <SceneShotPlannerModal
        activeShotSceneId={activeShotSceneId}
        scenes={scenes}
        shots={shots}
        elements={script.elements}
        onClose={() => setActiveShotSceneId(null)}
        onAddShot={handleAddShot}
        onUpdateShot={(shotId, fields) => handleUpdateShot(shotId, fields)}
        onDeleteShot={handleDeleteShot}
        themeConfig={themeConfig}
      />
      {/* SPARK PROVOCATION MODAL */}
      {isSparkModalOpen && (
        <div
          className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          style={mt.overlayStyle}
        >
          <div
            className="border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col p-6 space-y-5 relative"
            style={mt.windowStyle}
          >
            <button
              onClick={handleCloseSparkModal}
              className="absolute top-4 right-4 p-1.5 rounded-full border transition cursor-pointer hover:opacity-80"
              style={mt.secondaryBtnStyle}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase" style={mt.accentStyle}>Creative Provocation Spark</h3>
                <p className="text-[10px]" style={mt.mutedStyle}>{currentSpark.categoryLabel}</p>
              </div>
            </div>

            <div className="p-5 border rounded-xl space-y-3 relative overflow-hidden shadow-inner" style={mt.cardStyle}>
              <div className="absolute right-2 -bottom-2 opacity-10 pointer-events-none" style={mt.accentStyle}>
                <Lightbulb className="w-32 h-32" />
              </div>
              <p className="text-sm font-medium leading-relaxed italic relative z-10">
                {(() => {
                  if (currentSpark.categoryKey !== 'motivation') return `"${currentSpark.text}"`;
                  const dashIdx = currentSpark.text.lastIndexOf('—');
                  if (dashIdx === -1) return currentSpark.text;
                  const quotePart = currentSpark.text.slice(0, dashIdx + 1);
                  const authorName = currentSpark.text.slice(dashIdx + 1).trim();
                  if (!authorName) return currentSpark.text;
                  return (
                    <>
                      {quotePart}{' '}
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(authorName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-inherit no-underline hover:underline underline-offset-2"
                      >
                        {authorName}
                      </a>
                    </>
                  );
                })()}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleShuffleProvocation}
                className="flex-1 py-2.5 font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow transition active:scale-95 cursor-pointer hover:opacity-90"
                style={mt.primaryBtnStyle}
              >
                <Sparkles className="w-4 h-4" />
                <span>Shuffle Another</span>
              </button>
              <button
                type="button"
                onClick={handleCloseSparkModal}
                className="px-4 py-2.5 border font-bold rounded-xl text-xs transition cursor-pointer hover:opacity-85"
                style={mt.secondaryBtnStyle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN STORY LAB MODAL */}
      <StoryLabModal
        isOpen={isWhiteboardMaximized}
        onClose={() => setIsWhiteboardMaximized(false)}
        script={script}
        scenes={scenes}
        estimatedMinutes={estRuntimeMin}
        onChangeScript={onChangeScript}
        onJumpToScene={(sceneId) => {
          const sc = scenes.find((s) => s.id === sceneId);
          if (sc) onJumpToElementIndex(sc.elementIndex);
        }}
        themeConfig={themeConfig}
      />

      {/* FULLSCREEN MAXIMIZED CHARACTER BIBLE MODAL */}
      {isCharacterBibleMaximized && (
        <div
          className="fixed inset-x-0 top-28 bottom-0 z-50 flex flex-col p-4 sm:p-6 overflow-hidden animate-in fade-in duration-150"
          style={mt.windowStyle}
        >
          {/* Header Bar */}
          <div
            className="flex items-center justify-between pb-4 pt-1 border-b shrink-0 sticky top-0 backdrop-blur-md z-30"
            style={mt.borderStyle}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl border" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <span>Character Bible & Show-Don't-Tell Studio</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full border font-mono" style={{ ...mt.cardStyle, ...mt.accentStyle }}>
                    {characters.length} Detected
                  </span>
                </h2>
                <p className="text-xs" style={mt.mutedStyle}>
                  Comprehensive character arc analysis, psychological motivation, physical cues, and scene appearance logs.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCharacterBibleMaximized(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-lg cursor-pointer active:scale-95 hover:opacity-90"
              style={mt.primaryBtnStyle}
            >
              <Minimize2 className="w-4 h-4" />
              <span>✕ RETURN TO SCRIPT</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 min-h-0 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
            {/* Left Col: Character Roster List */}
            <div className="lg:col-span-4 border rounded-2xl p-4 flex flex-col min-h-0" style={mt.subCardStyle}>
              <div className="pb-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b shrink-0" style={mt.borderStyle}>
                <span style={mt.mutedStyle}>Select Character</span>
                <span className="text-[10px]" style={mt.accentStyle}>Click to edit profile</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mt-3 pr-1">
                {characters.map((char) => {
                  const bible = script.characterBibles?.[char.name];
                  const isSelected = editingCharacterName === char.name;
                  const hasNotes = Boolean(
                    bible?.age || bible?.appearance || bible?.attitude || bible?.actionInFirstScene || bible?.internalFlaw || bible?.coreMotivation
                  );
                  const charScenes = scenes.filter((s) => s.characters.includes(char.name));

                  return (
                    <div
                      key={char.name}
                      onClick={() => handleOpenCharacterEdit(char.name)}
                      className="p-3.5 rounded-xl cursor-pointer transition border shadow-sm"
                      style={{
                        backgroundColor: isSelected ? mt.theme.sceneCards : mt.theme.workspaceBackdrop,
                        borderColor: isSelected ? mt.theme.accentButtons : mt.theme.borders,
                        color: mt.theme.primaryText,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{char.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono" style={mt.mutedStyle}>{charScenes.length} scenes</span>
                          {!hasNotes && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={mt.primaryBtnStyle}>
                              NEW
                            </span>
                          )}
                        </div>
                      </div>

                      {bible?.attitude ? (
                        <p className="text-xs truncate" style={mt.accentStyle}>{bible.attitude}</p>
                      ) : bible?.appearance ? (
                        <p className="text-xs truncate" style={mt.mutedStyle}>{bible.appearance}</p>
                      ) : (
                        <p className="text-[11px] italic" style={mt.mutedStyle}>No notes logged yet...</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Active Character Deep-Dive Editor */}
            <div className="lg:col-span-8 border rounded-2xl p-6 flex flex-col min-h-0 overflow-y-auto" style={mt.cardStyle}>
              {editingCharacterName ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b" style={mt.borderStyle}>
                    <div>
                      <span className="text-xs font-mono uppercase font-bold" style={mt.accentStyle}>Editing Character Profile</span>
                      <h3 className="text-2xl font-bold">{editingCharacterName}</h3>
                    </div>
                    <button
                      onClick={handleSaveCharacterBible}
                      className="px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer hover:opacity-90"
                      style={mt.primaryBtnStyle}
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Character Profile</span>
                    </button>
                  </div>

                  {/* Character Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Age / Era / Social Status
                      </label>
                      <input
                        type="text"
                        value={tempAge}
                        onChange={(e) => handleUpdateCharacterField('age', e.target.value)}
                        placeholder="e.g. Late 30s, Former military technician"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Attitude / Vibe / Energy
                      </label>
                      <input
                        type="text"
                        value={tempAttitude}
                        onChange={(e) => handleUpdateCharacterField('attitude', e.target.value)}
                        placeholder="e.g. Stoic, hyper-vigilant, defensive humor"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Appearance (Show, Don't Tell Physicality)
                      </label>
                      <input
                        type="text"
                        value={tempAppearance}
                        onChange={(e) => handleUpdateCharacterField('appearance', e.target.value)}
                        placeholder="e.g. Frayed leather trench coat, constant hand tremor"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Action in First Scene (Opening Physical Impulse)
                      </label>
                      <input
                        type="text"
                        value={tempActionInFirstScene}
                        onChange={(e) => handleUpdateCharacterField('actionInFirstScene', e.target.value)}
                        placeholder="e.g. Checks lock twice before pouring whiskey"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Internal Fatal Flaw
                      </label>
                      <input
                        type="text"
                        value={tempFlaw}
                        onChange={(e) => handleUpdateCharacterField('internalFlaw', e.target.value)}
                        placeholder="e.g. Inability to trust partners, deep-seated guilt"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                        Core Dramatic Motivation
                      </label>
                      <input
                        type="text"
                        value={tempMotivation}
                        onChange={(e) => handleUpdateCharacterField('coreMotivation', e.target.value)}
                        placeholder="e.g. Exonerate family name before trial"
                        className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none"
                        style={mt.inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold mb-1" style={mt.mutedStyle}>
                      Visual Presence & Directorial Camera Notes
                    </label>
                    <textarea
                      rows={3}
                      value={tempVisual}
                      onChange={(e) => handleUpdateCharacterField('visualDescription', e.target.value)}
                      placeholder="Notes for lighting, framing choices, wardrobe details, and specific camera angles for this character..."
                      className="w-full border rounded-xl p-3 text-sm focus:outline-none resize-none"
                      style={mt.inputStyle}
                    />
                  </div>

                  {/* Scene Appearance Grid for Active Character */}
                  <div className="pt-3 border-t space-y-2" style={mt.borderStyle}>
                    <label className="block text-xs font-bold uppercase tracking-wider" style={mt.accentStyle}>
                      Screenplay Scene Appearances ({scenes.filter(s => s.characters.includes(editingCharacterName)).length} Scenes)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {scenes.filter(s => s.characters.includes(editingCharacterName)).map(s => (
                        <div key={s.id} className="p-2.5 border rounded-lg text-xs space-y-1" style={mt.subCardStyle}>
                          <div className="font-bold" style={mt.accentStyle}>Scene #{s.sceneNumber}</div>
                          <div className="text-[11px] truncate max-w-[200px]" style={mt.mutedStyle}>{s.heading}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3" style={mt.mutedStyle}>
                  <Users className="w-12 h-12 opacity-60" />
                  <p className="text-sm font-medium">Select any character on the left to edit their full Character Bible, psychological arc, and directorial notes.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
