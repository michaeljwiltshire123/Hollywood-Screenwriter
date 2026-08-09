import React, { useRef, useEffect, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { ScreenplayDocument, ScreenplayElement, ElementType, CursorPosition } from '../types';
import { getPredictiveNextElement, getNextElementTypeOnTab, getElementStyles, extractCharacters } from '../lib/screenplayUtils';
import { Plus, Trash2, Tag, MoveUp, MoveDown, User, StickyNote, Volume2, Shirt, Sparkles, X, FileText } from 'lucide-react';

interface ScreenplayEditorProps {
  script: ScreenplayDocument;
  onChangeScript: (updatedScript: ScreenplayDocument) => void;
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
  activeType: ElementType;
  setActiveType: (type: ElementType) => void;
  cursorPos: CursorPosition | null;
  setCursorPos: (pos: CursorPosition | null) => void;
  onJumpRef?: (fn: (index: number) => void) => void;
  editorFont?: 'Courier Prime' | 'Courier New';
}

export const ScreenplayEditor: React.FC<ScreenplayEditorProps> = ({
  script,
  onChangeScript,
  activeElementId,
  setActiveElementId,
  activeType,
  setActiveType,
  cursorPos,
  setCursorPos,
  onJumpRef,
  editorFont = 'Courier Prime',
}) => {
  const elementRefs = useRef<{ [id: string]: HTMLDivElement | null }>({});
  const isComposingRef = useRef(false);
  const elements = script?.elements || [];

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    selectedText: string;
    elementId: string;
  } | null>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const allCharacterNames = useMemo(() => {
    return extractCharacters(elements).map((c) => c.name);
  }, [elements]);

  // Jump to specific element by index
  const jumpToElement = useCallback((index: number) => {
    const elem = elements[index];
    if (elem) {
      setActiveElementId(elem.id);
      setActiveType(elem.type);
      const targetDom = elementRefs.current[elem.id];
      if (targetDom) {
        targetDom.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetDom.focus();
      }
    }
  }, [elements, setActiveElementId, setActiveType]);

  useEffect(() => {
    if (onJumpRef) {
      onJumpRef(jumpToElement);
    }
  }, [onJumpRef, jumpToElement]);

  /**
   * MATH GUARDS: Restore caret selection offset cleanly
   */
  useLayoutEffect(() => {
    if (!cursorPos || !cursorPos.elementId) return;
    const domNode = elementRefs.current[cursorPos.elementId];
    if (!domNode) return;

    try {
      const selection = window.getSelection();
      if (!selection) return;

      let targetNode: Node = domNode;
      if (domNode.firstChild) {
        targetNode = domNode.firstChild;
      }

      const maxLen = targetNode.textContent ? targetNode.textContent.length : 0;
      const safeOffset = Math.min(Math.max(0, cursorPos.offset), maxLen);

      const range = document.createRange();
      range.setStart(targetNode, safeOffset);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {
      // Math guard fallback
    }
  }, [cursorPos, script.elements]);

  /**
   * Helper to get current caret character offset inside contenteditable
   */
  const getCaretOffset = (element: HTMLElement): number => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  /**
   * Content change handler per element
   */
  const handleContentChange = (id: string, newText: string) => {
    const dom = elementRefs.current[id];
    const offset = dom ? getCaretOffset(dom) : newText.length;

    const updatedElements = script.elements.map((e) => {
      if (e.id === id) {
        return { ...e, content: newText };
      }
      return e;
    });

    setCursorPos({ elementId: id, offset });
    onChangeScript({
      ...script,
      elements: updatedElements,
      updatedAt: new Date().toISOString(),
    });
  };

  /**
   * Element Type change handler
   */
  const handleTypeChange = (id: string, newType: ElementType) => {
    const updatedElements = script.elements.map((e) => {
      if (e.id === id) {
        return { ...e, type: newType };
      }
      return e;
    });

    setActiveType(newType);
    onChangeScript({
      ...script,
      elements: updatedElements,
      updatedAt: new Date().toISOString(),
    });
  };

  /**
   * Add a new element
   */
  const handleAddElementAfter = (targetId: string, preferredType?: ElementType) => {
    const index = script.elements.findIndex((e) => e.id === targetId);
    if (index === -1) return;

    const currentElem = script.elements[index];
    const nextType = preferredType || getPredictiveNextElement(currentElem.type, currentElem.content);
    const newId = `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newElem: ScreenplayElement = {
      id: newId,
      type: nextType,
      content: '',
      sceneNumber: nextType === 'SCENE HEADING' ? `${script.elements.filter((e) => e.type === 'SCENE HEADING').length + 1}` : undefined,
    };

    const newElements = [...script.elements];
    newElements.splice(index + 1, 0, newElem);

    setActiveElementId(newId);
    setActiveType(nextType);
    setCursorPos({ elementId: newId, offset: 0 });

    onChangeScript({
      ...script,
      elements: newElements,
      updatedAt: new Date().toISOString(),
    });
  };

  /**
   * Delete element
   */
  const handleDeleteElement = (id: string) => {
    if (script.elements.length <= 1) return; // Keep at least 1 element
    const index = script.elements.findIndex((e) => e.id === id);
    if (index === -1) return;

    const prevElem = script.elements[index - 1] || script.elements[index + 1];
    const newElements = script.elements.filter((e) => e.id !== id);

    if (prevElem) {
      setActiveElementId(prevElem.id);
      setActiveType(prevElem.type);
      setCursorPos({ elementId: prevElem.id, offset: prevElem.content.length });
    }

    onChangeScript({
      ...script,
      elements: newElements,
      updatedAt: new Date().toISOString(),
    });
  };

  /**
   * Keydown Handler: Predictive Flow Engine & Math Guards
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, elem: ScreenplayElement, idx: number) => {
    const dom = elementRefs.current[elem.id];
    if (!dom) return;

    const offset = getCaretOffset(dom);
    const textLen = elem.content.length;

    // Alt + 1..8 shortcuts for fast element typing
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      const keyMap: { [key: string]: ElementType } = {
        '1': 'SCENE HEADING',
        '2': 'ACTION',
        '3': 'CHARACTER',
        '4': 'PARENTICAL',
        '5': 'DIALOGUE',
        '6': 'TRANSITION',
        '7': 'SHOT',
        '8': 'NOTE',
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        handleTypeChange(elem.id, keyMap[e.key]);
        return;
      }
    }

    // TAB / SHIFT+TAB: Cycle Element Type
    if (e.key === 'Tab') {
      e.preventDefault();
      const nextType = getNextElementTypeOnTab(elem.type, e.shiftKey);
      handleTypeChange(elem.id, nextType);
      setCursorPos({ elementId: elem.id, offset });
      return;
    }

    // ENTER: Predictive Next Element / Split Line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      // Case 1: Empty element -> revert to ACTION or cycle back
      if (elem.content.trim() === '') {
        if (elem.type !== 'ACTION') {
          handleTypeChange(elem.id, 'ACTION');
          setCursorPos({ elementId: elem.id, offset: 0 });
        } else {
          handleAddElementAfter(elem.id, 'ACTION');
        }
        return;
      }

      // Case 2: Cursor at end of element -> Predictive Next Element
      if (offset >= textLen) {
        const nextType = getPredictiveNextElement(elem.type, elem.content);
        handleAddElementAfter(elem.id, nextType);
        return;
      }

      // Case 3: Cursor in middle of text -> Split element into two
      const leftText = elem.content.substring(0, offset);
      const rightText = elem.content.substring(offset);

      const nextType = getPredictiveNextElement(elem.type, leftText);
      const newId = `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const newElem: ScreenplayElement = {
        id: newId,
        type: nextType,
        content: rightText,
      };

      const newElements = [...script.elements];
      newElements[idx] = { ...elem, content: leftText };
      newElements.splice(idx + 1, 0, newElem);

      setActiveElementId(newId);
      setActiveType(nextType);
      setCursorPos({ elementId: newId, offset: 0 });

      onChangeScript({
        ...script,
        elements: newElements,
        updatedAt: new Date().toISOString(),
      });
      return;
    }

    // BACKSPACE at position 0: Merge into preceding element
    if (e.key === 'Backspace' && offset === 0) {
      if (idx > 0) {
        e.preventDefault();
        const prevElem = script.elements[idx - 1];
        const joinOffset = prevElem.content.length;
        const mergedContent = prevElem.content + elem.content;

        const newElements = [...script.elements];
        newElements[idx - 1] = { ...prevElem, content: mergedContent };
        newElements.splice(idx, 1);

        setActiveElementId(prevElem.id);
        setActiveType(prevElem.type);
        setCursorPos({ elementId: prevElem.id, offset: joinOffset });

        onChangeScript({
          ...script,
          elements: newElements,
          updatedAt: new Date().toISOString(),
        });
      }
      return;
    }

    // ARROW UP / DOWN Navigation
    if (e.key === 'ArrowUp' && offset === 0 && idx > 0) {
      e.preventDefault();
      const prevElem = script.elements[idx - 1];
      setActiveElementId(prevElem.id);
      setActiveType(prevElem.type);
      setCursorPos({ elementId: prevElem.id, offset: prevElem.content.length });
      return;
    }

    if (e.key === 'ArrowDown' && offset >= textLen && idx < script.elements.length - 1) {
      e.preventDefault();
      const nextElem = script.elements[idx + 1];
      setActiveElementId(nextElem.id);
      setActiveType(nextElem.type);
      setCursorPos({ elementId: nextElem.id, offset: 0 });
      return;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, elem: ScreenplayElement) => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    if (selectedText) {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        selectedText,
        elementId: elem.id,
      });
    }
  };

  const handleAddWriterNote = () => {
    if (!contextMenu) return;
    const { elementId, selectedText } = contextMenu;
    const idx = elements.findIndex((e) => e.id === elementId);
    if (idx === -1) return;

    const noteId = `elem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newNoteElem: ScreenplayElement = {
      id: noteId,
      type: 'NOTE',
      content: `[Writer Note]: ${selectedText}`,
    };

    const newElements = [...elements];
    newElements.splice(idx + 1, 0, newNoteElem);

    const existingNotes = script.productionNotes || '';
    const updatedProdNotes = existingNotes
      ? `${existingNotes}\n• ${selectedText}`
      : `• ${selectedText}`;

    onChangeScript({
      ...script,
      elements: newElements,
      productionNotes: updatedProdNotes,
      updatedAt: new Date().toISOString(),
    });
    setContextMenu(null);
  };

  const handleTagProp = () => {
    if (!contextMenu) return;
    const { elementId, selectedText } = contextMenu;
    const idx = elements.findIndex((e) => e.id === elementId);
    if (idx === -1) return;

    let sceneStart = idx;
    while (sceneStart > 0 && elements[sceneStart].type !== 'SCENE HEADING') {
      sceneStart--;
    }
    const sceneHeadingElem = elements[sceneStart];
    const sceneHeadingId = sceneHeadingElem.id;

    const existingShots = [...(script.shots || [])];
    const shotIdx = existingShots.findIndex((s) => s.sceneHeadingId === sceneHeadingId);

    if (shotIdx !== -1) {
      const currentGear = existingShots[shotIdx].equipment || '';
      existingShots[shotIdx] = {
        ...existingShots[shotIdx],
        equipment: currentGear ? `${currentGear}, ${selectedText}` : selectedText,
      };
    } else {
      existingShots.push({
        id: `shot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sceneHeadingId,
        shotNumber: `${existingShots.length + 1}A`,
        shotType: 'MEDIUM',
        angle: 'Eye Level',
        lens: '50mm',
        equipment: selectedText,
        estimatedTimeMin: 15,
      });
    }

    const existingNotes = script.productionNotes || '';
    const updatedProdNotes = existingNotes
      ? `${existingNotes}\n• [Prop]: ${selectedText}`
      : `• [Prop]: ${selectedText}`;

    onChangeScript({
      ...script,
      shots: existingShots,
      productionNotes: updatedProdNotes,
      updatedAt: new Date().toISOString(),
    });
    setContextMenu(null);
  };

  const handleTagWardrobe = () => {
    if (!contextMenu) return;
    const { elementId, selectedText } = contextMenu;
    const idx = elements.findIndex((e) => e.id === elementId);
    if (idx === -1) return;

    let sceneStart = idx;
    while (sceneStart > 0 && elements[sceneStart].type !== 'SCENE HEADING') {
      sceneStart--;
    }
    let sceneEnd = idx;
    while (sceneEnd < elements.length - 1 && elements[sceneEnd + 1].type !== 'SCENE HEADING') {
      sceneEnd++;
    }

    let firstCharName = '';
    for (let i = sceneStart; i <= sceneEnd; i++) {
      if (elements[i].type === 'CHARACTER') {
        firstCharName = elements[i].content
          .replace(/\s*\(.*?\)/g, '')
          .replace(/DUAL/gi, '')
          .trim()
          .toUpperCase();
        if (firstCharName) break;
      }
    }

    const bibles = { ...(script.characterBibles || {}) };
    const targetChar = firstCharName || Object.keys(bibles)[0] || 'CHARACTER';

    bibles[targetChar] = {
      ...(bibles[targetChar] || { age: '', appearance: '', attitude: '', coreMotivation: '' }),
      appearance: bibles[targetChar]?.appearance
        ? `${bibles[targetChar].appearance}, ${selectedText}`
        : selectedText,
    };

    const existingNotes = script.productionNotes || '';
    const updatedProdNotes = existingNotes
      ? `${existingNotes}\n• [Wardrobe - ${targetChar}]: ${selectedText}`
      : `• [Wardrobe - ${targetChar}]: ${selectedText}`;

    onChangeScript({
      ...script,
      characterBibles: bibles,
      productionNotes: updatedProdNotes,
      updatedAt: new Date().toISOString(),
    });
    setContextMenu(null);
  };

  const handleReadScene = () => {
    if (!contextMenu) return;
    const { elementId } = contextMenu;
    const idx = elements.findIndex((e) => e.id === elementId);
    if (idx === -1) return;

    let sceneStart = idx;
    while (sceneStart > 0 && elements[sceneStart].type !== 'SCENE HEADING') {
      sceneStart--;
    }

    let sceneEnd = idx;
    while (sceneEnd < elements.length - 1 && elements[sceneEnd + 1].type !== 'SCENE HEADING') {
      sceneEnd++;
    }

    const sceneElements = elements.slice(sceneStart, sceneEnd + 1);
    const speechText = sceneElements.map((e) => e.content).join('. ');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
    setContextMenu(null);
  };

  const handleAlternateDialogue = () => {
    if (!contextMenu) return;
    const { elementId, selectedText } = contextMenu;
    const updatedElements = elements.map((e) => {
      if (e.id === elementId) {
        return {
          ...e,
          meta: {
            ...(e.meta || {}),
            alternateVersion: selectedText,
          },
        };
      }
      return e;
    });

    onChangeScript({
      ...script,
      elements: updatedElements,
      updatedAt: new Date().toISOString(),
    });
    setContextMenu(null);
  };

  /**
   * Group elements into pages (~54 lines/page)
   */
  let accumulatedLines = 0;
  const pageDividers: { [index: number]: number } = {};
  let currentPage = 1;

  elements.forEach((e, idx) => {
    const rawLines = Math.max(1, Math.ceil((e.content || '').length / 55));
    accumulatedLines += rawLines + (e.type === 'SCENE HEADING' ? 2 : 1);

    if (accumulatedLines >= 54) {
      currentPage += 1;
      pageDividers[idx] = currentPage;
      accumulatedLines = 0;
    }
  });

  const fontStyleValue = editorFont === 'Courier New'
    ? "'Courier New', Courier, monospace"
    : "'Courier Prime', 'Courier New', monospace";

  return (
    <main className="flex-1 bg-slate-950 overflow-y-auto py-8 px-2 sm:px-6 min-h-[calc(100vh-7rem)] select-text">
      <div className="max-w-[850px] mx-auto space-y-8">
        {/* Title Page Paper Card */}
        <div
          className="bg-white text-black shadow-2xl rounded-sm border border-slate-200 p-8 sm:p-16 text-[12pt] min-h-[500px] flex flex-col justify-between select-text relative"
          style={{ fontFamily: fontStyleValue }}
        >
          <div className="text-center my-auto space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-black">
              {script.titlePage.title || script.title}
            </h1>

            <div className="text-xs text-gray-700 space-y-1">
              <p className="italic">{script.titlePage.credit}</p>
              <p className="font-bold uppercase text-sm">{script.titlePage.author}</p>
              {script.titlePage.source && <p className="text-gray-500 mt-2">{script.titlePage.source}</p>}
            </div>
          </div>

          <div className="flex justify-between items-end text-xs text-gray-700 pt-12 border-t border-gray-200">
            <div className="whitespace-pre-line text-left">{script.titlePage.contact}</div>
            <div className="text-right">
              <p className="font-bold">{script.titlePage.date}</p>
              <p className="text-gray-500">{script.titlePage.draftColor || 'White Draft'}</p>
            </div>
          </div>
        </div>

        {/* Page 1 Header & Script Title Banner */}
        <div className="flex items-center justify-between text-xs font-mono px-2 text-slate-400 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-widest text-[11px] sm:text-xs">
            <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-[300px] sm:max-w-[500px]">
              {script.titlePage.title || script.title || 'UNTITLED SCREENPLAY'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span className="hidden sm:inline italic">By {script.titlePage.author || script.author || 'Author'}</span>
            <span className="font-bold text-slate-400">PAGE 1.</span>
          </div>
        </div>

        {/* Main Screenplay Page Paper Canvas */}
        <div
          className="bg-white text-black shadow-2xl rounded-sm border border-slate-200 p-6 sm:p-12 min-h-[1100px] text-[12pt] leading-relaxed relative"
          style={{ fontFamily: fontStyleValue }}
        >
          {script.elements.map((elem, idx) => {
            const isSelected = activeElementId === elem.id;
            const styles = getElementStyles(elem.type);
            const pageNum = pageDividers[idx];

            // Character autocomplete suggestions if CHARACTER type is active and selected
            const isCharActive = isSelected && elem.type === 'CHARACTER';
            const charQuery = (elem.content || '').trim().toUpperCase();
            const matchingChars = isCharActive
              ? allCharacterNames.filter((name) => charQuery === '' || (name.includes(charQuery) && name !== charQuery))
              : [];

            return (
              <React.Fragment key={elem.id}>
                {pageNum && (
                  <div className="my-10 pt-8 border-t-2 border-dashed border-slate-300 flex justify-between items-center text-xs text-slate-500 font-mono select-none">
                    <span className="uppercase text-[10px] font-bold tracking-wider text-amber-700">
                      PAGE BREAK ({script.title} • {script.draftStatus})
                    </span>
                    <span className="font-bold text-black">{pageNum}.</span>
                  </div>
                )}

                <div
                  onContextMenu={(e) => handleContextMenu(e, elem)}
                  className={`relative group transition-colors rounded px-2 py-1 ${
                    isSelected ? 'bg-amber-50/70 border-l-4 border-amber-500 shadow-2xs' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Floating Element Control Tag on Hover/Focus */}
                  <div className="absolute -left-28 top-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity hidden lg:flex items-center gap-1 select-none z-10">
                    <span className="text-[9px] font-bold uppercase bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded shadow-xs font-mono">
                      {elem.type}
                    </span>
                    <button
                      onClick={() => handleDeleteElement(elem.id)}
                      className="p-1 bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white rounded"
                      title="Delete element"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Scene Number Indicator */}
                  {elem.type === 'SCENE HEADING' && elem.sceneNumber && (
                    <span className="absolute left-[-2.5rem] top-2 font-bold text-slate-400 text-xs select-none font-mono">
                      #{elem.sceneNumber}
                    </span>
                  )}

                  {/* ContentEditable Pure Input Container */}
                  <div
                    ref={(el) => (elementRefs.current[elem.id] = el)}
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => {
                      setActiveElementId(elem.id);
                      setActiveType(elem.type);
                    }}
                    onInput={(e) => handleContentChange(elem.id, e.currentTarget.textContent || '')}
                    onKeyDown={(e) => handleKeyDown(e, elem, idx)}
                    className={`outline-none whitespace-pre-wrap break-words ${styles.containerClass}`}
                    style={{ textTransform: styles.textTransform, fontFamily: fontStyleValue }}
                    data-placeholder={styles.placeholder}
                  >
                    {elem.content}
                  </div>

                  {/* Alternate Version Badge */}
                  {elem.meta?.alternateVersion && (
                    <div className="mt-1 text-[10px] font-mono text-amber-800 bg-amber-100 border border-amber-300 rounded px-2 py-0.5 inline-flex items-center gap-1 shadow-2xs select-none">
                      <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>Alt: "{elem.meta.alternateVersion}"</span>
                    </div>
                  )}

                  {/* Character Autocomplete Dropdown */}
                  {isCharActive && matchingChars.length > 0 && (
                    <div className="absolute left-0 sm:left-[37%] mt-1 z-20 w-64 bg-slate-900 border border-amber-500/60 rounded-lg shadow-2xl py-1 text-slate-100 font-mono text-xs">
                      <div className="px-3 py-1 text-[9px] uppercase tracking-wider text-amber-400 font-bold border-b border-slate-800 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Character Suggestions</span>
                      </div>
                      <div className="max-h-36 overflow-y-auto">
                        {matchingChars.slice(0, 6).map((cName) => (
                          <div
                            key={cName}
                            onMouseDown={(e) => {
                              e.preventDefault(); // prevent blur
                              handleContentChange(elem.id, cName);
                              setActiveElementId(elem.id);
                            }}
                            className="px-3 py-1.5 hover:bg-amber-500/20 hover:text-amber-300 cursor-pointer transition flex items-center justify-between"
                          >
                            <span className="font-bold">{cName}</span>
                            <span className="text-[10px] text-slate-500">Select</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Quick Add Bottom Button */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => handleAddElementAfter(elements[elements.length - 1]?.id || '')}
              className="px-4 py-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-300 hover:border-amber-400 font-mono text-xs rounded-full flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Add Element (Enter)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Pro Context Menu Overlay (Dark Theme) */}
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-56 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl py-1.5 font-mono text-xs text-slate-100 animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 border-b border-slate-800 text-[9px] uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between">
            <span>PRO TOOLS MENU</span>
            <button onClick={() => setContextMenu(null)} className="text-slate-500 hover:text-slate-300">
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="p-1 space-y-0.5">
            <button
              onClick={handleAddWriterNote}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-500/20 text-amber-300 font-medium flex items-center gap-2 transition"
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Add Writer Note</span>
            </button>

            <button
              onClick={handleTagProp}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-200 font-medium flex items-center gap-2 transition"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Tag as Prop</span>
            </button>

            <button
              onClick={handleTagWardrobe}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-200 font-medium flex items-center gap-2 transition"
            >
              <Shirt className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Tag as Wardrobe</span>
            </button>

            <button
              onClick={handleReadScene}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-200 font-medium flex items-center gap-2 transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Read This Scene Aloud</span>
            </button>

            <button
              onClick={handleAlternateDialogue}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-800 text-slate-200 font-medium flex items-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Set Alternate Dialogue</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
