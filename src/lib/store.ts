import { create } from 'zustand';
import { ParsedDemo, DEFAULT_CONFIG } from '@/types/demo';
import { parseDemo, validateDemo } from './parser';

interface DemoState {
  code: string;
  json: string | null;
  parsed: ParsedDemo | null;
  errors: string[];
  isPlaying: boolean;
  isExporting: boolean;
  refresh: number;
  aspectRatio: string;
  previewSize: number;
  setCode: (code: string) => void;
  setPlaying: (playing: boolean) => void;
  setExporting: (exporting: boolean) => void;
  triggerRefresh: () => void;
  reset: () => void;
  setAspectRatio: (ratio: string) => void;
  setPreviewSize: (size: number) => void;
}

const DEFAULT_CODE = `// ═══════════════════════════════════════════
// RENDLY — 14 SCENE SHOWCASE
// ═══════════════════════════════════════════

SET WIDTH 1920
SET HEIGHT 1080
SET FPS 60
SET BACKGROUND #0C0C0C
SET COLOR white
SET FONT SYNE

// ═══════════════════════════════════════════
// SCENE 01: BRAND INTRO — FADE IN
// ═══════════════════════════════════════════
SHOW "RENDLY" FADE IN SIZE 120 FOR 3
SHOW "Create Demo Videos" FADE IN SIZE 48 FOR 2
WAIT 3

// ═══════════════════════════════════════════
// SCENE 02: SLIDE UP
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "SLIDE UP" SLIDE UP SIZE 80 FOR 2
SHOW "Elements slide from bottom" SLIDE UP SIZE 32 FOR 1.5
SHOW "Perfect for feature lists" SLIDE UP SIZE 32 FOR 1.5
WAIT 4

// ═══════════════════════════════════════════
// SCENE 03: ZOOM IN
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "ZOOM IN" ZOOM IN SIZE 96 FOR 2.5
SHOW "Dramatic entrance" ZOOM IN SIZE 40 FOR 1.5
WAIT 4

// ═══════════════════════════════════════════
// SCENE 04: BOUNCE
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "BOUNCE!" BOUNCE SIZE 96 FOR 2
SHOW "Playful & energetic" BOUNCE SIZE 40 FOR 1.5
WAIT 4

// ═══════════════════════════════════════════
// SCENE 05: POP IN
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "POP IN!" POP SIZE 96 FOR 2
SHOW "Smooth scale transition" POP SIZE 40 FOR 1.5
WAIT 4

// ═══════════════════════════════════════════
// SCENE 06: SHAKE
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "SHAKE!" SHAKE SIZE 96 FOR 2
SHOW "Get attention!" SHAKE SIZE 40 FOR 1.5
WAIT 4

// ═══════════════════════════════════════════
// SCENE 07: TYPEWRITER
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "TYPEWRITER EFFECT" TYPE SIZE 64 FOR 3
SHOW "Text appears character by character" TYPE SIZE 32 FOR 2
WAIT 4

// ═══════════════════════════════════════════
// SCENE 08: TYPOGRAPHY
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "TYPOGRAPHY" TYPE SIZE 80 FOR 2
SHOW "BOLD TEXT" BOLD SIZE 56 FOR 1.5
SHOW "italic text" ITALIC SIZE 56 FOR 1.5
SHOW "Normal Text" SIZE 56 FOR 1.5
SHOW "Bold Italic" BOLD ITALIC SIZE 56 FOR 1.5
WAIT 5

// ═══════════════════════════════════════════
// SCENE 09: FONT SIZES
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "FONT SIZES" TYPE SIZE 64 FOR 2
SHOW "SIZE 24" SIZE 24 FOR 1.5
SHOW "SIZE 36" SIZE 36 FOR 1.5
SHOW "SIZE 48" SIZE 48 FOR 1.5
SHOW "SIZE 64" SIZE 64 FOR 1.5
SHOW "SIZE 96" SIZE 96 FOR 2
WAIT 6

// ═══════════════════════════════════════════
// SCENE 10: FONTS
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "MULTIPLE FONTS" TYPE SIZE 64 FOR 2
SHOW "Syne - Geometric Bold" SLIDE UP SIZE 40 FOR 2
HIDE FADE OUT FOR 0.3
SHOW "Serif - Elegant" ZOOM IN SIZE 40 FOR 2
HIDE FADE OUT FOR 0.3
SHOW "Sans - Clean" POP SIZE 40 FOR 2
WAIT 5

// ═══════════════════════════════════════════
// SCENE 11: POSITIONING
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "POSITIONING" TYPE SIZE 64 FOR 2
SHOW "CENTER" SIZE 48 FOR 2
HIDE FADE OUT FOR 0.5
SHOW "LEFT" SIZE 48 FOR 2
HIDE FADE OUT FOR 0.5
SHOW "RIGHT" SIZE 48 FOR 2
WAIT 5

// ═══════════════════════════════════════════
// SCENE 12: COLORS
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "COLORS" TYPE SIZE 80 FOR 2
SHOW "White" SIZE 64 FOR 1.5
HIDE FADE OUT FOR 0.5
SHOW "Gray" SIZE 64 FOR 1.5
HIDE FADE OUT FOR 0.5
SHOW "Orange" SIZE 64 FOR 1.5
WAIT 5

// ═══════════════════════════════════════════
// SCENE 13: FEATURES
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "FEATURES" ZOOM IN SIZE 72 FOR 2
SHOW "60 FPS Rendering" SLIDE UP SIZE 36 FOR 1.2
SHOW "4K Support" SLIDE UP SIZE 36 FOR 1.2
SHOW "Multiple Fonts" SLIDE UP SIZE 36 FOR 1.2
SHOW "Custom Colors" SLIDE UP SIZE 36 FOR 1.2
SHOW "All Animations" SLIDE UP SIZE 36 FOR 1.2
WAIT 5

// ═══════════════════════════════════════════
// SCENE 14: CALL TO ACTION
// ═══════════════════════════════════════════
HIDE FADE OUT FOR 0.5
SHOW "START CREATING" ZOOM IN SIZE 80 FOR 2.5
SHOW "No Design Skills Required" BOUNCE SIZE 36 FOR 1.5
SHOW "Just Write Code" POP SIZE 48 FOR 1.5
SHOW "rendly.dev" TYPE SIZE 28 FOR 1.5
WAIT 5

END`;

const initialParse = () => {
  const result = parseDemo(DEFAULT_CODE);
  return {
    parsed: result.demo,
    json: JSON.stringify(result.demo, null, 2),
    errors: result.errors.length > 0 
      ? result.errors.map(e => e.friendlyMessage)
      : validateDemo(result.demo).map(e => e.friendlyMessage),
  };
};

const init = initialParse();

export const useDemoStore = create<DemoState>((set, get) => ({
  code: DEFAULT_CODE,
  json: init.json,
  parsed: init.parsed,
  errors: init.errors,
  isPlaying: false,
  isExporting: false,
  refresh: 0,
  aspectRatio: '16/9',
  previewSize: 70,
  
  setCode: (code: string) => {
    const result = parseDemo(code);
    set({ 
      code,
      parsed: result.demo,
      json: JSON.stringify(result.demo, null, 2),
      errors: result.errors.map(e => e.friendlyMessage),
    });
  },
  setPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setExporting: (isExporting: boolean) => set({ isExporting }),
  triggerRefresh: () => set((state) => ({ refresh: state.refresh + 1 })),
  reset: () => {
    const init = initialParse();
    set({
      code: DEFAULT_CODE,
      json: init.json,
      parsed: init.parsed,
      errors: init.errors,
      isPlaying: false,
      isExporting: false,
    });
  },
  setAspectRatio: (ratio: string) => set({ aspectRatio: ratio }),
  setPreviewSize: (size: number) => set({ previewSize: size }),
}));

export { DEFAULT_CODE };
