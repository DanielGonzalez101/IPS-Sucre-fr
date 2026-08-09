"use client";

import { useEffect } from "react";

function speak(text: string) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-ES";
  utter.rate = 1;
  window.speechSynthesis.speak(utter);
}

function readableText(el: HTMLElement): string {
  // aria-label tiene prioridad
  const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
  if (aria) {
    if (el.getAttribute("aria-labelledby")) {
      const ref = document.getElementById(aria);
      if (ref) return ref.textContent?.trim() ?? "";
    }
    return aria.trim();
  }
  // Para inputs buscar el <label> asociado
  if (el.tagName === "INPUT" || el.tagName === "SELECT" || el.tagName === "TEXTAREA") {
    const id = el.id;
    if (id) {
      const label = document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() ?? "";
    }
    const placeholder = (el as HTMLInputElement).placeholder;
    if (placeholder) return placeholder;
  }
  return (el.innerText || el.textContent || "").trim();
}

export function TextToSpeech() {
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest(".a11y-panel, .a11y-launcher")) return;
      speak(readableText(target));
    };

    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.closest(".a11y-panel, .a11y-launcher")) return;
      speak(readableText(target));
    };

    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocus);
      window.speechSynthesis.cancel();
    };
  }, []);

  return null;
}
