"use client";

import { useEffect } from "react";

type SpeechRecognitionCtor = new () => {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
};

export function VoiceCommands() {
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "es-ES";

    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const t = (last[0].transcript || "").trim().toLowerCase();
      if (t.includes("abajo")) window.scrollBy({ top: 300, behavior: "smooth" });
      else if (t.includes("arriba")) window.scrollBy({ top: -300, behavior: "smooth" });
      else if (t.includes("inicio")) window.scrollTo({ top: 0, behavior: "smooth" });
      else if (t.includes("final")) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      else if (t.startsWith("ir a ")) {
        const label = t.replace("ir a ", "");
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a"));
        const match = links.find((a) => (a.innerText || "").toLowerCase().includes(label));
        if (match) match.click();
      }
    };
    rec.onend = () => {
      try { rec.start(); } catch {}
    };

    try { rec.start(); } catch {}
    return () => { try { rec.stop(); } catch {} };
  }, []);

  return null;
}
