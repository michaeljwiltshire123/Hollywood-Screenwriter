import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-tutorial',
  title: 'HOLLYWOOD SCREENWRITER PRO TUTORIAL',
  author: 'Screenwriter Pro',
  description: 'An interactive meta-guide tutorial explaining screenplay formatting and software features.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'HOLLYWOOD SCREENWRITER PRO TUTORIAL',
    credit: 'Written by',
    author: 'Screenwriter Pro Team',
    source: 'Interactive User Guide',
    contact: 'Help & Docs: Press Ctrl+S to save your work anytime.',
    date: 'August 5, 2026',
    draftColor: 'White Draft',
  },
  elements: [
    {
      id: 'elem-1',
      type: 'SCENE HEADING',
      content: "INT. WRITER'S OFFICE - DAY",
      sceneNumber: '1',
    },
    {
      id: 'elem-2',
      type: 'ACTION',
      content: 'A softly illuminated desk holds a dual-monitor setup running Screenwriter Pro. Sunlight streams through the blinds onto a fresh cup of coffee.',
    },
    {
      id: 'elem-3',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-4',
      type: 'PARENTICAL',
      content: '(staring at the screen in awe)',
    },
    {
      id: 'elem-5',
      type: 'DIALOGUE',
      content: 'How do I save my script safely without relying on slow cloud servers?',
    },
    {
      id: 'elem-6',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-7',
      type: 'DIALOGUE',
      content: 'Just hit Ctrl+S, it overwrites the file on your hard drive! With the File System Access API, your file stays linked right on your disk.',
    },
    {
      id: 'elem-8',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-9',
      type: 'DIALOGUE',
      content: 'What about formatting? How does typing auto-advance elements?',
    },
    {
      id: 'elem-10',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-11',
      type: 'DIALOGUE',
      content: 'Pressing Enter after a Character automatically creates a Dialogue block. Pressing Enter twice drops back into Action mode! You can also use Alt+1 through Alt+8 to instantly switch element types.',
    },
    {
      id: 'elem-12',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },
    {
      id: 'elem-13',
      type: 'SCENE HEADING',
      content: 'EXT. THE CLOUD - CONTINUOUS',
      sceneNumber: '2',
    },
    {
      id: 'elem-14',
      type: 'ACTION',
      content: 'Volumetric data streams zip past, leaving zero trackable footprints. Data sovereignty is 100% local to the browser and hard drive.',
    },
    {
      id: 'elem-15',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-16',
      type: 'DIALOGUE',
      content: 'So zero mandatory cloud accounts or subscription paywalls?',
    },
    {
      id: 'elem-17',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-18',
      type: 'DIALOGUE',
      content: 'Exactly! Local-First architecture guarantees zero latency and bulletproof data privacy.',
    },
    {
      id: 'elem-19',
      type: 'TRANSITION',
      content: 'DISSOLVE TO:',
    },
    {
      id: 'elem-20',
      type: 'SCENE HEADING',
      content: 'INT. PRODUCTION STUDIO - NIGHT',
      sceneNumber: '3',
    },
    {
      id: 'elem-21',
      type: 'ACTION',
      content: 'A Hollywood director reviews a freshly printed script bound in brass fasteners.',
    },
    {
      id: 'elem-22',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-23',
      type: 'DIALOGUE',
      content: 'And export options?',
    },
    {
      id: 'elem-24',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-25',
      type: 'DIALOGUE',
      content: 'You can export standard industry PDF prints, Microsoft Word .docx files, or raw .screenplay JSON files anytime from the Header menu!',
    },
  ],
};
