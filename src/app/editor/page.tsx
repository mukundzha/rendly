'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Play, Square, Plus, BookOpen, Command, Palette, Type, Zap, Layers, ChevronRight, X, Download } from 'lucide-react';

type Scene = {
  name: string;
  type: 'text' | 'shape';
  shape?: string;
  color: string;
  background?: string;
  animation: string;
  duration: number;
  font?: string;
  size?: number;
};

const DEFAULT_CODE = `// .to create new scene,give an space of two lines between code.

TEXT "Start Creating"
FONT Inter
COLOR #1A1A1A
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 1.5s`;

const COMMANDS = [
  { cmd: 'TEXT', desc: 'Display text on screen', example: 'TEXT "Hello World"' },
  { cmd: 'SHAPE', desc: 'Add geometric shape', example: 'SHAPE circle' },
  { cmd: 'COLOR', desc: 'Text or shape color', example: 'COLOR #FF4D00' },
  { cmd: 'BACKGROUND', desc: 'Canvas background', example: 'BACKGROUND #000000' },
  { cmd: 'FONT', desc: 'Set font family', example: 'FONT Inter' },
  { cmd: 'SIZE', desc: 'Font size in px', example: 'SIZE 48' },
  { cmd: 'ANIMATION', desc: 'Animation type', example: 'ANIMATION fade in' },
  { cmd: 'DURATION', desc: 'Scene duration', example: 'DURATION 1.5s' },
];

const ANIMATIONS = ['fade in', 'slide up', 'pop', 'bounce'];
const SHAPES = ['circle', 'square', 'rect', 'diamond'];

function EditorContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleComment = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const lines = code.split('\n');
    let result: string[] = [];
    let lineStart = 0;
    let lineEnd = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const lineLen = lines[i].length + 1;
      if (charCount <= start && start < charCount + lineLen) lineStart = i;
      if (charCount < end && end <= charCount + lineLen) { lineEnd = i; break; }
      charCount += lineLen;
    }
    
    for (let i = lineStart; i <= lineEnd; i++) {
      if (lines[i].startsWith('// ')) {
        result.push(lines[i].substring(3));
      } else if (lines[i].trim()) {
        result.push('// ' + lines[i]);
      } else {
        result.push(lines[i]);
      }
    }
    
    const newCode = [...lines.slice(0, lineStart), ...result, ...lines.slice(lineEnd + 1)].join('\n');
    setCode(newCode);
  }, [code]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleComment();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleComment]);

  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      try {
        const decodedCode = atob(codeParam);
        setCode(decodedCode);
      } catch (e) {
        console.error('Failed to decode code from URL');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('rendly_guide_seen');
    if (!hasSeenGuide) {
      setShowGuide(true);
      localStorage.setItem('rendly_guide_seen', 'true');
    }
  }, []);

  const parseCode = useCallback((codeText: string): Scene[] => {
    if (!codeText.trim()) return [];

    const blocks = codeText.split(/\n\n\n+/);
    const parsedScenes: Scene[] = [];

    for (const block of blocks) {
      if (!block.trim()) continue;
      
      const lines = block.split('\n');
      const scene: Partial<Scene> = {
        type: 'text',
        animation: 'fade in',
        duration: 1500,
        color: '#000000',
        background: '#ffffff',
      };

      for (const line of lines) {
        if (line.trim().startsWith('// ')) continue;
        const upper = line.toUpperCase().trim();
        if (upper.startsWith('TEXT ')) {
          const match = line.match(/TEXT\s+"([^"]+)"/i);
          if (match) {
            scene.name = match[1];
            scene.type = 'text';
          }
        } else if (upper.startsWith('SHAPE ')) {
          const match = line.match(/SHAPE\s+(\w+)/i);
          if (match) {
            scene.shape = match[1].toLowerCase();
            scene.type = 'shape';
          }
        } else if (upper.startsWith('ANIMATION ')) {
          scene.animation = line.replace(/ANIMATION\s+/i, '').trim().toLowerCase();
        } else if (upper.startsWith('DURATION ')) {
          const d = line.replace(/DURATION\s+/i, '').replace('s', '').replace('S', '');
          scene.duration = parseFloat(d) * 1000;
        } else if (upper.startsWith('COLOR ')) {
          scene.color = line.replace(/COLOR\s+/i, '').trim();
        } else if (upper.startsWith('FONT ')) {
          scene.font = line.replace(/FONT\s+/i, '').trim();
        } else if (upper.startsWith('SIZE ')) {
          scene.size = parseInt(line.replace(/SIZE\s+/i, ''));
        } else if (upper.startsWith('BACKGROUND ')) {
          scene.background = line.replace(/BACKGROUND\s+/i, '').trim();
        }
      }

      if (scene.name || scene.shape) {
        parsedScenes.push(scene as Scene);
      }
    }

    return parsedScenes;
  }, []);

  useEffect(() => {
    const parsed = parseCode(code);
    setScenes(parsed);
  }, [code, parseCode]);

  useEffect(() => {
    if (!isPlaying || scenes.length === 0 || currentScene >= scenes.length) return;

    const duration = scenes[currentScene]?.duration || 1500;
    const timeout = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        setIsPlaying(false);
        setCurrentScene(0);
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [isPlaying, currentScene, scenes]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentScene(0);
    } else {
      setCurrentScene(0);
      setIsPlaying(true);
    }
  };

  const addNewScene = () => {
    const newCode = code + '\n\n\nTEXT "New Scene"\nANIMATION fade in\nDURATION 1s';
    setCode(newCode);
    setIsPlaying(false);
    setCurrentScene(scenes.length);
  };

  const insertCommand = (cmd: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + '\n' + cmd + code.substring(end);
      setCode(newCode);
    }
  };

  const exportVideo = async () => {
    if (scenes.length === 0 || isExporting) return;
    
    setIsExporting(true);
    setExportProgress(0);
    
    const canvas = document.createElement('canvas');
    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    const stream = canvas.captureStream(60);
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    
    recorder.start();
    
    const animationMap: Record<string, string> = {
      'fade in': 'fadeIn',
      'slide up': 'slideUp',
      'pop': 'pop',
      'bounce': 'bounce',
    };
    
    const animateKeyframes = (name: string, progress: number, draw: () => void) => {
      ctx.save();
      switch (name) {
        case 'fadeIn':
          ctx.globalAlpha = progress;
          ctx.translate(width / 2, height / 2);
          ctx.scale(0.95 + 0.05 * progress, 0.95 + 0.05 * progress);
          ctx.translate(-width / 2, -height / 2);
          break;
        case 'slideUp':
          ctx.globalAlpha = progress;
          const yOffset = (1 - progress) * 50;
          ctx.translate(0, yOffset);
          break;
        case 'pop':
          const scale = progress < 0.7 ? progress / 0.7 * 1.1 : 1.1 - (progress - 0.7) / 0.3 * 0.1;
          ctx.translate(width / 2, height / 2);
          ctx.scale(scale, scale);
          ctx.translate(-width / 2, -height / 2);
          break;
        case 'bounce':
          const bounceY = Math.sin(progress * Math.PI) * -30;
          ctx.translate(0, bounceY);
          break;
      }
      draw();
      ctx.restore();
    };
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const duration = scene.duration || 1500;
      const animName = animationMap[scene.animation?.toLowerCase() || 'fade in'] || 'fadeIn';
      const frames = Math.ceil((duration / 1000) * 60);
      
      for (let f = 0; f < frames; f++) {
        const progress = (f + 1) / frames;
        
        ctx.fillStyle = scene.background || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        ctx.save();
        
        if (scene.type === 'text') {
          const fontName = scene.font || 'Inter';
          ctx.font = `${scene.size || 64}px ${fontName}, sans-serif`;
          ctx.fillStyle = scene.color || '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const drawText = () => {
            ctx.fillText(scene.name || '', width / 2, height / 2);
          };
          animateKeyframes(animName, progress, drawText);
        } else if (scene.type === 'shape' && scene.shape) {
          const drawShape = () => {
            ctx.fillStyle = scene.color || '#FF4D00';
            const size = 120;
            const x = width / 2 - size / 2;
            const y = height / 2 - size / 2;
            
            if (scene.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(width / 2, height / 2, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (scene.shape === 'square') {
              ctx.fillRect(x, y, size, size);
            } else if (scene.shape === 'rect') {
              ctx.fillRect(x, y, size * 1.5, size);
            } else if (scene.shape === 'diamond') {
              ctx.beginPath();
              ctx.moveTo(width / 2, y);
              ctx.lineTo(x + size, height / 2);
              ctx.lineTo(width / 2, y + size);
              ctx.lineTo(x, height / 2);
              ctx.closePath();
              ctx.fill();
            }
          };
          animateKeyframes(animName, progress, drawShape);
        }
        
        ctx.restore();
        
        setExportProgress(Math.round(((i * frames + f) / (scenes.length * frames)) * 80));
        await new Promise(r => setTimeout(r, 1000 / 60));
      }
    }
    
    setExportProgress(90);
    recorder.stop();
    
    await new Promise(r => setTimeout(r, 500));
    
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rendly-video.webm';
    a.click();
    URL.revokeObjectURL(url);
    
    setExportProgress(100);
    setTimeout(() => {
      setIsExporting(false);
      setExportProgress(0);
    }, 1500);
  };

  const lines = code.split('\n');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Welcome to Editor</h2>
                  <p className="text-sm text-gray-500">Quick guide to get you started</p>
                </div>
              </div>
              <button onClick={() => setShowGuide(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-orange-600 font-medium mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>How it works</span>
                </div>
                <p className="text-sm text-gray-600">
                  Write DSL code to create scenes. Each scene is separated by 2+ line breaks.
                  Click <strong>Play</strong> to preview all scenes sequentially.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Command className="w-4 h-4" />
                  <span>Available Commands</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {COMMANDS.map((c) => (
                    <button
                      key={c.cmd}
                      onClick={() => insertCommand(c.cmd + ' ')}
                      className="text-left p-2 bg-gray-50 hover:bg-orange-50 hover:border-orange-200 border border-transparent rounded-lg transition-colors group"
                    >
                      <code className="text-xs text-orange-600 font-medium">{c.cmd}</code>
                      <p className="text-xs text-gray-500 group-hover:text-gray-600">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Zap className="w-4 h-4" />
                  <span>Animations</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ANIMATIONS.map((anim) => (
                    <span key={anim} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
                      {anim}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Palette className="w-4 h-4" />
                  <span>Shapes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SHAPES.map((shape) => (
                    <span key={shape} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono capitalize">
                      {shape}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">// Example with multiple scenes</p>
                <code className="text-sm text-white block">TEXT &quot;Hello&quot;</code>
                <code className="text-sm text-orange-400 block">ANIMATION fade in</code>
                <code className="text-sm text-yellow-400 block">DURATION 1.5s</code>
                <code className="text-sm text-gray-600 block my-2">{'// 2+ newlines = new scene'}</code>
                <code className="text-sm text-white block">TEXT &quot;World&quot;</code>
                <code className="text-sm text-orange-400 block">ANIMATION slide up</code>
                <code className="text-sm text-yellow-400 block">DURATION 1s</code>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.5); } 70% { transform: scale(1.1); } to { opacity: 1; transform: scale(1); } }
        .anim-fade { animation: fadeIn 0.6s ease-out both; }
        .anim-slide { animation: slideUp 0.6s ease-out both; }
        .anim-pop { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        textarea { caret-color: #f97316; }
      `}</style>

      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <a href="/dashboard" className="p-1.5 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </a>
        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">R</span>
        </div>
        <span className="text-sm font-medium text-gray-700">Editor</span>
        <button
          onClick={() => setShowGuide(true)}
          className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-xs text-gray-500 font-medium">CODE</span>
            <button
              onClick={addNewScene}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Scene</span>
            </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-10 py-4 bg-gray-50 border-r border-gray-100 text-right pr-2">
              {lines.map((_, i) => (
                <div key={i} className="text-xs text-gray-300 font-mono leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onClick={(e) => (e.target as HTMLTextAreaElement).focus()}
              className="flex-1 p-4 font-mono text-sm leading-6 resize-none focus:outline-none text-gray-800 cursor-text"
              placeholder="TEXT &quot;Your text&quot;"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="px-4 py-2 border-b border-gray-200 bg-white flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">PREVIEW</span>
            <button
              onClick={exportVideo}
              disabled={isExporting || scenes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors disabled:opacity-50"
            >
              {isExporting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-white/30 rounded-full animate-pulse" />
                  {exportProgress}%
                </span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div 
              className="w-full max-w-lg aspect-video rounded-lg overflow-hidden shadow-sm border border-gray-200"
              style={{ backgroundColor: scenes[currentScene]?.background || '#ffffff' }}
            >
              {scenes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-300 text-sm font-mono">
                  Write code to preview
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6">
                  {scenes[currentScene]?.type === 'text' ? (
                    <span
                      className={`text-center ${
                        isPlaying ? `anim-${scenes[currentScene]?.animation?.replace(' ', '') || 'fade'}` : ''
                      }`}
                      style={{
                        fontFamily: scenes[currentScene]?.font || 'sans-serif',
                        fontSize: scenes[currentScene]?.size || 32,
                        color: scenes[currentScene]?.color,
                      }}
                    >
                      {scenes[currentScene]?.name}
                    </span>
                  ) : (
                    <div
                      className={isPlaying ? `anim-${scenes[currentScene]?.animation?.replace(' ', '') || 'fade'}` : ''}
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: scenes[currentScene]?.color,
                        borderRadius: scenes[currentScene]?.shape === 'circle' ? '50%' : '8px',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Scene {currentScene + 1} of {scenes.length}
              </div>
              <button
                onClick={togglePlay}
                disabled={scenes.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isPlaying 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
}