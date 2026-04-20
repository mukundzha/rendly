import { 
  ParsedDemo, 
  DemoElement, 
  DemoConfig, 
  DEFAULT_CONFIG,
  AnimationType,
  PositionType,
  ParseError
} from '@/types/demo';
import { KEYWORDS, ANIMATION_ALIASES, ERROR_MESSAGES } from './tokens';

let elementIdCounter = 0;

function generateId(): string {
  return `element_${++elementIdCounter}`;
}

function resetIdCounter() {
  elementIdCounter = 0;
}

function parseNumber(value: string): number | null {
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function extractQuotedString(line: string): { value: string; rest: string } | null {
  const match = line.match(/\s*\"([^\"]+)\"\s*(.*)$/);
  if (!match) return null;
  return { value: match[1], rest: match[2] ? match[2].trim() : '' };
}

function extractAnimation(line: string): { animation: AnimationType; rest: string } | null {
  for (const anim of KEYWORDS.ANIMATIONS) {
    if (line.toUpperCase().includes(anim.toLowerCase())) {
      const regex = new RegExp(anim, 'i');
      // Remove the animation keyword and clean up
      let rest = line.replace(regex, '').replace(/^\s+/, '').replace(/\s+/g, ' ').trim();
      // Remove any stray quotes
      rest = rest.replace(/^"+|"+$/g, '').trim();
      return { animation: anim as AnimationType, rest };
    }
  }
  return null;
}

function extractModifier(line: string, modifier: string): string | null {
  const regex = new RegExp(`${modifier}\\s+(\\S+)`, 'i');
  const match = line.match(regex);
  return match ? match[1] : null;
}

function parseSetCommand(line: string, config: DemoConfig): DemoConfig | ParseError {
  const newConfig = { ...config };
  
  // Presets
  const bgPresets: Record<string, string> = {
    white: '#FFFFFF', black: '#000000', dark: '#1a1a1a', gray: '#F5F5F5',
    blue: '#3B82F6', purple: '#8B5CF6', red: '#EF4444', green: '#10B981',
    pink: '#EC4899', orange: '#F97316', yellow: '#EAB308', indigo: '#6366F1',
  };
  const colorPresets: Record<string, string> = {
    white: '#FFFFFF', black: '#000000', dark: '#1a1a1a', gray: '#6B7280',
    blue: '#3B82F6', purple: '#8B5CF6', red: '#EF4444', green: '#10B981',
    pink: '#EC4899', orange: '#F97316', yellow: '#EAB308',
  };
  const fontMap: Record<string, string> = {
    'instrument': "'Instrument Serif', serif",
    'instrument_serif': "'Instrument Serif', serif",
    system: 'system-ui, sans-serif', 
    serif: 'Georgia, serif', 
    mono: 'Menlo, monospace',
    arial: 'Arial, sans-serif', 
    times: 'Times New Roman, serif',
    courier: 'Courier New, monospace', 
    helvetica: 'Helvetica, sans-serif',
    verdana: 'Verdana, sans-serif',
    poppins: "'Poppins', sans-serif",
    inter: "'Inter', sans-serif",
    'plus jakarta': "'Plus Jakarta Sans', sans-serif",
    manrope: "'Manrope', sans-serif",
    'dm sans': "'DM Sans', sans-serif",
    geist: "'Geist', sans-serif",
    syne: "'Syne', sans-serif",
    'plus_jakarta_sans': "'Plus Jakarta Sans', sans-serif",
  };
  
  const widthMatch = line.match(/WIDTH\s+(\d+)/i);
  if (widthMatch) newConfig.width = parseInt(widthMatch[1], 10);
  
  const heightMatch = line.match(/HEIGHT\s+(\d+)/i);
  if (heightMatch) newConfig.height = parseInt(heightMatch[1], 10);
  
  const fpsMatch = line.match(/FPS\s+(\d+)/i);
  if (fpsMatch) newConfig.fps = parseInt(fpsMatch[1], 10);
  
  // Background - hex or preset
  const bgMatch = line.match(/BACKGROUND\s+(\w+)/i);
  if (bgMatch) {
    const bg = bgMatch[1].toLowerCase();
    newConfig.background = bgPresets[bg] || bg;
  }
  const hexBg = line.match(/BACKGROUND\s+(#[0-9A-Fa-f]+)/i);
  if (hexBg) newConfig.background = hexBg[1];
  
  // Color - hex or preset  
  const colorMatch = line.match(/COLOR\s+(\w+)/i);
  if (colorMatch) {
    const c = colorMatch[1].toLowerCase();
    newConfig.color = colorPresets[c] || c;
  }
  const hexColor = line.match(/COLOR\s+(#[0-9A-Fa-f]+)/i);
  if (hexColor) newConfig.color = hexColor[1];
  
  // Font
  const fontMatch = line.match(/FONT\s+(\w+)/i);
  if (fontMatch) {
    const fontName = fontMatch[1].toLowerCase();
    // Check if it's a custom uploaded font
    if (typeof window !== 'undefined') {
      let isCustomFont = false;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('rendly_font_')) {
          const storedFontName = key.replace('rendly_font_', '').replace(/\.[^.]+$/, '').toLowerCase();
          if (storedFontName === fontName) {
            isCustomFont = true;
            break;
          }
        }
      }
      newConfig.fontFamily = isCustomFont ? `font_${fontName}` : (fontMap[fontName] || fontMap.system);
    } else {
      newConfig.fontFamily = fontMap[fontName] || fontMap.system;
    }
  }
  
  return newConfig;
}

export function parseDemo(dsl: string): { demo: ParsedDemo; errors: ParseError[] } {
  resetIdCounter();
  
  const lines = dsl.split('\n');
  const elements: DemoElement[] = [];
  const errors: ParseError[] = [];
  let config = { ...DEFAULT_CONFIG };
  let currentConfig = { ...DEFAULT_CONFIG };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const lineNumber = index + 1;
    
    if (!trimmedLine || trimmedLine.startsWith('//')) {
      return;
    }
    
    if (trimmedLine.toUpperCase() === 'END') {
      return;
    }
    
    const upperLine = trimmedLine.toUpperCase();
    
    if (upperLine.startsWith('SET ')) {
      const result = parseSetCommand(trimmedLine, currentConfig);
      if ('message' in result) {
        errors.push(result as ParseError);
      } else {
        currentConfig = result as DemoConfig;
      }
      return;
    }
    
    if (upperLine.startsWith('WAIT ')) {
      const forMatch = trimmedLine.match(/WAIT\s+([\d.]+)\s*SECONDS?/i);
      if (forMatch) {
        const duration = parseFloat(forMatch[1]);
        elements.push({
          id: generateId(),
          type: 'text',
          content: '',
          animation: 'FADE IN',
          duration: 0,
          wait: duration,
          position: 'center',
        });
      } else {
        errors.push({
          line: lineNumber,
          message: 'Invalid WAIT syntax',
          friendlyMessage: ERROR_MESSAGES.MISSING_DURATION(),
        });
      }
      return;
    }
    
    if (upperLine.startsWith('SHOW ') || upperLine.startsWith('HIDE ') || upperLine.startsWith('AUDIO ')) {
      const isShow = upperLine.startsWith('SHOW ');
      const isAudio = upperLine.startsWith('AUDIO ');
      
      const contentResult = extractQuotedString(trimmedLine);
      if (!contentResult) {
        errors.push({
          line: lineNumber,
          message: 'Missing quoted string',
          friendlyMessage: ERROR_MESSAGES.MISSING_QUOTES(),
        });
        return;
      }
      
      const { value: content, rest: modifiers } = contentResult;
      const animationResult = extractAnimation(modifiers);
      
      let animation: AnimationType = isShow ? 'FADE IN' : 'FADE OUT';
      let duration = 2;
      let fontSize = 48;
      let color = currentConfig.color;
      let position: PositionType = 'center';
      let wait = 0;
      
      if (animationResult) {
        animation = animationResult.animation;
      }
      
      const forMatch = modifiers.match(/FOR\s+([\d.]+)\s*SECONDS?/i);
      if (forMatch) duration = parseFloat(forMatch[1]);
      
      const sizeMatch = modifiers.match(/SIZE\s+(\d+)/i);
      if (sizeMatch) fontSize = parseInt(sizeMatch[1], 10);
      
      // Color - hex or preset
      const colorPresets: Record<string, string> = {
        white: '#FFFFFF', black: '#000000', dark: '#1a1a1a', gray: '#6B7280',
        blue: '#3B82F6', purple: '#8B5CF6', red: '#EF4444', green: '#10B981',
      };
      const colorMatch = modifiers.match(/COLOR\s+(\w+)/i);
      if (colorMatch) {
        color = colorPresets[colorMatch[1].toLowerCase()] || currentConfig.color;
      }
      const hexColor = modifiers.match(/COLOR\s+(#[0-9A-Fa-f]+)/i);
      if (hexColor) color = hexColor[1];
      
      const posMatch = modifiers.match(/POSITION\s+(\w+)/i);
      if (posMatch) {
        const pos = posMatch[1].toUpperCase();
        if (KEYWORDS.POSITIONS.includes(pos as any)) {
          position = pos.toLowerCase() as PositionType;
        }
      }
      
      const waitMatch = modifiers.match(/WAIT\s+([\d.]+)/i);
      if (waitMatch) wait = parseFloat(waitMatch[1]);
      
      // Parse FONT for element
      let fontFamily = currentConfig.fontFamily;
      const fontMatch = modifiers.match(/FONT\s+(\w+)/i);
      if (fontMatch) {
        const elementFontMap: Record<string, string> = {
          'instrument': "'Instrument Serif', serif",
          'instrument_serif': "'Instrument Serif', serif",
          system: 'system-ui, sans-serif',
          serif: 'Georgia, serif', 
          mono: 'Menlo, monospace', 
          arial: 'Arial, sans-serif',
          times: 'Times New Roman, serif', 
          courier: 'Courier New, monospace',
          helvetica: 'Helvetica, sans-serif', 
          verdana: 'Verdana, sans-serif',
          poppins: "'Poppins', sans-serif",
          inter: "'Inter', sans-serif",
          'plus jakarta': "'Plus Jakarta Sans', sans-serif",
          manrope: "'Manrope', sans-serif",
          'dm sans': "'DM Sans', sans-serif",
          geist: "'Geist', sans-serif",
          syne: "'Syne', sans-serif",
          'plus_jakarta_sans': "'Plus Jakarta Sans', sans-serif",
        };
        fontFamily = elementFontMap[fontMatch[1].toLowerCase()] || fontFamily;
      }
      
      // Bold
      let fontWeight = 'normal';
      if (modifiers.match(/\bBOLD\b/i)) fontWeight = 'bold';
      
      // Italic
      let fontStyle: string | undefined;
      if (modifiers.match(/\bITALIC\b/i)) fontStyle = 'italic';
      
      // Text Shadow
      let textShadow: string | undefined;
      const shadowMatch = modifiers.match(/SHADOW\s+(\w+)/i);
      if (shadowMatch) {
        const s = shadowMatch[1].toLowerCase();
        const shadowMap: Record<string, string> = {
          light: '2px 2px 4px rgba(0,0,0,0.3)',
          medium: '2px 2px 8px rgba(0,0,0,0.5)',
          heavy: '4px 4px 12px rgba(0,0,0,0.7)',
        };
        textShadow = shadowMap[s] || shadowMap.light;
      }
      
      // Letter Spacing
      let letterSpacing: string | undefined;
      const spacingMatch = modifiers.match(/SPACING\s+(\w+)/i);
      if (spacingMatch) {
        const s = spacingMatch[1].toLowerCase();
        const spacingMap: Record<string, string> = {
          tight: '-0.05em',
          normal: '0em',
          wide: '0.1em',
          wider: '0.2em',
        };
        letterSpacing = spacingMap[s] || '0em';
      }
      // Custom spacing value
      const customSpacingMatch = modifiers.match(/SPACING\s+(-?\d+(?:\.\d+)?)(EM|px)?/i);
      if (customSpacingMatch) {
        letterSpacing = customSpacingMatch[2] 
          ? `${customSpacingMatch[1]}${customSpacingMatch[2]}`
          : `${customSpacingMatch[1]}em`;
      }
      
      // Line Height
      let lineHeight: string | undefined;
      const lineHeightMatch = modifiers.match(/LINE\s+HEIGHT\s+(\d+(?:\.\d+)?)/i);
      if (lineHeightMatch) {
        lineHeight = lineHeightMatch[1];
      }
      // Also support LH as shorthand
      const lhMatch = modifiers.match(/\bLH\s+(\d+(?:\.\d+)?)/i);
      if (lhMatch) {
        lineHeight = lhMatch[1];
      }
      
      // Text Align
      let textAlign: string | undefined;
      const alignMatch = modifiers.match(/ALIGN\s+(LEFT|CENTER|RIGHT|JUSTIFY)/i);
      if (alignMatch) {
        textAlign = alignMatch[1].toLowerCase();
      }
      
      // Image Width (percentage or pixel)
      let width: string | undefined;
      const widthMatch = modifiers.match(/WIDTH\s+(\d+(?:%|px)?)/i);
      if (widthMatch) {
        width = widthMatch[1];
      }
      
      // Image Border Radius
      let borderRadius: string | undefined;
      const radiusMatch = modifiers.match(/RADIUS\s+(\d+(?:%|px)?|FULL)/i);
      if (radiusMatch) {
        if (radiusMatch[1].toUpperCase() === 'FULL') {
          borderRadius = '50%';
        } else {
          borderRadius = radiusMatch[1].includes('%') || radiusMatch[1].includes('px') 
            ? radiusMatch[1] 
            : `${radiusMatch[1]}px`;
        }
      }
      
      // Image Object Fit
      let objectFit: 'cover' | 'contain' | 'fill' | 'none' | undefined;
      const fitMatch = modifiers.match(/FIT\s+(COVER|CONTAIN|FILL|NONE)/i);
      if (fitMatch) {
        objectFit = fitMatch[1].toLowerCase() as 'cover' | 'contain' | 'fill' | 'none';
      }
      
      // Image/Media Opacity (0-100)
      let mediaOpacity: number | undefined;
      const opacityMatch = modifiers.match(/OPACITY\s+(\d+)/i);
      if (opacityMatch) {
        mediaOpacity = Math.min(100, Math.max(0, parseInt(opacityMatch[1], 10))) / 100;
      }
      
      // Alternative opacity keyword
      const altOpacityMatch = modifiers.match(/TRANSPARENCY\s+(\d+)/i);
      if (altOpacityMatch) {
        mediaOpacity = Math.min(100, Math.max(0, parseInt(altOpacityMatch[1], 10))) / 100;
      }
      
      // Check media type - simple file extension or data URL
      const hasImageExt = content.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);
      const hasAudioExt = content.match(/\.(mp3|wav|ogg|m4a|aac)$/i);
      const isBase64 = content.startsWith('data:');
      const isUrl = content.startsWith('http');
      
      let type: 'text' | 'image' | 'audio' = 'text';
      let src: string | undefined = undefined;
      
      // Try to get from localStorage if it's a filename
      if (hasImageExt && !isBase64 && !isUrl) {
        // Has image extension - it's an image
        type = 'image';
        src = content;
      } else if (hasAudioExt) {
        type = 'audio';
        src = content;
      } else if (isBase64 || isUrl) {
        // Direct data URL or HTTP URL
        type = 'image';
        src = content;
      } else {
        // Default to text - no extension means it's text content
        type = 'text';
        src = undefined;
      }
      
      elements.push({
        id: generateId(),
        type: type,
        content: content,
        src: src,
        animation,
        duration,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        color,
        position,
        textAlign,
        textShadow,
        letterSpacing,
        lineHeight,
        wait,
        width,
        borderRadius,
        objectFit,
        mediaOpacity,
      });
    }
  });
  
  config = currentConfig;
  
  return {
    demo: {
      config,
      elements,
    },
    errors,
  };
}

export function demoToJson(demo: ParsedDemo): string {
  return JSON.stringify(demo, null, 2);
}

export function validateDemo(demo: ParsedDemo): ParseError[] {
  const errors: ParseError[] = [];
  
  if (demo.elements.length === 0) {
    errors.push({
      line: 0,
      message: 'No elements defined',
      friendlyMessage: 'Add at least one SHOW or WAIT command',
    });
  }
  
  for (const element of demo.elements) {
    if (!element.content && !element.wait) {
      errors.push({
        line: 0,
        message: 'Empty element',
        friendlyMessage: 'Add content to your SHOW command',
      });
    }
  }
  
  return errors;
}