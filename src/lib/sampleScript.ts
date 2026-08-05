import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-01',
  title: 'THE MIDNIGHT PROTOCOL',
  author: 'Alex Vance',
  description: 'A cyber-thriller screenplay.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'THE MIDNIGHT PROTOCOL',
    credit: 'Written by',
    author: 'Alex Vance',
    source: 'Original Screenplay',
    contact: 'Agent: CAA Cinema Division\nPhone: (310) 555-0199\nEmail: alex@vancemedia.io',
    date: 'October 24, 2026',
    draftColor: 'White Draft',
  },
  elements: [
    {
      id: 'elem-1',
      type: 'SCENE HEADING',
      content: 'EXT. CYBERNETIC DISTRICT - NIGHT',
      sceneNumber: '1',
    },
    {
      id: 'elem-2',
      type: 'ACTION',
      content: 'Neon rain slicks the chrome pavement of Sector 4. High above, holographic billboards glitch against obsidian skies.',
    },
    {
      id: 'elem-3',
      type: 'CHARACTER',
      content: 'KAI',
    },
    {
      id: 'elem-4',
      type: 'PARENTICAL',
      content: '(adjusting optic visor)',
    },
    {
      id: 'elem-5',
      type: 'DIALOGUE',
      content: 'The signal is decaying. We have ninety seconds before the firewall locks us out permanently.',
    },
    {
      id: 'elem-6',
      type: 'CHARACTER',
      content: 'VEX',
    },
    {
      id: 'elem-7',
      type: 'DIALOGUE',
      content: 'Then stop talking and run the bypass sequence.',
    },
    {
      id: 'elem-8',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },
    {
      id: 'elem-9',
      type: 'SCENE HEADING',
      content: 'INT. CONTROL SERVER ROOM - CONTINUOUS',
      sceneNumber: '2',
    },
    {
      id: 'elem-10',
      type: 'ACTION',
      content: 'Coolant tubes hum with pressurized blue nitrogen. Kai slides across the wet tiles, plugging the decryptor unit into the central node.',
    },
  ],
};
