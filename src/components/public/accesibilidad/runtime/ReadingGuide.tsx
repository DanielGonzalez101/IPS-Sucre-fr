"use client";

import { useEffect, useRef } from "react";

export function ReadingGuide() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      el.style.top = `${e.clientY - 20}px`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return <div ref={ref} className="a11y-reading-guide" aria-hidden />;
}
