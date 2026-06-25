import { z } from "zod";

export const pqrsSchema = z.object({
  tipo: z.enum(["peticion", "queja", "reclamo", "sugerencia"]),
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().regex(/^\+?[\d\s\-()]{7,15}$/, "Teléfono inválido").optional(),
  mensaje: z.string().min(20, "El mensaje debe tener al menos 20 caracteres").max(2000),
  anonimo: z.boolean().default(false),
});

export type PqrsInput = z.infer<typeof pqrsSchema>;
