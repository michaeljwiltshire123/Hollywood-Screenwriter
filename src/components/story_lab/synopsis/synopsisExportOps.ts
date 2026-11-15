export const copyPitchToClipboard = async (
  scriptTitle: string, comps: string, loglineText: string, synopsisText: string, onCopied: () => void,
) => {
  const compHeader = comps.trim() ? `COMPS: ${comps}\n\n` : '';
  const payload = `TITLE: ${scriptTitle}\n${compHeader}LOGLINE:\n${loglineText}\n\nSYNOPSIS:\n${synopsisText}`;
  try {
    await navigator.clipboard.writeText(payload);
    onCopied();
  } catch {
    /* ignore clipboard permissions failure */
  }
};

export const printPitchDocument = (
  scriptTitle: string, targetLength: number, comps: string, loglineText: string, synopsisText: string, words: number,
) => {
  const w = window.open('', '_blank');
  if (!w) return;
  const compHtml = comps.trim() ? `<p><b>Comps:</b> ${comps}</p>` : '';
  w.document.write(
    `<html><head><title>${scriptTitle} - Synopsis</title><style>body{font-family:serif;padding:40px;max-width:700px;margin:auto;line-height:1.6;color:#111}h1{font-size:22px}h3{color:#555;margin-top:20px}.logline{font-style:italic;margin-bottom:20px;padding:12px;background:#f9f9f9;border-left:4px solid #333}</style></head><body><h1>${scriptTitle}</h1><p><b>Target Runtime:</b> ${targetLength} minutes</p>${compHtml}<h3>Logline</h3><div class="logline">${loglineText || 'No logline provided.'}</div><h3>Synopsis (${words} words)</h3><p>${synopsisText.replace(/\n/g, '<br/>')}</p></body></html>`
  );
  w.document.close();
  w.print();
};

export const emailPitchDraft = (
  scriptTitle: string, comps: string, loglineText: string, synopsisText: string,
) => {
  const subject = encodeURIComponent(`Pitch Synopsis: ${scriptTitle}`);
  const compStr = comps.trim() ? `COMPS: ${comps}\n\n` : '';
  const body = encodeURIComponent(`${compStr}LOGLINE:\n${loglineText}\n\nSYNOPSIS:\n${synopsisText}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

export const downloadPitchWordDoc = (
  scriptTitle: string, targetLength: number, comps: string, loglineText: string, synopsisText: string,
) => {
  const compHtml = comps.trim() ? `<p><b>Comps:</b> ${comps}</p>` : '';
  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/1999/xhtml'><head><title>${scriptTitle}</title></head><body><h1>${scriptTitle}</h1><p><b>Target Runtime:</b> ${targetLength} minutes</p>${compHtml}<h3>Logline</h3><p><em>${loglineText || ''}</em></p><h3>Synopsis</h3><p>${synopsisText.replace(/\n/g, '<br/>')}</p></body></html>`;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${scriptTitle.toLowerCase().replace(/\s+/g, '_')}_synopsis.doc`;
  a.click();
  URL.revokeObjectURL(url);
};
