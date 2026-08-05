import { ElementType, ScreenplayElement, ScreenplayDocument, SceneInfo, CharacterInfo } from '../types';
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from 'docx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Generate Word Document (.docx) export for screenplay
 */
export async function generateDocxExport(script: ScreenplayDocument): Promise<Blob> {
  const children: any[] = [];

  if (script.titlePage) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: script.titlePage.title || script.title, bold: true, size: 32, font: 'Courier New' })],
        alignment: 'center' as any,
        spacing: { after: 200, before: 400 },
      }),
      new Paragraph({
        children: [new TextRun({ text: `by\n${script.titlePage.author || 'Author'}`, size: 24, font: 'Courier New' })],
        alignment: 'center' as any,
        spacing: { after: 400 },
      }),
      new Paragraph({ text: '\n\n' })
    );
  }

  script.elements.forEach((el) => {
    let bold = false;
    let italic = false;
    let indentLeft = 0;
    let alignment = 'left';

    if (el.type === 'SCENE HEADING') {
      bold = true;
    } else if (el.type === 'CHARACTER') {
      bold = true;
      indentLeft = 1440; // 1 inch
    } else if (el.type === 'DIALOGUE') {
      indentLeft = 720; // 0.5 inch
    } else if (el.type === 'PARENTICAL') {
      italic = true;
      indentLeft = 1000;
    } else if (el.type === 'TRANSITION') {
      bold = true;
      alignment = 'right';
    }

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: el.type === 'SCENE HEADING' || el.type === 'CHARACTER' || el.type === 'TRANSITION' ? el.content.toUpperCase() : el.content,
            font: 'Courier New',
            size: 24,
            bold,
            italics: italic,
          }),
        ],
        indent: indentLeft ? { left: indentLeft } : undefined,
        alignment: alignment as any,
        spacing: { after: 120, before: 60 },
      })
    );
  });

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBlob(doc);
}

/**
 * Parse uploaded file (.pdf, .docx, .txt, .fountain, .fdx, .json)
 * Handles PDF text-smashing sorting by coordinate (Y descending, X ascending)
 */
export async function parseUploadedFile(file: File): Promise<ScreenplayElement[]> {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items = textContent.items.map((item: any) => ({
        str: item.str,
        x: item.transform[4],
        y: item.transform[5]
      }));
      // Sort items by Y descending (top to bottom), then X ascending (left to right)
      items.sort((a, b) => {
        if (Math.abs(a.y - b.y) > 5) {
          return b.y - a.y;
        }
        return a.x - b.x;
      });
      let lastY = null;
      let lineStr = '';
      for (const it of items) {
        if (lastY !== null && Math.abs(it.y - lastY) > 5) {
          fullText += lineStr + '\n';
          lineStr = it.str;
        } else {
          lineStr += (lineStr ? ' ' : '') + it.str;
        }
        lastY = it.y;
      }
      if (lineStr) fullText += lineStr + '\n';
    }
    return parseScriptText(fullText);
  } else if (fileName.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return parseScriptText(result.value);
  } else if (fileName.endsWith('.json')) {
    const text = await file.text();
    try {
      const doc = JSON.parse(text);
      if (doc.elements && Array.isArray(doc.elements)) {
        return doc.elements;
      }
    } catch (e) {}
    return parseScriptText(text);
  } else {
    const text = await file.text();
    return parseScriptText(text);
  }
}

/**
 * Predictive Flow Engine
 * Determines next element type based on current element type and key event
 */
export function getPredictiveNextElement(
  currentType: ElementType,
  currentContent: string,
  isDoubleEnter: boolean = false
): ElementType {
  const trimmed = currentContent.trim();

  if (isDoubleEnter || trimmed === '') {
    return 'ACTION';
  }

  switch (currentType) {
    case 'CHARACTER':
      return 'DIALOGUE';
    case 'DIALOGUE':
      return 'CHARACTER'; // Hitting Enter after dialogue defaults to next CHARACTER or ACTION if empty
    case 'PARENTICAL':
      return 'DIALOGUE';
    case 'SCENE HEADING':
      return 'ACTION';
    case 'TRANSITION':
      return 'SCENE HEADING';
    case 'SHOT':
      return 'ACTION';
    case 'NOTE':
      return 'ACTION';
    case 'ACTION':
    default:
      return 'ACTION';
  }
}

/**
 * Cycles element type on Tab key press
 */
export function getNextElementTypeOnTab(currentType: ElementType, reverse: boolean = false): ElementType {
  const order: ElementType[] = [
    'ACTION',
    'CHARACTER',
    'PARENTICAL',
    'DIALOGUE',
    'TRANSITION',
    'SCENE HEADING',
    'SHOT',
    'NOTE',
  ];

  const index = order.indexOf(currentType);
  if (index === -1) return 'ACTION';

  if (reverse) {
    const prevIndex = (index - 1 + order.length) % order.length;
    return order[prevIndex];
  } else {
    const nextIndex = (index + 1) % order.length;
    return order[nextIndex];
  }
}

/**
 * Standard Hollywood Visual Formatting Specs
 * Pure Courier 12pt visual mapping
 */
export function getElementStyles(type: ElementType): {
  containerClass: string;
  textTransform: 'uppercase' | 'none' | 'capitalize';
  label: string;
  placeholder: string;
} {
  switch (type) {
    case 'SCENE HEADING':
      return {
        containerClass: 'font-bold uppercase tracking-wider text-black pl-0 pr-0 my-5 text-left',
        textTransform: 'uppercase',
        label: 'SCENE HEADING',
        placeholder: 'INT. LOCATION - DAY',
      };
    case 'ACTION':
      return {
        containerClass: 'text-gray-900 pl-0 pr-0 my-2 text-left leading-relaxed',
        textTransform: 'none',
        label: 'ACTION',
        placeholder: 'Describe action, setting, or characters...',
      };
    case 'CHARACTER':
      return {
        containerClass: 'font-bold uppercase text-black mt-4 mb-0 text-center sm:text-left sm:ml-[37%] max-w-[40%]',
        textTransform: 'uppercase',
        label: 'CHARACTER',
        placeholder: 'CHARACTER NAME',
      };
    case 'PARENTICAL':
      return {
        containerClass: 'italic text-gray-800 my-0 text-center sm:text-left sm:ml-[30%] max-w-[35%]',
        textTransform: 'none',
        label: 'PARENTICAL',
        placeholder: '(parenthetical direction)',
      };
    case 'DIALOGUE':
      return {
        containerClass: 'text-gray-900 mb-3 mt-0 text-center sm:text-left sm:ml-[25%] max-w-[50%] leading-relaxed',
        textTransform: 'none',
        label: 'DIALOGUE',
        placeholder: 'Character dialogue...',
      };
    case 'TRANSITION':
      return {
        containerClass: 'font-bold uppercase text-black my-4 text-right pr-4',
        textTransform: 'uppercase',
        label: 'TRANSITION',
        placeholder: 'CUT TO:',
      };
    case 'SHOT':
      return {
        containerClass: 'font-bold uppercase text-gray-900 my-3 text-left pl-0',
        textTransform: 'uppercase',
        label: 'SHOT',
        placeholder: 'ANGLE ON / CLOSE UP ON',
      };
    case 'NOTE':
      return {
        containerClass: 'bg-amber-50 text-amber-900 border-l-4 border-amber-400 p-2 my-2 rounded-r italic font-sans text-sm',
        textTransform: 'none',
        label: 'NOTE',
        placeholder: 'Writer note or comment...',
      };
  }
}

/**
 * Scene Navigator & Structure Extractor
 */
export function extractScenes(elements: ScreenplayElement[]): SceneInfo[] {
  const scenes: SceneInfo[] = [];
  let currentScene: SceneInfo | null = null;
  let sceneCounter = 1;

  elements.forEach((elem, idx) => {
    if (elem.type === 'SCENE HEADING') {
      if (currentScene) {
        scenes.push(currentScene);
      }
      currentScene = {
        id: elem.id,
        heading: elem.content || 'UNTITLED SCENE',
        sceneNumber: elem.sceneNumber || `${sceneCounter++}`,
        elementIndex: idx,
        lengthLines: 1,
        characters: [],
      };
    } else if (currentScene) {
      currentScene.lengthLines += 1;
      if (elem.type === 'CHARACTER' && elem.content.trim()) {
        const charName = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
        if (charName && !currentScene.characters.includes(charName)) {
          currentScene.characters.push(charName);
        }
      }
    }
  });

  if (currentScene) {
    scenes.push(currentScene);
  }

  return scenes;
}

/**
 * Character Bible & Speaking Breakdown
 */
export function extractCharacters(elements: ScreenplayElement[]): CharacterInfo[] {
  const charMap: Record<string, { count: number; words: number; firstScene: string }> = {};
  let currentSceneName = 'START';
  let totalDialogueLines = 0;

  elements.forEach((elem) => {
    if (elem.type === 'SCENE HEADING') {
      currentSceneName = elem.content || 'UNTITLED SCENE';
    } else if (elem.type === 'CHARACTER' && elem.content.trim()) {
      const charName = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
      if (charName) {
        if (!charMap[charName]) {
          charMap[charName] = { count: 0, words: 0, firstScene: currentSceneName };
        }
        charMap[charName].count += 1;
        totalDialogueLines += 1;
      }
    } else if (elem.type === 'DIALOGUE' && elem.content.trim()) {
      // Add word count to last character
      const lastChar = Object.keys(charMap)[Object.keys(charMap).length - 1];
      if (lastChar) {
        const words = elem.content.trim().split(/\s+/).length;
        charMap[lastChar].words += words;
      }
    }
  });

  return Object.entries(charMap)
    .map(([name, data]) => ({
      name,
      dialogueCount: data.count,
      wordCount: data.words,
      firstAppearedScene: data.firstScene,
      percentage: totalDialogueLines > 0 ? Math.round((data.count / totalDialogueLines) * 100) : 0,
    }))
    .sort((a, b) => b.dialogueCount - a.dialogueCount);
}

/**
 * Calculate dynamic page count based on industry standards
 * 1 Page = ~54 lines or ~220 words
 */
export function calculatePageEstimate(elements: ScreenplayElement[]): { pages: number; totalWords: number; lineCount: number } {
  let lineCount = 0;
  let totalWords = 0;

  elements.forEach((elem) => {
    const words = elem.content ? elem.content.trim().split(/\s+/).filter(Boolean).length : 0;
    totalWords += words;

    // Weight lines based on element spacing and length
    const rawLines = Math.max(1, Math.ceil((elem.content || '').length / 60));
    switch (elem.type) {
      case 'SCENE HEADING':
        lineCount += rawLines + 2; // Spacing before scene
        break;
      case 'CHARACTER':
        lineCount += 2;
        break;
      case 'DIALOGUE':
        lineCount += Math.max(1, Math.ceil((elem.content || '').length / 35));
        break;
      case 'TRANSITION':
        lineCount += 3;
        break;
      default:
        lineCount += rawLines + 1;
        break;
    }
  });

  const pages = Math.max(1, Number((lineCount / 54).toFixed(1)));
  return { pages, totalWords, lineCount };
}

/**
 * Intelligent Text / Fountain / FDX Parser
 * Snaps uploaded text into structured ScreenplayElements, preserving Dual Dialogue and complex parentheticals.
 */
export function parseScriptText(rawText: string): ScreenplayElement[] {
  const lines = rawText.split(/\r?\n/);
  const elements: ScreenplayElement[] = [];
  let lastType: ElementType = 'ACTION';
  let sceneCounter = 1;

  const speechVerbsPattern = '(?:said|shouted|asked|replied|whispered|exclaimed|muttered|yelled|cried|spoke|screamed|added|continued)';
  const charVerbRegex = new RegExp(`^([A-Za-z0-9\\s]{2,25})\\s+${speechVerbsPattern}(?:,|:)?\\s*"?([^"]*)"?$`, 'i');
  const verbCharRegex = new RegExp(`^${speechVerbsPattern}\\s+([A-Za-z0-9\\s]{2,25})(?:,|:)?\\s*"?([^"]*)"?$`, 'i');
  const locationKeywordsRegex = /^(INT|EXT|INT\/EXT|I\/E|BEDROOM|STREET|OFFICE|KITCHEN|LIVING ROOM|HALLWAY|BASEMENT|PARK|LAB|ROOFTOP|WAREHOUSE)\b/i;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    // Detect Dual Dialogue character marker (Fountain standard caret '^')
    let isDualDialogue = false;
    if (line.endsWith('^') || line.startsWith('^')) {
      isDualDialogue = true;
      line = line.replace(/^[\^]|[\^]$/g, '').trim();
    }

    // 1. Detect Scene Heading with Location Scouting (BEDROOM, STREET, OFFICE, KITCHEN, etc.)
    if (locationKeywordsRegex.test(line)) {
      let headingText = line.toUpperCase();
      if (!/^(INT|EXT|INT\/EXT|I\/E)/i.test(headingText)) {
        headingText = `INT. ${headingText}`;
      }
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'SCENE HEADING',
        content: headingText,
        sceneNumber: `${sceneCounter++}`,
      });
      lastType = 'SCENE HEADING';
      continue;
    }

    // 2. Razor-Sharp Heuristic Verb Detection: [Name] said "Dialogue" or shouted [Name] "Dialogue"
    const charVerbMatch = line.match(charVerbRegex);
    const verbCharMatch = !charVerbMatch ? line.match(verbCharRegex) : null;

    if (charVerbMatch && charVerbMatch[2]?.trim()) {
      const charName = charVerbMatch[1].trim().toUpperCase();
      const dialogueText = charVerbMatch[2].trim().replace(/^"/, '').replace(/"$/, '');

      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'CHARACTER',
        content: isDualDialogue ? `${charName} (DUAL)` : charName,
      });
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'DIALOGUE',
        content: dialogueText,
      });
      lastType = 'DIALOGUE';
      continue;
    }

    if (verbCharMatch && verbCharMatch[2]?.trim()) {
      const charName = verbCharMatch[1].trim().toUpperCase();
      const dialogueText = verbCharMatch[2].trim().replace(/^"/, '').replace(/"$/, '');

      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'CHARACTER',
        content: isDualDialogue ? `${charName} (DUAL)` : charName,
      });
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'DIALOGUE',
        content: dialogueText,
      });
      lastType = 'DIALOGUE';
      continue;
    }

    // Detect Transition
    if (/^(CUT TO:|FADE IN:|FADE OUT:|SMASH CUT TO:|DISSOLVE TO:)$/i.test(line) || line.startsWith('>')) {
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'TRANSITION',
        content: line.replace(/^>/, '').trim().toUpperCase(),
      });
      lastType = 'TRANSITION';
      continue;
    }

    // Detect Parenthetical
    if ((line.startsWith('(') && line.endsWith(')')) || (line.startsWith('(') && lastType === 'CHARACTER')) {
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'PARENTICAL',
        content: line,
      });
      lastType = 'PARENTICAL';
      continue;
    }

    // Detect Character (ALL CAPS line)
    const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line);
    if (
      isAllCaps &&
      line.length < 35 &&
      !line.endsWith('.') &&
      (lastType === 'ACTION' || lastType === 'SCENE HEADING' || lastType === 'DIALOGUE')
    ) {
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'CHARACTER',
        content: isDualDialogue ? `${line} (DUAL)` : line,
      });
      lastType = 'CHARACTER';
      continue;
    }

    // If last line was CHARACTER or PARENTICAL, this is DIALOGUE
    if (lastType === 'CHARACTER' || lastType === 'PARENTICAL') {
      elements.push({
        id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: 'DIALOGUE',
        content: line,
      });
      lastType = 'DIALOGUE';
      continue;
    }

    // Default to ACTION
    elements.push({
      id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'ACTION',
      content: line,
    });
    lastType = 'ACTION';
  }

  return elements.length > 0
    ? elements
    : [
        {
          id: `elem-${Date.now()}`,
          type: 'ACTION',
          content: rawText,
        },
      ];
}
