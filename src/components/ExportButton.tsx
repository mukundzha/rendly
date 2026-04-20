'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

type SceneData = {
  type: 'text' | 'shape';
  name?: string;
  shape?: string;
  color: string;
  animation: string;
  duration: number;
  style?: {
    font: string;
    size: number;
    bold: boolean;
    italic: boolean;
  };
};

const fontMap: Record<string, string> = {
  'Syne': 'Syne',
  'Instrument Serif': 'Instrument Serif',
  'Inter': 'Inter',
  'DM Serif Display': 'DM Serif Display',
  'Playfair Display': 'Playfair Display',
  'Montserrat': 'Montserrat',
  'Roboto': 'Roboto',
  'Geist': 'Geist',
  'Poppins': 'Poppins',
  'Manrope': 'Manrope',
  'DM Sans': 'DM Sans',
  'Plus Jakarta': 'Plus Jakarta Sans',
  'default': 'Syne',
};

const getFontFamily = (font?: string): string => {
  return fontMap[font || 'default'] || fontMap.default;
};

const animationMap: Record<string, string> = {
  'fade in': 'fadeIn',
  'fade out': 'fadeIn',
  'fadeout': 'fadeIn',
  'slide up': 'slideUp',
  'slideup': 'slideUp',
  'slide down': 'slideDown',
  'slidedown': 'slideDown',
  'slide left': 'slideLeft',
  'slideleft': 'slideLeft',
  'slide right': 'slideRight',
  'slideright': 'slideRight',
  'zoom in': 'zoomIn',
  'zoomin': 'zoomIn',
  'zoom out': 'zoomOut',
  'zoomout': 'zoomOut',
  'bounce': 'bounce',
  'pop': 'pop',
  'pop in': 'pop',
  'shake': 'shake',
  'type': 'typewriter',
  'typewriter': 'typewriter',
};

const getAnimationName = (animation?: string): string => {
  if (!animation) return 'fadeIn';
  return animationMap[animation.toLowerCase()] || 'fadeIn';
};

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number): number => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutElastic = (t: number): number => {
  if (t === 0 || t === 1) return t;
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

export default function ExportButton() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isExporting, setExporting] = useState(false);
  const [scenes, setScenes] = useState<SceneData[]>([]);

  useEffect(() => {
    const handleExportData = (event: CustomEvent) => {
      setScenes(event.detail);
    };
    window.addEventListener('exportScenes' as any, handleExportData);
    return () => window.removeEventListener('exportScenes' as any, handleExportData);
  }, []);

  const applyAnimation = (
    ctx: CanvasRenderingContext2D,
    animation: string,
    progress: number,
    canvasWidth: number,
    canvasHeight: number,
    drawFn: () => void
  ) => {
    ctx.save();
    const t = Math.min(1, Math.max(0, progress));
    const anim = getAnimationName(animation);
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;

    switch (anim) {
      case 'fadeIn':
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;

      case 'slideUp':
        ctx.translate(0, 40 * (1 - easeOutCubic(t)));
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;

      case 'slideDown':
        ctx.translate(0, -40 * (1 - easeOutCubic(t)));
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;

      case 'slideLeft':
        ctx.translate(80 * (1 - easeOutCubic(t)), 0);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;

      case 'slideRight':
        ctx.translate(-80 * (1 - easeOutCubic(t)), 0);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;

      case 'zoomIn': {
        ctx.translate(cx, cy);
        const scale = easeOutElastic(t);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;
      }

      case 'zoomOut': {
        ctx.translate(cx, cy);
        const scale = 1 - (1 - t) * 0.5;
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;
      }

      case 'bounce': {
        let bounceOffset = 0;
        if (t < 0.2) {
          bounceOffset = -50 * easeOutCubic(t / 0.2);
        } else if (t < 0.4) {
          bounceOffset = -50 + 50 * easeOutCubic((t - 0.2) / 0.2);
        } else if (t < 0.6) {
          bounceOffset = 10 * easeOutCubic((t - 0.4) / 0.2);
        } else if (t < 0.8) {
          bounceOffset = -5 * easeOutCubic((t - 0.6) / 0.2);
        }
        ctx.translate(0, bounceOffset);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;
      }

      case 'pop': {
        let popScale = 1;
        if (t < 0.7) {
          popScale = easeOutBack(t / 0.7);
        } else {
          const overshoot = (t - 0.7) / 0.3;
          popScale = 1.1 - 0.1 * overshoot;
        }
        ctx.translate(cx, cy);
        ctx.scale(popScale, popScale);
        ctx.translate(-cx, -cy);
        ctx.globalAlpha = easeOutCubic(t);
        drawFn();
        break;
      }

      case 'shake': {
        const shakeX = t < 1 ? 15 * Math.sin(t * 25 * Math.PI) * Math.cos(t * 15 * Math.PI) * (1 - t) : 0;
        ctx.translate(shakeX, 0);
        drawFn();
        break;
      }

      case 'typewriter':
        ctx.globalAlpha = easeInOutCubic(t);
        drawFn();
        break;

      default:
        drawFn();
    }
    ctx.restore();
  };

  const renderShape = (shape: string, color: string) => {
    const renderFns: Record<string, (ctx: CanvasRenderingContext2D, cx: number, cy: number) => void> = {
      circle: (ctx, cx, cy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      },
      square: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.fillRect(cx - 80, cy - 80, 160, 160);
      },
      rect: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.fillRect(cx - 120, cy - 60, 240, 120);
      },
      rectangle: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.fillRect(cx - 120, cy - 60, 240, 120);
      },
      rounded: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(cx - 100, cy - 50, 200, 100, 20);
        ctx.fill();
      },
      diamond: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 100);
        ctx.lineTo(cx + 100, cy);
        ctx.lineTo(cx, cy + 100);
        ctx.lineTo(cx - 100, cy);
        ctx.closePath();
        ctx.fill();
      },
      triangle: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 100);
        ctx.lineTo(cx + 80, cy + 70);
        ctx.lineTo(cx - 80, cy + 70);
        ctx.closePath();
        ctx.fill();
      },
      star: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / 5;
          const ox = cx + Math.cos(outerAngle) * 100;
          const oy = cy + Math.sin(outerAngle) * 100;
          const ix = cx + Math.cos(innerAngle) * 40;
          const iy = cy + Math.sin(innerAngle) * 40;
          if (i === 0) ctx.moveTo(ox, oy);
          else ctx.lineTo(ox, oy);
          ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.fill();
      },
      hexagon: (ctx, cx, cy) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3 - Math.PI / 2;
          const x = cx + Math.cos(angle) * 100;
          const y = cy + Math.sin(angle) * 100;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      },
      ring: (ctx, cx, cy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 16;
        ctx.stroke();
      },
    };
    return renderFns[shape] || renderFns.circle;
  };

  const runExport = async () => {
    if (isExporting || scenes.length === 0) return;

    setExporting(true);
    setStatus('Preparing...');
    setProgress(5);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setStatus('Error: Canvas not supported');
        setExporting(false);
        return;
      }

      const stream = canvas.captureStream(60);
      const options = { mimeType: 'video/webm; codecs=vp9' as const };
      const recorder = new MediaRecorder(stream, options);

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      setProgress(10);
      setStatus('Recording...');
      recorder.start();

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        const progressPercent = 10 + (i / scenes.length) * 70;
        setProgress(progressPercent);
        setStatus(`Rendering ${i + 1}/${scenes.length}...`);

        const animDuration = scene.duration;
        const fps = 60;
        const totalFrames = Math.max(1, (animDuration / 1000) * fps);
        const animName = getAnimationName(scene.animation);

        for (let frame = 0; frame < totalFrames; frame++) {
          const frameProgress = frame / totalFrames;

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.save();

          if (scene.type === 'text' && scene.name) {
            const fontFamily = getFontFamily(scene.style?.font);
            const fontSize = scene.style?.size || 64;
            const isBold = scene.style?.bold;
            const isItalic = scene.style?.italic;

            let fontStr = '';
            if (isBold && isItalic) {
              fontStr = `italic bold ${fontSize}px "${fontFamily}", sans-serif`;
            } else if (isBold) {
              fontStr = `bold ${fontSize}px "${fontFamily}", sans-serif`;
            } else if (isItalic) {
              fontStr = `italic ${fontSize}px "${fontFamily}", sans-serif`;
            } else {
              fontStr = `${fontSize}px "${fontFamily}", sans-serif`;
            }

            ctx.font = fontStr;
            ctx.fillStyle = scene.color || '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const drawText = () => ctx.fillText(scene.name!, canvas.width / 2, canvas.height / 2);
            applyAnimation(ctx, animName, frameProgress, canvas.width, canvas.height, drawText);
          }
          else if (scene.type === 'shape' && scene.shape) {
            const color = scene.color || '#FF4D00';
            const drawShape = () => renderShape(scene.shape!, color)(ctx, canvas.width / 2, canvas.height / 2);
            applyAnimation(ctx, animName, frameProgress, canvas.width, canvas.height, drawShape);
          }

          ctx.restore();

          await new Promise(r => setTimeout(r, 1000 / fps));
        }
      }

      setProgress(85);
      setStatus('Finalizing...');
      recorder.stop();
      await new Promise(r => setTimeout(r, 500));

      setProgress(95);
      setStatus('Saving...');

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rendly-video.mp4';
      link.click();
      URL.revokeObjectURL(url);

      setProgress(100);
      setStatus('Done!');

      setTimeout(() => {
        setExporting(false);
        setProgress(0);
        setStatus('');
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('Failed. Please try again.');
      setTimeout(() => {
        setExporting(false);
        setProgress(0);
        setStatus('');
      }, 3000);
    }
  };

  return (
    <button
      onClick={runExport}
      disabled={isExporting || scenes.length === 0}
      className="px-4 py-2 text-sm font-mono text-white bg-[#FF4D00] hover:bg-[#FF6B2C] transition-all disabled:opacity-50 flex items-center gap-2 rounded-lg"
    >
      {isExporting ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 bg-white/30 rounded-full animate-pulse" />
          {Math.round(progress)}%
        </span>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export Video
        </>
      )}
    </button>
  );
}