"use client";

import { useState, useRef, useId } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import {
  PQRSD_TYPES,
  DOC_TYPES,
  DOC_CONSTRAINTS,
  ANONYMOUS_ALLOWED,
  pqrsdSchema,
  type PqrsdType,
  type DocType,
} from "@/lib/validations/pqrs";
import CityInput from "./CityInput";
import DocTypeSelect from "./DocTypeSelect";
import PqrsConfirmation from "./PqrsConfirmation";

// ─── Definiciones de tipos ────────────────────────────────────────────────────

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

// ─── Estado del formulario ────────────────────────────────────────────────────

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
  response_mode: "email";
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

// ─── Componentes de UI ────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-2 mt-2 text-base"
      style={{ color: "var(--color-rojo-500)" }}
    >
      <AlertCircle size={16} aria-hidden="true" className="flex-shrink-0" />
      {message}
    </p>
  );
}

function SectionTitle({
  children,
  number,
}: {
  children: React.ReactNode;
  number: number;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
        style={{
          backgroundColor: "var(--color-azul-800)",
          color: "#fff",
        }}
        aria-hidden="true"
      >
        {number}
      </span>
      <h3
        className="font-bold text-xl md:text-2xl"
        style={{ color: "var(--color-azul-900)" }}
      >
        {children}
      </h3>
    </div>
  );
}

function Divider() {
  return (
    <hr
      className="my-10"
      style={{ borderColor: "var(--color-gris-100)" }}
      aria-hidden="true"
    />
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-5 py-4 rounded-xl border text-base transition-all duration-200",
    "focus:outline-none focus:ring-2",
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
      className="block text-base font-semibold mb-2"
      style={{ color: "var(--color-gris-700)" }}
    >
      {children}
      {required && (
        <span
          style={{ color: "var(--color-rojo-500)" }}
          aria-hidden="true"
        >
          {" "}
          *
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
  const [fileError, setFileError] = useState("");
  const [step, setStep] = useState<"form" | "success">("form");
  const [trackingCode, setTrackingCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const { getToken } = useRecaptcha();

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

    const recaptchaToken = await getToken("pqrsd");

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
      const firstKey = Object.keys(newErrors)[0];
      if (firstKey) document.getElementById(id(firstKey))?.focus();
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
      fd.append("phone", form.phone);
      if (form.address) fd.append("address", form.address);
      if (form.address_detail) fd.append("address_detail", form.address_detail);
      if (form.city) fd.append("city", form.city);
      fd.append("response_mode", "email");
      fd.append("subject", form.subject);
      fd.append("description", form.description);
      fd.append("accepted_terms", "true");
      if (recaptchaToken) fd.append("recaptcha_token", recaptchaToken);
      for (const f of files) fd.append("adjuntos", f);

      const res = await fetch("/api/pqrsd", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        if (json.fields) {
          const newErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(
            json.fields as Record<string, string[]>
          )) {
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
      setErrors({
        _global:
          "Error de conexión. Verifique su internet e intente nuevamente.",
      });
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

      {/* ── Sección 1: Tipo ──────────────────────────────────────────── */}
      <SectionTitle number={1}>
        ¿Qué tipo de solicitud desea presentar?
      </SectionTitle>

      {/* Selector de tipo */}
      <fieldset>
        <legend className="sr-only">Tipo de solicitud (obligatorio)</legend>
        <div
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4"
          role="radiogroup"
          aria-required="true"
        >
          {PQRSD_TYPES.map((t) => {
            const selected = form.type === t;
            return (
              <label
                key={t}
                className="flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 select-none"
                style={{
                  backgroundColor: selected ? "var(--color-azul-50)" : "#fff",
                  border: selected
                    ? "2.5px solid var(--color-azul-800)"
                    : "2px solid var(--color-gris-100)",
                  minHeight: "96px",
                }}
              >
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={selected}
                  onChange={() => handleTypeChange(t)}
                  className="mt-1 w-5 h-5 accent-[var(--color-azul-800)] flex-shrink-0"
                  aria-describedby={errors.type ? id("type-error") : undefined}
                />
                <span>
                  <span
                    className="block font-bold text-base"
                    style={{
                      color: selected
                        ? "var(--color-azul-800)"
                        : "var(--color-gris-800)",
                    }}
                  >
                    {TYPE_META[t].label}
                  </span>
                  <span
                    className="block text-sm mt-1 leading-snug"
                    style={{ color: "var(--color-gris-500)" }}
                  >
                    {TYPE_META[t].description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <FieldError id={id("type-error")} message={errors.type} />
      </fieldset>

      {/* ── Anonimato (solo queja/denuncia) ──── */}
      {canBeAnonymous && (
        <div
          className="mt-6 p-5 rounded-xl"
          style={{
            backgroundColor: "var(--color-azul-50)",
            border: "2px solid var(--color-azul-100)",
          }}
        >
          <label className="flex items-start gap-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_anonymous}
              onChange={(e) => set("is_anonymous", e.target.checked)}
              className="mt-1 w-5 h-5 accent-[var(--color-azul-800)] flex-shrink-0"
              aria-describedby={id("anon-desc")}
            />
            <span>
              <span
                className="block font-bold text-base"
                style={{ color: "var(--color-azul-900)" }}
              >
                Deseo presentar esta solicitud de forma anónima
              </span>
              <span
                id={id("anon-desc")}
                className="block text-sm mt-1"
                style={{ color: "var(--color-gris-500)" }}
              >
                Solo disponible para Quejas y Denuncias. Sus datos personales no
                quedarán registrados, pero debe ingresar un correo para recibir
                la respuesta.
              </span>
            </span>
          </label>
        </div>
      )}

      <Divider />

      {/* ── Sección 2: Identidad ─────────────────────────────────────── */}
      {!form.is_anonymous && (
        <>
          <SectionTitle number={2}>Sus datos de identificación</SectionTitle>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-2">
            <div className="md:col-span-2 xl:col-span-3">
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
                aria-describedby={
                  errors.full_name ? id("full_name-error") : undefined
                }
                autoComplete="name"
                placeholder="Escriba su nombre y apellidos"
              />
              <FieldError
                id={id("full_name-error")}
                message={errors.full_name}
              />
            </div>

            <div>
              <Label htmlFor={id("doc_type")} required>
                Tipo de documento
              </Label>
              <DocTypeSelect
                inputId={id("doc_type")}
                value={form.doc_type}
                onChange={(dt) => {
                  setForm((prev) => ({ ...prev, doc_type: dt, doc_number: "" }));
                  setErrors((prev) => ({ ...prev, doc_type: "", doc_number: "" }));
                }}
                hasError={!!errors.doc_type}
              />
              <FieldError
                id={id("doc_type-error")}
                message={errors.doc_type}
              />
            </div>

            <div className="xl:col-span-2">
              {(() => {
                const constraint = form.doc_type ? DOC_CONSTRAINTS[form.doc_type as DocType] : null;
                return (
                  <>
                    <Label htmlFor={id("doc_number")} required>
                      Número de documento
                    </Label>
                    <input
                      id={id("doc_number")}
                      type="text"
                      value={form.doc_number}
                      onChange={(e) => {
                        const raw = constraint?.numeric
                          ? e.target.value.replace(/\D/g, "")
                          : e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                        set("doc_number", raw.slice(0, constraint?.max ?? 20));
                      }}
                      className={inputClass(!!errors.doc_number)}
                      aria-invalid={!!errors.doc_number}
                      aria-describedby={
                        [
                          errors.doc_number ? id("doc_number-error") : "",
                          constraint ? id("doc_number-hint") : "",
                        ].filter(Boolean).join(" ") || undefined
                      }
                      inputMode={constraint?.numeric ? "numeric" : "text"}
                      maxLength={constraint?.max ?? 20}
                      placeholder={constraint?.placeholder ?? "Número de documento"}
                      disabled={!form.doc_type}
                    />
                    {constraint && !errors.doc_number && (
                      <p
                        id={id("doc_number-hint")}
                        className="text-sm mt-1.5"
                        style={{ color: "var(--color-gris-500)" }}
                      >
                        {constraint.hint}
                      </p>
                    )}
                    <FieldError
                      id={id("doc_number-error")}
                      message={errors.doc_number}
                    />
                  </>
                );
              })()}
            </div>
          </div>
          <Divider />
        </>
      )}

      {/* ── Sección 3 (o 2 si anónimo): Contacto ──────────────────────── */}
      <SectionTitle number={form.is_anonymous ? 2 : 3}>
        Datos de contacto
      </SectionTitle>
      <div className="grid md:grid-cols-2 gap-6 mb-2">
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
          <Label htmlFor={id("phone")} required>Teléfono</Label>
          <input
            id={id("phone")}
            type="tel"
            value={form.phone}
            onChange={(e) => {
              const clean = e.target.value.replace(/\D/g, "").slice(0, 10);
              set("phone", clean);
            }}
            className={inputClass(!!errors.phone)}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? id("phone-error") : undefined}
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Ej. 3001234567"
          />
          <FieldError id={id("phone-error")} message={errors.phone} />
        </div>

        <div className="md:col-span-2">
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
          <Label htmlFor={id("address_detail")}>Barrio</Label>
          <input
            id={id("address_detail")}
            type="text"
            value={form.address_detail}
            onChange={(e) => set("address_detail", e.target.value)}
            className={inputClass(false)}
            placeholder="Nombre del barrio"
          />
        </div>

        <div>
          <Label htmlFor={id("city")}>Ciudad</Label>
          <CityInput
            inputId={id("city")}
            value={form.city}
            onChange={(v) => set("city", v)}
          />
        </div>
      </div>

      <Divider />

      {/* ── Sección 4: Contenido ─────────────────────────────────────── */}
      <SectionTitle number={form.is_anonymous ? 3 : 4}>
        Describa su solicitud
      </SectionTitle>
      <div className="space-y-6 mb-2">
        <div>
          <Label htmlFor={id("subject")} required>
            Asunto o motivo principal
          </Label>
          <input
            id={id("subject")}
            type="text"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            className={inputClass(!!errors.subject)}
            aria-invalid={!!errors.subject}
            aria-describedby={
              errors.subject ? id("subject-error") : undefined
            }
            maxLength={200}
            placeholder="Resuma en pocas palabras el motivo de su solicitud"
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
            rows={7}
            maxLength={500}
            placeholder="Describa con detalle los hechos, fechas y lo que solicita a la entidad…"
          />
          <div className="flex items-start justify-between mt-2">
            <FieldError
              id={id("description-error")}
              message={errors.description}
            />
            <span
              id={id("description-hint")}
              className="text-sm ml-auto"
              style={{
                color:
                  form.description.length > 480
                    ? "var(--color-rojo-500)"
                    : form.description.length >= 50
                    ? "var(--color-azul-600)"
                    : "var(--color-gris-500)",
              }}
              aria-live="polite"
            >
              {form.description.length} / 500
            </span>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Sección 6: Adjuntos ──────────────────────────────────────── */}
      <SectionTitle number={form.is_anonymous ? 4 : 5}>
        Documentos adjuntos{" "}
        <span
          className="text-base font-normal"
          style={{ color: "var(--color-gris-500)" }}
        >
          (opcional)
        </span>
      </SectionTitle>
      <p
        className="text-base mb-6"
        style={{ color: "var(--color-gris-500)" }}
        id={id("file-hint")}
      >
        Puede adjuntar hasta <strong>3 archivos</strong> en formato PDF, JPG o
        PNG. Cada archivo no debe superar los <strong>5 MB</strong>.
      </p>

      {files.length < MAX_FILES && (
        <label
          className="flex flex-col items-center justify-center gap-3 py-10 rounded-xl cursor-pointer transition-all duration-200"
          style={{
            border: "2.5px dashed var(--color-azul-100)",
            backgroundColor: "var(--color-azul-50)",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileAdd(e.dataTransfer.files);
          }}
        >
          <Upload
            size={36}
            aria-hidden="true"
            style={{ color: "var(--color-azul-600)" }}
          />
          <span
            className="font-bold text-lg"
            style={{ color: "var(--color-azul-800)" }}
          >
            Haga clic aquí o arrastre los archivos
          </span>
          <span className="text-base" style={{ color: "var(--color-gris-500)" }}>
            {files.length} de {MAX_FILES} archivos seleccionados
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
          className="flex items-center gap-2 mt-3 text-base"
          role="alert"
          style={{ color: "var(--color-rojo-500)" }}
        >
          <AlertCircle size={16} aria-hidden="true" />
          {fileError}
        </p>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-3" aria-label="Archivos seleccionados">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
              style={{
                backgroundColor: "#fff",
                border: "1.5px solid var(--color-gris-100)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText
                  size={22}
                  aria-hidden="true"
                  style={{ color: "var(--color-azul-600)", flexShrink: 0 }}
                />
                <span
                  className="text-base truncate font-medium"
                  style={{ color: "var(--color-gris-700)" }}
                  title={f.name}
                >
                  {f.name}
                </span>
                <span
                  className="text-sm flex-shrink-0"
                  style={{ color: "var(--color-gris-500)" }}
                >
                  {formatSize(f.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="p-2 rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0 hover:bg-gray-100"
                style={{ color: "var(--color-gris-500)" }}
                aria-label={`Eliminar ${f.name}`}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Divider />

      {/* ── Sección 7: Términos y envío ──────────────────────────────── */}
      <SectionTitle number={form.is_anonymous ? 5 : 6}>
        Aceptación y envío
      </SectionTitle>

      <div
        className="p-6 rounded-xl mb-8"
        style={{
          backgroundColor: "var(--color-gris-50)",
          border: "1.5px solid var(--color-gris-100)",
        }}
      >
        <label className="flex items-start gap-4 cursor-pointer select-none">
          <input
            id={id("accepted_terms")}
            type="checkbox"
            checked={form.accepted_terms}
            onChange={(e) => set("accepted_terms", e.target.checked)}
            className="mt-1 w-5 h-5 accent-[var(--color-azul-800)] flex-shrink-0"
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
            className="text-base leading-relaxed"
            style={{ color: "var(--color-gris-700)" }}
          >
            He leído y acepto que mis datos personales serán tratados conforme a
            la <strong>Ley 1581 de 2012</strong> (Protección de Datos
            Personales) y la política de privacidad de IPS Sucre. Los datos
            recolectados serán utilizados exclusivamente para gestionar esta
            solicitud.{" "}
            <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true">
              *
            </span>
          </span>
        </label>
        <FieldError id={id("terms-error")} message={errors.accepted_terms} />
      </div>

      {/* Error global */}
      {errors._global && (
        <div
          className="flex items-center gap-3 p-5 rounded-xl mb-8 text-base"
          role="alert"
          style={{
            backgroundColor: "rgba(238,53,56,0.07)",
            border: "1px solid rgba(238,53,56,0.25)",
            color: "var(--color-rojo-500)",
          }}
        >
          <AlertCircle size={20} aria-hidden="true" className="flex-shrink-0" />
          {errors._global}
        </div>
      )}

      {/* Botón enviar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center font-bold text-lg rounded-full px-10 py-4 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{
            backgroundColor: "var(--color-rojo-500)",
            color: "#fff",
            boxShadow: "0 4px 20px 0 rgba(238,53,56,0.35)",
            minWidth: "220px",
          }}
        >
          {submitting ? "Enviando…" : "Radicar solicitud"}
        </button>
        <p className="text-base" style={{ color: "var(--color-gris-500)" }}>
          Los campos con{" "}
          <span style={{ color: "var(--color-rojo-500)" }}>*</span> son
          obligatorios.
        </p>
      </div>
    </form>
  );
}
