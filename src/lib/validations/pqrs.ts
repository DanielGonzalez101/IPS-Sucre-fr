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

export const DOC_CONSTRAINTS: Record<
  DocType,
  { max: number; numeric: boolean; placeholder: string; hint: string }
> = {
  CC:        { max: 10, numeric: true,  placeholder: "Ej. 1050000000",     hint: "6–10 dígitos" },
  CE:        { max: 12, numeric: false, placeholder: "Ej. 123456AB",        hint: "Hasta 12 caracteres" },
  NUIP:      { max: 10, numeric: true,  placeholder: "Ej. 1050000000",     hint: "10 dígitos" },
  TI:        { max: 11, numeric: true,  placeholder: "Ej. 10203040506",    hint: "10–11 dígitos" },
  NIT:       { max: 9,  numeric: true,  placeholder: "Ej. 900550249",      hint: "9 dígitos sin dígito de verificación" },
  Pasaporte: { max: 15, numeric: false, placeholder: "Ej. AC1234567",      hint: "Hasta 15 caracteres alfanuméricos" },
  PPT:       { max: 15, numeric: false, placeholder: "Ej. PPT202312345",   hint: "Hasta 15 caracteres" },
  Otro:      { max: 20, numeric: false, placeholder: "Número de documento", hint: "Hasta 20 caracteres" },
};

export const pqrsdSchema = z
  .object({
    type: z.enum(PQRSD_TYPES, { message: "Seleccione un tipo de solicitud" }),
    is_anonymous: z.boolean().default(false),
    full_name: z.string().max(150).optional(),
    doc_type: z.enum(DOC_TYPES).optional(),
    doc_number: z.string().max(20, "Número de documento demasiado largo").optional(),
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
      } else if (data.doc_type && data.doc_number) {
        const c = DOC_CONSTRAINTS[data.doc_type];
        if (data.doc_number.length > c.max) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["doc_number"],
            message: `El número de documento no puede superar ${c.max} caracteres para ${data.doc_type}`,
          });
        }
        if (c.numeric && !/^\d+$/.test(data.doc_number)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["doc_number"],
            message: `El número de ${data.doc_type} solo puede contener dígitos`,
          });
        }
      }
    }
  });

export type PqrsdInput = z.infer<typeof pqrsdSchema>;
