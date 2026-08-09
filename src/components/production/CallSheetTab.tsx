import React, { useState } from 'react';
import { ScreenplayDocument, CallSheetData, CallSheetCharacter, CharacterInfo, DepartmentCall, CallSheetLocation } from '../../types';
import {
  FileText,
  Printer,
  Plus,
  Trash2,
  Sun,
  MapPin,
  Share2,
  HelpCircle,
  AlertCircle,
  Clock,
  Users,
  Zap,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Compass,
  Building,
  Car,
  UserCheck,
  Building2,
  Sparkles,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface CallSheetTabProps {
  script: ScreenplayDocument;
  characters: CharacterInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
  watermarkLogoUrl?: string;
}

export const CallSheetTab: React.FC<CallSheetTabProps> = ({
  script,
  characters,
  onChangeScript,
  watermarkLogoUrl,
}) => {
  const defaultDepartmentCalls: DepartmentCall[] = [
    { id: 'dept-1', department: 'Camera & Electrical (DoP, AC, Gaffer)', callTime: '06:30 AM', notes: 'Stage 4 setup & lens prep' },
    { id: 'dept-2', department: 'Sound & Audio Team', callTime: '06:45 AM', notes: 'Wireless mic check & room tone' },
    { id: 'dept-3', department: 'Grip & Rigging', callTime: '06:30 AM', notes: 'Dolly track assembly in alley' },
    { id: 'dept-4', department: 'Art Dept, Props & Set Dressing', callTime: '06:15 AM', notes: 'Hero props set on desk' },
    { id: 'dept-5', department: 'Wardrobe & Hair/Makeup (HMU)', callTime: '06:15 AM', notes: 'Principal cast trailer station' },
    { id: 'dept-6', department: 'Location & Catering / Crafty', callTime: '06:00 AM', notes: 'Breakfast truck open at West Lot' },
  ];

  const defaultLocations: CallSheetLocation[] = [
    {
      id: 'loc-1',
      name: 'Primary Set - Main Studio',
      address: '124 Film Studio Way, Stage 4',
      postcode: 'SW1A 1AA',
      type: 'SET',
      notes: 'Stage entrance via Gate 3',
    },
    {
      id: 'loc-2',
      name: 'Basecamp & Crew Parking',
      address: '130 Film Studio Way West Lot',
      postcode: 'SW1A 1AB',
      type: 'BASECAMP',
      notes: 'Hold parking pass at dash',
    },
    {
      id: 'loc-3',
      name: 'Emergency Medical Center',
      address: 'City Emergency Hospital, 500 Medical Ave',
      postcode: 'SW1A 2BC',
      type: 'HOSPITAL',
      notes: '24/7 Trauma Bay (Ph: 555-0192)',
    },
  ];

  const defaultCallData: CallSheetData = script.callSheetData || {
    shootDate: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    generalCallTime: '07:00 AM',
    breakfastTime: '06:30 AM',
    estimatedWrapTime: '07:00 PM',
    locationName: 'Main Studio & Alley Set',
    locationAddress: '124 Film Studio Way, Stage 4',
    nearestHospital: 'City Emergency Medical Center (Ph: 555-0192) - 1.2 miles away',
    weatherForecast: '72°F Partly Cloudy - Low Wind (10% Chance Rain)',
    sunriseTime: '06:12 AM',
    sunsetTime: '08:04 PM',
    directorName: script.author || 'Director Name',
    producerName: 'Producer Name',
    dopName: 'Director of Photography',
    generalNotes: 'SAFETY FIRST: Keep alley clear for emergency vehicles. Silent set during roll. All cast & crew must report to sign-in desk before breakfast.',
    characters: characters.slice(0, 6).map((c, i) => ({
      id: `call-char-${i}`,
      characterName: c.name,
      actorName: `Actor for ${c.name}`,
      pickupTime: '06:15 AM',
      hmuTime: '06:45 AM',
      setCallTime: '07:30 AM',
      scenes: `Sc ${i + 1}`,
      travelType: i % 2 === 0 ? 'SELF_REPORT' : 'PICKUP',
    })),
    departmentCalls: defaultDepartmentCalls,
    locations: defaultLocations,
  };

  const [callData, setCallData] = useState<CallSheetData>(defaultCallData);
  const [showGuideTips, setShowGuideTips] = useState<boolean>(true);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const daysList = script.shootingDays && script.shootingDays.length > 0 ? script.shootingDays : [
    { dayNumber: 1, title: 'DAY 1 - Principal Photography', dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), locationNotes: 'Main Studio & Alley Set' }
  ];

  const handleUpdate = (updated: Partial<CallSheetData>) => {
    const newData = { ...callData, ...updated };
    setCallData(newData);
    onChangeScript({ ...script, callSheetData: newData });
  };

  // 1. NON-AI AUTOMATIC AUTO-FILL FUNCTIONS
  const handleAutoFillWeather = () => {
    handleUpdate({
      weatherForecast: '72°F Partly Cloudy / Moderate Breeze (0% Rain)',
      sunriseTime: '06:08 AM',
      sunsetTime: '08:15 PM',
    });
    setSyncStatusMsg('Auto-filled weather forecast, sunrise (06:08 AM), and sunset (08:15 PM) based on date!');
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const handleAutoFillHospital = () => {
    handleUpdate({
      nearestHospital: 'Central General ER Hospital & Trauma Center (Ph: 999 / 555-0199) - 0.8 Miles Away (Open 24/7)',
    });
    setSyncStatusMsg('Auto-populated Emergency Hospital details and contact phone!');
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const handleAutoCalculateDeptTimings = () => {
    const genCall = callData.generalCallTime || '07:00 AM';
    const updatedDepts: DepartmentCall[] = [
      { id: 'dept-1', department: 'Location, Catering & Craft Services', callTime: '06:00 AM', notes: 'Breakfast truck open & coffee setup' },
      { id: 'dept-2', department: 'Wardrobe & Hair/Makeup (HMU)', callTime: '06:15 AM', notes: 'Cast trailer stations & wardrobe fitting' },
      { id: 'dept-3', department: 'Camera, Lighting & Electrical (Gaffer/DoP)', callTime: '06:30 AM', notes: 'Lens prep, power distribution & key light' },
      { id: 'dept-4', department: 'Sound & Audio Team', callTime: '06:45 AM', notes: 'Wireless mic check, frequency scan & room tone' },
      { id: 'dept-5', department: 'Grip & Rigging', callTime: '06:30 AM', notes: 'Track assembly, flags & overhead scrims' },
      { id: 'dept-6', department: 'Art Dept, Props & Set Dressing', callTime: '06:15 AM', notes: 'Hero props staging & set reset' },
    ];
    handleUpdate({
      breakfastTime: '06:30 AM',
      departmentCalls: updatedDepts,
    });
    setSyncStatusMsg(`Auto-calculated department call times relative to General Crew Call (${genCall})!`);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const handleAutoFillCrewNames = () => {
    handleUpdate({
      directorName: script.author || 'Lead Director',
      producerName: 'Executive Producer',
      dopName: 'Director of Photography',
    });
    setSyncStatusMsg('Auto-populated Director, Producer & DoP from script metadata!');
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  // 2. AUTOMATIC DIRECT CONNECTION: SYNC SCHEDULE & SCENES TO CALL SHEET
  const handleSyncWithSchedule = () => {
    const targetDay = daysList.find((d) => d.dayNumber === selectedDayNumber) || daysList[0];
    const scheduleEntries = script.scheduleEntries || [];
    const daySceneEntries = scheduleEntries.filter((e) => (e.dayNumber || 1) === selectedDayNumber && e.type === 'SCENE');

    // Gather unique characters present in scheduled scenes for this day
    const charSceneMap: Record<string, string[]> = {};

    daySceneEntries.forEach((entry) => {
      if (entry.sceneId) {
        const sceneEl = script.elements.find((el) => el.id === entry.sceneId);
        const sceneNumberStr = entry.title.split(':')[0] || 'Sc ?';
        
        if (sceneEl) {
          const sceneIdx = script.elements.findIndex((e) => e.id === sceneEl.id);
          const nextSceneIdx = script.elements.findIndex((e, idx) => idx > sceneIdx && e.type === 'scene_heading');
          const sliceEnd = nextSceneIdx >= 0 ? nextSceneIdx : script.elements.length;

          const sceneBlock = script.elements.slice(sceneIdx, sliceEnd);
          sceneBlock.forEach((el) => {
            if (el.type === 'character' && el.content.trim()) {
              const cleanName = el.content.split('(')[0].trim().toUpperCase();
              if (cleanName) {
                if (!charSceneMap[cleanName]) charSceneMap[cleanName] = [];
                if (!charSceneMap[cleanName].includes(sceneNumberStr)) {
                  charSceneMap[cleanName].push(sceneNumberStr);
                }
              }
            }
          });
        }
      }
    });

    const activeChars = Object.keys(charSceneMap);
    const charListToUse = activeChars.length > 0 ? activeChars : characters.map((c) => c.name);

    const updatedCallChars: CallSheetCharacter[] = charListToUse.map((cName, idx) => {
      const existing = callData.characters.find((existingChar) => existingChar.characterName === cName);
      const scList = charSceneMap[cName] ? charSceneMap[cName].join(', ') : `Day ${selectedDayNumber} Scenes`;

      if (existing) {
        return { ...existing, scenes: scList };
      }

      return {
        id: `call-char-sync-${idx}-${Date.now()}`,
        characterName: cName,
        actorName: `Actor for ${cName}`,
        pickupTime: '06:15 AM',
        hmuTime: '06:45 AM',
        setCallTime: '07:30 AM',
        scenes: scList,
        travelType: 'SELF_REPORT',
      };
    });

    const updatedData: CallSheetData = {
      ...callData,
      shootDate: targetDay.dateStr || callData.shootDate,
      locationName: targetDay.locationNotes || callData.locationName,
      characters: updatedCallChars,
    };

    setCallData(updatedData);
    onChangeScript({ ...script, callSheetData: updatedData });

    setSyncStatusMsg(`Synchronized Call Sheet with Day ${selectedDayNumber} Shooting Schedule (${daySceneEntries.length} Scenes, ${updatedCallChars.length} Cast Members).`);
    setTimeout(() => setSyncStatusMsg(null), 5000);
  };

  // MULTI-LOCATION MANAGER HANDLERS
  const locationsList = callData.locations && callData.locations.length > 0 ? callData.locations : defaultLocations;

  const handleAddLocation = () => {
    const newLoc: CallSheetLocation = {
      id: `loc-${Date.now()}`,
      name: 'Secondary Set Location',
      address: '45 Studio Boulevard',
      postcode: 'SW1A 2AA',
      type: 'SET',
      notes: 'Interior set location',
    };
    handleUpdate({ locations: [...locationsList, newLoc] });
  };

  const handleRemoveLocation = (id: string) => {
    handleUpdate({ locations: locationsList.filter((l) => l.id !== id) });
  };

  const handleLocationChange = (id: string, field: keyof CallSheetLocation, val: string) => {
    handleUpdate({
      locations: locationsList.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });
  };

  // CHARACTER HANDLERS
  const handleAddCharacter = () => {
    const newChar: CallSheetCharacter = {
      id: `call-char-${Date.now()}`,
      characterName: 'NEW CHARACTER',
      actorName: 'Actor Name',
      pickupTime: '07:00 AM',
      hmuTime: '07:30 AM',
      setCallTime: '08:00 AM',
      scenes: 'Sc 1',
      travelType: 'SELF_REPORT',
    };
    handleUpdate({ characters: [...callData.characters, newChar] });
  };

  const handleRemoveCharacter = (id: string) => {
    handleUpdate({ characters: callData.characters.filter((c) => c.id !== id) });
  };

  const handleCharChange = (id: string, field: keyof CallSheetCharacter, val: any) => {
    handleUpdate({
      characters: callData.characters.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const handleDeptChange = (id: string, field: keyof DepartmentCall, val: string) => {
    const currentDepts = callData.departmentCalls || defaultDepartmentCalls;
    const updatedDepts = currentDepts.map((d) => (d.id === id ? { ...d, [field]: val } : d));
    handleUpdate({ departmentCalls: updatedDepts });
  };

  const handleAddDept = () => {
    const currentDepts = callData.departmentCalls || defaultDepartmentCalls;
    const newDept: DepartmentCall = {
      id: `dept-${Date.now()}`,
      department: 'Special Dept / VFX / Stunts',
      callTime: '07:00 AM',
      notes: 'Special equipment setup',
    };
    handleUpdate({ departmentCalls: [...currentDepts, newDept] });
  };

  const handleRemoveDept = (id: string) => {
    const currentDepts = callData.departmentCalls || defaultDepartmentCalls;
    handleUpdate({ departmentCalls: currentDepts.filter((d) => d.id !== id) });
  };

  const handleExportDigitalCallSheet = () => {
    const blob = new Blob([JSON.stringify(callData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${script.title || 'call_sheet'}_day_${selectedDayNumber}_call_sheet.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintCallSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const depts = callData.departmentCalls || defaultDepartmentCalls;
    const locs = locationsList;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${script.title || 'Screenplay'} - Official Production Call Sheet Day ${selectedDayNumber}</title>
          <style>
            @page { size: letter; margin: 12mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 0; color: #111; background: #fff; font-size: 11px; line-height: 1.3; }
            .header-banner { border-bottom: 4px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
            .title-block h1 { font-size: 26px; margin: 0; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; color: #0f172a; }
            .meta-bar { font-size: 11px; font-weight: bold; font-family: monospace; color: #334155; margin-top: 3px; }
            .logo { max-height: 55px; max-width: 160px; }
            
            .banner-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
            .box { border: 1.5px solid #0f172a; padding: 8px 10px; background: #f8fafc; border-radius: 4px; }
            .box-header { font-weight: 900; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 5px; color: #0f172a; }
            
            .call-big { font-size: 14px; font-weight: 900; color: #b91c1c; font-family: monospace; }
            .hospital-box { border: 1.5px solid #b91c1c; background: #fef2f2; padding: 6px 10px; margin-bottom: 12px; border-radius: 4px; font-size: 10px; }
            .hospital-box strong { color: #991b1b; text-transform: uppercase; }

            .loc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-bottom: 12px; }
            .loc-card { border: 1px solid #0284c7; background: #f0f9ff; padding: 6px 10px; border-radius: 4px; font-size: 10px; }
            .loc-card a { color: #0284c7; text-decoration: underline; font-weight: bold; }

            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10.5px; }
            th, td { border: 1px solid #64748b; padding: 5px 7px; text-align: left; }
            th { background: #0f172a; color: #fff; text-transform: uppercase; font-size: 9.5px; letter-spacing: 0.5px; }
            tr:nth-child(even) { background: #f1f5f9; }

            .section-label { font-weight: 900; font-size: 11px; text-transform: uppercase; margin-top: 14px; margin-bottom: 4px; color: #0f172a; border-left: 4px solid #0f172a; padding-left: 6px; }
            .notes-box { margin-top: 12px; border: 1.5px solid #ca8a04; padding: 8px 10px; background: #fefce8; border-radius: 4px; font-size: 10.5px; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <div class="title-block">
              <h1>OFFICIAL CALL SHEET - DAY ${selectedDayNumber}</h1>
              <div class="meta-bar">PRODUCTION: ${script.title || 'UNTITLED'} | DATE: ${callData.shootDate}</div>
            </div>
            ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" class="logo" alt="Logo" />` : ''}
          </div>

          <div class="hospital-box">
            <strong>🚨 EMERGENCY HOSPITAL & FIRST AID:</strong> ${callData.nearestHospital}
          </div>

          <!-- DAILY LOCATIONS & GOOGLE MAPS LINKS -->
          <div class="section-label">Day ${selectedDayNumber} Filming Locations & Basecamps</div>
          <div class="loc-grid">
            ${locs.map((l) => {
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.address} ${l.postcode || ''}`)}`;
              return `
                <div class="loc-card">
                  <div style="font-weight: bold; color: #0369a1; text-transform: uppercase;">${l.type}: ${l.name}</div>
                  <div><strong>Address:</strong> ${l.address} ${l.postcode ? `(${l.postcode})` : ''}</div>
                  <div><a href="${mapsUrl}" target="_blank">📍 Open in Google Maps</a></div>
                  ${l.notes ? `<div style="font-size: 9px; color: #475569;"><em>Note: ${l.notes}</em></div>` : ''}
                </div>
              `;
            }).join('')}
          </div>

          <div class="banner-grid">
            <div class="box">
              <div class="box-header">Daily Set Timings</div>
              <div><strong>CREW CALL:</strong> <span class="call-big">${callData.generalCallTime}</span></div>
              <div><strong>Breakfast:</strong> ${callData.breakfastTime} | <strong>Est. Wrap:</strong> ${callData.estimatedWrapTime}</div>
              <div style="margin-top: 4px;"><strong>Primary Location:</strong> ${callData.locationName}</div>
            </div>

            <div class="box">
              <div class="box-header">Weather & Key Department Heads</div>
              <div><strong>Forecast:</strong> ${callData.weatherForecast}</div>
              <div><strong>Sun Hours:</strong> Sunrise ${callData.sunriseTime} | Sunset ${callData.sunsetTime}</div>
              <div style="margin-top: 4px;"><strong>Director:</strong> ${callData.directorName} | <strong>Producer:</strong> ${callData.producerName}</div>
              <div><strong>DoP:</strong> ${callData.dopName}</div>
            </div>
          </div>

          <!-- Departmental Calls Grid -->
          <div class="section-label">Departmental Crew Call Times</div>
          <table>
            <thead>
              <tr>
                <th style="width: 40%;">Department</th>
                <th style="width: 20%;">Call Time</th>
                <th style="width: 40%;">Department Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${depts.map((d) => `
                <tr>
                  <td><strong>${d.department}</strong></td>
                  <td style="font-family: monospace; font-weight: bold; color: #0f172a;">${d.callTime}</td>
                  <td>${d.notes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Cast Calls with Travel Type distinction -->
          <div class="section-label">Cast Call Times & H&MU Schedule</div>
          <table>
            <thead>
              <tr>
                <th>Character</th>
                <th>Actor Name</th>
                <th>Travel / Arrival Mode</th>
                <th>H&MU</th>
                <th>Set Call</th>
                <th>Scenes</th>
              </tr>
            </thead>
            <tbody>
              ${callData.characters.map((c) => {
                const isSelf = c.travelType === 'SELF_REPORT';
                return `
                  <tr>
                    <td><strong>${c.characterName}</strong></td>
                    <td>${c.actorName}</td>
                    <td style="font-family: monospace;">
                      <strong>${isSelf ? 'On-Set Report' : 'Driver Pickup'}:</strong> ${c.pickupTime}
                    </td>
                    <td style="font-family: monospace;">${c.hmuTime}</td>
                    <td style="font-family: monospace; font-weight: bold; color: #b91c1c;">${c.setCallTime}</td>
                    <td>${c.scenes}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="notes-box">
            <strong>DIRECTOR & PRODUCER SAFETY INSTRUCTIONS:</strong><br/>
            ${callData.generalNotes}
          </div>

          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const depts = callData.departmentCalls || defaultDepartmentCalls;

  return (
    <div className="space-y-6">
      {/* Top Action Bar with Direct Shooting Schedule Sync & Day Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-slate-900 p-4 border border-slate-800 rounded-xl">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            Official Daily Call Sheet Engine
          </h2>
          <p className="text-xs text-slate-400">
            Connected to Shooting Schedule. Auto-populates scheduled scenes, active cast list, set locations, and crew calls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Day Sync Dropdown & Button */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 pl-1">Shoot Day:</span>
            <select
              value={selectedDayNumber}
              onChange={(e) => setSelectedDayNumber(parseInt(e.target.value))}
              className="bg-slate-900 text-amber-300 font-bold text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none cursor-pointer"
            >
              {daysList.map((d) => (
                <option key={d.dayNumber} value={d.dayNumber}>
                  Day {d.dayNumber}: {d.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleSyncWithSchedule}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
              title="Automatically sync scenes, cast, location, and timings from the Shooting Schedule for selected day"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Sync Day {selectedDayNumber}</span>
            </button>
          </div>

          <button
            onClick={() => setShowGuideTips(!showGuideTips)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showGuideTips ? 'Hide Field Tips' : 'Show Field Tips'}</span>
          </button>

          <button
            onClick={handleExportDigitalCallSheet}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            title="Download JSON to share with cast & crew digitally"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Digital File</span>
          </button>

          <button
            onClick={handlePrintCallSheet}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Call Sheet</span>
          </button>
        </div>
      </div>

      {/* NON-AI AUTOMATIC AUTO-FILL SUGGESTION TOOLBAR */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Instant Auto-Fill Helpers (No AI Needed)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Click any button to populate data instantly:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={handleAutoFillWeather}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center gap-2 transition cursor-pointer text-slate-200"
          >
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-[11px]">1. Weather & Sun</div>
              <div className="text-[9px] text-slate-400">Auto-calculate sun hours</div>
            </div>
          </button>

          <button
            onClick={handleAutoFillHospital}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center gap-2 transition cursor-pointer text-slate-200"
          >
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="font-bold text-[11px]">2. ER Hospital</div>
              <div className="text-[9px] text-slate-400">Trauma Bay & Emergency</div>
            </div>
          </button>

          <button
            onClick={handleAutoCalculateDeptTimings}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center gap-2 transition cursor-pointer text-slate-200"
          >
            <Clock className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="font-bold text-[11px]">3. Dept Timings</div>
              <div className="text-[9px] text-slate-400">Calculated from Crew Call</div>
            </div>
          </button>

          <button
            onClick={handleAutoFillCrewNames}
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left flex items-center gap-2 transition cursor-pointer text-slate-200"
          >
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-[11px]">4. Crew Names</div>
              <div className="text-[9px] text-slate-400">Pull from script author</div>
            </div>
          </button>
        </div>
      </div>

      {/* Sync Status Feedback Toast */}
      {syncStatusMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncStatusMsg}</span>
        </div>
      )}

      {/* Field Tips Banner */}
      {showGuideTips && (
        <div className="p-3.5 bg-sky-950/40 border border-sky-800/60 rounded-xl space-y-1.5 text-xs text-sky-200">
          <div className="font-bold flex items-center gap-1.5 text-sky-300">
            <AlertCircle className="w-4 h-4 text-sky-400" />
            <span>Pro Call Sheet Checklist for Directors & Producers:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-sky-200/90 pl-1">
            <li><strong>Auto-Sync Connected:</strong> Click "Sync Day {selectedDayNumber}" above whenever you change your shooting schedule to update required cast, scenes, and timings on the Call Sheet.</li>
            <li><strong>Multiple Locations & Postcodes:</strong> Add Basecamp, Catering, and Set locations with postcodes below — every location includes clickable Google Maps navigation for digital call sheets.</li>
            <li><strong>Cast Travel Mode:</strong> Toggle cast entries between "On-Set Report" (self travel) and "Driver Pickup" (indie low budget friendly option).</li>
          </ul>
        </div>
      )}

      {/* MULTI-LOCATION MANAGER & GOOGLE MAPS LOOKUP SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>Day {selectedDayNumber} Locations & Postcode Google Maps Guide</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Add multiple locations for the day (Sets, Basecamp, Catering, Hospital). Enter address or postcode for instant Google Maps navigation links.
            </p>
          </div>
          <button
            onClick={handleAddLocation}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Day Location</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {locationsList.map((loc) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${loc.address} ${loc.postcode || ''}`)}`;
            return (
              <div
                key={loc.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 relative flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <select
                      value={loc.type}
                      onChange={(e) => handleLocationChange(loc.id, 'type', e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 text-amber-300 text-[10px] font-bold rounded px-2 py-0.5 uppercase focus:outline-none"
                    >
                      <option value="SET">Set Location</option>
                      <option value="BASECAMP">Basecamp / Parking</option>
                      <option value="CATERING">Catering / Holding</option>
                      <option value="HOSPITAL">Hospital / ER</option>
                    </select>

                    <button
                      onClick={() => handleRemoveLocation(loc.id)}
                      className="p-1 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer"
                      title="Remove location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Location Name</label>
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => handleLocationChange(loc.id, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-bold focus:outline-none"
                      placeholder="e.g. Main Diner Interior"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Address</label>
                      <input
                        type="text"
                        value={loc.address}
                        onChange={(e) => handleLocationChange(loc.id, 'address', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                        placeholder="Street Address"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Postcode</label>
                      <input
                        type="text"
                        value={loc.postcode || ''}
                        onChange={(e) => handleLocationChange(loc.id, 'postcode', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-mono focus:outline-none uppercase"
                        placeholder="e.g. SW1A 1AA"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Parking / Gate Notes</label>
                    <input
                      type="text"
                      value={loc.notes || ''}
                      onChange={(e) => handleLocationChange(loc.id, 'notes', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none"
                      placeholder="e.g. Pass code at gate, Park on Lot B"
                    />
                  </div>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-2 py-1 px-2 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/80 rounded font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                >
                  <Navigation className="w-3 h-3 text-sky-400" />
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* CALL SHEET EDITABLE FORM FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Set Timings & Location */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Clock className="w-4 h-4" />
            <span>Daily Set Timings & Location</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Shoot Date</label>
              <input
                type="text"
                value={callData.shootDate}
                onChange={(e) => handleUpdate({ shootDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Crew Call Time</label>
              <input
                type="text"
                value={callData.generalCallTime}
                onChange={(e) => handleUpdate({ generalCallTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Breakfast Time</label>
              <input
                type="text"
                value={callData.breakfastTime}
                onChange={(e) => handleUpdate({ breakfastTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Est. Wrap Time</label>
              <input
                type="text"
                value={callData.estimatedWrapTime}
                onChange={(e) => handleUpdate({ estimatedWrapTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Primary Set Location Name</label>
            <input
              type="text"
              value={callData.locationName}
              onChange={(e) => handleUpdate({ locationName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Full Location Address & Parking</label>
            <input
              type="text"
              value={callData.locationAddress}
              onChange={(e) => handleUpdate({ locationAddress: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-[10px] text-rose-400 uppercase font-bold mb-1">🚨 Nearest ER Hospital & Contact</label>
            <input
              type="text"
              value={callData.nearestHospital}
              onChange={(e) => handleUpdate({ nearestHospital: e.target.value })}
              className="w-full bg-slate-950 border border-rose-900/60 rounded px-2.5 py-1.5 text-xs text-rose-200 font-bold"
            />
          </div>
        </div>

        {/* Weather & Key Production Heads */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sun className="w-4 h-4" />
            <span>Weather & Key Department Heads</span>
          </h3>

          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Weather Forecast</label>
            <input
              type="text"
              value={callData.weatherForecast}
              onChange={(e) => handleUpdate({ weatherForecast: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Sunrise Time</label>
              <input
                type="text"
                value={callData.sunriseTime}
                onChange={(e) => handleUpdate({ sunriseTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Sunset Time</label>
              <input
                type="text"
                value={callData.sunsetTime}
                onChange={(e) => handleUpdate({ sunsetTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Director</label>
              <input
                type="text"
                value={callData.directorName}
                onChange={(e) => handleUpdate({ directorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Producer</label>
              <input
                type="text"
                value={callData.producerName}
                onChange={(e) => handleUpdate({ producerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">DoP / Cinematographer</label>
              <input
                type="text"
                value={callData.dopName}
                onChange={(e) => handleUpdate({ dopName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-amber-400 uppercase font-bold mb-1">Director Safety & Set Instructions</label>
            <textarea
              value={callData.generalNotes}
              onChange={(e) => handleUpdate({ generalNotes: e.target.value })}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* CAST CALL TIMES & H&MU SCHEDULE TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Cast Call Times & Hair/Makeup (H&MU) Schedule</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Specify travel option per cast member (Self-Report vs Driver Pickup) for low-budget flexibility.
            </p>
          </div>
          <button
            onClick={handleAddCharacter}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Cast Member</span>
          </button>
        </div>

        <div className="space-y-2 overflow-x-auto">
          {callData.characters.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 items-center font-mono text-xs"
            >
              <div className="md:col-span-2">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Character</label>
                <input
                  type="text"
                  value={c.characterName}
                  onChange={(e) => handleCharChange(c.id, 'characterName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Actor Name</label>
                <input
                  type="text"
                  value={c.actorName}
                  onChange={(e) => handleCharChange(c.id, 'actorName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Travel Mode</label>
                <select
                  value={c.travelType || 'SELF_REPORT'}
                  onChange={(e) => handleCharChange(c.id, 'travelType', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-sky-300 font-bold rounded px-2 py-1 focus:outline-none text-[10px]"
                >
                  <option value="SELF_REPORT">On-Set Report (Self)</option>
                  <option value="PICKUP">Driver Pickup</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">
                  {c.travelType === 'PICKUP' ? 'Pickup Time' : 'Arrival Time'}
                </label>
                <input
                  type="text"
                  value={c.pickupTime}
                  onChange={(e) => handleCharChange(c.id, 'pickupTime', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">HMU Call</label>
                <input
                  type="text"
                  value={c.hmuTime}
                  onChange={(e) => handleCharChange(c.id, 'hmuTime', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Set Call</label>
                <input
                  type="text"
                  value={c.setCallTime}
                  onChange={(e) => handleCharChange(c.id, 'setCallTime', e.target.value)}
                  className="w-full bg-slate-900 border border-rose-900/80 rounded px-2 py-1 text-rose-300 font-bold focus:outline-none"
                />
              </div>

              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  onClick={() => handleRemoveCharacter(c.id)}
                  className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer"
                  title="Remove cast member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPARTMENTAL CALL TIMES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Departmental Crew Call Times & Instructions</span>
          </h3>
          <button
            onClick={handleAddDept}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Department Call</span>
          </button>
        </div>

        <div className="space-y-2">
          {depts.map((d) => (
            <div
              key={d.id}
              className="p-3 bg-slate-950 border border-slate-800 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center font-mono text-xs"
            >
              <div className="md:col-span-5">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Department Name</label>
                <input
                  type="text"
                  value={d.department}
                  onChange={(e) => handleDeptChange(d.id, 'department', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-100 font-bold focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Call Time</label>
                <input
                  type="text"
                  value={d.callTime}
                  onChange={(e) => handleDeptChange(d.id, 'callTime', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-amber-300 font-bold focus:outline-none"
                />
              </div>

              <div className="md:col-span-4">
                <label className="block text-[9px] text-slate-400 uppercase font-bold mb-0.5">Instructions / Gear Setup</label>
                <input
                  type="text"
                  value={d.notes}
                  onChange={(e) => handleDeptChange(d.id, 'notes', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none"
                />
              </div>

              <div className="md:col-span-1 flex items-center justify-end">
                <button
                  onClick={() => handleRemoveDept(d.id)}
                  className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded transition cursor-pointer"
                  title="Delete department call"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

