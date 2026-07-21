"use client";

import { useState } from "react";
import { useA11y } from "../A11yContext";
import { CustomColorTarget } from "../types";

const PALETTE = [
  "#ff0000","#ff5500","#ffaa00","#ffff00","#aaff00","#55ff00","#00ff00",
  "#00ff55","#00ffaa","#00ffff","#00aaff","#0055ff","#0000ff","#5500ff",
  "#aa00ff","#ff00ff","#ff0055","#000000","#666666","#ffffff",
];

export function CustomColorSection() {
  const { state, update } = useA11y();
  const [target, setTarget] = useState<CustomColorTarget>("fondos");

  const setColor = (color: string) => {
    update("colorPersonalizado", { ...state.colorPersonalizado, [target]: color });
  };

  const reset = () => update("colorPersonalizado", { fondos: null, encabezados: null, contenido: null });

  return (
    <div>
      <div className="a11y-tabs" role="tablist">
        {(["fondos","encabezados","contenido"] as CustomColorTarget[]).map((t) => (
          <button
            key={t}
            type="button"
            className="a11y-tab"
            data-active={target === t}
            onClick={() => setTarget(t)}
            role="tab"
            aria-selected={target === t}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="range"
        className="a11y-color-slider"
        min={0}
        max={PALETTE.length - 1}
        value={PALETTE.indexOf(state.colorPersonalizado[target] || PALETTE[0])}
        onChange={(e) => setColor(PALETTE[Number(e.target.value)])}
        aria-label={`Color de ${target}`}
      />

      <button type="button" className="a11y-reset-link" onClick={reset}>
        ↺ Restablecer colores
      </button>
    </div>
  );
}
