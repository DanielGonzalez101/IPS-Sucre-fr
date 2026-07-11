"use client";

import { useState, useRef, useId } from "react";
import { Upload, X, FileText, AlertCircle, ChevronDown } from "lucide-react";
import {
  PQRSD_TYPES,
  DOC_TYPES,
  ANONYMOUS_ALLOWED,
  pqrsdSchema,
  type PqrsdType,
  type DocType,
  type ResponseMode,
} from "@/lib/validations/pqrs";
import PqrsConfirmation from "./PqrsConfirmation";

// ─── Constantes de presentación ───────────────────────────────────────────────

const TYPE_META: Record<
  PqrsdType,
  { label: string; short: string; description: string }
> = {
  peticion: {
    label: "Petición",
    short: "P",
    description:
      "Solicitud respetuosa dirigida a la entidad para que tome una decisión frente a un interés legítimo o general.",
  },
  queja: {
    label: "Queja",
    short: "Q",
    description:
      "Manifestación de inconformidad por la conducta de un funcionario o por la atención recibida.",
  },
  reclamo: {
    label: "Reclamo",
    short: "R",
    description:
      "Inconformidad por la calidad, oportunidad o continuidad de un servicio prestado por la entidad.",
  },
  solicitud: {
    label: "Solicitud",
    short: "S",
    description:
      "Requerimiento de información, copias de documentos o acceso a datos sobre las actividades de la entidad.",
  },
  denuncia: {
    label: "Denuncia",
    short: "D",
    description:
      "Notificación de hechos irregulares, presuntas faltas disciplinarias o actos de corrupción en la entidad.",
  },
  sugerencia: {
    label: "Sugerencia",
    short: "Sg",
    description:
      "Propuesta para mejorar los procesos, actividades, servicios o calidad en la atención de la entidad.",
  },
};

const ALLOWED_EXTENSIONS = ["PDF", "JPG", "PNG"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 3;

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface FormState {
  type: PqrsdType | "";
  is_anonymous: boolean;
  full_name: string;
  doc_type: DocType | "";
  doc_number: string;
  email: string;
  phone: string;
  address: string;
  address_detail: string;
  city: string;
  response_mode: ResponseMode;
  subject: string;
  description: string;
  accepted_terms: boolean;
}

const INITIAL: FormState = {
  type: "",
  is_anonymous: false,
  full_name: "",
  doc_type: "",
  doc_number: "",
  email: "",
  phone: "",
  address: "",
  address_detail: "",
  city: "",
  response_mode: "email",
  subject: "",
  description: "",
  accepted_terms: false,
};

// ─── Helpers de UI ────────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 mt-1.5 text-sm" style={{ color: "var(--color-rojo-500)" }}>
      <AlertCircle size={14} aria-hidden="true" />
      {message}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-bold text-base mb-4"
      style={{ color: "var(--color-azul-900)" }}
    >
      {children}
    </h3>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "bg-white",
    hasError
      ? "border-[#EE3538] focus:ring-[#EE3538]/30"
      : "border-gray-200 focus:ring-[var(--color-azul-600)]/30 focus:border-[var(--color-azul-600)]",
  ].join(" ");
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold mb-1.5"
      style={{ color: "var(--color-gris-700)" }}
    >
      {children}
      {required && (
        <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">
          {" "}*
        </span>
      )}
    </label>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PqrsForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string>("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [trackingCode, setTrackingCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const id = (field: string) => `${uid}-${field}`;

  function set(field: keyof FormState, value: FormState[keyof FormState]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  const canBeAnonymous =
    form.type !== "" && ANONYMOUS_ALLOWED.includes(form.type as PqrsdType);

  function handleTypeChange(type: PqrsdType) {
    setForm((prev) => ({
      ...prev,
      type,
      is_anonymous: ANONYMOUS_ALLOWED.includes(type) ? prev.is_anonymous : false,
    }));
    setErrors((prev) => ({ ...prev, type: "" }));
  }

  function handleFileAdd(newFiles: FileList | null) {
    if (!newFiles) return;
    setFileError("");
    const arr = Array.from(newFiles);
    const next = [...files];

    for (const f of arr) {
      if (next.length >= MAX_FILES) {
        setFileError(`Máximo ${MAX_FILES} archivos permitidos.`);
        break;
      }
      if (f.size > MAX_FILE_SIZE) {
        setFileError(`"${f.name}" supera el límite de 5 MB.`);
        continue;
      }
      const ext = f.name.split(".").pop()?.toUpperCase() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setFileError(`"${f.name}" no es un tipo permitido (PDF, JPG, PNG).`);
        continue;
      }
      next.push(f);
    }

    setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // TODO: Integrar reCAPTCHA v3 aquí antes de enviar
    // const recaptchaToken = await grecaptcha.execute(SITE_KEY, { action: 'pqrsd_submit' });

    // Client-side validation
    const result = pqrsdSchema.safeParse({
      ...form,
      type: form.type || undefined,
      doc_type: form.doc_type || undefined,
    });

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(flat)) {
        if (msgs?.[0]) newErrors[key] = msgs[0];
      }
      setErrors(newErrors);
      // Focus first error
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey) {
        const el = document.getElementById(id(firstKey));
        el?.focus();
      }
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("type", form.type);
      fd.append("is_anonymous", String(form.is_anonymous));
      if (!form.is_anonymous) {
        fd.append("full_name", form.full_name);
        fd.append("doc_type", form.doc_type);
        fd.append("doc_number", form.doc_number);
      }
      fd.append("email", form.email);
      if (form.phone) fd.append("phone", form.phone);
      if (form.address) fd.append("address", form.address);
      if (form.address_detail) fd.append("address_detail", form.address_detail);
      if (form.city) fd.append("city", form.city);
      fd.append("response_mode", form.response_mode);
      fd.append("subject", form.subject);
      fd.append("description", form.description);
      fd.append("accepted_terms", "true");

      for (const f of files) {
        fd.append("adjuntos", f);
      }

      const res = await fetch("/api/pqrsd", {
        method: "POST",
        body: fd,
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.fields) {
          const newErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(json.fields as Record<string, string[]>)) {
            if (msgs[0]) newErrors[key] = msgs[0];
          }
          setErrors(newErrors);
        } else {
          setErrors({ _global: json.error ?? "Error al enviar la solicitud." });
        }
        return;
      }

      setTrackingCode(json.tracking_code);
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _global: "Error de conexión. Verifique su internet e intente nuevamente." });
    } finally {
      setSubmitting(false);
    }
  }

  function handleNew() {
    setForm(INITIAL);
    setFiles([]);
    setErrors({});
    setFileError("");
    setTrackingCode("");
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (step === "success") {
    return (
      <PqrsConfirmation
        trackingCode={trackingCode}
        email={form.email}
        onNew={handleNew}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulario PQRSD">
      {/* ── Sección de ayuda ───────────────────────────── */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setHelpOpen(!helpOpen)}
          className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: "var(--color-azul-50)",
            border: "1.5px solid var(--color-azul-100)",
          }}
          aria-expanded={helpOpen}
          aria-controls="pqrs-help-content"
        >
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--color-azul-800)" }}
          >
            ¿Cuál es la diferencia entre cada tipo de solicitud? Ver definiciones
          </span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            style={{
              color: "var(--color-azul-600)",
              transform: helpOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              flexShrink: 0,
            }}
          />
        </button>

        {helpOpen && (
          <div
            id="pqrs-help-content"
            className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {PQRSD_TYPES.map((t) => (
              <div
                key={t}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-gris-100)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: "var(--color-azul-800)",
                      color: "#fff",
                    }}
                    aria-hidden="true"
                  >
                    {TYPE_META[t].short}
                  </span>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-azul-900)" }}
                  >
                    {TYPE_META[t].label}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--color-gris-500)" }}>
                  {TYPE_META[t].description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tipo de solicitud ──────────────────────────── */}
      <fieldset className="mb-8">
        <legend className="font-bold text-base mb-4" style={{ color: "var(--color-azul-900)" }}>
          Tipo de solicitud{" "}
          <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">*</span>
        </legend>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          role="radiogroup"
          aria-required="true"
        >
          {PQRSD_TYPES.map((t) => {
            const selected = form.type === t;
            return (
              <label
                key={t}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  backgroundColor: selected ? "var(--color-azul-50)" : "#fff",
                  border: selected
                    ? "2px solid var(--color-azul-800)"
                    : "1.5px solid var(--color-gris-100)",
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={selected}
                  onChange={() => handleTypeChange(t)}
                  className="mt-0.5 accent-[var(--color-azul-800)]"
                  aria-describedby={errors.type ? id("type-error") : undefined}
                />
                <span>
                  <span
                    className="block font-semibold text-sm"
                    style={{
                      color: selected
                        ? "var(--color-azul-800)"
                        : "var(--color-gris-700)",
                    }}
                  >
                    {TYPE_META[t].label}
                  </span>
                  <span
                    className="block text-xs mt-0.5"
                    style={{ color: "var(--color-gris-500)" }}
                  >
                    {TYPE_META[t].description.slice(0, 70)}…
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <FieldError id={id("type-error")} message={errors.type} />
      </fieldset>

      {/* ── Anonimato (solo queja/denuncia) ───────────── */}
      {canBeAnonymous && (
        <div
          className="mb-8 p-4 rounded-xl"
          style={{
            backgroundColor: "var(--color-azul-50)",
            border: "1.5px solid var(--color-azul-100)",
          }}
        >
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_anonymous}
              onChange={(e) => set("is_anonymous", e.target.checked)}
              className="mt-0.5 accent-[var(--color-azul-800)]"
              aria-describedby={id("anon-desc")}
            />
            <span>
              <span
                className="block font-semibold text-sm"
                style={{ color: "var(--color-azul-900)" }}
              >
                Deseo presentar esta solicitud de forma anónima
              </span>
              <span
                id={id("anon-desc")}
                className="block text-xs mt-0.5"
                style={{ color: "var(--color-gris-500)" }}
              >
                Solo disponible para Quejas y Denuncias. No se registrarán sus
                datos personales, pero deberá suministrar un correo para la
                respuesta.
              </span>
            </span>
          </label>
        </div>
      )}

      {/* ── Datos de identificación ───────────────────── */}
      {!form.is_anonymous && (
        <div className="mb-8">
          <SectionTitle>Datos de identificación</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor={id("full_name")} required>
                Nombre completo
              </Label>
              <input
                id={id("full_name")}
                type="text"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
                className={inputClass(!!errors.full_name)}
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? id("full_name-error") : undefined}
                autoComplete="name"
                placeholder="Nombre y apellidos"
              />
              <FieldError id={id("full_name-error")} message={errors.full_name} />
            </div>

            <div>
              <Label htmlFor={id("doc_type")} required>
                Tipo de documento
              </Label>
              <select
                id={id("doc_type")}
                value={form.doc_type}
                onChange={(e) => set("doc_type", e.target.value as DocType)}
                className={inputClass(!!errors.doc_type)}
                aria-invalid={!!errors.doc_type}
                aria-describedby={errors.doc_type ? id("doc_type-error") : undefined}
              >
                <option value="">Seleccione…</option>
                {DOC_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
              <FieldError id={id("doc_type-error")} message={errors.doc_type} />
            </div>

            <div>
              <Label htmlFor={id("doc_number")} required>
                Número de documento
              </Label>
              <input
                id={id("doc_number")}
                type="text"
                value={form.doc_number}
                onChange={(e) => set("doc_number", e.target.value)}
                className={inputClass(!!errors.doc_number)}
                aria-invalid={!!errors.doc_number}
                aria-describedby={errors.doc_number ? id("doc_number-error") : undefined}
                placeholder="Ej. 1050000000"
              />
              <FieldError
                id={id("doc_number-error")}
                message={errors.doc_number}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Datos de contacto ─────────────────────────── */}
      <div className="mb-8">
        <SectionTitle>Datos de contacto</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={id("email")} required>
              Correo electrónico
            </Label>
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
            <Label htmlFor={id("phone")}>Teléfono (opcional)</Label>
            <input
              id={id("phone")}
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputClass(!!errors.phone)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? id("phone-error") : undefined}
              autoComplete="tel"
              placeholder="Ej. 300 000 0000"
            />
            <FieldError id={id("phone-error")} message={errors.phone} />
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor={id("address")}>Dirección de correspondencia</Label>
            <input
              id={id("address")}
              type="text"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={inputClass(false)}
              autoComplete="street-address"
              placeholder="Calle, carrera, transversal…"
            />
          </div>

          <div>
            <Label htmlFor={id("address_detail")}>
              Barrio / Vereda / Corregimiento
            </Label>
            <input
              id={id("address_detail")}
              type="text"
              value={form.address_detail}
              onChange={(e) => set("address_detail", e.target.value)}
              className={inputClass(false)}
              placeholder="Nombre del barrio o vereda"
            />
          </div>

          <div>
            <Label htmlFor={id("city")}>Municipio / Distrito</Label>
            <input
              id={id("city")}
              type="text"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className={inputClass(false)}
              autoComplete="address-level2"
              placeholder="Ciudad o municipio"
            />
          </div>
        </div>
      </div>

      {/* ── Modalidad de respuesta ─────────────────────── */}
      <fieldset className="mb-8">
        <legend
          className="font-bold text-base mb-4"
          style={{ color: "var(--color-azul-900)" }}
        >
          Modalidad de respuesta
        </legend>
        <div className="flex flex-col sm:flex-row gap-3">
          {(["email", "correspondencia"] as ResponseMode[]).map((mode) => {
            const labels: Record<ResponseMode, string> = {
              email: "Correo electrónico",
              correspondencia: "Dirección de correspondencia",
            };
            const selected = form.response_mode === mode;
            return (
              <label
                key={mode}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  backgroundColor: selected ? "var(--color-azul-50)" : "#fff",
                  border: selected
                    ? "2px solid var(--color-azul-800)"
                    : "1.5px solid var(--color-gris-100)",
                  flex: 1,
                }}
              >
                <input
                  type="radio"
                  name="response_mode"
                  value={mode}
                  checked={selected}
                  onChange={() => set("response_mode", mode)}
                  className="accent-[var(--color-azul-800)]"
                />
                <span
                  className="font-semibold text-sm"
                  style={{
                    color: selected
                      ? "var(--color-azul-800)"
                      : "var(--color-gris-700)",
                  }}
                >
                  {labels[mode]}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* ── Contenido ─────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle>Contenido de la solicitud</SectionTitle>
        <div className="space-y-4">
          <div>
            <Label htmlFor={id("subject")} required>
              Asunto / Objeto
            </Label>
            <input
              id={id("subject")}
              type="text"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              className={inputClass(!!errors.subject)}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? id("subject-error") : undefined}
              maxLength={200}
              placeholder="Resuma brevemente el motivo de su solicitud"
            />
            <FieldError id={id("subject-error")} message={errors.subject} />
          </div>

          <div>
            <Label htmlFor={id("description")} required>
              Descripción detallada
            </Label>
            <textarea
              id={id("description")}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className={inputClass(!!errors.description)}
              aria-invalid={!!errors.description}
              aria-describedby={
                [
                  errors.description ? id("description-error") : "",
                  id("description-hint"),
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              rows={6}
              placeholder="Describa con detalle los hechos, fechas, personas involucradas y lo que solicita a la entidad…"
            />
            <div className="flex items-start justify-between mt-1.5">
              <FieldError
                id={id("description-error")}
                message={errors.description}
              />
              <span
                id={id("description-hint")}
                className="text-xs ml-auto"
                style={{
                  color:
                    form.description.length < 50
                      ? "var(--color-gris-500)"
                      : "var(--color-azul-600)",
                }}
                aria-live="polite"
              >
                {form.description.length} / 50 mín.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Adjuntos ──────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle>Documentos adjuntos (opcional)</SectionTitle>
        <p
          className="text-sm mb-4"
          style={{ color: "var(--color-gris-500)" }}
          id={id("file-hint")}
        >
          PDF, JPG o PNG — máximo 5 MB por archivo — hasta 3 archivos.
        </p>

        {files.length < MAX_FILES && (
          <label
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl cursor-pointer transition-all duration-200"
            style={{
              border: "2px dashed var(--color-azul-100)",
              backgroundColor: "var(--color-azul-50)",
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileAdd(e.dataTransfer.files);
            }}
          >
            <Upload
              size={28}
              aria-hidden="true"
              style={{ color: "var(--color-azul-600)" }}
            />
            <span
              className="font-semibold text-sm"
              style={{ color: "var(--color-azul-800)" }}
            >
              Haga clic o arrastre archivos aquí
            </span>
            <span className="text-xs" style={{ color: "var(--color-gris-500)" }}>
              {files.length} / {MAX_FILES} archivos seleccionados
            </span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileAdd(e.target.files)}
              className="sr-only"
              aria-describedby={id("file-hint")}
            />
          </label>
        )}

        {fileError && (
          <p
            className="flex items-center gap-1.5 mt-2 text-sm"
            role="alert"
            style={{ color: "var(--color-rojo-500)" }}
          >
            <AlertCircle size={14} aria-hidden="true" />
            {fileError}
          </p>
        )}

        {files.length > 0 && (
          <ul className="mt-3 space-y-2" aria-label="Archivos seleccionados">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-gris-100)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText
                    size={18}
                    aria-hidden="true"
                    style={{ color: "var(--color-azul-600)", flexShrink: 0 }}
                  />
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--color-gris-700)" }}
                    title={f.name}
                  >
                    {f.name}
                  </span>
                  <span
                    className="text-xs flex-shrink-0"
                    style={{ color: "var(--color-gris-500)" }}
                  >
                    {formatSize(f.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="p-1 rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0"
                  style={{ color: "var(--color-gris-500)" }}
                  aria-label={`Eliminar ${f.name}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Aceptación de términos ─────────────────────── */}
      <div className="mb-8">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id={id("accepted_terms")}
            type="checkbox"
            checked={form.accepted_terms}
            onChange={(e) => set("accepted_terms", e.target.checked)}
            className="mt-0.5 accent-[var(--color-azul-800)]"
            aria-invalid={!!errors.accepted_terms}
            aria-describedby={[
              id("terms-text"),
              errors.accepted_terms ? id("terms-error") : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
          <span
            id={id("terms-text")}
            className="text-sm"
            style={{ color: "var(--color-gris-700)" }}
          >
            He leído y acepto que mis datos personales serán tratados conforme a
            la{" "}
            <strong>Ley 1581 de 2012</strong> (Protección de Datos Personales) y
            la política de privacidad de IPS Sucre. Los datos recolectados
            serán utilizados exclusivamente para gestionar esta solicitud.{" "}
            <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">
              *
            </span>
          </span>
        </label>
        <FieldError id={id("terms-error")} message={errors.accepted_terms} />
      </div>

      {/* ── Error global ───────────────────────────────── */}
      {errors._global && (
        <div
          className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm"
          role="alert"
          style={{
            backgroundColor: "rgba(238,53,56,0.07)",
            border: "1px solid rgba(238,53,56,0.25)",
            color: "var(--color-rojo-500)",
          }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          {errors._global}
        </div>
      )}

      {/* ── Botón enviar ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center font-semibold text-sm rounded-full px-8 py-3.5 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: "var(--color-rojo-500)",
            color: "#fff",
            boxShadow: "0 4px 16px 0 rgba(238,53,56,0.30)",
          }}
        >
          {submitting ? "Enviando…" : "Radicar solicitud"}
        </button>
        <p className="text-xs" style={{ color: "var(--color-gris-500)" }}>
          Los campos marcados con{" "}
          <span style={{ color: "var(--color-rojo-500)" }}>*</span> son
          obligatorios.
        </p>
      </div>
    </form>
  );
}
