'use client';

import { useDemoStore } from '@/lib/store';
import { Code2, Play } from 'lucide-react';

export default function Toolbar() {
  const { setPlaying } = useDemoStore();
  
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FF4D00] flex items-center justify-center">
          <span className="text-white font-serif text-2xl font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>R</span>
        </div>
        <span className="text-xl font-display font-bold tracking-tight text-black">Rendly</span>
      </div>
      
      <button
        onClick={() => setPlaying(true)}
        className="px-5 py-2.5 bg-[#FF4D00] text-white font-display font-medium text-sm hover:bg-[#FF6B2C] transition-all flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Play Showcase
      </button>
    </header>
  );
}
