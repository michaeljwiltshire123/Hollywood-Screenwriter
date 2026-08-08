import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-screenwriter-pro-guide',
  title: 'SCREENWRITER PRO: THE MASTER CLASS',
  author: 'Leo Vance & Maya Lin',
  description: 'A meta-screenplay tutorial demonstrating every feature of Screenwriter Pro alongside industry-standard formatting rules.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'SCREENWRITER PRO: THE MASTER CLASS',
    credit: 'Written by',
    author: 'Leo Vance & Maya Lin',
    source: 'Original Interactive Tutorial',
    contact: 'Local-First Engine: $0 Hosting / 100% Data Ownership\nSupport: support@screenwriterpro.io\nVersion: 2.5 Gold Standard',
    date: 'August 7, 2026',
    draftColor: 'Goldenrod Master Draft',
  },
  elements: [
    {
      id: 'elem-meta-1',
      type: 'SCENE HEADING',
      content: 'INT. SCREENWRITER PRO WRITING SUITE - NIGHT',
      sceneNumber: '1',
    },
    {
      id: 'elem-meta-2',
      type: 'ACTION',
      content: 'Crisp 12pt Courier typography glows on the screen. LEO (50s, master screenwriting mentor) points at the monitor with an empty coffee mug. MAYA (20s, eager film student) sits at the keyboard.',
    },
    {
      id: 'elem-meta-3',
      type: 'ACTION',
      content: 'Rule #1: Always keep action blocks under 5 lines. Dense paragraphs blind script readers. Break visual descriptions into digestible bites.',
    },
    {
      id: 'elem-meta-4',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-meta-5',
      type: 'PARENTICAL',
      content: '(grinning warmly)',
    },
    {
      id: 'elem-meta-6',
      type: 'DIALOGUE',
      content: 'Welcome to Screenwriter Pro! Every single keystroke you type is instantly saved locally to your browser IndexedDB. Zero cloud costs, zero privacy risk, and 100% data ownership.',
    },
    {
      id: 'elem-meta-7',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-meta-8',
      type: 'DIALOGUE',
      content: 'How do the keyboard shortcuts work when I am typing fast?',
    },
    {
      id: 'elem-meta-9',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-meta-10',
      type: 'DIALOGUE',
      content: 'Hit ENTER after a Character name and it switches to Dialogue! Hit ENTER twice anywhere to drop back to Action. Press TAB to cycle through all 8 element types.',
    },
    {
      id: 'elem-meta-11',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },
    {
      id: 'elem-meta-12',
      type: 'SCENE HEADING',
      content: 'EXT. COCKPIT VIEW & NAVIGATOR - CONTINUOUS',
      sceneNumber: '2',
    },
    {
      id: 'elem-meta-13',
      type: 'ACTION',
      content: 'Maya clicks the left panel button. The retractable Navigator side panel slides open smoothly, revealing six production tabs.',
    },
    {
      id: 'elem-meta-14',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-meta-15',
      type: 'DIALOGUE',
      content: 'Look at this! The SCENES tab lets me jump across the script instantly. The SHOTS tab creates a real shot list with camera angles and equipment setup.',
    },
    {
      id: 'elem-meta-16',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-meta-17',
      type: 'DIALOGUE',
      content: 'Do not forget the ARC tab for story structure cards, the SPARK tab for writer block prompts, the BIBLE tab for character appearance logs, and STATS for exact page estimates where 1 page equals 1 minute of film time!',
    },
    {
      id: 'elem-meta-18',
      type: 'TRANSITION',
      content: 'MATCH CUT TO:',
    },
    {
      id: 'elem-meta-19',
      type: 'SCENE HEADING',
      content: 'INT. REHEARSAL STUDIO & PRODUCTION WRAP - DAY',
      sceneNumber: '3',
    },
    {
      id: 'elem-meta-20',
      type: 'ACTION',
      content: 'Leo clicks the new TABLE READ button in the top menu bar. Built-in browser speech synthesis speaks the script aloud.',
    },
    {
      id: 'elem-meta-21',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-meta-22',
      type: 'DIALOGUE',
      content: 'I can mute my character name so I can practice speaking my dialogue live while the app voices all the other characters! And when I am done, I can export to PDF, Final Draft .fdx, .fountain, or import existing files!',
    },
    {
      id: 'elem-meta-23',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-meta-24',
      type: 'DIALOGUE',
      content: 'Plus the 5-minute Pomodoro Break Box lets you play micro-games without losing your momentum. Now go write your masterpiece!',
    },
    {
      id: 'elem-meta-25',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    },
  ],
};
