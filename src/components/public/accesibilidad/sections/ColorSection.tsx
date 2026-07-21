"use client";

import { useA11y } from "../A11yContext";
import { ColorMode } from "../types";

const ITEMS: { mode: ColorMode; label: string; icon: string }[] = [
  { mode: "monocromo", label: "Monocromo", icon: "👁" },
  { mode: "contraste-oscuro", label: "Contraste oscuro", icon: "🌙" },
  { mode: "contraste-claro", label: "Contraste claro", icon: "☀️" },
  { mode: "baja-saturacion", label: "Baja saturación", icon: "💧" },
  { mode: "alta-saturacion", label: "Alta saturación", icon: "💦" },
  { mode: "contraste-alto", label: "Modo de contraste", icon: "◐" },
];

export function ColorSection() {
  const { state, update } = useA11y();
  return (
    <div className="a11y-grid">
      {ITEMS.map((it) => {
        const active = state.colorMode === it.mode;
        return (
          <button
            key={it.mode}
            type="button"
            className="a11y-card"
            data-active={active}
            onClick={() => update("colorMode", active ? "off" : it.mode)}
            aria-pressed={active}
          >
            <span style={{ fontSize: "1.6rem" }} aria-hidden>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
