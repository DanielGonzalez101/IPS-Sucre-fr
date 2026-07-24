export type ProfileKey =
  | "ceguera"
  | "motora"
  | "daltonismo"
  | "visual"
  | "epilepsia"
  | "mayor"
  | "dislexia";

export type ColorMode =
  | "off"
  | "monocromo"
  | "contraste-oscuro"
  | "contraste-claro"
  | "baja-saturacion"
  | "alta-saturacion"
  | "contraste-alto";

export type CursorMode = "off" | "blanco" | "negro";

export type FontTarget = "size" | "line" | "word" | "letter";

export type A11yState = {
  profiles: Record<ProfileKey, boolean>;

  // Voz y navegación
  lectorPantalla: boolean;
  navTeclado: boolean;
  navInteligente: boolean;
  lectorTexto: boolean;

  // Color
  colorMode: ColorMode;
  // Contenido — fuente
  fontSize: number; // 0..4 pasos
  lineHeight: number;
  wordSpacing: number;
  letterSpacing: number;

  // Cursor
  cursor: CursorMode;

  // Toggles varios
  bloquearParpadeos: boolean;
  subtitulos: boolean;
  lupa: boolean;
  letraLegible: boolean;
  descripcionImagenes: boolean;
  resaltarEnlaces: boolean;
  resaltarTitulos: boolean;
  lupaTexto: boolean;
  estructuraPagina: boolean;
  leerEnfoque: boolean;
  guiaLectura: boolean;
  diccionario: boolean;
  tecladoVirtual: boolean;
};

export const DEFAULT_STATE: A11yState = {
  profiles: {
    ceguera: false,
    motora: false,
    daltonismo: false,
    visual: false,
    epilepsia: false,
    mayor: false,
    dislexia: false,
  },
  lectorPantalla: false,
  navTeclado: false,
  navInteligente: false,
  lectorTexto: false,
  colorMode: "off",
  fontSize: 0,
  lineHeight: 0,
  wordSpacing: 0,
  letterSpacing: 0,
  cursor: "off",
  bloquearParpadeos: false,
  subtitulos: false,
  lupa: false,
  letraLegible: false,
  descripcionImagenes: false,
  resaltarEnlaces: false,
  resaltarTitulos: false,
  lupaTexto: false,
  estructuraPagina: false,
  leerEnfoque: false,
  guiaLectura: false,
  diccionario: false,
  tecladoVirtual: false,
};
