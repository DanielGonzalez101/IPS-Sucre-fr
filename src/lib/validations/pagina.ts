import { z } from "zod";

export const paginaSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido: solo letras minúsculas, números y guiones"),
  titulo: z.string().min(2).max(200),
  contenido: z.string().min(1),
  meta_descripcion: z.string().max(160).optional(),
  publicado: z.boolean().default(false),
});

export type PaginaInput = z.infer<typeof paginaSchema>;
