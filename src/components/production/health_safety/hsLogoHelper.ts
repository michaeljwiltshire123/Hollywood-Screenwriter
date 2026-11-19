export interface PreparedLogo {
  pngDataUrl: string;
  pngBytes: Uint8Array;
  widthPt: number;
  heightPt: number;
  widthPx: number;
  heightPx: number;
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) {
    bytes[i] = bin.charCodeAt(i);
  }
  return bytes;
}

export function prepareLogoForExport(
  logoUrl?: string,
  maxWidthPt = 110,
  maxHeightPt = 38
): Promise<PreparedLogo | null> {
  if (!logoUrl) return Promise.resolve(null);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const natW = img.naturalWidth || 200;
        const natH = img.naturalHeight || 80;
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(natW, 600);
        canvas.height = Math.max(1, Math.round((canvas.width / natW) * natH));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngDataUrl = canvas.toDataURL('image/png');
        const scale = Math.min(maxWidthPt / natW, maxHeightPt / natH, 1);
        const widthPt = Math.max(12, Math.round(natW * scale));
        const heightPt = Math.max(12, Math.round(natH * scale));
        const pxScale = Math.min(120 / natW, 44 / natH, 1);
        resolve({
          pngDataUrl,
          pngBytes: dataUrlToBytes(pngDataUrl),
          widthPt,
          heightPt,
          widthPx: Math.max(16, Math.round(natW * pxScale)),
          heightPx: Math.max(16, Math.round(natH * pxScale)),
        });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });
}
