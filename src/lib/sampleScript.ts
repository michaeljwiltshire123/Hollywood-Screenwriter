import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-meta-01',
  title: 'HOLLYWOOD SOVEREIGNTY',
  author: 'CREATIVE WRITER',
  description: 'A meta-guide screenplay demonstrating direct file saving and zero-bloat editing.',
  draftStatus: 'DRAFT',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'HOLLYWOOD SOVEREIGNTY',
    credit: 'Written by',
    author: 'CREATIVE WRITER & THE TECH GURU',
    source: 'Original Meta-Tutorial',
    contact: 'Email: support@hollywoodscreenwriter.com',
    date: new Date().toLocaleDateString(),
    draftColor: 'White Draft',
  },
  elements: [
    {
      id: 'elem-meta-1',
      type: 'SCENE HEADING',
      content: 'INT. WRITER\'S OFFICE - DAY',
      sceneNumber: '1',
    },
    {
      id: 'elem-meta-2',
      type: 'ACTION',
      content: 'A clean, clutter-free workspace. Sunlight streams through a window, illuminating a screen displaying a beautifully formatted page. No lag. No freezing.',
    },
    {
      id: 'elem-meta-3',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-meta-4',
      type: 'DIALOGUE',
      content: 'I can finally type without the screen stuttering. Every keystroke is instant. But where is my work actually going?',
    },
    {
      id: 'elem-meta-5',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-meta-6',
      type: 'DIALOGUE',
      content: 'Directly to your hard drive. No hidden local databases, no cloud delays. When you press Ctrl+S, it silently replaces the file you chose.',
    },
    {
      id: 'elem-meta-7',
      type: 'TRANSITION',
      content: 'SMASH CUT TO:',
    },
    {
      id: 'elem-meta-8',
      type: 'SCENE HEADING',
      content: 'EXT. THE CLOUD - CONTINUOUS',
      sceneNumber: '2',
    },
    {
      id: 'elem-meta-10',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-meta-11',
      type: 'DIALOGUE',
      content: 'Wait, so we don\'t have to connect to Google Drive or deal with school firewalls blocking our connection?',
    },
    {
      id: 'elem-meta-12',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-meta-13',
      type: 'DIALOGUE',
      content: 'Exactly! Your .screenplay container is completely sovereign. It packages your script, character bibles, and shot lists into one single file on your local machine.',
    },
    {
      id: 'elem-meta-14',
      type: 'TRANSITION',
      content: 'FADE TO:',
    },
    {
      id: 'elem-meta-15',
      type: 'SCENE HEADING',
      content: 'INT. PRODUCTION STUDIO - NIGHT',
      sceneNumber: '3',
    },
    {
      id: 'elem-meta-16',
      type: 'ACTION',
      content: 'A massive sound stage. Crew members bustle around camera rigs. The Director checks the screenplay on an iPad, satisfied.',
    },
    {
      id: 'elem-meta-17',
      type: 'CHARACTER',
      content: 'WRITER',
    },
    {
      id: 'elem-meta-18',
      type: 'DIALOGUE',
      content: 'And what about the status lights at the bottom? The red pulsing and solid green dots?',
    },
    {
      id: 'elem-meta-19',
      type: 'CHARACTER',
      content: 'TECH GURU',
    },
    {
      id: 'elem-meta-20',
      type: 'PARENTICAL',
      content: '(pointing to the footer)',
    },
    {
      id: 'elem-meta-21',
      type: 'DIALOGUE',
      content: 'That\'s your safety pulse. If it\'s pulsing red, you have unsaved changes. Press Ctrl+S, it writes to disk, and turns solid green. Perfect clarity.',
    },
  ],
};
