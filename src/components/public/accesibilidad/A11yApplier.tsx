"use client";

import { useEffect } from "react";
import { useA11y } from "./A11yContext";
import { ColorMode } from "./types";

const COLOR_CLASS: Record<ColorMode, string> = {
  off: "",
  monocromo: "a11y-monocromo",
  "contraste-oscuro": "a11y-contraste-oscuro",
  "contraste-claro": "a11y-contraste-claro",
  "baja-saturacion": "a11y-baja-saturacion",
  "alta-saturacion": "a11y-alta-saturacion",
  "contraste-alto": "a11y-contraste-alto",
};

export function A11yApplier() {
  const { state } = useA11y();

  useEffect(() => {
    const html = document.documentElement;

    // limpia clases previas de escala
    Array.from(html.classList).forEach((c) => {
      if (c.startsWith("a11y-")) html.classList.remove(c);
    });

    // Fuente
    if (state.fontSize > 0) html.classList.add(`a11y-font-${state.fontSize}`);
    if (state.lineHeight > 0) html.classList.add(`a11y-line-${state.lineHeight}`);
    if (state.wordSpacing > 0) html.classList.add(`a11y-word-${state.wordSpacing}`);
    if (state.letterSpacing > 0) html.classList.add(`a11y-letter-${state.letterSpacing}`);

    // Color
    if (state.colorMode !== "off") html.classList.add(COLOR_CLASS[state.colorMode]);

    // Cursor
    if (state.cursor === "blanco") html.classList.add("a11y-cursor-blanco");
    if (state.cursor === "negro") html.classList.add("a11y-cursor-negro");

    // Toggles varios
    const toggles: [keyof typeof state, string][] = [
      ["bloquearParpadeos", "a11y-bloquear-parpadeos"],
      ["letraLegible", "a11y-letra-legible"],
      ["resaltarEnlaces", "a11y-resaltar-enlaces"],
      ["resaltarTitulos", "a11y-resaltar-titulos"],
      ["lupaTexto", "a11y-lupa-texto"],
      ["navTeclado", "a11y-nav-teclado"],
      ["leerEnfoque", "a11y-leer-enfoque"],
      ["descripcionImagenes", "a11y-descripcion-imagenes"],
    ];
    toggles.forEach(([k, cls]) => {
      if (state[k]) html.classList.add(cls);
    });

    return () => {
      Array.from(html.classList).forEach((c) => {
        if (c.startsWith("a11y-")) html.classList.remove(c);
      });
    };
  }, [state]);

  return null;
}
