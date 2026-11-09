import React from 'react';
import { MapPin, Globe, Layers, X } from 'lucide-react';

interface LocationAssignChoiceModalProps {
  isOpen: boolean;
  sceneSetting: string;
  sceneNumber: string;
  filmingLocation: string;
  onClose: () => void;
  onAssignToAll: () => void;
  onAssignToThisOnly: () => void;
}

export const LocationAssignChoiceModal: React.FC<LocationAssignChoiceModalProps> = ({
  isOpen, sceneSetting, sceneNumber, filmingLocation, onClose, onAssignToAll, onAssignToThisOnly,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-300 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <MapPin className="w-5 h-5 text-teal-600" />
            <h3 className="font-black text-sm uppercase tracking-wide">Assign Filming Location</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition cursor-pointer"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-900 space-y-1">
          <div><span className="font-bold">Filming Location:</span> "{filmingLocation}"</div>
          <div><span className="font-bold">Script Scene Setting:</span> {sceneSetting}</div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Would you like to assign this filming location to all scenes set in <strong>{sceneSetting}</strong>, or set it for <strong>Scene {sceneNumber}</strong> only?
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            type="button"
            onClick={() => { onAssignToAll(); onClose(); }}
            className="w-full p-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-left transition cursor-pointer group flex items-center justify-between shadow-xs"
          >
            <div>
              <div className="font-bold text-xs text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-teal-200" />
                <span>Auto-Fill All Scenes in {sceneSetting}</span>
              </div>
              <div className="text-[10px] text-teal-100 mt-0.5 font-medium">Apply "{filmingLocation}" to every matching scene setting across the schedule</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { onAssignToThisOnly(); onClose(); }}
            className="w-full p-3 bg-slate-100 hover:bg-teal-50 border border-slate-300 hover:border-teal-400 rounded-lg text-left transition cursor-pointer group flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Scene {sceneNumber} Only</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Set this location for Scene {sceneNumber} without affecting other scenes</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
