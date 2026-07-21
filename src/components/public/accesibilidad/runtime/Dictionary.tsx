"use client";

import { useEffect, useState } from "react";

type Def = { word: string; text: string; x: number; y: number } | null;

export function Dictionary() {
  const [def, setDef] = useState<Def>(null);

  useEffect(() => {
    const onUp = async (e: MouseEvent) => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 2 || text.split(/\s+/).length > 3) {
        setDef(null);
        return;
      }
      setDef({ word: text, text: "Buscando…", x: e.clientX, y: e.clientY });
      try {
        const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(text)}`);
        if (!r.ok) throw new Error("no def");
        const data = (await r.json()) as Array<{ meanings?: Array<{ definitions?: Array<{ definition: string }> }> }>;
        const first = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
        setDef({ word: text, text: first || "Sin definición disponible.", x: e.clientX, y: e.clientY });
      } catch {
        setDef({ word: text, text: "No se encontró definición.", x: e.clientX, y: e.clientY });
      }
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  if (!def) return null;
  return (
    <div className="a11y-dict-tooltip" style={{ left: def.x + 12, top: def.y + 12 }}>
      <strong>{def.word}</strong>
      <div style={{ marginTop: 4, fontWeight: 400 }}>{def.text}</div>
    </div>
  );
}
