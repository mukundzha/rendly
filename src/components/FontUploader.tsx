'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useDemoStore } from '@/lib/store';

export default function FontUploader() {
  const { code, setCode, triggerRefresh } = useDemoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFonts, setUploadedFonts] = useState<string[]>([]);
  
  useEffect(() => {
    const fonts: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('rendly_font_')) {
        fonts.push(key.replace('rendly_font_', ''));
      }
    }
    setUploadedFonts(fonts);
  }, []);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileName = file.name.replace(/\s+/g, '_');
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const validExts = ['ttf', 'otf', 'woff', 'woff2'];
    
    if (!validExts.includes(ext)) {
      alert('Please upload a font file (TTF, OTF, WOFF, or WOFF2)');
      return;
    }
    
    try {
      const base64Data = await readFileAsBase64(file);
      const fontName = fileName.replace(/\.[^.]+$/, '');
      const storageKey = `rendly_font_${fileName}`;
      const fontFaceKey = `font_${fontName}`;
      
      // Store font data
      localStorage.setItem(storageKey, base64Data);
      
      // Create and register font face
      const fontFace = new FontFace(fontFaceKey, `url(${base64Data})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      
      // Update fonts list
      setUploadedFonts(prev => {
        if (prev.includes(fontName)) return prev;
        return [...prev, fontName];
      });
      
      // Add font SET command
      const fontCmd = `SET FONT ${fontName.toUpperCase()}`;
      const newCode = code.replace(/\nEND\s*$/i, '').trim() + '\n' + fontCmd + '\n\nEND';
      setCode(newCode);
      triggerRefresh();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      alert('Error loading font');
    }
  }, [code, setCode, triggerRefresh]);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded hover:bg-emerald-100 transition-all font-medium"
      >
        Add Font
      </button>
    </>
  );
}