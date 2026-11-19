export interface SafetySign {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  headerTag: 'WARNING' | 'CAUTION' | 'DANGER' | 'NOTICE' | 'SAFE CONDITION';
  symbolSvg: string;
}

const tri = (inner: string, stroke = '#000') =>
  `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>${inner}</svg>`;

export const SAFETY_SIGNS: SafetySign[] = [
  {
    id: 'sign-stunts', title: 'ACTIVE FILM SET - STUNTS & ACTION IN PROGRESS',
    subtitle: 'Authorised Personnel Only. Do Not Enter Shooting Area Without 1st AD Clearance.',
    bgColor: 'bg-amber-400', borderColor: 'border-amber-600', textColor: 'text-slate-950', headerTag: 'WARNING',
    symbolSvg: tri('<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  },
  {
    id: 'sign-voltage', title: 'HIGH VOLTAGE / TEMPORARY POWER DISTRIBUTION',
    subtitle: 'Generators, Power Distros & Cables Active. Keep All Liquids Clear.',
    bgColor: 'bg-yellow-400', borderColor: 'border-yellow-600', textColor: 'text-slate-950', headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    id: 'sign-quiet', title: 'QUIET ON SET - SOUND RECORDING IN PROGRESS',
    subtitle: 'No Unauthorised Entry. Silence Mobile Phones & Equipment Before Passing.',
    bgColor: 'bg-red-600', borderColor: 'border-red-800', textColor: 'text-white', headerTag: 'NOTICE',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  },
  {
    id: 'sign-slip', title: 'WET FLOOR & CABLE TRIP HAZARD',
    subtitle: 'Atmospheric Wetting & Floor Cables in Walkways. Watch Your Step.',
    bgColor: 'bg-amber-300', borderColor: 'border-amber-500', textColor: 'text-slate-950', headerTag: 'CAUTION',
    symbolSvg: tri('<line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  },
  {
    id: 'sign-hazer', title: 'ATMOSPHERIC HAZER & SMOKE EFFECTS IN USE',
    subtitle: 'Water-Based Stage Fog Active. Doors Ventilated Between Takes.',
    bgColor: 'bg-orange-400', borderColor: 'border-orange-600', textColor: 'text-slate-950', headerTag: 'WARNING',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`,
  },
  {
    id: 'sign-closed', title: 'CLOSED SET - CAST & CREW ONLY',
    subtitle: 'Strictly No Visitors or Unauthorised Recording Past This Point.',
    bgColor: 'bg-rose-700', borderColor: 'border-rose-900', textColor: 'text-white', headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    id: 'sign-hearing', title: 'LOUD SOUND EFFECTS & HEARING PROTECTION AREA',
    subtitle: 'High-Decibel SFX or Blanks Active. Ear Defenders Required Beyond Here.',
    bgColor: 'bg-amber-500', borderColor: 'border-amber-700', textColor: 'text-slate-950', headerTag: 'WARNING',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
  },
  {
    id: 'sign-guerrilla', title: 'FILM PRODUCTION IN PROGRESS',
    subtitle: 'Location Filming Courtesy Notice. Please Keep Pavements & Access Clear.',
    bgColor: 'bg-sky-400', borderColor: 'border-sky-600', textColor: 'text-slate-950', headerTag: 'NOTICE',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223-3.482a.5.5 0 0 0 0-.836L16 5.2V13z"/><rect x="2" y="5" width="14" height="14" rx="2"/></svg>`,
  },
  {
    id: 'sign-battery', title: 'LITHIUM-ION BATTERY CHARGING STATION',
    subtitle: 'V-Mount & Camera Battery Bay. Do Not Cover Chargers or Stack Flammables.',
    bgColor: 'bg-red-500', borderColor: 'border-red-700', textColor: 'text-white', headerTag: 'DANGER',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },
  {
    id: 'sign-ppe', title: 'PPE AREA - HI-VIS VESTS & BOOTS REQUIRED',
    subtitle: 'Rigging, Vehicles & Overhead Lighting Active. Hi-Vis Vests Required.',
    bgColor: 'bg-emerald-400', borderColor: 'border-emerald-600', textColor: 'text-slate-950', headerTag: 'CAUTION',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  },
  {
    id: 'sign-firstaid', title: 'FIRST AID POINT & MEDICAL KIT',
    subtitle: 'On-Set First Aider Station & Trauma Kit Located Here.',
    bgColor: 'bg-emerald-600', borderColor: 'border-emerald-800', textColor: 'text-white', headerTag: 'SAFE CONDITION',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  },
  {
    id: 'sign-firepoint', title: 'FIRE ASSEMBLY POINT & EMERGENCY EXIT',
    subtitle: 'Keep Exit Routes Clear at All Times. Assemble Outside on Alarm.',
    bgColor: 'bg-green-700', borderColor: 'border-green-900', textColor: 'text-white', headerTag: 'SAFE CONDITION',
    symbolSvg: `<svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  },
];
