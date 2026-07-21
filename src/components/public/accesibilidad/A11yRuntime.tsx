"use client";

import { useA11y } from "./A11yContext";
import { ReadingGuide } from "./runtime/ReadingGuide";
import { Magnifier } from "./runtime/Magnifier";
import { TextToSpeech } from "./runtime/TextToSpeech";
import { VoiceCommands } from "./runtime/VoiceCommands";
import { VirtualKeyboard } from "./runtime/VirtualKeyboard";
import { PageStructure } from "./runtime/PageStructure";
import { FocusReader } from "./runtime/FocusReader";
import { Dictionary } from "./runtime/Dictionary";
import { ImageDescriptions } from "./runtime/ImageDescriptions";
import { SmartNav } from "./runtime/SmartNav";

export function A11yRuntime() {
  const { state } = useA11y();
  return (
    <>
      {state.guiaLectura && <ReadingGuide />}
      {state.lupa && <Magnifier />}
      {state.lectorTexto && <TextToSpeech />}
      {state.comandosVoz && <VoiceCommands />}
      {state.tecladoVirtual && <VirtualKeyboard />}
      {state.estructuraPagina && <PageStructure />}
      {state.leerEnfoque && <FocusReader />}
      {state.diccionario && <Dictionary />}
      {state.descripcionImagenes && <ImageDescriptions />}
      {state.navInteligente && <SmartNav />}
    </>
  );
}
