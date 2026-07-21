"use client";

import { useEffect } from "react";

const READABLE = "p, h1, h2, h3, h4, li, blockquote, article, section";

export function FocusReader() {
  useEffect(() => {
    let current: HTMLElement | null = null;

    const clear = () => {
      if (current) current.classList.remove("a11y-focus-target");
      current = null;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t || t.closest(".a11y-panel, .a11y-launcher")) return;
      const readable = t.closest<HTMLElement>(READABLE);
      if (!readable) return;
      if (readable === current) return;
      clear();
      readable.classList.add("a11y-focus-target");
      current = readable;
    };

    document.addEventListener("mouseover", onOver);
    return () => {
      document.removeEventListener("mouseover", onOver);
      clear();
    };
  }, []);

  return null;
}
