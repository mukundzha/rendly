'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDemoStore } from '@/lib/store';
import { X, Film, Image as ImageIcon, Music, Plus } from 'lucide-react';

interface MediaFile {
  name: string;
  data: string;
  type: string;
  size: number;
}

export default function MediaLibrary() {
  const { code, setCode, triggerRefresh } = useDemoStore();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(70);
  const [imageOpacity, setImageOpacity] = useState(100);
  const [imageRadius, setImageRadius] = useState(0);
  const [imageFit, setImageFit] = useState<'cover' | 'contain' | 'fill'>('cover');

  useEffect(() => {
    loadFiles();
  }, [isOpen]);

  const loadFiles = useCallback(() => {
    const mediaFiles: MediaFile[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('rendly_media_')) {
        const name = key.replace('rendly_media_', '');
        const data = localStorage.getItem(key) || '';
        const ext = name.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
        const videoExts = ['mp4', 'mov', 'webm'];
        const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac'];
        let type = 'image';
        if (videoExts.includes(ext)) type = 'video';
        else if (audioExts.includes(ext)) type = 'audio';
        else if (imageExts.includes(ext)) type = 'image';
        
        mediaFiles.push({ name, data, type, size: data.length });
      }
    }
    setFiles(mediaFiles);
  }, []);

  const handleDelete = useCallback((fileName: string) => {
    if (!confirm(`Delete "${fileName}"?`)) return;
    localStorage.removeItem(`rendly_media_${fileName}`);
    loadFiles();
  }, [loadFiles]);

  const handleUse = useCallback((fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
    const videoExts = ['mp4', 'mov', 'webm'];
    
    let modifiers = '';
    if (imageWidth !== 70) modifiers += ` WIDTH ${imageWidth}%`;
    if (imageOpacity !== 100) modifiers += ` OPACITY ${imageOpacity}`;
    if (imageRadius > 0) modifiers += ` RADIUS ${imageRadius}`;
    if (imageFit !== 'cover') modifiers += ` FIT ${imageFit.toUpperCase()}`;
    
    let showCmd = '';
    if (imageExts.includes(ext)) {
      showCmd = `SHOW "${fileName}"${modifiers} FOR 2`;
    } else if (videoExts.includes(ext)) {
      showCmd = `SHOW "${fileName}" FOR 5`;
    } else {
      showCmd = `SHOW "${fileName}"${modifiers} FOR 2`;
    }
    
    const newCode = code.replace(/\nEND\s*$/i, '').trim() + '\n' + showCmd + '\n\nEND';
    setCode(newCode);
    triggerRefresh();
    setIsOpen(false);
  }, [code, setCode, triggerRefresh, imageWidth, imageOpacity, imageRadius, imageFit]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-foreground bg-surface border border-border hover:border-[#FF4D00] hover:text-[#FF4D00] transition-all duration-300 font-mono text-xs"
      >
        <Film className="w-4 h-4" />
        <span className="hidden sm:inline">Library</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-[#FF4D00]" />
            <h3 className="text-sm font-display font-semibold text-foreground">Media Library</h3>
            <span className="text-xs text-black font-mono">({files.length} files)</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-black hover:text-foreground hover:bg-border transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="px-6 py-4 bg-surface/50 border-b border-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block text-black mb-2 font-mono uppercase text-[10px] tracking-wider">Width</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Number(e.target.value))}
                  className="flex-1 accent-[#FF4D00]"
                />
                <span className="w-10 text-right text-foreground font-mono">{imageWidth}%</span>
              </div>
            </div>
            <div>
              <label className="block text-black mb-2 font-mono uppercase text-[10px] tracking-wider">Opacity</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={imageOpacity}
                  onChange={(e) => setImageOpacity(Number(e.target.value))}
                  className="flex-1 accent-[#FF4D00]"
                />
                <span className="w-10 text-right text-foreground font-mono">{imageOpacity}%</span>
              </div>
            </div>
            <div>
              <label className="block text-black mb-2 font-mono uppercase text-[10px] tracking-wider">Radius</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={imageRadius}
                  onChange={(e) => setImageRadius(Number(e.target.value))}
                  className="flex-1 accent-[#FF4D00]"
                />
                <span className="w-10 text-right text-foreground font-mono">{imageRadius}</span>
              </div>
            </div>
            <div>
              <label className="block text-black mb-2 font-mono uppercase text-[10px] tracking-wider">Fit</label>
              <select
                value={imageFit}
                onChange={(e) => setImageFit(e.target.value as 'cover' | 'contain' | 'fill')}
                className="w-full px-2 py-1.5 text-xs bg-background border border-border text-foreground font-mono"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => selectedFile && handleUse(selectedFile)}
                disabled={!selectedFile}
                className="w-full px-3 py-2 text-xs bg-[#FF4D00] text-white font-display font-medium hover:bg-[#FF6B2C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {files.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 border border-border flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-black" />
              </div>
              <p className="text-black text-sm mb-2">No media files uploaded yet.</p>
              <p className="text-xs text-black/60">Use the + Media button to upload files.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.name}
                  className={`relative group border-2 cursor-pointer transition-all duration-300 ${
                    selectedFile === file.name 
                      ? 'border-[#FF4D00] ring-2 ring-[#FF4D00]/20' 
                      : 'border-border hover:border-[#FF4D00]/50'
                  }`}
                  onClick={() => setSelectedFile(file.name)}
                  onDoubleClick={() => handleUse(file.name)}
                >
                  {file.type === 'image' && (
                    <img
                      src={file.data}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  {file.type === 'video' && (
                    <div className="w-full h-32 bg-surface flex items-center justify-center">
                      <Film className="w-8 h-8 text-black" />
                    </div>
                  )}
                  {file.type === 'audio' && (
                    <div className="w-full h-32 bg-surface flex items-center justify-center">
                      <Music className="w-8 h-8 text-black" />
                    </div>
                  )}
                  <div className="p-3 bg-card">
                    <p className="text-xs text-foreground truncate font-mono">{file.name}</p>
                    <p className="text-[10px] text-black capitalize">{file.type}</p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(file.name);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500/90 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {selectedFile && (
          <div className="px-6 py-4 border-t border-border bg-surface/50">
            <p className="text-xs text-black">
              <span className="text-[#FF4D00]">→</span> Selected: <span className="text-foreground font-mono">{selectedFile}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
