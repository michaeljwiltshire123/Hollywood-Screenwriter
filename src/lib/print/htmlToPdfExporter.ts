import { jsPDF } from 'jspdf';
import { prepareLogoForExport } from '../../components/production/health_safety/hsLogoHelper';

async function svgToPngDataUrl(svgEl: SVGElement): Promise<{ dataUrl: string; w: number; h: number } | null> {
  try {
    const clone = svgEl.cloneNode(true) as SVGElement;
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
    const res = await prepareLogoForExport(url, 72, 72);
    return res ? { dataUrl: res.pngDataUrl, w: res.widthPt, h: res.heightPt } : null;
  } catch {
    return null;
  }
}

export async function exportHtmlToPdf(htmlContent: string, title = 'Document'): Promise<void> {
  const isLandscape = /size:\s*[^;]*landscape/i.test(htmlContent);
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: isLandscape ? 'landscape' : 'portrait' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - 80;
  let y = 44;

  const newPage = () => { doc.addPage(); y = 44; };
  const ensure = (h: number) => { if (y + h > pageH - 40) newPage(); };
  const writeText = (txt: string, size = 10, bold = false, gap = 4) => {
    const clean = txt.replace(/\s+/g, ' ').trim();
    if (!clean) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(clean, maxW) as string[];
    ensure(lines.length * (size + 3) + gap);
    doc.text(lines, 40, y);
    y += lines.length * (size + 3) + gap;
  };

  const parsed = new DOMParser().parseFromString(htmlContent, 'text/html');
  const walk = async (node: Element, isFirstPageRoot = false): Promise<void> => {
    const tag = node.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style') return;
    if ((node.classList.contains('pb') || (node.classList.contains('rf-page') && !isFirstPageRoot)) && y > 60) newPage();

    if (tag === 'img') {
      const logo = await prepareLogoForExport(node.getAttribute('src') || undefined, 110, 40);
      if (logo) { ensure(logo.heightPt + 8); doc.addImage(logo.pngDataUrl, 'PNG', 40, y, logo.widthPt, logo.heightPt); y += logo.heightPt + 8; }
      return;
    }
    if (tag === 'svg') {
      const png = await svgToPngDataUrl(node as unknown as SVGElement);
      if (png) { ensure(png.h + 8); doc.addImage(png.dataUrl, 'PNG', 40, y, png.w, png.h); y += png.h + 8; }
      return;
    }
    if (tag === 'h1') { writeText(node.textContent || '', 15, true, 8); return; }
    if (tag === 'h2' || tag === 'h3') { y += 4; writeText(node.textContent || '', 12, true, 6); return; }
    if (tag === 'table') {
      Array.from(node.querySelectorAll('tr')).forEach((tr, rIdx) => {
        const cells = Array.from(tr.children).map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim());
        writeText(cells.join('  |  '), 9, rIdx === 0, 3);
      });
      y += 6;
      return;
    }
    if (node.classList.contains('legal-text') || node.classList.contains('notes')) {
      (node.textContent || '').split('\n').forEach((p) => writeText(p, 9.5, false, 6));
      return;
    }
    if (node.children.length === 0) {
      writeText(node.textContent || '', 10, tag === 'strong' || tag === 'b', 4);
      return;
    }
    const directText = Array.from(node.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent || '').join(' ').trim();
    if (directText && node.children.length <= 2 && tag !== 'div') { writeText(node.textContent || '', 10, false, 4); return; }
    let firstRf = true;
    for (const child of Array.from(node.children)) {
      await walk(child, child.classList.contains('rf-page') ? firstRf : false);
      if (child.classList.contains('rf-page')) firstRf = false;
    }
  };

  await walk(parsed.body, true);
  const slug = (title || 'Document').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  doc.save(`${slug || 'Document'}.pdf`);
}
