import { z } from "zod";
import { DOC_TYPES } from "@/lib/validations/pqrs";

export const participaInscripcionSchema = z.object({
  full_name: z
    .string()
    .min(1, "El nombre completo es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),
  doc_type: z.enum(DOC_TYPES, { message: "Seleccione un tipo de documento" }),
  doc_number: z
    .string()
    .min(1, "El número de documento es obligatorio")
    .max(20, "Número de documento demasiado largo"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Correo electrónico inválido"),
  phone: z
    .string()
    .min(7, "El teléfono debe tener mínimo 7 dígitos")
    .max(10, "El teléfono no puede superar 10 dígitos")
    .refine((val) => /^\d{7,10}$/.test(val), {
      message: "Solo se permiten dígitos (7 a 10 números)",
    }),
  espacio_id: z.string().min(1, "Seleccione un espacio de participación"),
  message: z
    .string()
    .max(500, "El mensaje no puede superar 500 caracteres")
    .optional(),
});

export type ParticipaInscripcionInput = z.infer<typeof participaInscripcionSchema>;
