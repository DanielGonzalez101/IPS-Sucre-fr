import { z } from "zod";

export const servicioSchema = z.object({
  titulo: z.string().min(2).max(200),
  descripcion: z.string().min(1).max(2000),
  orden: z.number().int().nonnegative().optional(),
});

export type ServicioInput = z.infer<typeof servicioSchema>;