'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Globe, ExternalLink } from 'lucide-react';

interface NavbarProps {
  variant?: 'transparent' | 'solid';
}

export default function Navbar({ variant = 'solid' }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || variant === 'solid'
            ? 'bg-background/90 backdrop-blur-lg border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#FF4D00] flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-serif text-2xl font-bold" style={{ fontFamily: "'Instrument Serif', serif" }}>R</span>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Rendly</span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-sm font-mono text-black hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-5 right-5 h-px bg-[#FF4D00] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a
                href="/editor"
                className="px-4 py-2 bg-[#FF4D00] text-white font-display font-medium text-sm hover:bg-[#FF6B2C] transition-colors rounded-lg"
              >
                Editor
              </a>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-background lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pt-20">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-display font-bold hover:text-[#FF4D00] transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo-video"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-[#FF4D00] text-white font-display font-medium text-lg"
          >
            Try Editor
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </>
  );
}