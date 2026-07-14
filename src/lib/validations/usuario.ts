import { z } from "zod";
import { MODULO_SLUGS } from "@/lib/permisos";

export const usuarioSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  nombre: z.string().min(2).max(100),
  role: z.enum(["admin", "editor", "viewer"]).default("viewer"),
  modulos_permitidos: z.array(z.enum(MODULO_SLUGS)).default([]),
});

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type UsuarioInput = z.infer<typeof usuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
