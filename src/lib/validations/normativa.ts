import { z } from "zod";

export const normativaSchema = z.object({
  titulo: z.string().min(2).max(300),
  descripcion: z.string().max(1000).optional(),
  archivo_url: z.string().url("URL de archivo inválida").optional(),
  fecha: z.string().date("Fecha inválida, use formato YYYY-MM-DD"),
});

export type NormativaInput = z.infer<typeof normativaSchema>;