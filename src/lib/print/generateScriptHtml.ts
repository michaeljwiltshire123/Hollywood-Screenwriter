import { ScreenplayDocument, ScreenplayElement } from '../../types';
import { PRINT_SCREENPLAY_CSS } from './printStyles';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderElementHtml(elem: ScreenplayElement): string {
  const content = escapeHtml(elem.content || '');
  if (!content && elem.type !== 'SCENE HEADING') return '';

  switch (elem.type) {
    case 'SCENE HEADING':
      return `<div class="scene-heading">${content}</div>`;
    case 'CHARACTER':
      return `<div class="character">${content}</div>`;
    case 'PARENTICAL': {
      const formatted = content.startsWith('(') && content.endsWith(')') ? content : `(${content})`;
      return `<div class="parentical">${formatted}</div>`;
    }
    case 'DIALOGUE':
      return `<div class="dialogue">${content}</div>`;
    case 'TRANSITION':
      return `<div class="transition">${content}</div>`;
    case 'SHOT':
      return `<div class="shot">${content}</div>`;
    case 'NOTE':
      return `<div class="note">[[ NOTE: ${content} ]]</div>`;
    case 'ACTION':
    default:
      return `<div class="action">${content}</div>`;
  }
}

export function generateScriptHtml(script: ScreenplayDocument): string {
  const tp = script.titlePage;
  const title = escapeHtml(tp?.title || script.title || 'UNTITLED SCREENPLAY');
  const credit = escapeHtml(tp?.credit || 'Written by');
  const author = escapeHtml(tp?.author || '');
  const source = escapeHtml(tp?.source || '');
  const contact = escapeHtml(tp?.contact || '');
  const date = escapeHtml(tp?.date || '');
  const draftColor = escapeHtml(tp?.draftColor || 'White Draft');

  const elementsHtml = script.elements.map(renderElementHtml).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>${PRINT_SCREENPLAY_CSS}</style>
</head>
<body>
  <div class="title-page-container">
    <div class="title-page-center">
      <div class="title-main">${title}</div>
      <div class="title-credit">${credit}</div>
      ${author ? `<div class="title-author">${author}</div>` : ''}
      ${source ? `<div class="title-source">${source}</div>` : ''}
    </div>
    <div class="title-page-bottom">
      <div class="title-contact">${contact}</div>
      <div class="title-meta-right">
        ${date ? `<div>${date}</div>` : ''}
        ${draftColor ? `<div>${draftColor}</div>` : ''}
      </div>
    </div>
  </div>
  <div class="script-body">
    ${elementsHtml}
  </div>
</body>
</html>`;
}
