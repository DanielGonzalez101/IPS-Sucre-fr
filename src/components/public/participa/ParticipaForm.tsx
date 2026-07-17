"use client";

import { useState, useId } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { DOC_TYPES, type DocType } from "@/lib/validations/pqrs";
import { participaInscripcionSchema } from "@/lib/validations/participa";
import { getMecanismos } from "@/lib/participa";

// Ítem ITA 1942: formulario de inscripción a espacios de participación.
//
// BACKEND_PENDING: no existe todavía `src/app/api/participa/inscripcion/route.ts`
// ni la tabla `participa_inscripciones` (ver requerimiento en
// .claude/Cam.Claude/backend/backend-2026-07-14-participa.md). Por instrucción
// explícita de esta tarea NO se crea el endpoint ni la tabla — el formulario
// valida en cliente con el mismo contrato que tendría el POST real, y al
// enviarse muestra un estado "próximamente" en vez de hacer la petición.
// Cuando el endpoint exista, solo hay que reemplazar el bloque marcado
// abajo por un `fetch("/api/participa/inscripcion", ...)` igual al de
// PqrsForm.tsx.
const BACKEND_PENDING = true;

interface FormState {
  full_name: string;
  doc_type: DocType | "";
  doc_number: string;
  email: string;
  phone: string;
  espacio_id: string;
  message: string;
}

const INITIAL: FormState = {
  full_name: "",
  doc_type: "",
  doc_number: "",
  email: "",
  phone: "",
  espacio_id: "",
  message: "",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-2 mt-2 text-sm" style={{ color: "#FCA5A5" }}>
      <AlertCircle size={14} aria-hidden="true" className="flex-shrink-0" />
      {message}
    </p>
  );
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.9)" }}>
      {children}
      {required && (
        <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true"> *</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-base transition-all duration-200",
    "participa-dark-input",
    hasError ? "participa-dark-input--error" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function selectClass(hasError: boolean) {
  return [inputClass(hasError), "participa-dark-select"].join(" ");
}

export default function ParticipaForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "pending-info">("idle");
  const mecanismos = getMecanismos();
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = participaInscripcionSchema.safeParse({
      ...form,
      doc_type: form.doc_type || undefined,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat)) {
        if (msgs?.[0]) newErrors[key] = msgs[0];
      }
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey) document.getElementById(id(firstKey))?.focus();
      return;
    }

    if (BACKEND_PENDING) {
      setStatus("pending-info");
      return;
    }

    // TODO(backend): reemplazar por fetch("/api/participa/inscripcion", { method: "POST", body: JSON.stringify(result.data) })
    // cuando el endpoint y la tabla participa_inscripciones existan.
  }

  return (
    <section
      id="inscripcion"
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="inscripcion-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10 max-w-3xl">
        <h2
          id="inscripcion-title"
          className="font-heading font-bold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-azul-900)" }}
        >
          Inscríbete a un espacio de participación
        </h2>
        <p className="font-body text-base mb-8" style={{ color: "var(--color-gris-600)" }}>
          Déjanos tus datos y nos pondremos en contacto contigo.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de inscripción a espacios de participación"
          className="rounded-3xl border border-white/10 bg-[#1B2B5E]/80 shadow-2xl shadow-[#1B2B5E]/40 backdrop-blur-xl p-6 md:p-8"
        >
          {status === "pending-info" && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm"
              role="status"
              aria-live="polite"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "#fff",
              }}
            >
              <CheckCircle2 size={18} aria-hidden="true" className="flex-shrink-0 mt-0.5" style={{ color: "#fff" }} />
              <span>
                Este formulario estará disponible próximamente. Tus datos no fueron enviados —
                mientras tanto puedes escribirnos por nuestros{" "}
                <a href="#mecanismos" className="underline font-semibold" style={{ color: "#FCA5A5" }}>
                  canales de contacto
                </a>
                .
              </span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5 mb-2">
            <div className="md:col-span-2">
              <Label htmlFor={id("full_name")} required>Nombre completo</Label>
              <input
                id={id("full_name")}
                type="text"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                className={inputClass(!!errors.full_name)}
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? id("full_name-error") : undefined}
                autoComplete="name"
                placeholder="Escriba su nombre y apellidos"
              />
              <FieldError id={id("full_name-error")} message={errors.full_name} />
            </div>

            <div>
              <Label htmlFor={id("doc_type")} required>Tipo de documento</Label>
              <select
                id={id("doc_type")}
                value={form.doc_type}
                onChange={(e) => set("doc_type", e.target.value)}
                className={selectClass(!!errors.doc_type)}
                aria-invalid={!!errors.doc_type}
                aria-describedby={errors.doc_type ? id("doc_type-error") : undefined}
              >
                <option value="">Seleccione…</option>
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <FieldError id={id("doc_type-error")} message={errors.doc_type} />
            </div>

            <div>
              <Label htmlFor={id("doc_number")} required>Número de documento</Label>
              <input
                id={id("doc_number")}
                type="text"
                value={form.doc_number}
                onChange={(e) => set("doc_number", e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20))}
                className={inputClass(!!errors.doc_number)}
                aria-invalid={!!errors.doc_number}
                aria-describedby={errors.doc_number ? id("doc_number-error") : undefined}
                placeholder="Número de documento"
              />
              <FieldError id={id("doc_number-error")} message={errors.doc_number} />
            </div>

            <div>
              <Label htmlFor={id("email")} required>Correo electrónico</Label>
              <input
                id={id("email")}
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass(!!errors.email)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? id("email-error") : undefined}
                autoComplete="email"
                placeholder="ejemplo@correo.com"
              />
              <FieldError id={id("email-error")} message={errors.email} />
            </div>

            <div>
              <Label htmlFor={id("phone")} required>Teléfono</Label>
              <input
                id={id("phone")}
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                className={inputClass(!!errors.phone)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? id("phone-error") : undefined}
                autoComplete="tel"
                inputMode="numeric"
                placeholder="Ej. 3001234567"
              />
              <FieldError id={id("phone-error")} message={errors.phone} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={id("espacio_id")} required>Espacio de participación</Label>
              <select
                id={id("espacio_id")}
                value={form.espacio_id}
                onChange={(e) => set("espacio_id", e.target.value)}
                className={selectClass(!!errors.espacio_id)}
                aria-invalid={!!errors.espacio_id}
                aria-describedby={errors.espacio_id ? id("espacio_id-error") : undefined}
              >
                <option value="">Seleccione…</option>
                {mecanismos.map((m) => (
                  <option key={m.id} value={m.id}>{m.titulo}</option>
                ))}
              </select>
              <FieldError id={id("espacio_id-error")} message={errors.espacio_id} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={id("message")}>Mensaje (opcional)</Label>
              <textarea
                id={id("message")}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className={inputClass(!!errors.message)}
                rows={4}
                maxLength={500}
                placeholder="Cuéntanos brevemente por qué quieres participar"
              />
              <FieldError id={id("message-error")} message={errors.message} />
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 mt-6">
            <button
              type="submit"
              className="inline-flex items-center justify-center font-bold text-base rounded-full px-8 py-3.5 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B2B5E] cursor-pointer"
              style={{
                backgroundColor: "var(--color-rojo-500)",
                color: "#fff",
                boxShadow: "0 4px 20px 0 rgba(238,53,56,0.35)",
              }}
            >
              Enviar inscripción
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
