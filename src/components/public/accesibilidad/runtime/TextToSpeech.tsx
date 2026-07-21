"use client";

import { useEffect } from "react";

export function TextToSpeech() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest(".a11y-panel, .a11y-launcher")) return;
      const text = (target.innerText || target.textContent || "").trim();
      if (!text) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-ES";
      utter.rate = 1;
      window.speechSynthesis.speak(utter);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.speechSynthesis.cancel();
    };
  }, []);

  return null;
}
