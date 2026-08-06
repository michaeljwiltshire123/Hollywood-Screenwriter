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
} from 'lucide-react';
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

interface NavigatorSidePanelProps {
  script: ScreenplayDocument;
  isOpen: boolean;
  onClose: () => void;
  onJumpToElementIndex: (index: number) => void;
  onChangeScript: (updated: ScreenplayDocument) => void;
  revisions: RevisionHistoryItem[];
  onRollbackRevision: (rev: RevisionHistoryItem) => void;
}

const MASTER_PROVOCATIONS = [
  "Imagine the antagonist is actually trying to help the protagonist, but in the most catastrophic way possible.",
  "What happens if this scene starts 30 seconds later, right after the explosion or confession?",
  "Every character in this scene must lie about their true motivation for at least two lines.",
  "Introduce a ticking clock: A loud sound or event occurs in 3 minutes that everyone is dreading.",
  "Switch the power dynamic: The character who feels weakest at the start must make a bold demand by the end.",
  "Add an irrelevant physical object (e.g., a squeaky rubber duck, a heavy suitcase) that someone is forced to carry.",
  "What if the dialogue is entirely subtext? No one says what they actually mean.",
  "Remove all exposition: The audience must figure out who these people are purely through actions and glances.",
  "Force a character to reveal their deepest secret in casual conversation while peeling an orange.",
  "The room starts filling with water (or smoke). How does the argument change?"
];

const DEFAULT_3_ACT: StoryArcCard[] = [
  { id: 'act-1', actTitle: 'Act I: Setup & Inciting Incident', goal: 'Establish the ordinary world, introduce the protagonist, and hit them with an inciting incident.' },
  { id: 'act-2', actTitle: 'Act II: Confrontation & Rising Action', goal: 'Raise the stakes, introduce obstacles, and push the protagonist toward the midpoint crisis.' },
  { id: 'act-3', actTitle: 'Act III: Climax & Resolution', goal: 'The ultimate showdown, emotional catharsis, and the new equilibrium.' }
];

const DEFAULT_5_ACT: StoryArcCard[] = [
  { id: 'act-1', actTitle: 'Act I: Exposition & Status Quo', goal: 'Introduce setting, characters, and initial dramatic premise.' },
  { id: 'act-2', actTitle: 'Act II: Rising Action & Complication', goal: 'Obstacles mount; secondary characters apply pressure.' },
  { id: 'act-3', actTitle: 'Act III: Midpoint Crisis', goal: 'A major revelation shifts the protagonist from reactive to proactive.' },
  { id: 'act-4', actTitle: 'Act IV: Falling Action & Lowest Point', goal: 'All hope seems lost; the antagonist gains the upper hand.' },
  { id: 'act-5', actTitle: 'Act V: Climax & Resolution', goal: 'The final test of character and resolution of narrative tension.' }
];

const DEFAULT_HEROS_JOURNEY: StoryArcCard[] = [
  { id: 'hj-1', actTitle: '1. Ordinary World', goal: 'Establish hero in mundane surroundings before the call to adventure.' },
  { id: 'hj-2', actTitle: '2. Call to Adventure', goal: 'Inciting disruption upsets the status quo.' },
  { id: 'hj-3', actTitle: '3. Refusal of the Call', goal: 'Hero hesitates due to fear, doubt, or duty.' },
  { id: 'hj-4', actTitle: '4. Meeting the Mentor', goal: 'Guidance, talisman, or wisdom is acquired.' },
  { id: 'hj-5', actTitle: '5. Crossing the Threshold', goal: 'Entering the special world with no turning back.' },
  { id: 'hj-6', actTitle: '6. Tests, Allies & Enemies', goal: 'Navigating tests and establishing relational dynamics.' },
  { id: 'hj-7', actTitle: '7. Approach to Inmost Cave', goal: 'Preparing for the central ordeal.' },
  { id: 'hj-8', actTitle: '8. The Ordeal', goal: 'Facing death or ultimate existential fear.' },
  { id: 'hj-9', actTitle: '9. Reward (Seizing Sword)', goal: 'Claiming the prize or realization.' },
  { id: 'hj-10', actTitle: '10. The Road Back', goal: 'Chased by remaining forces toward return.' },
  { id: 'hj-11', actTitle: '11. Resurrection', goal: 'Final existential purification test.' },
  { id: 'hj-12', actTitle: '12. Return with Elixir', goal: 'Returning transformed to the ordinary world.' },
];

function getGhostGuidanceHint(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('setup') || lower.includes('ordinary') || lower.includes('act i') || lower.includes('exposition')) {
    return 'Hint: Focus on establishing the ordinary world, introducing the protagonist\'s core flaw, and ending with an undeniable inciting incident.';
  }
  if (lower.includes('confrontation') || lower.includes('rising') || lower.includes('act ii') || lower.includes('tests') || lower.includes('complication')) {
    return 'Hint: Raise stakes progressively, force the protagonist into reactive traps, and lead to a midpoint revelation.';
  }
  if (lower.includes('climax') || lower.includes('resolution') || lower.includes('act iii') || lower.includes('act v') || lower.includes('ordeal')) {
    return 'Hint: Maximum pressure, ultimate showdown, and emotional catharsis resolving the protagonist\'s arc.';
  }
  if (lower.includes('mentor') || lower.includes('threshold')) {
    return 'Hint: Show the transition from hesitation to commitment through decisive physical action.';
  }
  return 'Hint: Define the specific dramatic obstacle and emotional shift required in this beat.';
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
}) => {
  const tabNavRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'scenes' | 'shotlist' | 'arc' | 'inspiration' | 'characters' | 'stats'>('scenes');
  const [sceneSearch, setSceneSearch] = useState('');

  // Fullscreen Whiteboard State
  const [isWhiteboardMaximized, setIsWhiteboardMaximized] = useState(false);

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

  // Master's Toolkit Provocation State
  const [currentProvocation, setCurrentProvocation] = useState<string>(MASTER_PROVOCATIONS[0]);
  const [isSparkModalOpen, setIsSparkModalOpen] = useState<boolean>(false);

  const handleShuffleProvocation = () => {
    const randomIndex = Math.floor(Math.random() * MASTER_PROVOCATIONS.length);
    setCurrentProvocation(MASTER_PROVOCATIONS[randomIndex]);
  };

  const handleOpenSparkModal = () => {
    handleShuffleProvocation();
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

  // Story Arc Structure Initialization & Handlers
  const storyArc: StoryArcStructure = script.storyArc || {
    preset: '3-Act',
    cards: DEFAULT_3_ACT
  };

  const handlePresetChange = (preset: '3-Act' | '5-Act' | 'Hero’s Journey' | 'Custom') => {
    let cards = DEFAULT_3_ACT;
    if (preset === '5-Act') cards = DEFAULT_5_ACT;
    if (preset === 'Hero’s Journey') cards = DEFAULT_HEROS_JOURNEY;
    if (preset === 'Custom' && storyArc.cards.length === 0) {
      cards = [{ id: `card-${Date.now()}`, actTitle: 'Sequence 1', goal: 'Define narrative objective.' }];
    } else if (preset === 'Custom') {
      cards = storyArc.cards;
    }

    onChangeScript({
      ...script,
      storyArc: { preset, cards }
    });
  };

  const handleAddArcCard = () => {
    const newCard: StoryArcCard = {
      id: `card-${Date.now()}`,
      actTitle: `Section ${storyArc.cards.length + 1}`,
      goal: 'Enter narrative goal for this section...'
    };
    onChangeScript({
      ...script,
      storyArc: {
        ...storyArc,
        preset: 'Custom',
        cards: [...storyArc.cards, newCard]
      }
    });
  };

  const handleUpdateArcCard = (id: string, field: 'actTitle' | 'goal' | 'linkedSceneId' | 'sketchId', val: string) => {
    const updatedCards = storyArc.cards.map((c) => (c.id === id ? { ...c, [field]: val } : c));
    onChangeScript({
      ...script,
      storyArc: {
        ...storyArc,
        cards: updatedCards
      }
    });
  };

  const handleDeleteArcCard = (id: string) => {
    const updatedCards = storyArc.cards.filter((c) => c.id !== id);
    onChangeScript({
      ...script,
      storyArc: {
        ...storyArc,
        preset: 'Custom',
        cards: updatedCards
      }
    });
  };

  // Character Bible Saving
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

  const handleSaveCharacterBible = () => {
    if (!editingCharacterName) return;
    const currentBibles = script.characterBibles || {};
    const updatedBibles = {
      ...currentBibles,
      [editingCharacterName]: {
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
      shotType: 'MEDIUM',
      angle: 'Eye Level',
      lens: '50mm',
      equipment: 'Tripod',
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
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed inset-y-0 left-0 z-40 lg:relative lg:inset-auto w-80 sm:w-96 bg-slate-900 border-r border-slate-800 text-slate-200 h-full flex flex-col shadow-2xl shrink-0 select-none transition-all duration-300">
        {/* Panel Header */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-xs uppercase text-amber-300">
              NAVIGATOR • PRODUCTION
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Storage Heavy Warning Banner */}
        {isStorageHeavy && (
          <div className="bg-rose-950/90 border-b border-rose-500/50 p-2.5 flex items-start gap-2 text-[11px] text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">STORAGE WARNING:</strong> Base64 images exceed 5MB. IndexedDB JSON size is high ({Math.round(jsonStringSize / (1024 * 1024))}MB). Consider smaller sketches.
            </div>
          </div>
        )}

        {/* 6-Tab Navigation Grid (Always 100% Visible) */}
        <div className="grid grid-cols-3 gap-1 p-1.5 border-b border-slate-800 bg-slate-950/80 text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'scenes'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Scene Heading Navigator"
          >
            <Layers className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">SCENES</span>
          </button>

          <button
            onClick={() => setActiveTab('shotlist')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'shotlist'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Production Stripboard & Shot List"
          >
            <Camera className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="truncate">SHOTS</span>
          </button>

          <button
            onClick={() => setActiveTab('arc')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'arc'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Story Arc Sandbox"
          >
            <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">ARC</span>
          </button>

          <button
            onClick={() => setActiveTab('inspiration')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'inspiration'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Creative Inspirations & Provocations"
          >
            <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">IDEAS</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'characters'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Character Bibles & Appearance Logs"
          >
            <Users className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="truncate">CHARS</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-1.5 px-1 rounded border font-semibold transition flex items-center justify-center gap-1 text-center truncate ${
              activeTab === 'stats'
                ? 'border-amber-400 text-amber-300 bg-slate-900 shadow-sm'
                : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
            title="Script Page Stats & Breakdown"
          >
            <BarChart3 className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="truncate">STATS</span>
          </button>
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-3">
          {/* TAB 1: SCENE NAVIGATOR & SHOT MANAGER MODAL */}
          {activeTab === 'scenes' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter scenes or characters..."
                  value={sceneSearch}
                  onChange={(e) => setSceneSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                <span>{filteredScenes.length} SCENES DETECTED</span>
                <span>PAGE ESTIMATE: ~{pageStats.pages}</span>
              </div>

              <div className="space-y-2">
                {filteredScenes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 italic">
                    No scene headings found. Add "INT. LOCATION - DAY" to create scenes.
                  </div>
                ) : (
                  filteredScenes.map((scene) => {
                    const sceneShots = shots.filter((s) => s.sceneHeadingId === scene.id);
                    const estPageFraction = (scene.lengthLines / 54).toFixed(1);
                    return (
                      <div
                        key={scene.id}
                        className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded transition space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            onClick={() => onJumpToElementIndex(scene.elementIndex)}
                            className="font-bold text-amber-300 truncate flex items-center gap-1.5 cursor-pointer hover:underline"
                            title="Jump to scene in script"
                          >
                            <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded border border-slate-800">
                              #{scene.sceneNumber}
                            </span>
                            <span className="truncate">{scene.heading}</span>
                          </div>
                          <button
                            onClick={() => setActiveShotSceneId(scene.id)}
                            className="px-2 py-1 bg-sky-950 border border-sky-600/60 hover:bg-sky-900 text-sky-200 rounded font-bold text-[10px] flex items-center gap-1 shrink-0 transition"
                          >
                            <Camera className="w-3 h-3 text-sky-400" />
                            <span>Shots ({sceneShots.length})</span>
                          </button>
                        </div>

                        {scene.characters.length > 0 && (
                          <div className="flex flex-wrap gap-1 text-[10px] text-slate-300">
                            {scene.characters.map((char) => (
                              <span
                                key={char}
                                className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 border border-slate-800 font-bold"
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">
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
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase">
                    <Camera className="w-4 h-4" />
                    <span>PRODUCTION STRIPBOARD</span>
                  </div>
                  <button
                    onClick={handlePrintShotList}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 transition"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print Crew Sheet</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Logistical blueprint mapping all script scenes into actionable production shots, lenses, and equipment.
                </p>

                {/* Sort Toggles */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-300 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                    <span>"Sort to Shoot" Logistics Toggles:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={groupByLocation}
                        onChange={(e) => setGroupByLocation(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>Group by Location</span>
                    </label>

                    <label className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-800 cursor-pointer text-[11px]">
                      <input
                        type="checkbox"
                        checked={outdoorPriority}
                        onChange={(e) => setOutdoorPriority(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>Outdoor Priority (EXT)</span>
                    </label>
                  </div>
                </div>

                {/* Global Production Notes */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold">
                    Global Production / Transition Notes for Crew:
                  </label>
                  <textarea
                    rows={2}
                    value={script.productionNotes || ''}
                    onChange={(e) => onChangeScript({ ...script, productionNotes: e.target.value })}
                    placeholder="Enter crew safety notes, lighting setup rules, catering schedules..."
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-sky-400 resize-none"
                  />
                </div>
              </div>

              {/* Stripboard Render List */}
              <div className="space-y-3">
                {(() => {
                  // Sort and group scenes according to toggles
                  let sortedScenes = [...scenes];

                  if (groupByLocation) {
                    sortedScenes.sort((a, b) => {
                      const locA = a.heading.split('-')[0].trim();
                      const locB = b.heading.split('-')[0].trim();
                      if (locA !== locB) return locA.localeCompare(locB);
                      // Inside location group, apply outdoor priority if checked
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
                      <div className="text-center py-8 text-slate-500 italic">
                        No scenes available for shot list.
                      </div>
                    );
                  }

                  return sortedScenes.map((scene) => {
                    const sceneShots = shots.filter((s) => s.sceneHeadingId === scene.id);
                    return (
                      <div
                        key={scene.id}
                        className="p-3 bg-slate-800/90 border border-slate-700 rounded-lg space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                          <div className="font-bold text-amber-300 flex items-center gap-1.5">
                            <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded border border-slate-800">
                              #{scene.sceneNumber}
                            </span>
                            <span className="truncate max-w-[180px]">{scene.heading}</span>
                          </div>
                          <button
                            onClick={() => setActiveShotSceneId(scene.id)}
                            className="px-2 py-1 bg-slate-900 border border-slate-700 hover:bg-slate-750 text-sky-300 rounded text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Shot</span>
                          </button>
                        </div>

                        {sceneShots.length === 0 ? (
                          <div className="text-[11px] text-slate-500 italic py-1">
                            No shots logged yet. Click "Add Shot" to plan camera setups.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {sceneShots.map((sh) => (
                              <div
                                key={sh.id}
                                className="p-2.5 bg-slate-950 border border-slate-800 rounded space-y-1.5 text-[11px]"
                              >
                                <div className="flex items-center justify-between font-bold text-slate-200">
                                  <div className="flex items-center gap-2">
                                    <span className="text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                      {sh.shotNumber}
                                    </span>
                                    <span className="text-sky-300">{sh.shotType}</span>
                                  </div>
                                  <span className="text-slate-400">{sh.estimatedTimeMin} min</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 pt-1">
                                  <div><span className="text-slate-500">Angle:</span> {sh.angle}</div>
                                  <div><span className="text-slate-500">Lens:</span> {sh.lens}</div>
                                  <div><span className="text-slate-500">Equip:</span> {sh.equipment}</div>
                                </div>
                                {sh.sketchDataUrl && (
                                  <div className="pt-1">
                                    <img
                                      src={sh.sketchDataUrl}
                                      alt="Shot sketch"
                                      className="w-16 h-12 object-cover rounded border border-slate-700"
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
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                    <TrendingUp className="w-4 h-4" />
                    <span>STORY ARC SANDBOX</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsWhiteboardMaximized(true)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[10px] flex items-center gap-1 transition shadow"
                    title="Fullscreen Whiteboard Mode"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Maximize Whiteboard</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                  {(['3-Act', '5-Act', 'Hero’s Journey', 'Custom'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetChange(preset)}
                      className={`px-2 py-0.5 rounded font-bold border transition ${
                        storyArc.preset === preset
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Interactive blueprint. Switch narrative philosophies instantly without losing text. Maximize for immersive grid whiteboard.
                </p>
              </div>

              {/* Arc Cards List */}
              <div className="space-y-3">
                {storyArc.cards.map((card, idx) => {
                  const ghostHint = getGhostGuidanceHint(card.actTitle);
                  const linkedScene = scenes.find((s) => s.id === card.linkedSceneId);
                  const pinnedShot = (script.shots || []).find((sh) => sh.id === card.sketchId);

                  return (
                    <div
                      key={card.id}
                      className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-lg space-y-2.5 shadow-sm relative group"
                    >
                      {/* Ghost Guidance Hint Text */}
                      <div className="text-[10px] text-amber-300/70 italic bg-slate-950/60 p-1.5 rounded border border-slate-900 leading-relaxed">
                        {ghostHint}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={card.actTitle}
                          onChange={(e) => handleUpdateArcCard(card.id, 'actTitle', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-bold w-full focus:outline-none focus:border-emerald-400"
                          placeholder="Section title..."
                        />
                        <button
                          onClick={() => handleDeleteArcCard(card.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                          title="Delete section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                          Narrative Goal & Key Beat:
                        </label>
                        <textarea
                          rows={2}
                          value={card.goal}
                          onChange={(e) => handleUpdateArcCard(card.id, 'goal', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 resize-none"
                          placeholder="What must happen in this section?"
                        />
                      </div>

                      {/* Scene Link & Sketch Pin Linkage */}
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/50 text-[10px]">
                        <div>
                          <label className="block text-slate-400 uppercase font-bold mb-0.5">Scene Link:</label>
                          <select
                            value={card.linkedSceneId || ''}
                            onChange={(e) => handleUpdateArcCard(card.id, 'linkedSceneId', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-400"
                          >
                            <option value="">-- No Scene Attached --</option>
                            {scenes.map((s) => (
                              <option key={s.id} value={s.id}>#{s.sceneNumber}: {s.heading.substring(0, 20)}...</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 uppercase font-bold mb-0.5">Pin Sketch Ref:</label>
                          <select
                            value={card.sketchId || ''}
                            onChange={(e) => handleUpdateArcCard(card.id, 'sketchId', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-1.5 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-400"
                          >
                            <option value="">-- No Sketch Pinned --</option>
                            {(script.shots || []).filter(sh => sh.sketchDataUrl).map((sh) => (
                              <option key={sh.id} value={sh.id}>Shot {sh.shotNumber} ({sh.shotType})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {pinnedShot?.sketchDataUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <img src={pinnedShot.sketchDataUrl} alt="Pinned sketch" className="w-12 h-9 object-cover rounded border border-emerald-500/50" />
                          <span className="text-[10px] text-emerald-300 font-bold">Pinned Shot #{pinnedShot.shotNumber} Reference</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handleAddArcCard}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 border border-dashed border-slate-700 hover:border-emerald-500 text-emerald-400 rounded-lg font-bold flex items-center justify-center gap-1.5 transition text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Story Card</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: THE MASTER'S INSPIRATIONS */}
          {activeTab === 'inspiration' && (
            <div className="space-y-4 py-6 px-2 text-center">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-xs uppercase">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Master’s Inspirations</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Break through writer's block with lighthearted creative play. Click below to draw a random scene provocation.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenSparkModal}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition transform active:scale-95"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950" />
                    <span>Spark Provocation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CHARACTERS */}
          {activeTab === 'characters' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                <span>{characters.length} DETECTED CHARACTERS</span>
                <span className="text-amber-400">Gold border = New (No Notes)</span>
              </div>

              {editingCharacterName ? (
                <div className="p-4 bg-slate-800 border border-amber-500/60 rounded-xl space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="font-bold text-amber-300 uppercase text-xs">
                      Character Bible: {editingCharacterName} (Show, Don't Tell Workbook)
                    </span>
                    <button
                      onClick={() => setEditingCharacterName(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                          Age / Era
                        </label>
                        <input
                          type="text"
                          value={tempAge}
                          onChange={(e) => setTempAge(e.target.value)}
                          placeholder="e.g., Mid 40s"
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                          Attitude / Vibe
                        </label>
                        <input
                          type="text"
                          value={tempAttitude}
                          onChange={(e) => setTempAttitude(e.target.value)}
                          placeholder="e.g., Cynical, hyper-vigilant"
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                        Appearance (Show, Don't Tell)
                      </label>
                      <input
                        type="text"
                        value={tempAppearance}
                        onChange={(e) => setTempAppearance(e.target.value)}
                        placeholder="e.g., Frayed tweed jacket, ink-stained fingers"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                        Action in First Scene (Workbook Exercise)
                      </label>
                      <input
                        type="text"
                        value={tempActionInFirstScene}
                        onChange={(e) => setTempActionInFirstScene(e.target.value)}
                        placeholder="What do they do with their hands before speaking?"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                        Internal Flaw
                      </label>
                      <input
                        type="text"
                        value={tempFlaw}
                        onChange={(e) => setTempFlaw(e.target.value)}
                        placeholder="e.g., Blind pride, fear of abandonment"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                        Core Motivation
                      </label>
                      <input
                        type="text"
                        value={tempMotivation}
                        onChange={(e) => setTempMotivation(e.target.value)}
                        placeholder="e.g., To win parental approval at all costs"
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-300 uppercase font-bold mb-1">
                        Visual Description & Notes
                      </label>
                      <textarea
                        rows={2}
                        value={tempVisual}
                        onChange={(e) => setTempVisual(e.target.value)}
                        placeholder="Directorial notes for visual presence..."
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCharacterName(null)}
                      className="px-3 py-1.5 bg-slate-900 text-slate-300 rounded hover:bg-slate-700 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveCharacterBible}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Bible</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {characters.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 italic">
                      No character dialogue lines detected yet. Add CHARACTER elements to begin.
                    </div>
                  ) : (
                    characters.map((char) => {
                      const bible = script.characterBibles?.[char.name];
                      const hasNotes = Boolean(
                        bible?.age || bible?.appearance || bible?.attitude || bible?.actionInFirstScene || bible?.internalFlaw || bible?.coreMotivation
                      );

                      const charScenes = scenes.filter((s) => s.characters.includes(char.name));

                      return (
                        <div
                          key={char.name}
                          onClick={() => handleOpenCharacterEdit(char.name)}
                          className={`p-3.5 rounded-xl cursor-pointer transition space-y-2.5 shadow-sm ${
                            hasNotes
                              ? 'bg-slate-800/80 border border-slate-700 hover:border-slate-500'
                              : 'bg-amber-950/20 border border-amber-400/60 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-sm">{char.name}</span>
                              {!hasNotes && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400 text-amber-300 text-[9px] font-bold uppercase tracking-wider animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                              <Edit3 className="w-3 h-3" />
                              Edit Bible
                            </span>
                          </div>

                          {hasNotes ? (
                            <div className="text-[11px] text-slate-300 space-y-1 bg-slate-950/40 p-2 rounded border border-slate-800">
                              {bible?.age && <div><strong className="text-amber-300">Age:</strong> {bible.age}</div>}
                              {bible?.appearance && <div><strong className="text-sky-300">Appearance:</strong> {bible.appearance}</div>}
                              {bible?.actionInFirstScene && <div><strong className="text-emerald-300">First Scene Action:</strong> {bible.actionInFirstScene}</div>}
                              {bible?.internalFlaw && <div><strong className="text-amber-300">Flaw:</strong> {bible.internalFlaw}</div>}
                            </div>
                          ) : (
                            <div className="text-[11px] text-amber-300/80 italic">
                              Click to complete Workbook: Age, Appearance, Attitude, First Scene Action...
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-700/50 space-y-1">
                            <div className="text-[9px] text-slate-400 uppercase font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-400" />
                              <span>Appearance Log ({charScenes.length} scenes):</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {charScenes.length > 0 ? (
                                charScenes.map((s) => (
                                  <span
                                    key={s.id}
                                    className="bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded text-[9px] border border-slate-800"
                                  >
                                    #{s.sceneNumber}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">No direct scene heading link</span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                            <span>Dialogue Lines: <strong className="text-amber-300">{char.dialogueCount}</strong></span>
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
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  HOLLYWOOD PAGE ESTIMATE
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-amber-400">{pageStats.pages}</span>
                  <span className="text-xs text-slate-400">PAGES (~54 lines/page)</span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-1.5 pt-1 border-t border-slate-700">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Est. Screen Runtime: ~{Math.ceil(pageStats.pages)} minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">TOTAL WORDS</div>
                  <div className="text-base font-bold text-slate-100 mt-1">{pageStats.totalWords}</div>
                </div>
                <div className="p-2.5 bg-slate-800 border border-slate-700 rounded">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">TOTAL ELEMENTS</div>
                  <div className="text-base font-bold text-slate-100 mt-1">{script.elements.length}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-800 border border-slate-700 rounded space-y-2">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  ELEMENT TYPES BREAKDOWN
                </div>
                {['SCENE HEADING', 'ACTION', 'CHARACTER', 'DIALOGUE', 'PARENTICAL', 'TRANSITION'].map((type) => {
                  const count = script.elements.filter((e) => e.type === type).length;
                  const pct = script.elements.length ? Math.round((count / script.elements.length) * 100) : 0;
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-300 font-bold">{type}</span>
                        <span className="text-amber-400">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                        <div className="bg-amber-400 h-full" style={{ width: `${pct}%` }} />
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
      {activeShotSceneId && (() => {
        const targetScene = scenes.find((s) => s.id === activeShotSceneId);
        const sceneShots = shots.filter((s) => s.sceneHeadingId === activeShotSceneId);
        if (!targetScene) return null;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-sky-400" />
                  <div>
                    <h2 className="font-bold text-sm uppercase text-sky-300">
                      Scene #{targetScene.sceneNumber}: Shots Planning
                    </h2>
                    <p className="text-[10px] text-slate-400 truncate max-w-md">{targetScene.heading}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveShotSceneId(null)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">
                    Configure camera setups, angles, lenses, equipment, and sketch references for this scene.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddShot(targetScene.id)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded flex items-center gap-1.5 text-xs shadow transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Shot</span>
                  </button>
                </div>

                {sceneShots.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 italic bg-slate-950 border border-slate-800 rounded-lg">
                    No shots added for this scene yet. Click "Add Shot" above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sceneShots.map((sh, idx) => (
                      <div
                        key={sh.id}
                        className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3 relative group shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Shot #:</label>
                            <input
                              type="text"
                              value={sh.shotNumber}
                              onChange={(e) => handleUpdateShot(sh.id, { shotNumber: e.target.value })}
                              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold text-xs text-center focus:outline-none focus:border-sky-400"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">Type:</label>
                            <select
                              value={sh.shotType}
                              onChange={(e) => handleUpdateShot(sh.id, { shotType: e.target.value as any })}
                              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-400"
                            >
                              {SHOT_TYPES.map((st) => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteShot(sh.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Delete shot"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Angle</label>
                            <input
                              type="text"
                              value={sh.angle}
                              onChange={(e) => handleUpdateShot(sh.id, { angle: e.target.value })}
                              placeholder="e.g. Low, High, Eye"
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Lens</label>
                            <input
                              type="text"
                              value={sh.lens}
                              onChange={(e) => handleUpdateShot(sh.id, { lens: e.target.value })}
                              placeholder="e.g. 35mm, 50mm"
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Est. Time (min)</label>
                            <input
                              type="number"
                              min={1}
                              value={sh.estimatedTimeMin}
                              onChange={(e) => handleUpdateShot(sh.id, { estimatedTimeMin: parseInt(e.target.value) || 15 })}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                            />
                          </div>
                        </div>

                        <div className="pt-1">
                          <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Equipment Suite Checklist</label>
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {STANDARD_KITS.map((kit) => {
                              const currentEquip = sh.equipment || '';
                              const isSelected = currentEquip.includes(kit);
                              return (
                                <button
                                  key={kit}
                                  type="button"
                                  onClick={() => {
                                    let items = currentEquip.split(',').map(s => s.trim()).filter(Boolean);
                                    if (isSelected) {
                                      items = items.filter(i => i !== kit);
                                    } else {
                                      items.push(kit);
                                    }
                                    handleUpdateShot(sh.id, { equipment: items.join(', ') });
                                  }}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${
                                    isSelected
                                      ? 'bg-sky-950 text-sky-300 border-sky-600'
                                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                                  }`}
                                >
                                  {kit}
                                </button>
                              );
                            })}
                          </div>
                          <input
                            type="text"
                            value={sh.equipment}
                            onChange={(e) => handleUpdateShot(sh.id, { equipment: e.target.value })}
                            placeholder="Additional gear (e.g. 100mm macro, anamorphic lenses)"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                          />
                        </div>

                        {/* Reference Image Upload Slot */}
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {sh.sketchDataUrl ? (
                              <img
                                src={sh.sketchDataUrl}
                                alt="Sketch reference"
                                className="w-16 h-12 object-cover rounded border border-slate-700"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-[9px] text-slate-500 italic">
                                No Sketch
                              </div>
                            )}
                            <div>
                              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-0.5">
                                Reference Sketch / Storyboard
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleSketchUpload(e, sh.id)}
                                className="text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-sky-300 hover:file:bg-slate-700 cursor-pointer"
                              />
                            </div>
                          </div>
                          {sh.sketchDataUrl && (
                            <button
                              type="button"
                              onClick={() => handleUpdateShot(sh.id, { sketchDataUrl: undefined })}
                              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                            >
                              Remove Sketch
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveShotSceneId(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* SPARK PROVOCATION MODAL */}
      {isSparkModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl max-w-md w-full text-slate-100 overflow-hidden flex flex-col p-6 space-y-5 relative">
            <button
              onClick={() => setIsSparkModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase text-amber-300">Creative Provocation Spark</h3>
                <p className="text-[10px] text-slate-400">Random constraint for your next scene</p>
              </div>
            </div>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 relative overflow-hidden shadow-inner">
              <div className="absolute right-2 -bottom-2 text-amber-500/5 pointer-events-none">
                <Lightbulb className="w-32 h-32" />
              </div>
              <p className="text-sm font-medium text-slate-100 leading-relaxed italic relative z-10">
                "{currentProvocation}"
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleShuffleProvocation}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Shuffle Another</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSparkModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN WHITEBOARD MODAL */}
      {isWhiteboardMaximized && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col p-6 overflow-y-auto text-slate-100">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-300 uppercase tracking-wide">
                    Fullscreen Story Arc Sandbox & Pacing Whiteboard
                  </h2>
                  <p className="text-xs text-slate-400">
                    Non-destructive narrative architecture and reactive pacing audit.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Target Length & Over-length Indicator */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] text-slate-400 font-bold uppercase">Target (mins):</span>
                  <input
                    type="number"
                    min={1}
                    value={targetLength}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 90;
                      onChangeScript({ ...script, targetLength: val });
                    }}
                    className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-300 font-bold text-center focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[11px] text-slate-400">Est: {estRuntimeMin}m</span>
                  {isOverLength && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300 text-[10px] font-bold animate-pulse">
                      OVER LENGTH
                    </span>
                  )}
                </div>

                {/* Philosophy Presets */}
                <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl gap-1">
                  {(['3-Act', '5-Act', 'Hero’s Journey', 'Custom'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handlePresetChange(preset)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        storyArc.preset === preset
                          ? 'bg-emerald-600 text-slate-950 shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsWhiteboardMaximized(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <X className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            </div>

            {/* Heartbeat Pacing Ratio Bar */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Pacing Heartbeat Ratio (Action vs. Dialogue)</span>
                </span>
                <span className="text-emerald-400">{actionPct}% Action / {dialoguePct}% Dialogue</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${actionPct}%` }} title="Action beats" />
                <div className="bg-sky-500 h-full transition-all duration-500" style={{ width: `${dialoguePct}%` }} title="Dialogue lines" />
              </div>
            </div>

            {/* Whiteboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {storyArc.cards.map((card) => {
                const ghostHint = getGhostGuidanceHint(card.actTitle);
                const pinnedShot = (script.shots || []).find((sh) => sh.id === card.sketchId);

                return (
                  <div
                    key={card.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="text-[10px] text-amber-300/80 italic bg-slate-950 p-2 rounded-xl border border-slate-800 leading-relaxed">
                        {ghostHint}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={card.actTitle}
                          onChange={(e) => handleUpdateArcCard(card.id, 'actTitle', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-amber-300 font-bold w-full focus:outline-none focus:border-emerald-400"
                          placeholder="Card title..."
                        />
                        <button
                          onClick={() => handleDeleteArcCard(card.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition"
                          title="Delete card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                          Narrative Goal & Key Beat:
                        </label>
                        <textarea
                          rows={3}
                          value={card.goal}
                          onChange={(e) => handleUpdateArcCard(card.id, 'goal', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
                          placeholder="Describe narrative goal..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-800 text-[10px]">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-400 uppercase font-bold mb-0.5">Scene Link:</label>
                          <select
                            value={card.linkedSceneId || ''}
                            onChange={(e) => handleUpdateArcCard(card.id, 'linkedSceneId', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-400"
                          >
                            <option value="">-- None --</option>
                            {scenes.map((s) => (
                              <option key={s.id} value={s.id}>#{s.sceneNumber}: {s.heading.substring(0, 16)}...</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 uppercase font-bold mb-0.5">Pin Sketch:</label>
                          <select
                            value={card.sketchId || ''}
                            onChange={(e) => handleUpdateArcCard(card.id, 'sketchId', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-bold focus:outline-none focus:border-emerald-400"
                          >
                            <option value="">-- None --</option>
                            {(script.shots || []).filter(sh => sh.sketchDataUrl).map((sh) => (
                              <option key={sh.id} value={sh.id}>Shot #{sh.shotNumber}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {pinnedShot?.sketchDataUrl && (
                        <div className="flex items-center gap-2 pt-1">
                          <img src={pinnedShot.sketchDataUrl} alt="Pinned sketch" className="w-14 h-10 object-cover rounded border border-emerald-500/60 shadow" />
                          <span className="text-[10px] text-emerald-300 font-bold">Pinned Shot #{pinnedShot.shotNumber} Reference</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={handleAddArcCard}
                className="p-6 bg-slate-900 hover:bg-slate-850 border-2 border-dashed border-slate-700 hover:border-emerald-500 text-emerald-400 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 transition min-h-[220px]"
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm">Add New Whiteboard Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
