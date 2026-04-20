'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play, Code, Zap, Layers, Sparkles, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showReplay, setShowReplay] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleEnded = () => {
    setShowReplay(true);
    setIsPlaying(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const replay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setShowReplay(false);
      setIsPlaying(true);
    }
  };

  const fullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground grain">
      <Navbar />

      <main className="flex-1">
        <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20 lg:pt-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FF4D00]/10 via-transparent to-transparent" />
          
          <div className="absolute top-20 right-20 w-96 h-96 border border-[#FF4D00]/20 rounded-full animate-pulse-glow" />
          <div className="absolute bottom-40 left-10 w-64 h-64 border border-[#FF4D00]/10 rounded-full animate-float" />
          
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="animate-fade-in-up">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF4D00]/10 border border-[#FF4D00]/30 rounded-full text-sm text-[#FF4D00] font-mono">
                    <span className="w-2 h-2 bg-[#FF4D00] rounded-full animate-pulse" />
                    Open Source
                  </span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight leading-[0.9] animate-fade-in-up delay-100">
                  <span className="gradient-text">Code.</span>
                  <br />
                  <span className="gradient-text-accent">Preview.</span>
                  <br />
                  <span className="gradient-text">Export.</span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-black leading-relaxed max-w-xl font-serif italic animate-fade-in-up delay-200">
                  Create stunning demo videos with a simple DSL. 
                  No timeline editors. No keyframes. Just write.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 animate-fade-in-up delay-300">
                  <a 
                    href="/editor"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-[#FF4D00] text-white font-display font-semibold text-lg rounded-none transition-all duration-300 hover:bg-[#FF6B2C] hover:translate-x-2"
                  >
                    <span>Open Editor</span>
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </div>
              
              <div className="lg:col-span-5 relative animate-scale-in delay-400">
                <div className="relative border border-border bg-card p-8">
                  <div className="absolute -top-3 -left-3 bg-[#FF4D00] text-white text-xs font-mono px-3 py-1">
                    EXAMPLE
                  </div>
                  <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                    <code className="text-orange-500">TEXT</code> <code className="text-foreground">&quot;Start Creating&quot;</code>
                    <br />
                    <code className="text-blue-400">FONT</code> <code className="text-foreground">Inter</code>
                    <br />
                    <code className="text-purple-400">COLOR</code> <code className="text-[#98C379]">#1A1A1A</code>
                    <br />
                    <code className="text-yellow-400">BACKGROUND</code> <code className="text-[#98C379]">#FFFFFF</code>
                    <br />
                    <code className="text-green-400">ANIMATION</code> <code className="text-foreground">fade in</code>
                    <br />
                    <code className="text-pink-400">DURATION</code> <code className="text-[#C678DD]">1.5s</code>
                  </pre>
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-black font-mono">
                    <span className="w-2 h-2 bg-[#98C379] rounded-full" />
                    Live
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-32 h-32 border border-[#FF4D00]/20 animate-float" />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 lg:py-32 border-t border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-16 lg:mb-24">
              <span className="inline-block text-xs font-mono text-[#FF4D00] mb-4 tracking-wider">CAPABILITIES</span>
              <h2 className="text-4xl lg:text-6xl font-display font-bold tracking-tight animate-fade-in-up">
                Built for developers<br />
                <span className="gradient-text-accent">who value their time</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
              {[
                {
                  icon: Code,
                  title: "Code-First",
                  description: "Write animations in a simple, readable DSL. Version control your demos like any other code.",
                  delay: 0
                },
                {
                  icon: Zap,
                  title: "Live Preview",
                  description: "See changes instantly as you type. Fast iteration loop with hot reloading.",
                  delay: 100
                },
                {
                  icon: Layers,
                  title: "Layer Control",
                  description: "Precise control over timing, easing, and transitions. No guessing.",
                  delay: 200
                },
                {
                  icon: Sparkles,
                  title: "Export Ready",
                  description: "Generate high-quality MP4 videos with custom resolution and frame rate.",
                  delay: 300
                }
              ].map((feature, i) => (
                <div 
                  key={feature.title}
                  className="group bg-background p-8 lg:p-12 transition-all duration-500 hover:bg-surface animate-fade-in-up"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  <div className="w-14 h-14 bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center mb-6 group-hover:bg-[#FF4D00] group-hover:border-[#FF4D00] transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-[#FF4D00] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-3">{feature.title}</h3>
                  <p className="text-black leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 lg:py-32 bg-surface border-y border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 lg:order-1">
                <span className="inline-block text-xs font-mono text-[#FF4D00] mb-4 tracking-wider">HOW IT WORKS</span>
                <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-8 animate-fade-in-up">
                  Three steps to<br />
                  <span className="gradient-text-accent">professional demos</span>
                </h2>
                
                <div className="space-y-8">
                  {[
                    { num: "01", title: "Write your script", desc: "Use simple commands to define your content, timing, and effects." },
                    { num: "02", title: "Preview instantly", desc: "Watch your demo come to life in real-time as you type." },
                    { num: "03", title: "Export & share", desc: "Render high-quality MP4s ready for documentation, demos, or tutorials." }
                  ].map((step, i) => (
                    <div key={step.num} className="flex gap-6 animate-slide-in-left" style={{ animationDelay: `${i * 150}ms` }}>
                      <span className="text-5xl font-display font-bold text-[#FF4D00]/30">{step.num}</span>
                      <div>
                        <h3 className="text-xl font-display font-semibold mb-2">{step.title}</h3>
                        <p className="text-black">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="order-1 lg:order-2 relative animate-scale-in">
                <div className="relative border border-border bg-card p-1">
                  <div className="bg-white p-8 font-mono text-sm text-black">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                      <span className="ml-4 text-gray-700 text-xs">demo.rendly</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">TEXT</span>
                        <span className="text-gray-700">&quot;Hello&quot;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">FONT</span>
                        <span className="text-gray-700">Inter</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">COLOR</span>
                        <span className="text-gray-700">#FF4D00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">ANIMATION</span>
                        <span className="text-gray-700">fade in</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-400">DURATION</span>
                        <span className="text-gray-700">1.5s</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border border-[#FF4D00]/20" />
              </div>
            </div>
          </div>
        </section>

        <section id="demo-video" className="py-24 lg:py-32 border-t border-border bg-surface">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-mono text-[#FF4D00] mb-4 tracking-wider">★ DEMO VIDEO</span>
              <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight animate-fade-in-up">
                See It In Action
              </h2>
              <p className="text-lg text-black mt-4 max-w-2xl mx-auto animate-fade-in-up delay-100">
                Watch the demo video exported directly from Rendly.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto animate-fade-in-up delay-200">
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/20 group">
                <video 
                  ref={videoRef}
                  src="/demo.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  className="w-full h-auto block"
                />
                
                {showReplay && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer" onClick={replay}>
                    <div className="w-28 h-28 bg-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-orange-500/40">
                      <RotateCcw className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div 
                    className="h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
                    onClick={handleSeek}
                  >
                    <div 
                      className="h-full bg-orange-500 rounded-full relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-orange-500 rounded-full shadow shadow-orange-500" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button onClick={togglePlay} className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button onClick={toggleMute} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                      <button onClick={fullscreen} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Maximize className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div className="max-w-sm">
              <h3 className="text-2xl font-display font-bold mb-4">Rendly</h3>
              <p className="text-black leading-relaxed">
                Create stunning demo videos with code. No designers, no recording — just write.
              </p>
            </div>
            <div className="text-right">
              <h4 className="font-display font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-black">
                <li><a href="/docs" className="hover:text-[#FF4D00] transition-colors">Documentation</a></li>
                <li><a href="/examples" className="hover:text-[#FF4D00] transition-colors">Examples</a></li>
                <li><a href="/editor" className="hover:text-[#FF4D00] transition-colors">Editor</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
            <p className="text-sm text-black">© 2026 Rendly. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/anomalyco/rendly"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-black hover:text-[#FF4D00] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <p className="text-sm text-black flex items-center gap-2">
                Made with <span className="text-[#FF4D00]">●</span> for developers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
