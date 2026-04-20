'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDemoStore } from '@/lib/store';
import { Play, Square, RotateCcw, SkipForward, Sparkles } from 'lucide-react';

type Scene = {
  background: string;
  animation: string;
  elementType: 'circle' | 'rect' | 'none';
  elementColor: string;
  elementBg?: string;
  elementBorderRadius?: number;
  label: string;
  description: string;
  fontDescription?: string;
  duration: number;
};

const SCENES: Scene[] = [
  // 01: FADE IN
  {
    background: 'white',
    animation: 'fadeIn',
    elementType: 'circle',
    elementColor: '#000000',
    elementBg: 'transparent',
    label: 'FADE IN',
    description: 'Smooth fade-in animation for elegant entrances',
    fontDescription: 'Instrument Serif • Elegant typography',
    duration: 4000,
  },
  // 02: SLIDE UP
  {
    background: 'white',
    animation: 'slideUp',
    elementType: 'rect',
    elementColor: '#10B981',
    elementBg: '#10B981',
    elementBorderRadius: 16,
    label: 'SLIDE UP',
    description: 'Elements slide from bottom with smooth easing',
    fontDescription: 'Instrument Serif • Natural motion',
    duration: 4000,
  },
  // 03: TYPEWRITER
  {
    background: 'white',
    animation: 'typewriter',
    elementType: 'none',
    elementColor: '#8B5CF6',
    elementBg: 'transparent',
    label: 'TYPEWRITER',
    description: 'Typewriter effect - characters appear one by one',
    fontDescription: 'Instrument Serif • Classic feel',
    duration: 4000,
  },
  // 04: POP
  {
    background: 'white',
    animation: 'pop',
    elementType: 'rect',
    elementColor: '#EF4444',
    elementBg: '#EF4444',
    elementBorderRadius: 20,
    label: 'POP IN',
    description: 'Smooth scale pop with overshoot',
    fontDescription: 'Instrument Serif • Smooth curves',
    duration: 4000,
  },
  // 06: SHAKE
  {
    background: 'white',
    animation: 'shake',
    elementType: 'rect',
    elementColor: '#EC4899',
    elementBg: '#EC4899',
    elementBorderRadius: 12,
    label: 'SHAKE',
    description: 'Attention-grabbing shake animation',
    fontDescription: 'Instrument Serif • Bold impact',
    duration: 4000,
  },
  // 07: TYPOGRAPHY - No shape
  {
    background: 'white',
    animation: 'none',
    elementType: 'none',
    elementColor: '#000000',
    elementBg: 'transparent',
    label: 'TYPOGRAPHY',
    description: 'Create stunning text with precise control over size, weight, and style. Support for bold, italic, and custom spacing.',
    fontDescription: 'Instrument Serif • Premium type',
    duration: 5000,
  },
  // 08: COLORS - No shape
  {
    background: 'white',
    animation: 'none',
    elementType: 'none',
    elementColor: '#FF4D00',
    elementBg: 'transparent',
    label: 'COLORS',
    description: 'Full color support with hex codes, presets, and custom palettes for any brand identity',
    fontDescription: 'Instrument Serif • Vibrant shades',
    duration: 4000,
  },
  // 09: BG COLOR - Background color cycling
  {
    background: 'white',
    animation: 'none',
    elementType: 'none',
    elementColor: '#000000',
    elementBg: 'transparent',
    elementBorderRadius: 0,
    label: 'BG COLOR',
    description: '',
    fontDescription: 'Syne • Poppins • Serif',
    duration: 4000,
  },
  // 10: SHAPES
  {
    background: 'white',
    animation: 'typewriter',
    elementType: 'circle',
    elementColor: '#14B8A6',
    elementBg: 'transparent',
    label: 'SHAPES',
    description: 'Support for circles, rectangles, and rounded corners. Perfect for cards, buttons, and UI elements',
    fontDescription: 'Instrument Serif • Geometric forms',
    duration: 4000,
  },
  // 11: SIZES - No shape
  {
    background: 'white',
    animation: 'none',
    elementType: 'none',
    elementColor: '#000000',
    elementBg: '#000000',
    elementBorderRadius: 8,
    label: 'SIZES',
    description: 'Dynamic font sizes from 12px to 120px with pixel-perfect rendering at any resolution',
    fontDescription: 'Instrument Serif • Scalable type',
    duration: 4000,
  },
  // 12: CTA - No shape
  {
    background: 'white',
    animation: 'none',
    elementType: 'none',
    elementColor: '#FF4D00',
    elementBg: '#FF4D00',
    elementBorderRadius: 40,
    label: 'START CREATING',
    description: 'Export stunning demo videos in MP4 format. Perfect for product demos, tutorials, and presentations',
    fontDescription: 'Instrument Serif • Professional output',
    duration: 5000,
  },
];

export default function Preview() {
  const { isPlaying, setPlaying } = useDemoStore();
  const [currentScene, setCurrentScene] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const [bgColorIndex, setBgColorIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bgIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const bgColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
  
  const play = useCallback(() => {
    setCurrentScene(0);
    setAnimationKey(0);
    setPlaying(true);
  }, [setPlaying]);
  
  const stop = useCallback(() => {
    setPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [setPlaying]);
  
  const reset = useCallback(() => {
    stop();
    setCurrentScene(0);
    setAnimationKey(0);
  }, [stop]);
  
  const nextScene = useCallback(() => {
    if (currentScene < SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
      setAnimationKey(prev => prev + 1);
    }
  }, [currentScene]);
  
  const prevScene = useCallback(() => {
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
      setAnimationKey(prev => prev + 1);
    }
  }, [currentScene]);
  
  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }
    
    const scene = SCENES[currentScene];
    if (!scene) return;
    
    timeoutRef.current = setTimeout(() => {
      if (currentScene < SCENES.length - 1) {
        setCurrentScene(prev => prev + 1);
        setAnimationKey(prev => prev + 1);
      } else {
        setPlaying(false);
      }
    }, scene.duration);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentScene, setPlaying]);
  
  const scene = SCENES[currentScene];
  
  useEffect(() => {
    if (scene?.label === 'BG COLOR') {
      bgIntervalRef.current = setInterval(() => {
        setBgColorIndex(prev => (prev + 1) % bgColors.length);
      }, 100);
    } else {
      if (bgIntervalRef.current) {
        clearInterval(bgIntervalRef.current);
        bgIntervalRef.current = null;
      }
    }
    return () => {
      if (bgIntervalRef.current) {
        clearInterval(bgIntervalRef.current);
      }
    };
  }, [scene?.label]);

  const displayBgColor = scene?.label === 'BG COLOR' ? bgColors[bgColorIndex] : (scene?.background || '#FFFFFF');
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF4D00] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-sm font-mono text-black">Rendly Preview</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevScene}
            disabled={currentScene === 0}
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4 rotate-180" />
          </button>
          <button 
            onClick={nextScene}
            disabled={currentScene >= SCENES.length - 1}
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all disabled:opacity-30"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          <button 
            onClick={reset} 
            className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-200 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={isPlaying ? stop : play} 
            className={`px-4 py-2 text-sm font-mono transition-all flex items-center gap-2 ${
              isPlaying 
                ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' 
                : 'bg-[#FF4D00] text-white hover:bg-[#FF6B2C]'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3 h-3" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Play
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Preview Area */}
<div className="flex-1 flex items-center justify-center p-0 overflow-hidden bg-white">
          <div 
            className="relative overflow-hidden"
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '16/9',
              backgroundColor: displayBgColor,
            }}
          >
          {scene && (
            <div key={animationKey} className="absolute inset-0 flex flex-col items-center justify-center px-12">
              {/* Label */}
              <div 
                className="text-sm font-mono font-bold tracking-[0.2em] mb-4"
                style={{ color: '#000000' }}
              >
                {scene.label}
              </div>
              
{/* Animated Element - Center */}
              {scene.label === 'TYPEWRITER' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-typewriter text-4xl font-bold text-black font-mono overflow-hidden whitespace-nowrap">
                    Hello World
                    <span className="animate-blink border-r-2 border-black ml-1"></span>
                  </div>
                </div>
              ) : scene.elementType !== 'none' && (
                scene.elementType === 'circle' ? (
                  <div 
                    className={`animate-${scene.animation}`}
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      border: `3px solid ${scene.elementColor}`,
                      backgroundColor: scene.elementBg || 'transparent',
                      boxShadow: `0 0 60px ${scene.elementColor}40, inset 0 0 30px ${scene.elementColor}20`,
                    }}
                  />
                ) : (
                  <div 
                    className={`animate-${scene.animation}`}
                    style={{
                      padding: '28px 64px',
                      borderRadius: scene.elementBorderRadius || 16,
                      backgroundColor: scene.elementBg || scene.elementColor,
                      border: scene.elementBg === 'transparent' ? `2px solid ${scene.elementColor}` : 'none',
                      boxShadow: `0 20px 60px ${scene.elementColor}40`,
                    }}
                  />
                )
              )}
              
              {/* Description - Below */}
              <div 
                className="text-center mt-6 max-w-md"
                style={{ 
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontSize: scene.label === 'TYPOGRAPHY' || scene.label === 'BG COLOR' || scene.label === 'SHAPES' || scene.label === 'SIZES' || scene.label === 'COLORS' || scene.label === 'START CREATING' ? '22px' : '18px',
                  lineHeight: 1.5,
                  color: '#000000',
                  marginTop: '11px',
                }}
              >
                {/* Typography scene - special formatting */}
                {scene.label === 'TYPOGRAPHY' ? (
<div className="text-3xl text-black">
                  <span style={{ color: '#1A1A1A' }}>custom</span>{' '}
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#1A1A1A' }}>Create</span>{' '}
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: '#1A1A1A' }}>beautiful</span>{' '}
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#1A1A1A' }}>designs</span>{' '}
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, color: '#1A1A1A' }}>with</span>{' '}
                  <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: '#1A1A1A' }}>multiple</span>{' '}
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: '#1A1A1A' }}>fonts</span>
                  </div>
                ) : scene.label === 'BG COLOR' ? (
                  null
                ) : (
                  scene.description
                )}
              </div>
              
              
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-black">
              Scene {currentScene + 1} / {SCENES.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full border border-gray-300" 
              style={{ backgroundColor: scene?.label === 'BG COLOR' ? bgColors[bgColorIndex] : scene?.background }}
            />
            <span className="text-xs text-black font-mono">
              1920 × 1080 @ 60fps
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-[gray-100] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#FF4D00] transition-all duration-300"
            style={{ width: `${((currentScene + 1) / SCENES.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: '100%'; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        @keyframes pop {
          from { opacity: 0; transform: scale(0); }
          70% { transform: scale(1.1); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0% { opacity: 0; transform: translateX(0); }
          10% { transform: translateX(-12px); }
          20% { transform: translateX(12px); }
          30% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          50% { transform: translateX(-8px); }
          60% { transform: translateX(8px); }
          70% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-typewriter { animation: typewriter 1s steps(20) forwards; }
        .animate-blink { animation: blink 0.75s step-end infinite; }
        .animate-pop { animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-shake { animation: shake 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
}
