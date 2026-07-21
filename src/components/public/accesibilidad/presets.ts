import { A11yState, ProfileKey } from "./types";

export const PROFILE_PRESETS: Record<ProfileKey, Partial<A11yState>> = {
  ceguera: {
    lectorTexto: true,
    lectorPantalla: true,
    navTeclado: true,
  },
  motora: {
    navTeclado: true,
    tecladoVirtual: true,
    cursor: "negro",
  },
  daltonismo: {
    colorMode: "monocromo",
  },
  visual: {
    fontSize: 3,
    letraLegible: true,
    resaltarEnlaces: true,
    resaltarTitulos: true,
    lupa: true,
  },
  epilepsia: {
    bloquearParpadeos: true,
    colorMode: "baja-saturacion",
  },
  tdah: {
    guiaLectura: true,
    leerEnfoque: true,
    resaltarEnlaces: true,
  },
  aprendizaje: {
    letraLegible: true,
    modoLegible: true,
    guiaLectura: true,
    diccionario: true,
  },
  mayor: {
    fontSize: 2,
    cursor: "negro",
    letraLegible: true,
    resaltarEnlaces: true,
  },
  dislexia: {
    letraLegible: true,
    lineHeight: 2,
    letterSpacing: 1,
    modoLegible: true,
  },
  wcag: {
    resaltarEnlaces: true,
    resaltarTitulos: true,
    letraLegible: true,
    colorMode: "contraste-alto",
  },
};
