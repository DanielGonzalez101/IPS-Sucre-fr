import { z } from "zod";

export const equipoSchema = z.object({
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(2).max(100),
  cargo: z.string().min(2).max(150),
  especialidad: z.string().max(200).optional(),
  foto_url: z.string().url("URL de foto inválida").optional(),
});

export type EquipoInput = z.infer<typeof equipoSchema>;