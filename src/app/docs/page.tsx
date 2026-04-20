'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Type, Square, Palette, Zap, Layers, Clock, Hash, PenTool, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: 'intro', label: 'Introduction' },
  { id: 'text', label: 'Text' },
  { id: 'shapes', label: 'Shapes' },
  { id: 'colors', label: 'Colors' },
  { id: 'animations', label: 'Animations' },
  { id: 'scenes', label: 'Scenes' },
  { id: 'reference', label: 'Reference' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('intro');

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-gray-900 tracking-tight">Rendly</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">Documentation</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`text-sm transition-colors ${
                  activeSection === section.id
                    ? 'text-orange-500 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-12">
          {/* Sidebar */}
          <div className="w-56 shrink-0">
            <nav className="sticky top-28 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white font-medium shadow-lg shadow-orange-500/20'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-3xl space-y-16">
            {/* Introduction */}
            <section id="intro" className={activeSection === 'intro' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <BookOpen className="w-4 h-4" />
                  <span>Introduction</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Code-first video creation
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Write simple DSL code to create stunning animated videos. No timelines, 
                  no keyframes — just code. It&apos;s that simple.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm overflow-hidden">
                <div className="text-gray-500 mb-4">// Your first video</div>
                <div className="text-white">TEXT &quot;Hello World&quot;</div>
                <div className="text-orange-400">FONT Inter</div>
                <div className="text-blue-400">COLOR #1A1A1A</div>
                <div className="text-purple-400">BACKGROUND #FFFFFF</div>
                <div className="text-green-400">ANIMATION fade in</div>
                <div className="text-yellow-400">DURATION 1.5s</div>
              </div>

              <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-700">
                  <span className="font-medium">Pro tip:</span> Separate scenes with two or more line breaks to create multi-scene videos.
                </p>
              </div>
            </section>

            {/* Text */}
            <section id="text" className={activeSection === 'text' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <Type className="w-4 h-4" />
                  <span>Text</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Display text on screen
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Use the TEXT command to display any text. Wrap your text in quotes.
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                    <code className="text-sm text-orange-600">TEXT &quot;Your text here&quot;</code>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700">Display any text on screen</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                    <code className="text-sm text-orange-600">TEXT &quot;Title&quot; FONT Inter SIZE 48</code>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700">With custom font and size</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Shapes */}
            <section id="shapes" className={activeSection === 'shapes' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <Square className="w-4 h-4" />
                  <span>Shapes</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Add geometric shapes
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Display circles, squares, rectangles, or diamonds.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['circle', 'square', 'rect', 'diamond'].map((shape) => (
                  <div key={shape} className="bg-white rounded-xl border border-gray-200 p-5">
                    <code className="text-sm text-orange-600 block mb-2">SHAPE {shape}</code>
                    <p className="text-sm text-gray-500 capitalize">{shape} shape</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Colors */}
            <section id="colors" className={activeSection === 'colors' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <Palette className="w-4 h-4" />
                  <span>Colors</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Text & background colors
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Use COLOR for text/shape color, BACKGROUND for canvas color.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Available colors</h3>
                  <div className="flex flex-wrap gap-3">
                    {['#000000', '#FFFFFF', '#FF4D00', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444'].map((color) => (
                      <div
                        key={color}
                        className="w-12 h-12 rounded-xl border border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                    <code className="text-sm text-orange-600">COLOR #FF4D00</code>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700">Set text or shape color</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                    <code className="text-sm text-orange-600">BACKGROUND #FFFFFF</code>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-700">Set canvas background color</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Animations */}
            <section id="animations" className={activeSection === 'animations' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <Zap className="w-4 h-4" />
                  <span>Animations</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Bring your content to life
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Choose from 4 animation types for smooth entrances.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'fade in', desc: 'Fade in from transparent with scale' },
                  { name: 'slide up', desc: 'Slide up from below' },
                  { name: 'pop', desc: 'Scale pop with overshoot' },
                  { name: 'bounce', desc: 'Bounce effect from top' },
                ].map((anim) => (
                  <div key={anim.name} className="bg-white rounded-xl border border-gray-200 p-5">
                    <code className="text-sm text-orange-600 block mb-2">ANIMATION {anim.name}</code>
                    <p className="text-sm text-gray-500">{anim.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Scenes */}
            <section id="scenes" className={activeSection === 'scenes' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <Layers className="w-4 h-4" />
                  <span>Scenes</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  Create multi-scene videos
                </h1>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Separate scenes with two or more line breaks. Each scene plays sequentially.
                </p>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6 font-mono text-sm overflow-hidden">
                <div className="text-gray-500 mb-2">// Scene 1</div>
                <div className="text-white">TEXT &quot;Welcome&quot;</div>
                <div className="text-orange-400">ANIMATION fade in</div>
                <div className="text-yellow-400">DURATION 1.5s</div>
                <div className="text-gray-600 my-3">{'// empty lines create new scene'}</div>
                <div className="text-white">TEXT &quot;To Rendly&quot;</div>
                <div className="text-orange-400">ANIMATION slide up</div>
                <div className="text-yellow-400">DURATION 1s</div>
              </div>

              <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-700">
                  <span className="font-medium">How it works:</span> The editor automatically detects new scenes when you leave 2+ line breaks between code blocks. Use the Play button to preview all scenes.
                </p>
              </div>
            </section>

            {/* Reference */}
            <section id="reference" className={activeSection === 'reference' ? 'block' : 'hidden'}>
              <div className="mb-8">
                <div className="flex items-center gap-2 text-orange-500 text-sm font-medium mb-3">
                  <PenTool className="w-4 h-4" />
                  <span>Quick Reference</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                  All commands
                </h1>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">COMMAND</span>
                  <span className="text-xs text-gray-400">—</span>
                  <span className="text-xs text-gray-400 font-medium">DESCRIPTION</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { cmd: 'TEXT "..."', desc: 'Display text on screen' },
                    { cmd: 'SHAPE circle|square|rect|diamond', desc: 'Display a shape' },
                    { cmd: 'COLOR #HEX', desc: 'Set text or shape color' },
                    { cmd: 'BACKGROUND #HEX', desc: 'Set background color' },
                    { cmd: 'FONT name', desc: 'Set font family' },
                    { cmd: 'SIZE number', desc: 'Set font size' },
                    { cmd: 'ANIMATION fade in|slide up|pop|bounce', desc: 'Set animation type' },
                    { cmd: 'DURATION 1.5s', desc: 'Set scene duration in seconds' },
                  ].map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center gap-4">
                      <code className="text-sm text-orange-600 w-64 shrink-0">{item.cmd}</code>
                      <span className="text-sm text-gray-500">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-900 rounded-2xl font-mono text-sm">
                <div className="text-gray-500 mb-4">// Full example with multiple scenes</div>
                <div className="text-white">TEXT &quot;Start Creating&quot;</div>
                <div className="text-orange-400">FONT Inter</div>
                <div className="text-blue-400">COLOR #1A1A1A</div>
                <div className="text-purple-400">BACKGROUND #FFFFFF</div>
                <div className="text-green-400">ANIMATION fade in</div>
                <div className="text-yellow-400">DURATION 1.5s</div>
                <div className="text-gray-700 my-2">{'// two newlines = new scene'}</div>
                <div className="text-white">TEXT &quot;Made with Rendly&quot;</div>
                <div className="text-orange-400">ANIMATION slide up</div>
                <div className="text-yellow-400">DURATION 1s</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}