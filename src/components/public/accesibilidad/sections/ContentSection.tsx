"use client";

import { useState } from "react";
import { useA11y } from "../A11yContext";
import { A11yState, CursorMode, FontTarget } from "../types";

const FONT_TABS: { key: FontTarget; label: string; field: keyof A11yState }[] = [
  { key: "size", label: "Tamaño de letra", field: "fontSize" },
  { key: "line", label: "Espacio entre líneas", field: "lineHeight" },
  { key: "word", label: "Espacio entre palabras", field: "wordSpacing" },
  { key: "letter", label: "Espacio entre letras", field: "letterSpacing" },
];

const CARDS: { key: keyof A11yState; label: string; icon: string }[] = [
  { key: "bloquearParpadeos", label: "Bloquear parpadeos", icon: "🚫" },
  { key: "subtitulos", label: "Añadir subtítulos (beta)", icon: "▶︎" },
  { key: "lupa", label: "Lupa", icon: "🔍" },
  { key: "letraLegible", label: "Letra legible", icon: "A" },
  { key: "descripcionImagenes", label: "Descripción de imágenes", icon: "🖼️" },
  { key: "resaltarEnlaces", label: "Resaltar enlaces", icon: "🔗" },
  { key: "resaltarTitulos", label: "Resaltar títulos", icon: "H" },
  { key: "modoLegible", label: "Modo legible", icon: "📄" },
  { key: "lupaTexto", label: "Lupa de texto", icon: "🔎" },
  { key: "estructuraPagina", label: "Estructura de la página", icon: "🗺️" },
  { key: "leerEnfoque", label: "Leer enfoque", icon: "◱" },
  { key: "guiaLectura", label: "Guía de lectura", icon: "▬" },
  { key: "diccionario", label: "Diccionario", icon: "📖" },
  { key: "tecladoVirtual", label: "Teclado virtual", icon: "⌨" },
];

export function ContentSection() {
  const { state, update } = useA11y();
  const [fontTab, setFontTab] = useState<FontTarget>("size");
  const active = FONT_TABS.find((t) => t.key === fontTab)!;
  const value = state[active.field] as number;

  const dec = () => update(active.field, Math.max(0, value - 1) as never);
  const inc = () => update(active.field, Math.min(4, value + 1) as never);
  const pct = (value / 4) * 100;

  const setCursor = (c: CursorMode) => update("cursor", state.cursor === c ? "off" : c);

  return (
    <div>
      <div style={{ padding: "0.5rem 0" }}>
        <strong>Ajustes de fuente</strong>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 8px" }}>
          Aumentar o disminuir el tamaño de la letra
        </p>
        <div className="a11y-tabs">
          {FONT_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className="a11y-tab"
              data-active={fontTab === t.key}
              onClick={() => setFontTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="a11y-slider-row">
          <button className="a11y-slider-btn" onClick={dec} disabled={value === 0} aria-label="Disminuir">−</button>
          <div className="a11y-slider-bar" style={{ ["--a11y-progress" as string]: `${pct}%` } as React.CSSProperties} />
          <button className="a11y-slider-btn" onClick={inc} disabled={value === 4} aria-label="Aumentar">+</button>
        </div>
      </div>

      <div style={{ padding: "0.75rem 0" }}>
        <strong>Cursor</strong>
        <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: "2px 0 8px" }}>
          Aumentar el tamaño y cambiar el color del cursor
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            className="a11y-tab"
            data-active={state.cursor === "blanco"}
            onClick={() => setCursor("blanco")}
            style={{ flex: 1 }}
          >
            BLANCO
          </button>
          <button
            type="button"
            className="a11y-tab"
            data-active={state.cursor === "negro"}
            onClick={() => setCursor("negro")}
            style={{ flex: 1 }}
          >
            NEGRO
          </button>
        </div>
      </div>

      <div className="a11y-grid">
        {CARDS.map((it) => {
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
              <span style={{ fontSize: "1.4rem" }} aria-hidden>{it.icon}</span>
              <span>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
