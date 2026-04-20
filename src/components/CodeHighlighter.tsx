'use client';

import { useEffect, useMemo } from 'react';

interface CodeHighlighterProps {
  code: string;
}

function highlightCode(code: string): { highlighted: string[] } {
  const lines = code.split('\n');
  const highlighted = lines.map(line => {
    let result = line;
    
    // TEXT keyword
    result = result.replace(/(TEXT)/gi, '<span class="text-[#FF4D00] font-bold">$1</span>');
    // SHAPE keyword  
    result = result.replace(/(SHAPE)/gi, '<span class="text-[#8B5CF6] font-bold">$1</span>');
    // String "text"
    result = result.replace(/"([^"]+)"/g, '<span class="text-[#10B981]">"$1"</span>');
    // Hex color
    result = result.replace(/(#[A-Fa-f0-9]{6})/g, '<span class="text-[#F59E0B]">$1</span>');
    // Number
    result = result.replace(/\b(\d+)\b/g, '<span class="text-[#6366F1]">$1</span>');
    // FOR keyword
    result = result.replace(/\b(FOR)\b/gi, '<span class="text-[#EC4899] font-bold">$1</span>');
    
    return result;
  });
  
  return { highlighted };
}

export function CodeHighlighter({ code }: CodeHighlighterProps) {
  const { highlighted } = useMemo(() => highlightCode(code), [code]);

  const renderLines = useMemo(() => {
    return highlighted.map((line, i) => {
      const isEmpty = line.trim() === '';
      const lineNum = i + 1;
      
      return (
        <div key={i} className="flex min-h-[1.5em]">
          <span className="w-8 text-right pr-3 text-[#2A2A2A] select-none font-mono text-sm border-r border-white/5 flex-shrink-0">
            {lineNum}
          </span>
          <span 
            className="flex-1 pl-3 font-mono text-sm whitespace-pre"
            dangerouslySetInnerHTML={{ __html: isEmpty ? '&nbsp;' : line }}
          />
        </div>
      );
    });
  }, [highlighted]);

  return (
    <div className="flex-1 bg-black/20 p-4 overflow-auto font-mono text-sm">
      {renderLines}
    </div>
  );
}

export function parseCodeErrors(code: string): string[] {
  const errors: string[] = [];
  const lines = code.split('\n');
  
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const trimmed = line.trim();
    
    if (!trimmed) return;
    
    // Check if starts with TEXT or SHAPE
    if (!trimmed.startsWith('TEXT') && !trimmed.startsWith('SHAPE')) {
      errors.push(`Line ${lineNum}: Must start with TEXT or SHAPE`);
    }
    
    // Check for missing quotes
    if ((trimmed.startsWith('TEXT') || trimmed.startsWith('SHAPE')) && !/"[^"]+"/.test(trimmed)) {
      errors.push(`Line ${lineNum}: Missing name in quotes`);
    }
    
    // Check for FOR keyword
    if (!/\bFOR\b/i.test(trimmed)) {
      errors.push(`Line ${lineNum}: Missing FOR duration`);
    }
  });
  
  return errors;
}