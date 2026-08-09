import { ScreenplayDocument } from '../types';

export const INITIAL_SAMPLE_SCRIPT: ScreenplayDocument = {
  id: 'script-sample-screenwriter-pro-guide',
  title: 'THE CRAFT OF THE SCREENPLAY',
  author: 'J. Onionfist',
  description: 'A 6-page meta-screenplay tutorial written in the spirit of Ferris Bueller, where a master screenwriter and his student teach the software while writing the exact script you are reading.',
  draftStatus: 'REVISION',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  titlePage: {
    title: 'THE CRAFT OF THE SCREENPLAY',
    credit: 'Written by',
    author: 'J. Onionfist',
    source: 'Interactive Masterclass Screenplay',
    contact: 'Screenwriter Pro Local-First Engine\nZero Cloud Hosting Costs / 100% Data Sovereignty\nSupport: support@screenwriterpro.io',
    date: 'August 2026',
    draftColor: 'Goldenrod Master Revision',
  },
  characterBibles: {
    'ARTHUR': {
      age: 'Late 50s',
      appearance: 'Tweed vest, rolled sleeves, vintage wire-rim glasses resting on his nose.',
      attitude: 'Effortlessly confident, cocky master screenwriter with a warm heart and zero tolerance for fluff.',
      actionInFirstScene: 'Turns directly to the camera with a smirk before taking a slow sip from a chipped mug.',
      internalFlaw: 'Secretly fears the new digital generation will leave classic storytelling behind.',
      coreMotivation: 'Pass down the timeless geometry of drama to anyone willing to respect the craft.',
      visualDescription: 'Framed in warm amber lamplight; framed movie posters from the 1980s behind him.',
      actorNotes: 'Play with dry humor, rapid-fire pacing, and casual fourth-wall breaks straight into the camera.'
    },
    'LILY': {
      age: '22',
      appearance: 'Oversized sweater, hair pinned back with a pencil, eyes glowing with creative intensity.',
      attitude: 'Hyper-focused film student; prone to overthinking until Arthur breaks her out of her head.',
      actionInFirstScene: 'Hovers over the mechanical keyboard, fingers twitching above the home row.',
      internalFlaw: 'Perfectionism—fears typing a bad line so much that she freezes before starting.',
      coreMotivation: 'Write something authentic enough to turn heads in Hollywood.',
      visualDescription: 'Lit by the soft 12pt Courier glow of the screen; posture shifts from timid to commanding.',
      actorNotes: 'Start hesitant and reactive, then hit a confident flow state on Page 5 as keyboard rhythms take over.'
    }
  },
  shots: [
    {
      id: 'shot-1',
      sceneHeadingId: 'elem-meta-1',
      shotNumber: '1A',
      shotType: 'MEDIUM',
      angle: 'Eye Level',
      lens: '35mm Prime',
      equipment: 'Dolly Track',
      estimatedTimeMin: 15,
      targetCharacter: 'ARTHUR',
      movementDetail: 'Slow push-in on Arthur as he turns to address the screen.',
      otherNotes: 'Establish the dusty study atmosphere with warm practical lamps.'
    },
    {
      id: 'shot-2',
      sceneHeadingId: 'elem-meta-1',
      shotNumber: '1B',
      shotType: 'CLOSE-UP',
      angle: 'Low Angle',
      lens: '50mm',
      equipment: 'Handheld',
      estimatedTimeMin: 10,
      targetCharacter: 'LILY',
      movementDetail: 'Focus on Lily’s hands hovering over the mechanical keyboard.',
      otherNotes: 'Capture the nervous energy before she types her first Scene Heading.'
    }
  ],
  storyArc: {
    preset: '3-Act',
    cards: [
      { id: 'card-1', actTitle: 'Act I: The Hook', goal: 'Arthur introduces the geometry of screenplay formatting and breaks the fourth wall.' },
      { id: 'card-2', actTitle: 'Act II: The Setup & Flow', goal: 'Lily learns element switching, the Navigator suite, and Focus Mode.' },
      { id: 'card-3', actTitle: 'Act III: The Meta Breakthrough', goal: 'Lily writes in real-time, completing a 6-page script that is this exact document.' }
    ]
  },
  elements: [
    // PAGE 1: INT. ARTHUR'S DUSTY STUDY - NIGHT
    {
      id: 'elem-meta-1',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - NIGHT',
      sceneNumber: '1',
    },
    {
      id: 'elem-meta-2',
      type: 'ACTION',
      content: 'Floor-to-ceiling bookshelves sagging with leather-bound scripts. Warm brass desk lamps cast deep amber shadows.',
    },
    {
      id: 'elem-meta-3',
      type: 'ACTION',
      content: 'ARTHUR (50s, tweed vest, wire-rim glasses, oozing effortless swagger) leans against a oak desk, holding a chipped mug. He turns directly toward US, smirking.',
    },
    {
      id: 'elem-meta-4',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-5',
      type: 'PARENTICAL',
      content: '(to the screen)',
    },
    {
      id: 'elem-meta-6',
      type: 'DIALOGUE',
      content: 'Look at you sitting there. You want to write a movie, don\'t you? You think it\'s all fancy cappuccinos and red carpets. It isn\'t. It\'s rhythm. It\'s standard 12pt Courier typography, exact one-inch margins, and knowing how to handle the page.',
    },
    {
      id: 'elem-meta-7',
      type: 'ACTION',
      content: 'He gestures toward LILY (22, sharp-eyed film student) sitting in a leather armchair, hovering nervously over the keyboard.',
    },
    {
      id: 'elem-meta-8',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-9',
      type: 'DIALOGUE',
      content: 'Arthur, who are you talking to? There\'s no one over there.',
    },
    {
      id: 'elem-meta-10',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-11',
      type: 'DIALOGUE',
      content: 'Don\'t worry about them, kid. They\'re reading this right now. Now pay attention. Rule Number One of screenwriting: every scene starts with a Scene Heading, or Slugline. Location, lighting, time of day. INT for Interior, EXT for Exterior.',
    },
    {
      id: 'elem-meta-12',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-13',
      type: 'DIALOGUE',
      content: 'Like "INT. ARTHUR\'S DUSTY STUDY - NIGHT"?',
    },
    {
      id: 'elem-meta-14',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-15',
      type: 'DIALOGUE',
      content: 'Exactamente. Clean, bold, and unambiguous. Now hit ENTER.',
    },
    {
      id: 'elem-meta-16',
      type: 'ACTION',
      content: 'Lily presses ENTER. The cursor drops down instantly into Action mode.',
    },
    {
      id: 'elem-meta-17',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-18',
      type: 'DIALOGUE',
      content: 'Notice how the editor snapped directly into Action? Action describes what the audience sees and hears. No internal monologues, no fluff. Just physical truth.',
    },

    // PAGE 2: CONTINUOUS ACTION & DIALOGUE MASTERY
    {
      id: 'elem-meta-19',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - CONTINUOUS',
      sceneNumber: '2',
    },
    {
      id: 'elem-meta-20',
      type: 'ACTION',
      content: 'Arthur paces behind Lily\'s chair. He taps the top edge of her monitor.',
    },
    {
      id: 'elem-meta-21',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-22',
      type: 'DIALOGUE',
      content: 'Here\'s the Golden Rule for Action blocks: never exceed five lines in a single paragraph. Heavy blocks of text blind script readers and studio execs. Keep it punchy.',
    },
    {
      id: 'elem-meta-23',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-24',
      type: 'PARENTICAL',
      content: '(typing rapidly)',
    },
    {
      id: 'elem-meta-25',
      type: 'DIALOGUE',
      content: 'What about character names and dialogue? How do I switch without clicking around with the mouse?',
    },
    {
      id: 'elem-meta-26',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-27',
      type: 'DIALOGUE',
      content: 'That\'s the beauty of the engine. Type a Character name in uppercase and hit ENTER—it instantly creates a Dialogue block! Type Parentheticals in parentheses. Hit ENTER twice from anywhere to return to Action. Or press TAB to cycle through all eight element types.',
    },
    {
      id: 'elem-meta-28',
      type: 'ACTION',
      content: 'Lily smiles as her fingers fly across the keys. The typography aligns with mathematical precision on the white page.',
    },
    {
      id: 'elem-meta-29',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-30',
      type: 'DIALOGUE',
      content: 'It feels like playing a piano. I don\'t even have to think about margins or formatting rules.',
    },
    {
      id: 'elem-meta-31',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-32',
      type: 'PARENTICAL',
      content: '(grinning at camera)',
    },
    {
      id: 'elem-meta-33',
      type: 'DIALOGUE',
      content: 'Because the tool disappears, leaving only your mind and the story. Just like John Hughes wrote Ferris Bueller in a two-day fever dream.',
    },
    {
      id: 'elem-meta-34',
      type: 'TRANSITION',
      content: 'CUT TO:',
    },

    // PAGE 3: THE COCKPIT VIEW & NAVIGATOR SIDE PANEL
    {
      id: 'elem-meta-35',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - LATER',
      sceneNumber: '3',
    },
    {
      id: 'elem-meta-36',
      type: 'ACTION',
      content: 'The clock on the mantelpiece ticks past midnight. Lily opens the left side panel. The Navigator suite slides out smoothly.',
    },
    {
      id: 'elem-meta-37',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-38',
      type: 'DIALOGUE',
      content: 'Look at this sidebar! The SCENES tab lets me jump across the script instantly, reorder scenes, or check page stats.',
    },
    {
      id: 'elem-meta-39',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-40',
      type: 'DIALOGUE',
      content: 'Check out the SHOTS tab, kid. That\'s where you transform a script into a director\'s shooting blueprint. You can set camera angles, lens sizes, movement dynamics, and attach storyboard sketches for every scene.',
    },
    {
      id: 'elem-meta-41',
      type: 'ACTION',
      content: 'Lily clicks over to the BIBLE tab. Arthur and Lily\'s character profiles are displayed with full psychological breakdowns, age, flaw, and appearance logs.',
    },
    {
      id: 'elem-meta-42',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-43',
      type: 'DIALOGUE',
      content: 'The Character Bible logs every scene appearance automatically! And when I make edits to a character\'s internal flaw or visual description, it saves in real-time.',
    },
    {
      id: 'elem-meta-44',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-45',
      type: 'DIALOGUE',
      content: 'And don\'t forget the STORY ARC Whiteboard for three-act or hero\'s journey structuring, and the SPARK tab when you hit a creative wall and need a random narrative constraint.',
    },
    {
      id: 'elem-meta-46',
      type: 'TRANSITION',
      content: 'MATCH CUT TO:',
    },

    // PAGE 4: PRODUCTION SUITE, FOCUS SPRINT & LOCAL PERSISTENCE
    {
      id: 'elem-meta-47',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - NIGHT',
      sceneNumber: '4',
    },
    {
      id: 'elem-meta-48',
      type: 'ACTION',
      content: 'Lily clicks the PRODUCTION button in the top navigation bar. A sleek modal expands with Call Sheets, Shooting Schedules, and Risk Assessments.',
    },
    {
      id: 'elem-meta-49',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-50',
      type: 'DIALOGUE',
      content: 'Wait, this generates actual production Call Sheets with weather forecasts, location maps, cast pickup times, and safety signage banks?',
    },
    {
      id: 'elem-meta-51',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-52',
      type: 'DIALOGUE',
      content: 'A real writer doesn\'t just dream—a real writer prepares for production. And notice the zero-cloud indicator at the top? Every single word you type, every shot, every character note is stored local-first on your machine.',
    },
    {
      id: 'elem-meta-53',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-54',
      type: 'DIALOGUE',
      content: 'So if the internet cuts out on location in the middle of a desert, my work is 100% safe?',
    },
    {
      id: 'elem-meta-55',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-56',
      type: 'PARENTICAL',
      content: '(pointing a finger)',
    },
    {
      id: 'elem-meta-57',
      type: 'DIALOGUE',
      content: '100% safe. Zero monthly cloud fees. Complete data ownership. Now hit FOCUS MODE in the top right. Let\'s see what you can really do when the distractions vanish.',
    },
    {
      id: 'elem-meta-58',
      type: 'TRANSITION',
      content: 'DISSOLVE TO:',
    },

    // PAGE 5: THE BREAKTHROUGH - RHYTHM & FLOW
    {
      id: 'elem-meta-59',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - MOMENTS LATER',
      sceneNumber: '5',
    },
    {
      id: 'elem-meta-60',
      type: 'ACTION',
      content: 'The screen enters Zen-mode focus. Dual progress bars track word count velocity and sprint time.',
    },
    {
      id: 'elem-meta-61',
      type: 'ACTION',
      content: 'Lily\'s hands blur over the keyboard. She stops overthinking. The characters come alive on the page before her.',
    },
    {
      id: 'elem-meta-62',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-63',
      type: 'DIALOGUE',
      content: 'Arthur... it\'s happening. The scene is writing itself.',
    },
    {
      id: 'elem-meta-64',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-65',
      type: 'DIALOGUE',
      content: 'Don\'t stop. Keep typing. What happens next?',
    },
    {
      id: 'elem-meta-66',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-67',
      type: 'DIALOGUE',
      content: 'The mentor realizes his student has surpassed him. She doesn\'t need his rules anymore—she\'s mastering the craft.',
    },
    {
      id: 'elem-meta-68',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-69',
      type: 'PARENTICAL',
      content: '(smiling quietly)',
    },
    {
      id: 'elem-meta-70',
      type: 'DIALOGUE',
      content: 'That\'s not a rule, Lily. That\'s dramatic truth.',
    },

    // PAGE 6: THE GRAND CONCLUSION & META WINK
    {
      id: 'elem-meta-71',
      type: 'SCENE HEADING',
      content: 'INT. ARTHUR\'S DUSTY STUDY - DAWN',
      sceneNumber: '6',
    },
    {
      id: 'elem-meta-72',
      type: 'ACTION',
      content: 'Golden morning light breaks through the tall study windows, illuminating dust motes dancing in the air.',
    },
    {
      id: 'elem-meta-73',
      type: 'ACTION',
      content: 'Lily leans back in the leather chair, letting out a long breath. On screen, the footer page counter ticks up to 6 pages.',
    },
    {
      id: 'elem-meta-74',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-75',
      type: 'DIALOGUE',
      content: 'Six pages. Exactly 12pt Courier, five scenes, character bibles complete, shot list ready for the crew.',
    },
    {
      id: 'elem-meta-76',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-77',
      type: 'DIALOGUE',
      content: 'And do you realize what script we just wrote, kid?',
    },
    {
      id: 'elem-meta-78',
      type: 'ACTION',
      content: 'Lily looks at the monitor, then slowly turns her head toward the CAMERA. A realization dawns on her face.',
    },
    {
      id: 'elem-meta-79',
      type: 'CHARACTER',
      content: 'LILY',
    },
    {
      id: 'elem-meta-80',
      type: 'DIALOGUE',
      content: 'We wrote the exact screenplay that they are reading right now.',
    },
    {
      id: 'elem-meta-81',
      type: 'CHARACTER',
      content: 'ARTHUR',
    },
    {
      id: 'elem-meta-82',
      type: 'PARENTICAL',
      content: '(turns to camera, winks, and tips his coffee mug)',
    },
    {
      id: 'elem-meta-83',
      type: 'DIALOGUE',
      content: 'Now it\'s your turn. Clear the screen, open a fresh page, and go write your story. Life moves pretty fast—if you don\'t stop and write it down once in a while, you could miss it.',
    },
    {
      id: 'elem-meta-84',
      type: 'TRANSITION',
      content: 'FADE OUT.',
    }
  ]
};
