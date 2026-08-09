import React, { useRef } from 'react';
import { Image, Upload, Trash2, CheckCircle2 } from 'lucide-react';

interface LogoWatermarkUploaderProps {
  watermarkLogoUrl?: string;
  onUpdateLogoUrl: (url?: string) => void;
}

export const LogoWatermarkUploader: React.FC<LogoWatermarkUploaderProps> = ({
  watermarkLogoUrl,
  onUpdateLogoUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateLogoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Production Company Logo & Document Watermark
          </h3>
        </div>
        {watermarkLogoUrl && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Logo Attached
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400">
        Upload your production company logo or branding watermark PNG/JPG. It will automatically attach to the header of all printed Shooting Schedules, Call Sheets, Risk Assessments, and Release Forms!
      </p>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {watermarkLogoUrl ? (
          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <img
              src={watermarkLogoUrl}
              alt="Production Logo Watermark"
              className="h-12 max-w-[180px] object-contain rounded bg-white/10 p-1"
            />
            <div className="space-y-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold block"
              >
                Change Logo
              </button>
              <button
                onClick={() => onUpdateLogoUrl(undefined)}
                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-xs font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Remove Logo
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto px-4 py-3 bg-slate-950 hover:bg-slate-850 border-2 border-dashed border-slate-700 hover:border-amber-400 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Upload Company Logo (PNG / JPG)</span>
          </button>
        )}
      </div>
    </div>
  );
};
