'use client';

import { ArrowLeft, Play, Code, Layers, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const examples = [
  {
    id: 1,
    title: "Welcome Message",
    description: "Simple text with fade in animation. Perfect for intro sequences.",
    code: `TEXT "Welcome"
FONT Inter
COLOR #1A1A1A
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 1.5s`,
    preview: { text: "Welcome", color: "#1A1A1A", bg: "#FFFFFF" },
  },
  {
    id: 2,
    title: "Brand Intro",
    description: "Bold typography with slide up animation for impactful openings.",
    code: `TEXT "Made with Rendly"
FONT Syne
SIZE 72
COLOR #FF4D00
BACKGROUND #000000
ANIMATION slide up
DURATION 2s`,
    preview: { text: "Made with Rendly", color: "#FF4D00", bg: "#000000", size: 28 },
  },
  {
    id: 3,
    title: "Feature Showcase",
    description: "Multi-scene demo cycling through three feature reveals.",
    code: `TEXT "Feature One"
ANIMATION fade in
DURATION 1s

TEXT "Feature Two"
ANIMATION slide up
DURATION 1s

TEXT "Feature Three"
ANIMATION pop
DURATION 1s`,
    preview: { text: "Feature One", color: "#3B82F6", bg: "#EFF6FF" },
  },
  {
    id: 4,
    title: "Call to Action",
    description: "High contrast CTA with bounce animation to drive action.",
    code: `TEXT "Get Started"
FONT Inter
SIZE 64
COLOR #FFFFFF
BACKGROUND #FF4D00
ANIMATION bounce
DURATION 1.5s`,
    preview: { text: "Get Started", color: "#FFFFFF", bg: "#FF4D00", size: 24 },
  },
  {
    id: 5,
    title: "Minimalist",
    description: "Clean black and white design for understated elegance.",
    code: `TEXT "Less is More"
FONT Inter
SIZE 48
COLOR #000000
BACKGROUND #FFFFFF
ANIMATION fade in
DURATION 2s`,
    preview: { text: "Less is More", color: "#000000", bg: "#FFFFFF" },
  },
  {
    id: 6,
    title: "Shape Animation",
    description: "Geometric circle with pop animation for abstract reveals.",
    code: `SHAPE circle
COLOR #8B5CF6
ANIMATION pop
DURATION 1.5s`,
    preview: { shape: "circle", color: "#8B5CF6", bg: "#FAF5FF" },
  },
];

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      <header className="sticky top-0 z-50 bg-[#FBFBFA]/80 backdrop-blur-sm border-b border-[#EAEAEA]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#111111] rounded flex items-center justify-center">
                <span className="text-white font-medium text-sm">R</span>
              </div>
              <span className="font-medium text-[#111111] tracking-tight">Rendly</span>
            </Link>
            <span className="text-[#C7C7C5]">/</span>
            <span className="text-sm text-[#787774]">Examples</span>
          </div>
          <Link 
            href="/editor" 
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white text-sm font-medium rounded hover:bg-[#333333] transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>Open Editor</span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono text-[#787774] uppercase tracking-widest mb-4">
            Template Gallery
          </span>
          <h1 className="text-5xl font-serif text-[#111111] tracking-tight mb-5" style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Start creating.<br />
            <span className="text-[#787774]">Copy and customize.</span>
          </h1>
          <p className="text-lg text-[#787774] max-w-xl mx-auto leading-relaxed">
            Six ready-to-use templates to kickstart your video creation. 
            Click any example to load it directly into the editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <Link
              key={example.id}
              href={`/editor?code=${encodeURIComponent(btoa(example.code))}`}
              className="group block"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <article className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden hover:border-[#C7C7C5] transition-colors">
                <div 
                  className="aspect-[16/9] flex items-center justify-center p-6 relative"
                  style={{ backgroundColor: example.preview.bg }}
                >
                  {example.preview.shape ? (
                    <div 
                      className="w-16 h-16 rounded-full"
                      style={{ backgroundColor: example.preview.color }}
                    />
                  ) : (
                    <span 
                      className="text-center font-serif"
                      style={{ 
                        color: example.preview.color, 
                        fontSize: example.preview.size ? `${example.preview.size}px` : '1.5rem',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      {example.preview.text}
                    </span>
                  )}
                  
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-[#EAEAEA]">
                    <Play className="w-3 h-3 text-[#111111] ml-0.5" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-medium text-[#111111] text-lg">{example.title}</h3>
                    <span className="shrink-0 px-2 py-1 bg-[#F7F6F3] rounded text-xs font-mono text-[#787774] uppercase tracking-wider">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-[#787774] leading-relaxed mb-4">
                    {example.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-[#787774] group-hover:text-[#111111] transition-colors">
                    <Code className="w-3.5 h-3.5" />
                    <span>Load in editor</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#F7F6F3] rounded border border-[#EAEAEA]">
            <Layers className="w-4 h-4 text-[#787774]" />
            <span className="text-sm text-[#787774]">More templates coming soon</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#EAEAEA] py-10 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-[#787774] hover:text-[#111111] transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link href="/docs" className="text-sm text-[#787774] hover:text-[#111111] transition-colors">
            Read Documentation
          </Link>
        </div>
      </footer>
    </div>
  );
}