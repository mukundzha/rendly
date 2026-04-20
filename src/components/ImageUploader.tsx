'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useDemoStore } from '@/lib/store';
import { ImagePlus } from 'lucide-react';

export default function ImageUploader() {
  const { code, setCode, triggerRefresh } = useDemoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  useEffect(() => {
    const fileSet = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('rendly_media_')) {
        fileSet.add(key.replace('rendly_media_', ''));
      }
    }
    setUploadedFiles(Array.from(fileSet));
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
    const fileName = file.name;
    
    try {
      const base64Data = await readFileAsBase64(file);
      const storageKey = `rendly_media_${fileName}`;
      localStorage.setItem(storageKey, base64Data);
      
      setUploadedFiles(prev => {
        const filtered = prev.filter(f => f !== fileName);
        return [...filtered, fileName];
      });
      
      const ext = fileName.split('.').pop()?.toLowerCase() || '';
      const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
      const videoExts = ['mp4', 'mov', 'webm'];
      
      let showCmd = '';
      if (imageExts.includes(ext)) {
        showCmd = `SHOW "${fileName}" FOR 2`;
      } else if (videoExts.includes(ext)) {
        showCmd = `SHOW "${fileName}" FOR 5`;
      } else {
        showCmd = `SHOW "${fileName}" FOR 2`;
      }
      
      const newCode = code.replace(/\nEND\s*$/i, '').trim() + '\n' + showCmd + '\n\nEND';
      setCode(newCode);
      triggerRefresh();
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
  }, [code, setCode, triggerRefresh]);
  
  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="group flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-surface border border-border hover:border-[#FF4D00] hover:text-[#FF4D00] transition-all duration-300 font-mono text-xs"
      >
        <ImagePlus className="w-4 h-4" />
        <span className="hidden sm:inline">Media</span>
      </button>
      
      {uploadedFiles.length > 0 && (
        <div className="flex gap-1">
          {Array.from(new Set(uploadedFiles)).slice(-2).map(f => (
            <span key={f} className="text-[10px] text-black font-mono">{f.slice(0,6)}..</span>
          ))}
        </div>
      )}
    </div>
  );
}
