"use client";

import { useA11y } from "../A11yContext";

export function ContentSection() {
  const { state, update } = useA11y();
  const value = state.fontSize;
  const pct = (value / 4) * 100;

  const dec = () => update("fontSize", Math.max(0, value - 1) as never);
  const inc = () => update("fontSize", Math.min(4, value + 1) as never);

  return (
    <div style={{ padding: "0.5rem 0" }}>
      <strong>Tamaño de letra</strong>
      <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 8px" }}>
        Aumentar o disminuir el tamaño de la letra
      </p>
      <div className="a11y-slider-row">
        <button className="a11y-slider-btn" onClick={dec} disabled={value === 0} aria-label="Disminuir">−</button>
        <div className="a11y-slider-bar" style={{ ["--a11y-progress" as string]: `${pct}%` } as React.CSSProperties} />
        <button className="a11y-slider-btn" onClick={inc} disabled={value === 4} aria-label="Aumentar">+</button>
      </div>
    </div>
  );
}
