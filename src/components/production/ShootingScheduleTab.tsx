import React, { useState, useEffect } from 'react';
import { ScreenplayDocument, SceneInfo, ShotInfo } from '../../types';
import { extractCharacters } from '../../lib/screenplayUtils';
import { GanttChart, ScheduleItem } from './GanttChart';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Printer,
  Layers,
  Coffee,
  Sparkles,
  Camera,
  ChevronDown,
  ChevronUp,
  Users,
  Film,
  Download,
  Scissors,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  GripVertical,
  CheckSquare,
  Square,
  MoveRight,
} from 'lucide-react';

interface ShootingScheduleTabProps {
  script: ScreenplayDocument;
  scenes: SceneInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
  watermarkLogoUrl?: string;
}

export interface CustomScheduleEntry {
  id: string;
  type: 'SCENE' | 'BREAK';
  sceneId?: string;
  scene?: SceneInfo;
  title: string;
  durationHours: number;
  dayNumber: number;
}

export interface ShootingDayConfig {
  dayNumber: number;
  title: string;
  dateStr: string;
  locationNotes: string;
  callTime?: string;
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

const STANDARD_KITS = [
  'Tripod',
  'Gimbal / Steadicam',
  'Handheld',
  'Dolly / Track',
  'Jib / Crane',
  'Drone / Aerial',
  'Car Mount / Rig',
  'Slider',
];

export const ShootingScheduleTab: React.FC<ShootingScheduleTabProps> = ({
  script,
  scenes,
  onChangeScript,
  watermarkLogoUrl,
}) => {
  const [shootStartTime, setShootStartTime] = useState('07:00');
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);

  // Drag & Drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // Multi-select batch operation state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Extract detected characters for the target character dropdown
  const detectedCharacters = extractCharacters(script.elements);

  // Shooting Days List
  const [days, setDays] = useState<ShootingDayConfig[]>(() => {
    if (script.shootingDays && script.shootingDays.length > 0) {
      return script.shootingDays;
    }
    return [
      {
        dayNumber: 1,
        title: 'DAY 1 - Principal Photography',
        dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        locationNotes: 'Main Studio & City Alley | General Call: 07:00 AM',
      },
    ];
  });

  // Unified schedule items list (Scenes + Movable Breaks across days)
  const [items, setItems] = useState<CustomScheduleEntry[]>(() => {
    if (script.scheduleEntries && script.scheduleEntries.length > 0) {
      // Re-hydrate scene references
      return script.scheduleEntries.map((e) => {
        if (e.type === 'SCENE' && e.sceneId) {
          const matched = scenes.find((s) => s.id === e.sceneId);
          if (matched) {
            return {
              ...e,
              scene: matched,
              title: `SC #${matched.sceneNumber}: ${matched.heading}`,
            };
          }
        }
        return e;
      });
    }

    // Default initial setup
    const list: CustomScheduleEntry[] = [
      {
        id: 'entry-crew-call-d1',
        type: 'BREAK',
        title: 'CREW CALL & BREAKFAST',
        durationHours: 1.0,
        dayNumber: 1,
      },
    ];

    scenes.forEach((sc, idx) => {
      if (idx === 3 && scenes.length > 3) {
        list.push({
          id: 'entry-lunch-break-d1',
          type: 'BREAK',
          title: '🍽️ LUNCH BREAK & COMPANY REST',
          durationHours: 1.0,
          dayNumber: 1,
        });
      }

      const dur = Math.max(0.75, Number((sc.lengthLines / 25).toFixed(1)));
      list.push({
        id: `entry-sc-${sc.id}`,
        type: 'SCENE',
        sceneId: sc.id,
        scene: sc,
        title: `SC #${sc.sceneNumber}: ${sc.heading}`,
        durationHours: dur,
        dayNumber: 1,
      });
    });

    list.push({
      id: 'entry-wrap-d1',
      type: 'BREAK',
      title: '🎬 WRAP & EQUIPMENT TEARDOWN',
      durationHours: 0.75,
      dayNumber: 1,
    });

    return list;
  });

  // Keep script document updated with shooting days and schedule entries for Call Sheet sync
  useEffect(() => {
    const cleanEntries = items.map((it) => ({
      id: it.id,
      type: it.type,
      sceneId: it.sceneId,
      title: it.title,
      durationHours: it.durationHours,
      dayNumber: it.dayNumber || 1,
    }));

    if (
      JSON.stringify(script.shootingDays) !== JSON.stringify(days) ||
      JSON.stringify(script.scheduleEntries) !== JSON.stringify(cleanEntries)
    ) {
      onChangeScript({
        ...script,
        shootingDays: days,
        scheduleEntries: cleanEntries,
      });
    }
  }, [items, days]);

  // Sync new scenes when script scenes change
  useEffect(() => {
    setItems((prevItems) => {
      const existingSceneIds = new Set(prevItems.filter((i) => i.type === 'SCENE').map((i) => i.sceneId));
      const newScenes = scenes.filter((s) => !existingSceneIds.has(s.id));

      if (newScenes.length === 0) {
        return prevItems.map((item) => {
          if (item.type === 'SCENE' && item.sceneId) {
            const fresh = scenes.find((s) => s.id === item.sceneId);
            if (fresh) {
              return {
                ...item,
                scene: fresh,
                title: `SC #${fresh.sceneNumber}: ${fresh.heading}`,
              };
            }
          }
          return item;
        });
      }

      const updated = [...prevItems];
      const newEntries: CustomScheduleEntry[] = newScenes.map((sc) => ({
        id: `entry-sc-${sc.id}`,
        type: 'SCENE',
        sceneId: sc.id,
        scene: sc,
        title: `SC #${sc.sceneNumber}: ${sc.heading}`,
        durationHours: Math.max(0.75, Number((sc.lengthLines / 25).toFixed(1))),
        dayNumber: 1,
      }));

      const wrapIdx = updated.findIndex((i) => i.title.includes('WRAP') && i.dayNumber === 1);
      if (wrapIdx >= 0) {
        updated.splice(wrapIdx, 0, ...newEntries);
      } else {
        updated.push(...newEntries);
      }
      return updated;
    });
  }, [scenes]);

  // Current day's items
  const activeDayItems = items.filter((i) => (i.dayNumber || 1) === activeDayNumber);
  const activeDayConfig = days.find((d) => d.dayNumber === activeDayNumber) || days[0];
  const activeDayCallTime = activeDayConfig?.callTime || '07:00';

  const updateActiveDayNotes = (notes: string) => {
    setDays((prev) =>
      prev.map((d) => (d.dayNumber === activeDayNumber ? { ...d, locationNotes: notes } : d))
    );
  };

  const updateActiveDayCallTime = (time: string) => {
    setDays((prev) =>
      prev.map((d) => (d.dayNumber === activeDayNumber ? { ...d, callTime: time } : d))
    );
  };

  const moveItem = (itemIndexInActive: number, direction: 'UP' | 'DOWN') => {
    const targetIdxInActive = direction === 'UP' ? itemIndexInActive - 1 : itemIndexInActive + 1;
    if (targetIdxInActive < 0 || targetIdxInActive >= activeDayItems.length) return;

    const itemA = activeDayItems[itemIndexInActive];
    const itemB = activeDayItems[targetIdxInActive];

    const globalIdxA = items.findIndex((i) => i.id === itemA.id);
    const globalIdxB = items.findIndex((i) => i.id === itemB.id);

    if (globalIdxA >= 0 && globalIdxB >= 0) {
      const next = [...items];
      const temp = next[globalIdxA];
      next[globalIdxA] = next[globalIdxB];
      next[globalIdxB] = temp;
      setItems(next);
    }
  };

  // --- DRAG AND DROP REORDERING & DAY MOVING ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedItemId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnItem = (targetId: string) => {
    if (!draggedItemId || draggedItemId === targetId) return;

    const sourceIdx = items.findIndex((i) => i.id === draggedItemId);
    const targetIdx = items.findIndex((i) => i.id === targetId);

    if (sourceIdx >= 0 && targetIdx >= 0) {
      const next = [...items];
      const [moved] = next.splice(sourceIdx, 1);
      // Ensure dayNumber matches target day if dropped on item in another day
      const targetDay = next[targetIdx >= next.length ? next.length - 1 : targetIdx]?.dayNumber || activeDayNumber;
      moved.dayNumber = targetDay;
      next.splice(targetIdx, 0, moved);
      setItems(next);
    }
    setDraggedItemId(null);
  };

  const handleDropOnDayTab = (targetDayNum: number) => {
    if (!draggedItemId) return;

    // Move dragged item or all selected items to targetDayNum
    const idsToMove = selectedIds.has(draggedItemId)
      ? Array.from(selectedIds)
      : [draggedItemId];

    setItems((prev) =>
      prev.map((i) => (idsToMove.includes(i.id) ? { ...i, dayNumber: targetDayNum } : i))
    );
    setDraggedItemId(null);
  };

  // Multi-select helpers
  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAllActiveDay = () => {
    if (selectedIds.size === activeDayItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activeDayItems.map((i) => i.id)));
    }
  };

  const handleBatchMoveToDay = (targetDayNum: number) => {
    if (selectedIds.size === 0) return;
    setItems((prev) =>
      prev.map((i) => (selectedIds.has(i.id) ? { ...i, dayNumber: targetDayNum } : i))
    );
    setSelectedIds(new Set());
  };

  const handleBatchDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} selected item(s) from schedule?`)) {
      setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
      setSelectedIds(new Set());
    }
  };

  const handleAutoSortExtFirst = () => {
    const currentBreaks = activeDayItems.filter((i) => i.type === 'BREAK');
    const currentScenes = activeDayItems.filter((i) => i.type === 'SCENE');

    const sortedScenes = [...currentScenes].sort((a, b) => {
      const aExt = a.scene?.heading.includes('EXT.') ? 0 : 1;
      const bExt = b.scene?.heading.includes('EXT.') ? 0 : 1;
      return aExt - bExt;
    });

    const crewCall = currentBreaks.find((b) => b.title.includes('CREW CALL')) || currentBreaks[0];
    const wrap = currentBreaks.find((b) => b.title.includes('WRAP')) || currentBreaks[currentBreaks.length - 1];
    const otherBreaks = currentBreaks.filter((b) => b !== crewCall && b !== wrap);

    const newActiveOrder: CustomScheduleEntry[] = [];
    if (crewCall) newActiveOrder.push(crewCall);

    const mid = Math.ceil(sortedScenes.length / 2);
    sortedScenes.forEach((sc, idx) => {
      if (idx === mid && otherBreaks.length > 0) {
        newActiveOrder.push(...otherBreaks);
      }
      newActiveOrder.push(sc);
    });

    if (wrap && !newActiveOrder.some((b) => b.id === wrap.id)) {
      newActiveOrder.push(wrap);
    }

    const otherDayItems = items.filter((i) => (i.dayNumber || 1) !== activeDayNumber);
    setItems([...otherDayItems, ...newActiveOrder]);
  };

  const handleAddBreak = () => {
    const newBreak: CustomScheduleEntry = {
      id: `entry-break-${Date.now()}`,
      type: 'BREAK',
      title: '☕ SET MOVEMENT & REFRESHMENT BREAK',
      durationHours: 0.5,
      dayNumber: activeDayNumber,
    };

    const wrapIdx = items.findIndex((i) => (i.dayNumber || 1) === activeDayNumber && i.title.includes('WRAP'));
    if (wrapIdx >= 0) {
      const next = [...items];
      next.splice(wrapIdx, 0, newBreak);
      setItems(next);
    } else {
      setItems([...items, newBreak]);
    }
  };

  const handleAddShootingDay = () => {
    const nextDayNum = days.length + 1;
    const newDay: ShootingDayConfig = {
      dayNumber: nextDayNum,
      title: `DAY ${nextDayNum} - Principal Photography`,
      dateStr: new Date(Date.now() + (nextDayNum - 1) * 86400000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      locationNotes: `Location Day ${nextDayNum} | General Call: 07:00 AM`,
      callTime: '07:00',
    };

    const defaultDayBreaks: CustomScheduleEntry[] = [
      {
        id: `entry-crew-call-d${nextDayNum}`,
        type: 'BREAK',
        title: 'CREW CALL & BREAKFAST',
        durationHours: 1.0,
        dayNumber: nextDayNum,
      },
      {
        id: `entry-wrap-d${nextDayNum}`,
        type: 'BREAK',
        title: '🎬 WRAP & EQUIPMENT TEARDOWN',
        durationHours: 0.75,
        dayNumber: nextDayNum,
      },
    ];

    setDays([...days, newDay]);
    setItems([...items, ...defaultDayBreaks]);
    setActiveDayNumber(nextDayNum);
  };

  // FEATURE: SPLIT DAY AT A SPECIFIC SCENE
  const handleSplitDayAtScene = (sceneId: string) => {
    const currentActiveItems = items.filter((i) => (i.dayNumber || 1) === activeDayNumber);
    const sceneIdxInActive = currentActiveItems.findIndex((i) => i.sceneId === sceneId);
    if (sceneIdxInActive <= 0) return;

    const nextDayNum = days.length + 1;
    const newDayConfig: ShootingDayConfig = {
      dayNumber: nextDayNum,
      title: `DAY ${nextDayNum} - Split Photography`,
      dateStr: new Date(Date.now() + (nextDayNum - 1) * 86400000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      locationNotes: `Split from Day ${activeDayNumber} | General Call: 07:00 AM`,
    };

    // Move all items from sceneIdxInActive onwards to the new day
    const itemsToMove = currentActiveItems.slice(sceneIdxInActive);
    const movedIds = new Set(itemsToMove.map((i) => i.id));

    // Create crew call break for new day
    const newDayCrewCall: CustomScheduleEntry = {
      id: `entry-crew-call-d${nextDayNum}`,
      type: 'BREAK',
      title: 'CREW CALL & BREAKFAST',
      durationHours: 1.0,
      dayNumber: nextDayNum,
    };

    const updatedItems = items.map((it) => {
      if (movedIds.has(it.id)) {
        return { ...it, dayNumber: nextDayNum };
      }
      return it;
    });

    setDays([...days, newDayConfig]);
    setItems([newDayCrewCall, ...updatedItems]);
    setActiveDayNumber(nextDayNum);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<CustomScheduleEntry>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const handleReassignItemDay = (id: string, newDayNum: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, dayNumber: newDayNum } : i)));
  };

  // FULL SHOT LIST MANAGEMENT IN MAXIMIZED SCHEDULER
  const allShots = script.shots || [];

  const handleAddShotToScene = (sceneId: string) => {
    const sceneShots = allShots.filter((s) => s.sceneHeadingId === sceneId);
    const nextNum = `${sceneShots.length + 1}A`;
    const newShot: ShotInfo = {
      id: `shot-${Date.now()}`,
      sceneHeadingId: sceneId,
      shotNumber: nextNum,
      shotType: 'MEDIUM',
      angle: 'Eye Level',
      lens: '35mm',
      equipment: 'Tripod',
      estimatedTimeMin: 15,
      targetCharacter: detectedCharacters[0]?.name || '',
      movementDetail: 'Static framing',
      transitionFromPrev: '',
      transitionToNext: '',
      otherNotes: '',
    };

    const updated = [...allShots, newShot];
    onChangeScript({ ...script, shots: updated });
  };

  const handleUpdateShotInScene = (shotId: string, updates: Partial<ShotInfo>) => {
    const updated = allShots.map((s) => (s.id === shotId ? { ...s, ...updates } : s));
    onChangeScript({ ...script, shots: updated });
  };

  const handleDeleteShotInScene = (shotId: string) => {
    const updated = allShots.filter((s) => s.id !== shotId);
    onChangeScript({ ...script, shots: updated });
  };

  const handleSketchUpload = (e: React.ChangeEvent<HTMLInputElement>, shotId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        handleUpdateShotInScene(shotId, { sketchDataUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const calculatePages = (lines: number) => {
    const pgs = (lines / 54).toFixed(1);
    return `${pgs} pgs`;
  };

  // Convert active day items into GanttChart format
  const ganttScheduleItems: ScheduleItem[] = activeDayItems.map((it) => ({
    id: it.id,
    type: it.type,
    title: it.title,
    sceneNumber: it.scene?.sceneNumber,
    heading: it.scene?.heading,
    durationHours: it.durationHours,
    isExterior: it.scene?.heading.includes('EXT.'),
    isNight: it.scene?.heading.includes('NIGHT'),
    location: it.scene?.heading,
  }));

  // EXPORT SCHEDULE FILE (JSON)
  const handleExportScheduleJSON = () => {
    const exportData = {
      projectTitle: script.title || 'Screenplay',
      exportDate: new Date().toISOString(),
      days,
      scheduleEntries: items.map((i) => ({
        id: i.id,
        type: i.type,
        sceneId: i.sceneId,
        sceneHeading: i.scene?.heading,
        sceneNumber: i.scene?.sceneNumber,
        title: i.title,
        durationHours: i.durationHours,
        dayNumber: i.dayNumber,
      })),
      allShots: script.shots || [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title || 'shooting_schedule'}_full_production_schedule.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // HIGH-PRECISION BULLETPROOF PRINTOUT WITH TRUE GANTT CHART & COMPLETE SHOT BREAKDOWN
  const generateDayPrintHTML = (dayNum: number, isMultiPage: boolean = false) => {
    const dayConfig = days.find((d) => d.dayNumber === dayNum) || days[0];
    const dayCallTime = dayConfig?.callTime || '07:00';
    const dayItems = items.filter((i) => (i.dayNumber || 1) === dayNum);

    const startHourBase = parseInt(dayCallTime.split(':')[0] || '7', 10);
    let cursor = startHourBase;

    const printRows = dayItems.map((it, idx) => {
      const startHour = cursor;
      const startStr = `${String(Math.floor(cursor)).padStart(2, '0')}:${String(
        Math.round((cursor % 1) * 60)
      ).padStart(2, '0')}`;
      cursor += it.durationHours;
      const endHour = cursor;
      const endStr = `${String(Math.floor(cursor)).padStart(2, '0')}:${String(
        Math.round((cursor % 1) * 60)
      ).padStart(2, '0')}`;

      const sceneShots = it.scene ? allShots.filter((s) => s.sceneHeadingId === it.scene?.id) : [];

      return {
        ...it,
        startHour,
        endHour,
        startStr,
        endStr,
        seq: idx + 1,
        sceneShots,
      };
    });

    const hourTicks = Array.from({ length: 13 }, (_, i) => Math.floor(startHourBase) + i);

    return `
      <div class="${isMultiPage ? 'day-page-break' : ''}">
        <div class="header-banner">
          <div>
            <h1>OFFICIAL SHOOTING SCHEDULE - DAY ${dayNum}</h1>
            <div class="meta">PROJECT: ${script.title || 'UNTITLED'} | DATE: ${dayConfig?.dateStr || ''} | GENERAL CALL: ${dayCallTime}</div>
          </div>
          ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" class="logo" alt="Logo" />` : ''}
        </div>

        <div style="font-size: 11px; margin-bottom: 10px; color: #334155;"><strong>LOCATION & DAY NOTES:</strong> ${dayConfig?.locationNotes || 'N/A'}</div>

        <!-- 1. TRUE VISUAL GANTT CHART PRINT TIMELINE -->
        <div class="section-title">FILMING DAY VISUAL TIMELINE (GANTT CHART)</div>
        <table class="gantt-grid-table">
          <thead>
            <tr>
              <th class="label-col">Activity / Scene Block</th>
              ${hourTicks.slice(0, 12).map((h) => `<th>${String(h % 24).padStart(2, '0')}:00</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${printRows
              .map((r) => {
                const isBreak = r.type === 'BREAK';
                const isExt = r.scene?.heading.includes('EXT.');
                const bg = isBreak ? '#10b981' : isExt ? '#0284c7' : '#4f46e5';

                return `
                  <tr>
                    <td class="label-col">
                      ${r.title}
                      <div style="font-size:9px; color:#64748b; font-weight:normal;">${r.startStr} - ${r.endStr} (${r.durationHours}h)</div>
                    </td>
                    <td colspan="12" style="padding: 2px 0; position: relative;">
                      <div style="display: flex; height: 20px; width: 100%; position: relative; background: #f1f5f9; border-radius: 3px;">
                        <div style="
                          position: absolute;
                          left: ${((r.startHour - startHourBase) / 12) * 100}%;
                          width: ${Math.max(3, (r.durationHours / 12) * 100)}%;
                          height: 100%;
                          background: ${bg};
                          color: #ffffff;
                          font-size: 9px;
                          font-weight: bold;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          border-radius: 3px;
                          white-space: nowrap;
                          overflow: hidden;
                        ">
                          ${r.durationHours}h
                        </div>
                      </div>
                    </td>
                  </tr>
                `;
              })
              .join('')}
          </tbody>
        </table>

        <!-- 2. PRINCIPAL PHOTOGRAPHY STRIPBOARD WITH DETAILED SHOT LISTS -->
        <div class="section-title">PRINCIPAL PHOTOGRAPHY STRIPBOARD & DETAILED CAMERA SHOTS</div>
        <table class="stripboard">
          <thead>
            <tr>
              <th style="width: 5%;">Seq</th>
              <th style="width: 12%;">Time Slot</th>
              <th style="width: 8%;">Scene #</th>
              <th style="width: 35%;">Heading & Location</th>
              <th style="width: 8%;">Type</th>
              <th style="width: 8%;">Pages</th>
              <th style="width: 24%;">Cast Required</th>
            </tr>
          </thead>
          <tbody>
            ${printRows
              .map((r) => {
                if (r.type === 'BREAK') {
                  return `
                  <tr class="break-row">
                    <td style="text-align: center;"><strong>${r.seq}</strong></td>
                    <td style="font-family: monospace;">${r.startStr} - ${r.endStr}</td>
                    <td colspan="5"><strong>${r.title} (${r.durationHours} hrs)</strong></td>
                  </tr>
                `;
                }
                const sc = r.scene;
                if (!sc) return '';

                const shotsHTML =
                  r.sceneShots.length > 0
                    ? `
                  <tr>
                    <td colspan="7" style="padding: 6px 12px; background: #f8fafc;">
                      <div style="font-weight: bold; font-size: 10px; color: #0284c7; margin-bottom: 4px; text-transform: uppercase;">
                        📷 Camera Shot List for Scene #${sc.sceneNumber} (${r.sceneShots.length} Shots Planned):
                      </div>
                      <table class="shot-table">
                        <thead>
                          <tr>
                            <th>Shot #</th>
                            <th>Framing / Type</th>
                            <th>Target Char</th>
                            <th>Lens & Gear</th>
                            <th>Movement / Dynamics</th>
                            <th>Est Min</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${r.sceneShots
                            .map(
                              (sh) => `
                            <tr>
                              <td class="shot-num"><strong>#${sh.shotNumber}</strong></td>
                              <td><strong>${sh.shotType}</strong> (${sh.angle || 'Eye Level'})</td>
                              <td style="color: #0369a1; font-weight: bold;">${sh.targetCharacter || 'All'}</td>
                              <td>${sh.lens || '35mm'} | ${sh.equipment || 'Tripod'}</td>
                              <td>${sh.movementDetail || 'Static'} ${sh.otherNotes ? `<br/><em>Notes: ${sh.otherNotes}</em>` : ''}</td>
                              <td style="text-align: center;"><strong>${sh.estimatedTimeMin}m</strong></td>
                            </tr>
                          `
                            )
                            .join('')}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                `
                    : `
                  <tr>
                    <td colspan="7" style="padding: 4px 12px; background: #fafafa; font-size: 9px; color: #94a3b8; italic">
                      No specific camera setups logged for Scene #${sc.sceneNumber}.
                    </td>
                  </tr>
                `;

                return `
                <tr>
                  <td><strong>${r.seq}</strong></td>
                  <td style="font-family: monospace;">${r.startStr} - ${r.endStr}</td>
                  <td><strong>#${sc.sceneNumber}</strong></td>
                  <td><strong>${sc.heading}</strong></td>
                  <td><span class="${sc.heading.includes('EXT.') ? 'ext-tag' : 'int-tag'}">${
                  sc.heading.includes('EXT.') ? 'EXT' : 'INT'
                }</span></td>
                  <td>${calculatePages(sc.lengthLines)}</td>
                  <td><strong>${sc.characters.join(', ') || 'N/A'}</strong></td>
                </tr>
                ${shotsHTML}
              `;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const executePrintWindow = (bodyHTML: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${script.title || 'Screenplay'} - ${title}</title>
          <style>
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              .no-print { display: none !important; }
              .day-page-break { page-break-after: always; break-after: page; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; color: #0f172a; background: #fff; line-height: 1.4; }
            .header-banner { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
            h1 { font-size: 22px; margin: 0; text-transform: uppercase; font-weight: 900; letter-spacing: 0.5px; }
            .meta { font-size: 11px; color: #475569; font-family: monospace; margin-top: 4px; }
            .logo { max-height: 50px; max-width: 150px; }
            .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; background: #0f172a; color: #fff; padding: 6px 10px; margin-top: 25px; border-radius: 4px; letter-spacing: 0.5px; }
            .day-page-break { margin-bottom: 35px; border-bottom: 2px dashed #cbd5e1; padding-bottom: 25px; }
            
            /* TRUE GANTT CHART PRINT TABLE */
            .gantt-grid-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10px; }
            .gantt-grid-table th, .gantt-grid-table td { border: 1px solid #94a3b8; padding: 4px; text-align: center; }
            .gantt-grid-table th { background: #e2e8f0; font-weight: bold; }
            .gantt-grid-table .label-col { text-align: left; width: 28%; font-weight: bold; padding-left: 8px; }
            
            /* STRIPBOARD TABLE */
            table.stripboard { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            table.stripboard th, table.stripboard td { border: 1px solid #64748b; padding: 6px 8px; text-align: left; }
            table.stripboard th { background: #f1f5f9; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #1e293b; }
            .break-row { background: #fef3c7 !important; font-weight: bold; color: #78350f; }
            .ext-tag { background: #bae6fd !important; color: #0369a1 !important; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; }
            .int-tag { background: #c7d2fe !important; color: #3730a3 !important; padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: bold; }
            
            /* SHOT BREAKDOWN NESTED TABLE */
            .shot-table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 10px; background: #fafafa; }
            .shot-table th { background: #0284c7 !important; color: #ffffff !important; padding: 4px 6px; font-size: 9px; text-transform: uppercase; }
            .shot-table td { border: 1px solid #cbd5e1; padding: 4px 6px; font-size: 10px; }
            .shot-num { background: #fef3c7 !important; font-weight: bold; color: #92400e; text-align: center; }
          </style>
        </head>
        <body>
          <div class="no-print" style="background: #0f172a; color: #f8fafc; padding: 12px 20px; font-size: 13px; font-weight: bold; border-bottom: 2px solid #0284c7; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-radius: 8px;">
            <div>
              <strong>📄 Official Production Shooting Schedule</strong>
              <span style="font-weight: normal; margin-left: 12px; color: #94a3b8; font-size: 12px;">Tip: To save as a digital PDF file, select <em>"Save as PDF"</em> as Destination in the print popup!</span>
            </div>
            <button onclick="window.print()" style="background: #0284c7; color: #ffffff; border: none; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 12px;">
              🖨️ Print / Save as PDF
            </button>
          </div>

          ${bodyHTML}

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintSchedule = () => {
    const html = generateDayPrintHTML(activeDayNumber, false);
    executePrintWindow(html, `Day ${activeDayNumber} Schedule`);
  };

  const handlePrintAllDays = () => {
    const html = days.map((d) => generateDayPrintHTML(d.dayNumber, true)).join('');
    executePrintWindow(html, `Master Production Schedule (All Days)`);
  };

  return (
    <div className="space-y-6">
      {/* 1. VISUAL GANTT CHART TIMELINE AT THE VERY TOP */}
      <GanttChart scheduleItems={ganttScheduleItems} shootStartTime={activeDayCallTime} />

      {/* 2. PRODUCTION SCHEDULE & STRIPBOARD SUITE BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Production Schedule & Stripboard Suite
            </h2>
            <p className="text-xs text-slate-400">
              Drag scenes onto Day Tabs to reassign, split days, manage shot details, and sync with Call Sheet.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <Film className="w-4 h-4 text-sky-400" />
          <span>Day {activeDayNumber}: {activeDayItems.filter((i) => i.type === 'SCENE').length} Scenes, {activeDayItems.filter((i) => i.type === 'BREAK').length} Breaks</span>
        </div>
      </div>

      {/* 3. SHOOTING SCHEDULE & DYNAMIC GANTT SUITE ACTIONS TOOLBAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Shooting Schedule & Dynamic Gantt Suite
            </h2>
            <p className="text-xs text-slate-400">
              Drag and drop scenes, split shooting days, auto-group EXT scenes, and edit camera setups.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono" title="Set Call Time for the active shooting day">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Call Time (Day {activeDayNumber}):</span>
            <input
              type="text"
              value={activeDayCallTime}
              onChange={(e) => updateActiveDayCallTime(e.target.value)}
              className="w-14 bg-transparent text-amber-300 font-bold focus:outline-none"
            />
          </div>

          <button
            onClick={handleAutoSortExtFirst}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Automatically group Exterior scenes first to optimize natural daylight shooting"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Auto-Group EXT First</span>
          </button>

          <button
            onClick={handleAddBreak}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Break</span>
          </button>

          <button
            onClick={handleAddShootingDay}
            className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ New Shooting Day</span>
          </button>

          <button
            onClick={handleExportScheduleJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Export schedule data as JSON file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export File</span>
          </button>

          <button
            onClick={handlePrintSchedule}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            title="Print or Save as PDF for Day ${activeDayNumber}"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Day {activeDayNumber}</span>
          </button>

          <button
            onClick={handlePrintAllDays}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            title="Print or Save Master Schedule (All Days)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print All Days</span>
          </button>
        </div>
      </div>

      {/* 4. SHOOTING DAYS SELECTOR TABS & LOCATION NOTES */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          {/* Day Tabs (Drop targets for dragging items) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {days.map((d) => {
              const daySceneCount = items.filter((i) => (i.dayNumber || 1) === d.dayNumber && i.type === 'SCENE').length;
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDayNumber(d.dayNumber)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnDayTab(d.dayNumber)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                    activeDayNumber === d.dayNumber
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  title={`Click to view Day ${d.dayNumber} or Drag scene card here to move it to Day ${d.dayNumber}`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{d.title}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${activeDayNumber === d.dayNumber ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                    {daySceneCount} sc
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Call:</span>
              <input
                type="text"
                value={activeDayCallTime}
                onChange={(e) => updateActiveDayCallTime(e.target.value)}
                className="w-14 bg-transparent text-amber-300 font-bold focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
              <input
                type="text"
                value={activeDayConfig.locationNotes}
                onChange={(e) => updateActiveDayNotes(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 w-full sm:w-[280px]"
                placeholder="Add Day shooting location or setup notes..."
              />
            </div>
          </div>
        </div>

        {/* BATCH OPERATION TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAllActiveDay}
              className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 font-bold transition cursor-pointer"
            >
              {selectedIds.size > 0 && selectedIds.size === activeDayItems.length ? (
                <CheckSquare className="w-4 h-4 text-amber-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
              <span>
                {selectedIds.size > 0 ? `Selected (${selectedIds.size})` : 'Select All Items'}
              </span>
            </button>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in duration-100">
              <span className="text-slate-400 font-mono text-[11px]">Batch Action:</span>
              
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBatchMoveToDay(parseInt(e.target.value));
                    e.target.value = '';
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-amber-300 text-xs font-bold rounded px-2 py-1 focus:outline-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Move Selected to Day...
                </option>
                {days.map((d) => (
                  <option key={d.dayNumber} value={d.dayNumber}>
                    Move to Day {d.dayNumber}
                  </option>
                ))}
              </select>

              <button
                onClick={handleBatchDelete}
                className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. STRIPBOARD SCENES AND MOVABLE BREAKS LIST (DRAGGABLE) */}
        <div className="space-y-2.5">
          {activeDayItems.map((item, idx) => {
            const isSelected = selectedIds.has(item.id);

            if (item.type === 'BREAK') {
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDropOnItem(item.id)}
                  className={`p-3 bg-emerald-950/30 border rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 transition shadow-xs ${
                    isSelected ? 'border-amber-400 bg-emerald-950/60' : 'border-emerald-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0 w-full sm:w-auto">
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className="text-slate-400 hover:text-amber-400 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>

                    <div className="cursor-grab text-emerald-500/70 hover:text-emerald-300 transition" title="Drag to reorder">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveItem(idx, 'UP')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-emerald-900/40 disabled:opacity-30 rounded text-emerald-400 cursor-pointer"
                        title="Move break up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'DOWN')}
                        disabled={idx === activeDayItems.length - 1}
                        className="p-1 hover:bg-emerald-900/40 disabled:opacity-30 rounded text-emerald-400 cursor-pointer"
                        title="Move break down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Coffee className="w-4 h-4 text-emerald-400 shrink-0" />

                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                      className="bg-slate-950 border border-emerald-800/80 rounded px-2.5 py-1 text-xs text-emerald-200 font-bold flex-1 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-mono">
                      <span>Duration (hrs):</span>
                      <input
                        type="number"
                        step={0.25}
                        min={0.25}
                        max={4}
                        value={item.durationHours}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { durationHours: parseFloat(e.target.value) || 0.5 })
                        }
                        className="w-14 bg-slate-950 border border-emerald-800 rounded px-1.5 py-0.5 text-center text-amber-300 font-bold"
                      />
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer"
                      title="Delete break"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            const sc = item.scene;
            if (!sc) return null;

            const sceneShots = allShots.filter((s) => s.sceneHeadingId === sc.id);
            const isExpanded = expandedSceneId === sc.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnItem(item.id)}
                className={`bg-slate-950 border rounded-xl overflow-hidden transition shadow-sm ${
                  isSelected ? 'border-amber-400 ring-1 ring-amber-400/50' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Main Stripboard Scene Row */}
                <div className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleSelect(item.id)}
                      className="text-slate-400 hover:text-amber-400 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </button>

                    <div className="cursor-grab text-slate-500 hover:text-amber-400 transition" title="Drag scene to reorder or drag onto Day tab">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveItem(idx, 'UP')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 cursor-pointer"
                        title="Move scene up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'DOWN')}
                        disabled={idx === activeDayItems.length - 1}
                        className="p-1 hover:bg-slate-800 disabled:opacity-30 rounded text-slate-400 cursor-pointer"
                        title="Move scene down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="px-2.5 py-1 bg-slate-900 text-amber-400 border border-slate-800 rounded-md text-xs font-mono font-bold shrink-0">
                        #{sc.sceneNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-2">
                          <span>{sc.heading}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-3 mt-0.5">
                          <span>Pages: {calculatePages(sc.lengthLines)}</span>
                          <span>Est Shoot: {item.durationHours}h</span>
                          {sc.characters.length > 0 && (
                            <span className="text-amber-300 font-bold truncate flex items-center gap-1">
                              <Users className="w-3 h-3 text-amber-400 shrink-0" />
                              Cast: {sc.characters.join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap self-end sm:self-auto">
                    {/* Day Reassign Dropdown (Instant 1-click reassignment) */}
                    <select
                      value={item.dayNumber || activeDayNumber}
                      onChange={(e) => handleReassignItemDay(item.id, parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-700 text-[11px] font-bold text-amber-300 rounded px-2 py-1 focus:outline-none cursor-pointer"
                      title="Move scene to a different shooting day"
                    >
                      {days.map((d) => (
                        <option key={d.dayNumber} value={d.dayNumber}>
                          Day {d.dayNumber}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleSplitDayAtScene(sc.id)}
                      className="px-2.5 py-1 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      title={`Split shooting schedule here: Move Scene #${sc.sceneNumber} and all subsequent scenes into a new Day`}
                    >
                      <Scissors className="w-3 h-3 text-indigo-400" />
                      <span>Split Day Here</span>
                    </button>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        sc.heading.includes('EXT.')
                          ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {sc.heading.includes('EXT.') ? 'EXTERIOR' : 'INTERIOR'}
                    </span>

                    <button
                      onClick={() => setExpandedSceneId(isExpanded ? null : sc.id)}
                      className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                        sceneShots.length > 0
                          ? 'bg-slate-800 text-sky-300 border-slate-700 hover:bg-slate-750'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 text-sky-400" />
                      <span>
                        {sceneShots.length} Shot{sceneShots.length === 1 ? '' : 's'} Logged
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 6. EXPANDABLE INLINE SCENE SHOT MANAGER WITH FULL FIELD PARITY */}
                {isExpanded && (
                  <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-sky-300 uppercase">
                        <Camera className="w-4 h-4 text-sky-400" />
                        <span>Scene #{sc.sceneNumber} Camera Shot List ({sceneShots.length} Shots)</span>
                      </div>

                      {/* CLEAR, UNMISTAKABLE ADD SHOT BUTTON (CALM SECONDARY STYLE) */}
                      <button
                        onClick={() => handleAddShotToScene(sc.id)}
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-sky-400" />
                        <span>+ Add Shot Setup to Scene #{sc.sceneNumber}</span>
                      </button>
                    </div>

                    {sceneShots.length === 0 ? (
                      <div className="text-center py-6 text-slate-500 italic text-xs bg-slate-950 border border-slate-850 rounded-lg">
                        No camera setups logged for Scene #{sc.sceneNumber} yet. Click "+ Add Shot Setup to Scene #{sc.sceneNumber}" above to configure camera angles, equipment, sketch reference images, and transition notes.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sceneShots.map((sh) => (
                          <div
                            key={sh.id}
                            className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs font-mono"
                          >
                            {/* Header: Shot Number & Explicit Delete Button */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold rounded-md text-xs">
                                  SHOT #{sh.shotNumber} (Scene #{sc.sceneNumber})
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[10px] text-slate-400 uppercase font-bold">Shot #:</label>
                                  <input
                                    type="text"
                                    value={sh.shotNumber}
                                    onChange={(e) => handleUpdateShotInScene(sh.id, { shotNumber: e.target.value })}
                                    className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-amber-300 font-bold text-xs text-center focus:outline-none focus:border-sky-400"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <label className="text-[10px] text-slate-400 uppercase font-bold">Type:</label>
                                  <select
                                    value={sh.shotType}
                                    onChange={(e) =>
                                      handleUpdateShotInScene(sh.id, { shotType: e.target.value as any })
                                    }
                                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-400"
                                  >
                                    {SHOT_TYPES.map((st) => (
                                      <option key={st} value={st}>
                                        {st}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* EXPLICIT, UNMISTAKABLE DELETE BUTTON */}
                              <button
                                onClick={() => handleDeleteShotInScene(sh.id)}
                                className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                                title={`Delete Shot #${sh.shotNumber}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Shot #{sh.shotNumber}</span>
                              </button>
                            </div>

                            {/* Main Shot Attributes Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
                              <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                  Target Character
                                </label>
                                <input
                                  type="text"
                                  list={`target-char-list-tab-${sh.id}`}
                                  value={sh.targetCharacter || ''}
                                  onChange={(e) =>
                                    handleUpdateShotInScene(sh.id, { targetCharacter: e.target.value })
                                  }
                                  placeholder="Select or type character..."
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-sky-400"
                                />
                                <datalist id={`target-char-list-tab-${sh.id}`}>
                                  {detectedCharacters.map((c) => (
                                    <option key={c.name} value={c.name} />
                                  ))}
                                </datalist>
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                  Movement / Dynamics
                                </label>
                                <input
                                  type="text"
                                  value={sh.movementDetail || ''}
                                  onChange={(e) =>
                                    handleUpdateShotInScene(sh.id, { movementDetail: e.target.value })
                                  }
                                  placeholder="e.g. Slow push-in, Whip pan"
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                  Angle
                                </label>
                                <input
                                  type="text"
                                  value={sh.angle}
                                  onChange={(e) => handleUpdateShotInScene(sh.id, { angle: e.target.value })}
                                  placeholder="Low, Eye, High"
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                  Lens
                                </label>
                                <input
                                  type="text"
                                  value={sh.lens}
                                  onChange={(e) => handleUpdateShotInScene(sh.id, { lens: e.target.value })}
                                  placeholder="35mm, 50mm, Macro"
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                  Est. Time (min)
                                </label>
                                <input
                                  type="number"
                                  min={1}
                                  value={sh.estimatedTimeMin}
                                  onChange={(e) =>
                                    handleUpdateShotInScene(sh.id, {
                                      estimatedTimeMin: parseInt(e.target.value) || 15,
                                    })
                                  }
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                                />
                              </div>
                            </div>

                            {/* Equipment Suite Checklist Tags */}
                            <div className="pt-1">
                              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                                Equipment Suite Checklist
                              </label>
                              <div className="flex flex-wrap gap-1.5 mb-1.5">
                                {STANDARD_KITS.map((kit) => {
                                  const currentEquip = sh.equipment || '';
                                  const isSelectedKit = currentEquip.includes(kit);
                                  return (
                                    <button
                                      key={kit}
                                      type="button"
                                      onClick={() => {
                                        let itemsArr = currentEquip
                                          .split(',')
                                          .map((s) => s.trim())
                                          .filter(Boolean);
                                        if (isSelectedKit) {
                                          itemsArr = itemsArr.filter((i) => i !== kit);
                                        } else {
                                          itemsArr.push(kit);
                                        }
                                        handleUpdateShotInScene(sh.id, { equipment: itemsArr.join(', ') });
                                      }}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                                        isSelectedKit
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
                                onChange={(e) => handleUpdateShotInScene(sh.id, { equipment: e.target.value })}
                                placeholder="Additional gear (e.g. Anamorphic lens, wireless follow focus)"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-400"
                              />
                            </div>

                            {/* FULL PARITY: Reference Image & Director Notes Layout */}
                            <div className="pt-3 border-t border-slate-900 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              {/* Left: Reference Image / Storyboard Slot */}
                              <div className="md:col-span-4 space-y-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                                <label className="block text-[10px] text-sky-400 uppercase font-bold flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Reference Sketch / Storyboard</span>
                                </label>
                                <div className="flex items-center gap-3">
                                  {sh.sketchDataUrl ? (
                                    <img
                                      src={sh.sketchDataUrl}
                                      alt="Sketch reference"
                                      className="w-24 h-18 object-cover rounded border border-slate-700 shrink-0 shadow"
                                    />
                                  ) : (
                                    <div className="w-24 h-18 bg-slate-950 border border-slate-800 rounded flex items-center justify-center text-[9px] text-slate-500 italic shrink-0">
                                      No Image
                                    </div>
                                  )}
                                  <div className="space-y-1.5 flex-1 min-w-0">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleSketchUpload(e, sh.id)}
                                      className="text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-slate-800 file:text-sky-300 hover:file:bg-slate-700 cursor-pointer w-full"
                                    />
                                    {sh.sketchDataUrl && (
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateShotInScene(sh.id, { sketchDataUrl: undefined })}
                                        className="text-[10px] text-rose-400 hover:text-rose-300 font-bold block cursor-pointer"
                                      >
                                        Remove Image
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Transitions & Director Notes */}
                              <div className="md:col-span-8 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-2">
                                <label className="block text-[10px] text-amber-400 uppercase font-bold">
                                  Director & DOP Transition Notes
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                                      Transition FROM Previous
                                    </label>
                                    <input
                                      type="text"
                                      value={sh.transitionFromPrev || ''}
                                      onChange={(e) =>
                                        handleUpdateShotInScene(sh.id, { transitionFromPrev: e.target.value })
                                      }
                                      placeholder="Match cut, whip pan left"
                                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                                      Transition TO Next
                                    </label>
                                    <input
                                      type="text"
                                      value={sh.transitionToNext || ''}
                                      onChange={(e) =>
                                        handleUpdateShotInScene(sh.id, { transitionToNext: e.target.value })
                                      }
                                      placeholder="Hard cut, J-cut audio lead"
                                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                                    />
                                  </div>
                                </div>

                                <div className="pt-1">
                                  <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                                    Additional Framing & Acting Notes
                                  </label>
                                  <input
                                    type="text"
                                    value={sh.otherNotes || ''}
                                    onChange={(e) => handleUpdateShotInScene(sh.id, { otherNotes: e.target.value })}
                                    placeholder="e.g. Focus on right eye reflection during monologue"
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
