import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-blacklist-passions',
  title: 'THE BLACK LIST PASSION',
  author: 'Leo Vance & Maya Lin',
  description: 'An inspiring feature screenplay following two writers chasing their big break in Hollywood.',
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
      content: "INT. LEO'S APARTMENT - NIGHT",
      sceneNumber: '1',
    },
    {
      id: 'elem-bl-2',
      type: 'ACTION',
      content: 'A cramped studio in East Hollywood. Rain lashes against the fogged windowpane. Neon streetlights bleed amber and cyan across the cluttered desk.',
    },
    {
      id: 'elem-bl-3',
      type: 'ACTION',
      content: 'LEO (30s, intense eyes, exhausted) stares at page 90 of a printed manuscript. His fingers hover over a vintage typewriter.',
    },
    {
      id: 'elem-bl-4',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-5',
      type: 'PARENTICAL',
      content: '(whispering to himself)',
    },
    {
      id: 'elem-bl-6',
      type: 'DIALOGUE',
      content: 'If the protagonist surrenders in Act Two, the climax loses all momentum. She has to fight back here.',
    },
    {
      id: 'elem-bl-7',
      type: 'ACTION',
      content: 'The front door unlatches. MAYA (30s, sharp coat, carrying rolled storyboards) steps inside, dripping wet.',
    },
    {
      id: 'elem-bl-8',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-9',
      type: 'DIALOGUE',
      content: 'I just came from the producer review. They love the opening setpiece, but they want a sharper emotional hook for the finale.',
    },
    {
      id: 'elem-bl-10',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-11',
      type: 'DIALOGUE',
      content: 'We already have it. Look at Scene 14—the confrontation on the pier. It ties directly into the character arc.',
    },
    {
      id: 'elem-bl-12',
      type: 'ACTION',
      content: 'Maya steps over to the desk, laying out the scene cards. She points to a highlighted beat in the second act.',
    },
    {
      id: 'elem-bl-13',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-bl-14',
      type: 'PARENTICAL',
      content: '(smiling faintly)',
    },
    {
      id: 'elem-bl-15',
      type: 'DIALOGUE',
      content: 'Then let us refine the dialogue and lock the revision. Great stories always win in the end.',
    },
    {
      id: 'elem-bl-16',
      type: 'TRANSITION',
      content: 'MATCH CUT TO:',
    },
    {
      id: 'elem-bl-17',
      type: 'SCENE HEADING',
      content: 'EXT. SANTA MONICA PIER - DAY',
      sceneNumber: '2',
    },
    {
      id: 'elem-bl-18',
      type: 'ACTION',
      content: 'Morning fog drifts across the wooden boardwalk. Waves crash beneath the pilings as ocean breeze sweeps over the crest.',
    },
    {
      id: 'elem-bl-19',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-bl-20',
      type: 'DIALOGUE',
      content: 'This is where everything changes. The moment where truth meets consequence.',
    },
    {
      id: 'elem-bl-21',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    },
  ],
};
