import React, { useState } from 'react';
import { X, Cloud, Type } from 'lucide-react';
import { requestGoogleDriveToken } from '../lib/googleDriveSync';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDriveConnected: boolean;
  driveLastSync: Date | null;
  onConnectDrive: (token: string) => void;
  onDisconnectDrive: () => void;
  editorFont: 'Courier Prime' | 'Courier New';
  onUpdateFont: (font: 'Courier Prime' | 'Courier New') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDriveConnected,
  driveLastSync,
  onConnectDrive,
  onDisconnectDrive,
  editorFont = 'Courier Prime',
  onUpdateFont,
}) => {
  if (!isOpen) return null;

  const [driveLoading, setDriveLoading] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);

  const handleConnectGoogleDrive = async () => {
    setDriveLoading(true);
    setDriveError(null);
    try {
      const token = await requestGoogleDriveToken();
      onConnectDrive(token);
    } catch (err: any) {
      const errMsg = err?.message || '';
      if (errMsg.includes('401') || errMsg.includes('invalid_client') || !import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        setDriveError('Check Google Cloud Console: Error 401 indicates your VITE_GOOGLE_CLIENT_ID is incorrect.');
      } else {
        setDriveError(errMsg || 'Check Google Cloud Console: Error 401 indicates your VITE_GOOGLE_CLIENT_ID is incorrect.');
      }
    } finally {
      setDriveLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full text-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-sm uppercase text-sky-300">CONNECT TO DRIVE</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Typography Preference */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Type className="w-4 h-4 text-amber-400" />
              <span>Editor Typography (12pt Standard)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Choose your preferred industry-standard screenplay typewriter font.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onUpdateFont('Courier Prime')}
                className={`flex-1 py-2 px-3 rounded font-bold text-xs border transition ${
                  editorFont === 'Courier Prime'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Courier Prime
              </button>
              <button
                type="button"
                onClick={() => onUpdateFont('Courier New')}
                className={`flex-1 py-2 px-3 rounded font-bold text-xs border transition ${
                  editorFont === 'Courier New'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Courier New
              </button>
            </div>
          </div>

          {/* Google Drive Integration */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Cloud className="w-4 h-4 text-sky-400" />
                <span>Google Drive Mirror Backup</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDriveConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                {isDriveConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Connect your Google Drive to automatically mirror your script JSON to a "Screenwriter Pro" folder every 2 minutes.
            </p>
            {driveError && (
              <div className="p-2 bg-rose-950/80 border border-rose-500/50 text-rose-200 rounded text-[11px]">
                {driveError}
              </div>
            )}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500">
                {driveLastSync ? `Last synced: ${driveLastSync.toLocaleTimeString()}` : 'No active mirror sync yet'}
              </span>
              {isDriveConnected ? (
                <button
                  type="button"
                  onClick={onDisconnectDrive}
                  className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800 rounded font-bold transition"
                >
                  Disconnect Drive
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGoogleDrive}
                  disabled={driveLoading}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {driveLoading ? 'Connecting...' : 'Connect Google Drive'}
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

