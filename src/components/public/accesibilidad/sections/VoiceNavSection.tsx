"use client";

import { useA11y } from "../A11yContext";
import { A11yState } from "../types";

const ITEMS: { key: keyof A11yState; label: string; icon: string }[] = [
  { key: "lectorPantalla", label: "Adaptación al lector de pantalla", icon: "👂" },
  { key: "navTeclado", label: "Navegación con el teclado (Motorizada)", icon: "⌨️" },
  { key: "navInteligente", label: "Navegación inteligente", icon: "🎯" },
  { key: "lectorTexto", label: "Lector de texto", icon: "🔊" },
];

export function VoiceNavSection() {
  const { state, update } = useA11y();
  return (
    <div className="a11y-grid">
      {ITEMS.map((it) => {
        const on = !!state[it.key];
        return (
          <button
            key={it.key as string}
            type="button"
            className="a11y-card"
            data-active={on}
            onClick={() => update(it.key, !on as never)}
            aria-pressed={on}
          >
            <span style={{ fontSize: "1.6rem" }} aria-hidden>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
