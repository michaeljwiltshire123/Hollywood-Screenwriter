import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-blacklist-passions',
  title: 'THE BLACK LIST PASSION',
  author: 'Leo Vance & Maya Lin',
  description: 'An inspiring feature screenplay following two writers chasing their big break.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'THE BLACK LIST PASSION',
    credit: 'Written by',
    author: 'Leo Vance & Maya Lin',
    source: 'Original Screenplay',
    contact: 'Representation: WME Cinema Division\nPhone: (310) 555-0142\nEmail: contact@blacklistpassion.io',
    date: 'August 6, 2026',
    draftColor: 'White Draft',
  },
  elements: [
    {
      id: 'elem-bl-1',
      type: 'SCENE HEADING',
      content: "INT. LEO'S BEDROOM - NIGHT",
      sceneNumber: '1',
    },
    {
      id: 'elem-bl-2',
      type: 'ACTION',
      content: 'Glow from a high-resolution laptop illuminates LEO (30s, restless, pacing in sock feet). A half-eaten bagel sits beside an open script container on his desk.',
    },
    {
      id: 'elem-bl-3',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-4',
      type: 'PARENTICAL',
      content: '(staring at the screen)',
    },
    {
      id: 'elem-bl-5',
      type: 'DIALOGUE',
      content: 'Look at this typing response speed. Zero lag, zero stuttering. Every line snaps into standard 12pt Courier instantly!',
    },
    {
      id: 'elem-bl-6',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-7',
      type: 'PARENTICAL',
      content: '(leaning against the doorway, coffee in hand)',
    },
    {
      id: 'elem-bl-8',
      type: 'DIALOGUE',
      content: 'That speed means nothing if you lose your pages when the browser refreshes. Did you save?',
    },
    {
      id: 'elem-bl-9',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-10',
      type: 'DIALOGUE',
      content: 'Watch the footer. See that pulsing red badge? That is the safety status guard telling me there are unsaved changes.',
    },
    {
      id: 'elem-bl-11',
      type: 'ACTION',
      content: 'Leo hits Ctrl+S on his mechanical keyboard. The footer instantly transforms into a calm, solid green SAVED indicator.',
    },
    {
      id: 'elem-bl-12',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-13',
      type: 'DIALOGUE',
      content: 'Direct file saving! It overwrote the local disk file directly. No cloud intermediate needed.',
    },
    {
      id: 'elem-bl-14',
      type: 'TRANSITION',
      content: 'MATCH CUT TO:',
    },
    {
      id: 'elem-bl-15',
      type: 'SCENE HEADING',
      content: 'EXT. COFFEE SHOP - DAY',
      sceneNumber: '2',
    },
    {
      id: 'elem-bl-16',
      type: 'ACTION',
      content: 'Morning sunlight floods the patio. Maya sits with her tablet, highlighting dialogue beats in the newly saved draft.',
    },
    {
      id: 'elem-bl-17',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-18',
      type: 'DIALOGUE',
      content: 'When we hit Enter after a Character name, it jumps straight into Dialogue. Hit Enter twice, and we are back in Action mode.',
    },
    {
      id: 'elem-bl-19',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-20',
      type: 'DIALOGUE',
      content: 'Pure muscle memory formatting. Plus Alt+1 through Alt+8 switches element types on the fly.',
    },
    {
      id: 'elem-bl-21',
      type: 'TRANSITION',
      content: 'DISSOLVE TO:',
    },
    {
      id: 'elem-bl-22',
      type: 'SCENE HEADING',
      content: 'INT. CINEMA LOBBY - EVENING',
      sceneNumber: '3',
    },
    {
      id: 'elem-bl-23',
      type: 'ACTION',
      content: 'A bustling red-carpet premiere. Poster frames feature "THE BLACK LIST PASSION". Fans cheer outside under flashbulbs.',
    },
    {
      id: 'elem-bl-24',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-25',
      type: 'DIALOGUE',
      content: 'We wrote this script with full local sovereignty. Now it is on the big screen.',
    },
    {
      id: 'elem-bl-26',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-27',
      type: 'DIALOGUE',
      content: 'To pristine formatting, total file ownership, and great stories.',
    },
    {
      id: 'elem-bl-28',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    },
  ],
};
