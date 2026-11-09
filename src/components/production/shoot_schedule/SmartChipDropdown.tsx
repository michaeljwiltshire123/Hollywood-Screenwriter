import React from 'react';
import { ChevronDown } from 'lucide-react';
import { getUnitBadgeStyle, getUnitShortLabel, getUnitLabel, MAX_UNITS } from './multiUnitOps';

interface SmartChipDropdownProps {
  type: 'INT_EXT' | 'DAY_NIGHT' | 'UNIT';
  value?: string;
  unitNumber?: number;
  unitsList?: number[];
  onChange?: (newValue: string) => void;
  onUnitChange?: (newUnitNumber: number | undefined) => void;
  onCreateUnit?: () => void;
}

export const SmartChipDropdown: React.FC<SmartChipDropdownProps> = ({
  type, value = '', unitNumber, unitsList = [1],
  onChange = (_val: string) => {},
  onUnitChange = (_unit?: number) => {},
  onCreateUnit = () => {},
}) => {
  if (type === 'UNIT') {
    const activeUnit = unitNumber || 1;
    const style = getUnitBadgeStyle(activeUnit);
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === 'CREATE_NEW') onCreateUnit();
      else onUnitChange(parseInt(val, 10));
    };

    return (
      <div className="relative inline-block text-xs font-sans">
        <select
          value={activeUnit.toString()}
          onChange={handleSelect}
          className={`appearance-none font-extrabold py-0.5 px-1 pr-3 rounded text-[11px] cursor-pointer focus:outline-none transition-colors shadow-2xs ${style.bg} ${style.text} ${style.border}`}
        >
          {unitsList.map((u) => (
            <option key={u} value={u.toString()}>{getUnitShortLabel(u)}</option>
          ))}
          {unitsList.length < MAX_UNITS && (
            <option value="CREATE_NEW">+ Unit</option>
          )}
        </select>
        <ChevronDown className="w-2.5 h-2.5 absolute right-0.5 top-1.5 pointer-events-none opacity-60" />
      </div>
    );
  }

  if (!value) return <span className="text-slate-400 font-mono text-xs">—</span>;

  const isIntExt = type === 'INT_EXT';
  const valNormalized = value.trim();
  const isExt = valNormalized.toLowerCase().startsWith('ext');
  const isNight = valNormalized.toLowerCase().startsWith('night');

  let pillClasses = isIntExt
    ? (isExt ? 'bg-sky-100 text-sky-900 border-sky-300 hover:bg-sky-200' : 'bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200')
    : (isNight ? 'bg-indigo-100 text-indigo-950 border-indigo-300 hover:bg-indigo-200' : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200');

  const options = isIntExt
    ? [{ label: 'Int ∨', val: 'Int' }, { label: 'Ext ∨', val: 'Ext' }]
    : [{ label: 'Day ∨', val: 'Day' }, { label: 'Night ∨', val: 'Night' }];

  return (
    <div className="relative inline-block text-xs">
      <select
        value={isExt ? 'Ext' : isNight ? 'Night' : isIntExt ? 'Int' : 'Day'}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none font-bold py-1 px-3 pr-6 rounded-md border text-xs cursor-pointer focus:outline-none transition-colors shadow-2xs ${pillClasses}`}
      >
        {options.map((opt) => (<option key={opt.val} value={opt.val}>{opt.label}</option>))}
      </select>
      <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none opacity-60" />
    </div>
  );
};
