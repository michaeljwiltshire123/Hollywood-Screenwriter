import React from 'react';
import { AlertTriangle, Printer, ShieldAlert, Zap, Flame, Eye, Volume2, Camera, Lock, Wind, Radio, AlertOctagon } from 'lucide-react';

export interface SafetySign {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'STUNT' | 'VOLTAGE' | 'SLIP' | 'ACCESS' | 'FLAME' | 'HEARING' | 'HAZER' | 'GUERRILLA' | 'BATTERY' | 'PPE';
  bgColor: string;
  borderColor: string;
  textColor: string;
  headerTag: 'WARNING' | 'CAUTION' | 'DANGER' | 'NOTICE';
  symbolSvg: string; // Pure SVG string for printable vector icon
}

const SAFETY_SIGNS: SafetySign[] = [
  {
    id: 'sign-stunts',
    title: 'ACTIVE FILM SET - STUNTS & ACTION IN PROGRESS',
    subtitle: 'Authorized Personnel Only. Do Not Enter Shooting Area Without AD Clearance.',
    iconType: 'STUNT',
    bgColor: 'bg-amber-400',
    borderColor: 'border-amber-600',
    textColor: 'text-slate-950',
    headerTag: 'WARNING',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    id: 'sign-voltage',
    title: 'HIGH VOLTAGE / TEMPORARY POWER DISTRIBUTION',
    subtitle: 'Heavy Generators, Power Distros & Cables Operating. Keep Liquids Clear.',
    iconType: 'VOLTAGE',
    bgColor: 'bg-yellow-400',
    borderColor: 'border-yellow-600',
    textColor: 'text-slate-950',
    headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    id: 'sign-quiet',
    title: 'QUIET ON SET - SOUND RECORDING IN PROGRESS',
    subtitle: 'No Unauthorized Access. Turn Off Mobile Devices & Silence All Equipment.',
    iconType: 'ACCESS',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-800',
    textColor: 'text-white',
    headerTag: 'NOTICE',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  },
  {
    id: 'sign-slip',
    title: 'WET FLOOR & SLIP / CABLE TRIP HAZARD',
    subtitle: 'Atmospheric Wetting / Heavy Cables on Walkways. Watch Your Step.',
    iconType: 'SLIP',
    bgColor: 'bg-amber-300',
    borderColor: 'border-amber-500',
    textColor: 'text-slate-950',
    headerTag: 'CAUTION',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  },
  {
    id: 'sign-hazer',
    title: 'ATMOSPHERIC HAZER & SMOKE EFFECTS IN USE',
    subtitle: 'Non-Toxic Stage Fog / Hazer Active. Ventilation Open Between Takes.',
    iconType: 'HAZER',
    bgColor: 'bg-orange-400',
    borderColor: 'border-orange-600',
    textColor: 'text-slate-950',
    headerTag: 'WARNING',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  },
  {
    id: 'sign-closed',
    title: 'CLOSED SET - CAST & CREW ONLY',
    subtitle: 'Strictly No Visitors or Unauthorized Recording Devices Allowed Past This Point.',
    iconType: 'ACCESS',
    bgColor: 'bg-rose-700',
    borderColor: 'border-rose-900',
    textColor: 'text-white',
    headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    id: 'sign-hearing',
    title: 'LOUD SOUND EFFECTS & BLANKS AREA',
    subtitle: 'Pyrotechnic & Blank Audio Effects. Approved Hearing Protection Required.',
    iconType: 'HEARING',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-700',
    textColor: 'text-slate-950',
    headerTag: 'WARNING',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  },
  {
    id: 'sign-guerrilla',
    title: 'INDEPENDENT FILM PRODUCTION IN PROGRESS',
    subtitle: 'Street Filming Courtesy Notice. Please Keep Sidewalk & Access Paths Clear.',
    iconType: 'GUERRILLA',
    bgColor: 'bg-sky-400',
    borderColor: 'border-sky-600',
    textColor: 'text-slate-950',
    headerTag: 'NOTICE',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223-3.482a.5.5 0 0 0 0-.836L16 5.2V13z"/><rect x="2" y="5" width="14" height="14" rx="2"/></svg>`,
  },
  {
    id: 'sign-battery',
    title: 'LITHIUM-ION BATTERY CHARGING STATION',
    subtitle: 'V-Mount & Camera Battery Bay. Do Not Cover Units or Stack Flammables.',
    iconType: 'BATTERY',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-700',
    textColor: 'text-white',
    headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },
  {
    id: 'sign-ppe',
    title: 'SAFETY GEAR AREA - HI-VIS VESTS REQUIRED',
    subtitle: 'Heavy Rigging, Cranes & Overhead Lighting Active. Hi-Vis Vests & Boots Mandated.',
    iconType: 'PPE',
    bgColor: 'bg-emerald-400',
    borderColor: 'border-emerald-600',
    textColor: 'text-slate-950',
    headerTag: 'CAUTION',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
];

export const SafetySignsBank: React.FC = () => {
  const handlePrintSign = (sign: SafetySign) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SAFETY SIGN - ${sign.title}</title>
          <style>
            @page { size: landscape; margin: 0; }
            body { margin: 0; padding: 30px; font-family: 'Helvetica Neue', Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; box-sizing: border-box; background: #fff; }
            .sign-box { width: 100%; height: 100%; border: 18px solid #000; box-sizing: border-box; padding: 30px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; text-align: center; background: #ffffff; }
            
            .header-badge { font-size: 64px; font-weight: 900; letter-spacing: 6px; padding: 14px 60px; color: #fff; background: ${
              sign.headerTag === 'DANGER' ? '#dc2626' : sign.headerTag === 'WARNING' ? '#ea580c' : sign.headerTag === 'NOTICE' ? '#0284c7' : '#d97706'
            }; border-radius: 8px; text-transform: uppercase; }

            .symbol-wrapper { margin: 20px 0; transform: scale(1.4); }
            
            .title { font-size: 38px; font-weight: 900; color: #000; text-transform: uppercase; line-height: 1.25; max-width: 950px; }
            .subtitle { font-size: 22px; font-weight: 700; color: #333; max-width: 850px; margin-top: 10px; }
            .footer { margin-top: 15px; font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 2px; border-top: 2px solid #ddd; width: 100%; pt-10; }
          </style>
        </head>
        <body>
          <div class="sign-box">
            <div class="header-badge">${sign.headerTag}</div>
            
            <div class="symbol-wrapper">
              ${sign.symbolSvg}
            </div>

            <div>
              <div class="title">${sign.title}</div>
              <div class="subtitle">${sign.subtitle}</div>
            </div>

            <div class="footer">Screenwriter Pro - Official On-Set Safety Notice & Poster Bank</div>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Printable On-Set Safety Warning Signs Bank (10 High-Visibility Posters)
          </h3>
          <p className="text-xs text-slate-400">
            Click any visual warning sign to instantly print high-impact ISO-style warning posters for set doors, generators, and filming locations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SAFETY_SIGNS.map((sign) => (
          <div
            key={sign.id}
            className={`p-3.5 rounded-xl border-2 ${sign.bgColor} ${sign.borderColor} ${sign.textColor} shadow-md flex flex-col justify-between space-y-3 transition transform hover:-translate-y-0.5`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2 py-0.5 bg-slate-950 text-white font-black text-[9px] tracking-widest rounded uppercase">
                  {sign.headerTag}
                </span>

                <div
                  className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{ __html: sign.symbolSvg.replace('width="80"', 'width="20"').replace('height="80"', 'height="20"') }}
                />
              </div>

              <div className="font-extrabold text-xs leading-snug uppercase">
                {sign.title}
              </div>

              <div className="text-[11px] font-medium opacity-90 leading-tight">
                {sign.subtitle}
              </div>
            </div>

            <button
              onClick={() => handlePrintSign(sign)}
              className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Poster</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

