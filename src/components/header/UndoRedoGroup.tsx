import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface UndoRedoGroupProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  themeConfig?: AppThemeConfig;
}

export const UndoRedoGroup: React.FC<UndoRedoGroupProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  themeConfig,
}) => {
  return (
    <div
      className="hidden lg:flex items-center border rounded-lg overflow-hidden shrink-0"
      style={{
        backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
        borderColor: themeConfig?.borders || '#E4D3B9',
      }}
    >
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 min-h-[38px] disabled:opacity-35 transition cursor-pointer hover:opacity-80"
        style={{ color: themeConfig?.primaryText || '#433422' }}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4" style={{ backgroundColor: themeConfig?.borders || '#E4D3B9' }} />
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 min-h-[38px] disabled:opacity-35 transition cursor-pointer hover:opacity-80"
        style={{ color: themeConfig?.primaryText || '#433422' }}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
};
