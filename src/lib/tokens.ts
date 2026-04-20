export const KEYWORDS = {
  COMMANDS: ['SHOW', 'HIDE', 'WAIT', 'SET', 'END', 'AUDIO'] as const,
  ANIMATIONS: [
    // Basic Fades
    'FADE IN',
    'FADE OUT',
    'FADE IN UP',
    'FADE IN DOWN',
    'FADE IN LEFT',
    'FADE IN RIGHT',
    'FADE OUT UP',
    'FADE OUT DOWN',
    'FADE OUT LEFT',
    'FADE OUT RIGHT',
    
    // Slides
    'SLIDE UP',
    'SLIDE DOWN',
    'SLIDE LEFT',
    'SLIDE RIGHT',
    'SLIDE IN UP',
    'SLIDE IN DOWN',
    'SLIDE IN LEFT',
    'SLIDE IN RIGHT',
    
    // Zoom
    'ZOOM IN',
    'ZOOM OUT',
    'ZOOM IN UP',
    'ZOOM IN DOWN',
    'ZOOM OUT UP',
    'ZOOM OUT DOWN',
    
    // Type & Reveal
    'TYPE',
    'TYPE IN',
    'REVEAL',
    'REVEAL LEFT',
    'BLINDS',
    'BLINDS IN',
    
    // Shake & Wiggle
    'SHAKE',
    'WIGGLE',
    'JIGGLE',
    'SHAKE LEFT',
    'SHAKE RIGHT',
    
    // Bounce & Spring
    'BOUNCE',
    'BOUNCE IN',
    'BOUNCE OUT',
    'SPRING IN',
    'POP IN',
    'POP',
    'POP OUT',
    
    // Flip & Rotate
    'FLIP IN',
    'FLIP OUT',
    'FLIP X',
    'FLIP Y',
    'ROTATE IN',
    'ROTATE OUT',
    'ROTATE LEFT',
    'ROTATE RIGHT',
    'SPIN IN',
    'TWIST IN',
    
    // Scale
    'SCALE IN',
    'SCALE OUT',
    'GROW',
    'SHRINK',
    'GROW IN',
    'SHRINK IN',
    
    // Blur & Focus
    'BLUR IN',
    'BLUR OUT',
    'FOCUS',
    'UNBLUR',
    
    // Special Effects
    'GLITCH',
    'GLITCH IN',
    'PULSE',
    'PULSE IN',
    'HEARTBEAT',
    'RATTLE',
    'SWING',
    'FLUTTER',
    'WAVE',
    'DRIFT',
    'DRIFT IN',
    'ROLL IN',
    'ROLL OUT',
    'SLIDE BLUR IN',
    'FADE ZOOM',
    
    // Elastic
    'ELASTIC IN',
    'ELASTIC OUT',
    'RUBBER BAND',
    'RUBBER',
    
    // Split & Reveal
    ' SPLIT IN',
    'SPLIT OUT',
    'BOX OPEN',
    'BOX CLOSE',
    
    // Miscellaneous
    'EXPAND',
    'CONTRACT',
    'RISE',
    'FALL',
    'DROP IN',
    'ROLL UP',
    'ROLL DOWN',
  ] as const,
  MODIFIERS: ['FOR', 'SIZE', 'COLOR', 'POSITION', 'WAIT', 'WIDTH', 'RADIUS', 'FIT'] as const,
  POSITIONS: ['CENTER', 'TOP', 'BOTTOM', 'LEFT', 'RIGHT'] as const,
} as const;

export const ANIMATION_KEYWORDS = new Set(KEYWORDS.ANIMATIONS);
export const COMMAND_KEYWORDS = new Set(KEYWORDS.COMMANDS);
export const MODIFIER_KEYWORDS = new Set(KEYWORDS.MODIFIERS);
export const POSITION_KEYWORDS = new Set(KEYWORDS.POSITIONS);

export const ANIMATION_ALIASES: Record<string, string> = {
  'FADE': 'FADE IN',
  'SLIDE': 'SLIDE UP',
  'ZOOM': 'ZOOM IN',
  'TYPE': 'TYPE IN',
  'REVEAL': 'REVEAL LEFT',
  'BLINDS': 'BLINDS IN',
  'BOUNCE': 'BOUNCE IN',
  'SPRING': 'SPRING IN',
  'POP': 'POP IN',
  'FLIP': 'FLIP IN',
  'ROTATE': 'ROTATE IN',
  'SPIN': 'SPIN IN',
  'TWIST': 'TWIST IN',
  'SCALE': 'SCALE IN',
  'GROW': 'GROW',
  'SHRINK': 'SHRINK',
  'BLUR': 'BLUR IN',
  'FOCUS': 'FOCUS',
  'GLITCH': 'GLITCH',
  'PULSE': 'PULSE',
  'HEARTBEAT': 'HEARTBEAT',
  'RATTLE': 'RATTLE',
  'SWING': 'SWING',
  'FLUTTER': 'FLUTTER',
  'WAVE': 'WAVE',
  'DRIFT': 'DRIFT',
  'ROLL': 'ROLL IN',
  'EXPAND': 'EXPAND',
  'CONTRACT': 'CONTRACT',
  'RISE': 'RISE',
  'FALL': 'FALL',
  'DROP': 'DROP IN',
  'ELASTIC': 'ELASTIC IN',
  'RUBBER': 'RUBBER BAND',
};

export function normalizeAnimation(word: string): string {
  const upper = word.toUpperCase();
  return ANIMATION_ALIASES[upper] || upper;
}

export const ERROR_MESSAGES = {
  UNKNOWN_COMMAND: (cmd: string) => 
    `I don't understand "${cmd}". Try SHOW, HIDE, WAIT, or SET`,
  UNKNOWN_ANIMATION: (anim: string) =>
    `I don't know "${anim}". Try FADE IN, SLIDE UP, or TYPE`,
  MISSING_QUOTES: () =>
    `Put your text in quotes like "this"`,
  MISSING_DURATION: () =>
    `Add how long with FOR 2 SECONDS`,
  INVALID_NUMBER: (val: string) =>
    `"${val}" doesn't look like a number`,
  UNKNOWN_MODIFIER: (mod: string) =>
    `I don't know "${mod}". Try FOR, SIZE, COLOR, or POSITION`,
  INVALID_POSITION: (pos: string) =>
    `Position must be CENTER, TOP, BOTTOM, LEFT, or RIGHT`,
} as const;