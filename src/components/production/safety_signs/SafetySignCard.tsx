import React from 'react';
import { Printer } from 'lucide-react';
import { SafetySign } from './safetySignsData';
import { printHsHtml } from '../health_safety/hsPrintHelper';

function buildSignHtml(sign: SafetySign, productionLogoUrl?: string): string {
  const badgeColor =
    sign.headerTag === 'DANGER' ? '#dc2626'
      : sign.headerTag === 'WARNING' ? '#ea580c'
      : sign.headerTag === 'SAFE CONDITION' ? '#15803d'
      : sign.headerTag === 'NOTICE' ? '#0284c7'
      : '#d97706';
  const logoHtml = productionLogoUrl ? `<img src="${productionLogoUrl}" style="max-height:38px;max-width:120px;object-fit:contain" alt="Logo" />` : '';

  return `<!DOCTYPE html><html><head><title>SAFETY SIGN - ${sign.title}</title>
<style>@page{size:landscape;margin:0}body{margin:0;padding:30px;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;box-sizing:border-box;background:#fff}
.box{width:100%;height:100%;border:18px solid #000;box-sizing:border-box;padding:30px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;text-align:center}
.tag{font-size:60px;font-weight:900;letter-spacing:6px;padding:12px 54px;color:#fff;background:${badgeColor};border-radius:8px;text-transform:uppercase}
.sym{margin:16px 0;transform:scale(1.4)}.title{font-size:36px;font-weight:900;color:#000;text-transform:uppercase;line-height:1.25;max-width:950px}
.sub{font-size:21px;font-weight:700;color:#333;max-width:850px;margin-top:10px}
.ftr{font-size:13px;font-weight:bold;color:#666;text-transform:uppercase;letter-spacing:2px;border-top:2px solid #ddd;width:100%;padding-top:10px;display:flex;align-items:center;justify-content:space-between}</style></head>
<body><div class="box"><div class="tag">${sign.headerTag}</div><div class="sym">${sign.symbolSvg}</div>
<div><div class="title">${sign.title}</div><div class="sub">${sign.subtitle}</div></div>
<div class="ftr"><span>On-Set Health &amp; Safety (H&amp;S) — Printable Warning Poster</span>${logoHtml}</div></div></body></html>`;
}

export const SafetySignCard: React.FC<{ sign: SafetySign; productionLogoUrl?: string }> = ({ sign, productionLogoUrl }) => (
  <div className={`p-3.5 rounded-xl border-2 ${sign.bgColor} ${sign.borderColor} ${sign.textColor} shadow-md flex flex-col justify-between space-y-3 transition hover:-translate-y-0.5`}>
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-block px-2 py-0.5 bg-slate-950 text-white font-black text-[9px] tracking-widest rounded uppercase">{sign.headerTag}</span>
        {productionLogoUrl ? (
          <img src={productionLogoUrl} alt="Logo" className="h-6 max-w-[60px] object-contain rounded bg-white/80 px-1" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: sign.symbolSvg.replace('width="80"', 'width="20"').replace('height="80"', 'height="20"') }} />
        )}
      </div>
      <div className="font-extrabold text-xs leading-snug uppercase">{sign.title}</div>
      <div className="text-[11px] font-medium opacity-90 leading-tight">{sign.subtitle}</div>
    </div>
    <button
      type="button"
      onClick={() => printHsHtml(buildSignHtml(sign, productionLogoUrl))}
      className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
    >
      <Printer className="w-3.5 h-3.5 text-amber-400" />
      <span>Print Poster</span>
    </button>
  </div>
);
