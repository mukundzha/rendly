'use client';

import { useCallback, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useDemoStore } from '@/lib/store';
import { Terminal, Loader2 } from 'lucide-react';

const DSL_THEME: any = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6B6B6B', fontStyle: 'italic' },
    { token: 'command', foreground: 'FF4D00', fontStyle: 'bold' },
    { token: 'animation', foreground: '98C379' },
    { token: 'modifier', foreground: 'E5C07B' },
    { token: 'number', foreground: 'D19A66' },
    { token: 'string', foreground: '98C379' },
    { token: 'position', foreground: '61AFEF' },
  ],
  colors: {
    'editor.background': '#0C0C0C',
    'editor.foreground': '#F5F5F0',
    'editor.lineHighlightBackground': '#1A1A1A',
    'editor.selectionBackground': '#2A2A2A',
    'editorCursor.foreground': '#FF4D00',
    'editorLineNumber.foreground': '#3A3A3A',
    'editorLineNumber.activeForeground': '#6B6B6B',
  },
};

function registerDSLLanguage(monaco: any) {
  monaco.languages.register({ id: 'democode' });
  monaco.languages.setMonarchTokensProvider('democode', {
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\b(SHOW|HIDE|WAIT|SET|END)\b/, 'command'],
        [/\b(FADE IN|FADE OUT|SLIDE UP|SLIDE DOWN|SLIDE LEFT|SLIDE RIGHT|TYPE|ZOOM IN|ZOOM OUT|SHAKE|BOUNCE|POP)\b/, 'animation'],
        [/\b(FOR|SIZE|COLOR|POSITION|WIDTH|HEIGHT|RADIUS|FIT|OPACITY|FPS|BACKGROUND|ALIGN|SPACING|LINE HEIGHT|BOLD|ITALIC)\b/, 'modifier'],
        [/\b(CENTER|TOP|BOTTOM|LEFT|RIGHT)\b/, 'position'],
        [/"[^"]*"/, 'string'],
        [/\b\d+(?:\.\d+)?\b/, 'number'],
        [/\b(white|black|dark|red|green|blue|yellow|orange|purple|pink|gray|grey)\b/i, 'string'],
        [/\#[0-9A-Fa-f]{3,8}\b/, 'number'],
      ],
    },
  });
  monaco.editor.defineTheme('democode-dark', DSL_THEME);
}

export default function CodeEditor() {
  const { code } = useDemoStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const handleMount: OnMount = useCallback((editor, monaco) => {
    registerDSLLanguage(monaco);
    
    editor.updateOptions({
      readOnly: true,
      fontSize: 13,
      fontFamily: "'Geist Mono', 'SF Mono', monospace",
      lineHeight: 22,
      padding: { top: 16, bottom: 16 },
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderLineHighlight: 'none',
      automaticLayout: true,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
      },
    });
    
    setIsLoading(false);
  }, []);
  
  return (
<div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF4D00] flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-gray-700 font-mono uppercase tracking-widest bg-gray-100 px-2 py-1">
            DSL EDITOR
          </span>
        </div>
      </div>
      
<div className="flex-1 flex relative">
        <Editor
          height="100%"
          defaultLanguage="democode"
          theme="democode-dark"
          value={code}
          onMount={handleMount}
          options={{
            readOnly: true,
            fontSize: 13,
            fontFamily: "'Geist Mono', 'SF Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineHeight: 22,
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
}
