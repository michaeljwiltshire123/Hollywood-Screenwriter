import React, { useEffect, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  rowId: string;
}

interface ShootScheduleContextMenuProps {
  menu: ContextMenuState | null;
  onClose: () => void;
  onAddLineBelow: (rowId: string) => void;
  onDeleteRow: (rowId: string) => void;
}

export const ShootScheduleContextMenu: React.FC<ShootScheduleContextMenuProps> = ({
  menu,
  onClose,
  onAddLineBelow,
  onDeleteRow,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (menu) {
      window.addEventListener('click', handleOutsideClick);
      window.addEventListener('contextmenu', handleOutsideClick);
    }
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [menu, onClose]);

  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-slate-300 rounded-lg shadow-xl py-1 w-44 text-xs font-medium text-slate-800 animate-in fade-in duration-100"
      style={{ top: menu.mouseY, left: menu.mouseX }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onAddLineBelow(menu.rowId);
          onClose();
        }}
        className="w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition text-slate-700"
      >
        <Plus className="w-3.5 h-3.5 text-blue-600" />
        <span>Add Line Below</span>
      </button>

      <div className="border-t border-slate-200 my-1" />

      <button
        onClick={() => {
          onDeleteRow(menu.rowId);
          onClose();
        }}
        className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition text-rose-600"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Row</span>
      </button>
    </div>
  );
};
