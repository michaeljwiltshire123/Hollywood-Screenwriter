import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-chasing-the-sun',
  title: 'CHASING THE SUN',
  author: 'Leo Vance & Maya Lin',
  description: 'A gripping feature screenplay following a writer and director pouring their souls into a breakout cinematic masterpiece.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'CHASING THE SUN',
    credit: 'Written by',
    author: 'Leo Vance & Maya Lin',
    source: 'Original Screenplay',
    contact: 'Representation: WME Cinema Division\nPhone: (310) 555-0142\nEmail: contact@chasingthesun.io',
    date: 'August 6, 2026',
    draftColor: 'Goldenrod Revision',
  },
  elements: [
    {
      id: 'elem-cts-1',
      type: 'SCENE HEADING',
      content: "INT. LEO'S BEDROOM - NIGHT",
      sceneNumber: '1',
    },
    {
      id: 'elem-cts-2',
      type: 'ACTION',
      content: 'Paper drafts and glowing monitors flood the dark room. Rain strikes the window like applause. LEO (30s, intense, relentless) paces back and forth across the hardwood floor.',
    },
    {
      id: 'elem-cts-3',
      type: 'ACTION',
      content: 'MAYA (30s, sharp director jacket, viewfinder hanging around her neck) sits on the edge of the bed, analyzing a highlighted scene card.',
    },
    {
      id: 'elem-cts-4',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-cts-5',
      type: 'PARENTICAL',
      content: '(pacing rapidly)',
    },
    {
      id: 'elem-cts-6',
      type: 'DIALOGUE',
      content: 'If the protagonist hides her flaw until the third act, the audience will feel betrayed. Her vulnerability has to break open right here in the bedroom.',
    },
    {
      id: 'elem-cts-7',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-cts-8',
      type: 'DIALOGUE',
      content: 'You are right. When the camera pushes close into her eyes, there can be no armor left. Only raw truth.',
    },
    {
      id: 'elem-cts-9',
      type: 'ACTION',
      content: 'Leo stops in front of the workstation. The safety status lights in the footer pulse with a reassuring green glow. He types out the climax beat.',
    },
    {
      id: 'elem-cts-10',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },
    {
      id: 'elem-cts-11',
      type: 'SCENE HEADING',
      content: 'EXT. CINEMA ROOFTOP - SUNSET',
      sceneNumber: '2',
    },
    {
      id: 'elem-cts-12',
      type: 'ACTION',
      content: 'The city sky burns brilliant crimson and gold. Maya holds up her framing hands, framing Leo against the setting sun.',
    },
    {
      id: 'elem-cts-13',
      type: 'CHARACTER',
      content: 'MAYA',
    },
    {
      id: 'elem-cts-14',
      type: 'PARENTICAL',
      content: '(looking through the view)',
    },
    {
      id: 'elem-cts-15',
      type: 'DIALOGUE',
      content: 'This is the ultimate shot. The golden hour light catching the horizon just as the hero makes her choice.',
    },
    {
      id: 'elem-cts-16',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-cts-17',
      type: 'DIALOGUE',
      content: 'We spent three years getting to this page. Every line, every revision... it all matters now.',
    },
    {
      id: 'elem-cts-18',
      type: 'TRANSITION',
      content: 'MATCH CUT TO:',
    },
    {
      id: 'elem-cts-19',
      type: 'SCENE HEADING',
      content: 'INT. FILM FESTIVAL STAGE - NIGHT',
      sceneNumber: '3',
    },
    {
      id: 'elem-cts-20',
      type: 'ACTION',
      content: 'Spotlights illuminate a packed auditorium. Thousands of audience members stand in applause as the final credits roll across the silver screen.',
    },
    {
      id: 'elem-cts-21',
      type: 'CHARACTER',
      content: 'LEO',
    },
    {
      id: 'elem-cts-22',
      type: 'DIALOGUE',
      content: 'We chased the sun... and we finally caught it.',
    },
    {
      id: 'elem-cts-23',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    },
  ],
};
