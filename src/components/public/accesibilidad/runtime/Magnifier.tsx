"use client";

import { useEffect, useRef } from "react";

export function Magnifier() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const size = 220;

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX - size / 2}px`;
      el.style.top = `${e.clientY - size / 2}px`;
    };

    el.style.background = "rgba(255,255,255,0.95)";
    el.style.boxShadow = "0 10px 40px rgba(0,0,0,0.4)";
    el.style.backdropFilter = "none";

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <div ref={ref} className="a11y-magnifier" aria-hidden />;
}
