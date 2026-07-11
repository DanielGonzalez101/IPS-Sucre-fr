import { z } from "zod";

export const PQRSD_TYPES = [
  "peticion",
  "queja",
  "reclamo",
  "solicitud",
  "denuncia",
  "sugerencia",
] as const;

export const DOC_TYPES = [
  "CC",
  "CE",
  "NUIP",
  "TI",
  "NIT",
  "Pasaporte",
  "PPT",
  "Otro",
] as const;

export const RESPONSE_MODES = ["email", "correspondencia"] as const;

export type PqrsdType = (typeof PQRSD_TYPES)[number];
export type DocType = (typeof DOC_TYPES)[number];
export type ResponseMode = (typeof RESPONSE_MODES)[number];

export const ANONYMOUS_ALLOWED: PqrsdType[] = ["queja", "denuncia"];

export const pqrsdSchema = z
  .object({
    type: z.enum(PQRSD_TYPES, { message: "Seleccione un tipo de solicitud" }),
    is_anonymous: z.boolean().default(false),
    full_name: z.string().max(150).optional(),
    doc_type: z.enum(DOC_TYPES).optional(),
    doc_number: z.string().max(10, "El número de documento no puede superar 10 dígitos").optional(),
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
    address: z.string().max(200).optional(),
    address_detail: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    response_mode: z.enum(RESPONSE_MODES).default("email"),
    subject: z
      .string()
      .min(3, "El asunto es obligatorio")
      .max(200, "El asunto no puede superar 200 caracteres"),
    description: z
      .string()
      .min(50, "La descripción debe tener al menos 50 caracteres")
      .max(500, "La descripción no puede superar los 500 caracteres"),
    accepted_terms: z
      .boolean()
      .refine((v) => v === true, {
        message: "Debe aceptar las condiciones de tratamiento de datos",
      }),
    terms_version: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_anonymous) {
      if (!data.full_name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["full_name"],
          message: "El nombre completo es obligatorio",
        });
      }
      if (!data.doc_type) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["doc_type"],
          message: "Seleccione el tipo de documento",
        });
      }
      if (!data.doc_number?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["doc_number"],
          message: "El número de documento es obligatorio",
        });
      }
    }
  });

export type PqrsdInput = z.infer<typeof pqrsdSchema>;
