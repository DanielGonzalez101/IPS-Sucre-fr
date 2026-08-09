"use client";

import { useSyncExternalStore } from "react";
import { useA11y } from "./A11yContext";
import { ReadingGuide } from "./runtime/ReadingGuide";
import { Magnifier } from "./runtime/Magnifier";
import { TextToSpeech } from "./runtime/TextToSpeech";
import { VirtualKeyboard } from "./runtime/VirtualKeyboard";
import { PageStructure } from "./runtime/PageStructure";
import { FocusReader } from "./runtime/FocusReader";
import { Dictionary } from "./runtime/Dictionary";
import { ImageDescriptions } from "./runtime/ImageDescriptions";
import { SmartNav } from "./runtime/SmartNav";

// Durante SSR y la primera hidratación, getServerSnapshot devuelve false.
// Después de la hidratación, React cambia a getSnapshot (true).
// Esto garantiza que el árbol del servidor y el del cliente sean idénticos.
const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

export function A11yRuntime() {
  const { state } = useA11y();
  const isClient = useIsClient();

  if (!isClient) return null;

  return (
    <>
      {state.guiaLectura && <ReadingGuide />}
      {state.lupa && <Magnifier />}
      {state.lectorTexto && <TextToSpeech />}
      {state.tecladoVirtual && <VirtualKeyboard />}
      {state.estructuraPagina && <PageStructure />}
      {state.leerEnfoque && <FocusReader />}
      {state.diccionario && <Dictionary />}
      {state.descripcionImagenes && <ImageDescriptions />}
      {state.navInteligente && <SmartNav />}
    </>
  );
}
