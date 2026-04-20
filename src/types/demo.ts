export interface ParsedDemo {
  config: DemoConfig;
  elements: DemoElement[];
}

export interface ParseError {
  line: number;
  message: string;
  friendlyMessage: string;
}

export const DEFAULT_CONFIG: DemoConfig = {
  width: 1920,
  height: 1080,
  fps: 30,
  background: '#FFFFFF',
  color: '#111111',
  fontFamily: "'Instrument Serif', serif",
  textAlign: 'center',
};

export interface DemoConfig {
  width: number;
  height: number;
  fps: number;
  background: string;
  color: string;
  fontFamily?: string;
  textAlign?: string;
}

export interface DemoElement {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  src?: string;
  animation: string;
  duration: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  position: string;
  textAlign?: string;
  textShadow?: string;
  letterSpacing?: string;
  lineHeight?: string;
  wait?: number;
  volume?: number;
  width?: string;
  borderRadius?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  mediaOpacity?: number;
};

export type AnimationType = string;
export type PositionType = string;

export const VALID_COMMANDS = ['SHOW', 'HIDE', 'WAIT', 'SET', 'END'] as const;
export type Command = typeof VALID_COMMANDS[number];

// Presets
export const FONT_PRESETS = [
  { name: 'Instrument Serif', value: "'Instrument Serif', serif" },
  { name: 'System', value: 'system-ui, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Mono', value: 'Menlo, monospace' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times', value: 'Times New Roman, serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Courier', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
] as const;

export const BG_PRESETS: Record<string, string> = {
  white: '#FFFFFF',
  black: '#000000',
  dark: '#1a1a1a',
  gray: '#F5F5F5',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444',
  green: '#10B981',
  pink: '#EC4899',
  orange: '#F97316',
  yellow: '#EAB308',
  indigo: '#6366F1',
  teal: '#14B8A6',
};

export const COLOR_PRESETS: Record<string, string> = {
  white: '#FFFFFF',
  black: '#000000',
  dark: '#1a1a1a',
  gray: '#6B7280',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  red: '#EF4444',
  green: '#10B981',
  pink: '#EC4899',
  orange: '#F97316',
  yellow: '#EAB308',
};