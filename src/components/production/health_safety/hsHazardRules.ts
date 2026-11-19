export interface HazardRule {
  id: string;
  category: string;
  pattern: RegExp;
  hazard: string;
  riskLevel: 'HIGH' | 'MED' | 'LOW';
  likelihood: 'HIGH' | 'MED' | 'LOW';
  controlMeasures: string;
  responsiblePerson: string;
}

export const HAZARD_RULES: HazardRule[] = [
  {
    id: 'auto-night', category: 'Night Shoot',
    pattern: /\b(NIGHT|MIDNIGHT|DUSK|DAWN)\b/i,
    hazard: 'Low visibility, cable trips, crew fatigue', riskLevel: 'MED', likelihood: 'MED',
    controlMeasures: 'Deploy work lights, mark walkways, wear hi-vis vests, schedule hot catering breaks.',
    responsiblePerson: '1st AD / Gaffer',
  },
  {
    id: 'auto-ext', category: 'Outdoor Exterior',
    pattern: /\b(EXT\.|EXTERIOR|OUTDOOR)\b/i,
    hazard: 'Sudden weather shifts, heat/cold exposure, uneven ground', riskLevel: 'LOW', likelihood: 'MED',
    controlMeasures: 'Provide weather shelter, hydration, warm layers, and check local Met Office forecasts.',
    responsiblePerson: 'Location Manager',
  },
  {
    id: 'auto-vehicle', category: 'Vehicles & Traffic',
    pattern: /\b(CAR|TRUCK|VAN|MOTORCYCLE|DRIVE|DRIVING|VEHICLE|MOTORWAY|HIGHWAY|TRAFFIC)\b/i,
    hazard: 'Moving vehicle collision, roadside crew safety', riskLevel: 'HIGH', likelihood: 'MED',
    controlMeasures: 'Secure council road closures, use precision drivers, deploy marshals with radios.',
    responsiblePerson: '1st AD / Safety Marshal',
  },
  {
    id: 'auto-water', category: 'Water & Wet Set',
    pattern: /\b(WATER|RIVER|LAKE|SEA|OCEAN|POOL|RAIN|BOAT|SWIM|FLOOD|DOCK|BEACH)\b/i,
    hazard: 'Cold water shock, drowning risk, electrical shock near moisture', riskLevel: 'HIGH', likelihood: 'MED',
    controlMeasures: 'Keep throw lines and life jackets ready, RCD-protect all power, warm dry towels on standby.',
    responsiblePerson: 'Water Safety Officer',
  },
  {
    id: 'auto-stunt', category: 'Stunts & Action',
    pattern: /\b(STUNT|FIGHT|PUNCH|KICK|FALL|CRASH|TACKLE|JUMP)\b/i,
    hazard: 'Impact injuries, sprains, falls during physical action', riskLevel: 'HIGH', likelihood: 'MED',
    controlMeasures: 'Rehearse at half-speed with crash mats, clear glass/sharp props, brief cast beforehand.',
    responsiblePerson: 'Stunt Coordinator',
  },
  {
    id: 'auto-fire', category: 'Fire & Heat',
    pattern: /\b(FIRE|FLAME|BURN|TORCH|CANDLE|SPARK|PYRO|EXPLODE|EXPLOSION)\b/i,
    hazard: 'Burns, smoke inhalation, accidental ignition', riskLevel: 'HIGH', likelihood: 'LOW',
    controlMeasures: 'Position CO2/foam extinguishers on set, clear flammables, keep fire marshal nearby.',
    responsiblePerson: 'Pyro / Fire Marshal',
  },
  {
    id: 'auto-height', category: 'Working at Height',
    pattern: /\b(ROOF|ROOFTOP|BALCONY|LADDER|SCAFFOLD|CLIFF|BRIDGE|LEDGE)\b/i,
    hazard: 'Falls from height, dropped tools or camera kit', riskLevel: 'HIGH', likelihood: 'LOW',
    controlMeasures: 'Use harnesses/edge barriers, tether overhead gear, cordon off drop zones below.',
    responsiblePerson: 'Key Grip / Safety Marshal',
  },
  {
    id: 'auto-haze', category: 'Smoke, Haze & Strobe',
    pattern: /\b(HAZE|HAZER|FOG|SMOKE MACHINE|STROBE|FLASHING LIGHT)\b/i,
    hazard: 'Respiratory irritation, asthma triggers, photosensitive seizures', riskLevel: 'MED', likelihood: 'MED',
    controlMeasures: 'Use non-toxic water-based fluid, ventilate between takes, post strobe warnings.',
    responsiblePerson: '1st AD / Gaffer',
  },
  {
    id: 'auto-public', category: 'Public & Street Filming',
    pattern: /\b(STREET|CROWD|PAVEMENT|MARKET|STATION|SQUARE|ALLEY)\b/i,
    hazard: 'Pedestrian obstruction, trip hazards in public areas', riskLevel: 'MED', likelihood: 'MED',
    controlMeasures: 'Keep pavements passable, obtain filming permits, deploy marshals with safety signage.',
    responsiblePerson: 'Location Manager',
  },
  {
    id: 'auto-weapons', category: 'Replica Weapons & Props',
    pattern: /\b(GUN|PISTOL|RIFLE|KNIFE|BLADE|SWORD|WEAPON|SHOTGUN|REVOLVER)\b/i,
    hazard: 'Public alarm, sharp-edge cuts, misfires', riskLevel: 'HIGH', likelihood: 'LOW',
    controlMeasures: 'Notify local police before filming, use rubber/blunt props, lock prop box between takes.',
    responsiblePerson: 'Armourer / Prop Master',
  },
  {
    id: 'auto-minors', category: 'Minors & Animals',
    pattern: /\b(CHILD|KID|BABY|TODDLER|DOG|HORSE|ANIMAL)\b/i,
    hazard: 'Chaperone/licensing requirements, animal stress on set', riskLevel: 'MED', likelihood: 'LOW',
    controlMeasures: 'Verify child performance licences & chaperones; keep trained handler with animals.',
    responsiblePerson: 'Producer / 1st AD',
  },
];
