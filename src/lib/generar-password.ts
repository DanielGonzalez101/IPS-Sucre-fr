import { randomInt } from "crypto";

// Genera una contraseña temporal aleatoria criptográficamente segura.
// 12 caracteres, garantiza al menos 1 de cada grupo, excluye caracteres
// ambiguos (I/O/0/1/l) para que sea fácil de transcribir a mano si hace falta.
const MAYUS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const MINUS = "abcdefghijkmnopqrstuvwxyz";
const DIGITOS = "23456789";
const SIMBOLOS = "!@#$%&*-_";
const TODOS = MAYUS + MINUS + DIGITOS + SIMBOLOS;

function pick(set: string): string {
  return set[randomInt(set.length)];
}

export function generarPasswordTemporal(): string {
  const obligatorios = [MAYUS, MINUS, DIGITOS, SIMBOLOS].map(pick);
  const resto = Array.from({ length: 8 }, () => pick(TODOS));
  const chars = [...obligatorios, ...resto];

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}
