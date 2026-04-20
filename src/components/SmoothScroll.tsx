'use client';

import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    scrollRef.current = new LocomotiveScroll();

    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}