"use client";

import { useState, useId, useRef, useEffect } from "react";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { AlertCircle, CheckCircle2, ChevronDown, Check } from "lucide-react";
import { DOC_TYPES, type DocType } from "@/lib/validations/pqrs";
import { participaInscripcionSchema } from "@/lib/validations/participa";
import type { MecanismoParticipacion } from "@/data/participa.mock";


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
    <p id={id} role="alert" className="flex items-center gap-2 mt-2 text-sm" style={{ color: "var(--color-rojo-500)" }}>
      <AlertCircle size={14} aria-hidden="true" className="flex-shrink-0" />
      {message}
    </p>
  );
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-2" style={{ color: "var(--color-gris-700)" }}>
      {children}
      {required && (
        <span style={{ color: "var(--color-rojo-500)" }} aria-hidden="true"> *</span>
      )}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-3 rounded-xl border text-base transition-all duration-200 bg-white",
    "text-gray-900 placeholder-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    hasError
      ? "border-red-400 focus:ring-red-200"
      : "border-gray-300 focus:border-blue-600 focus:ring-blue-100",
  ]
    .filter(Boolean)
    .join(" ");
}

interface SelectOption { value: string; label: string }

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
  "aria-describedby"?: string;
}

function CustomSelect({ id, value, onChange, options, placeholder = "Seleccione…", hasError = false, "aria-describedby": describedBy }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonId = id;
  const listId = `${id}-list`;

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  useEffect(() => {
    if (open && focused >= 0) {
      const item = listRef.current?.children[focused] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focused, open]);

  function toggle() {
    setOpen((prev) => {
      if (!prev) {
        const idx = options.findIndex((o) => o.value === value);
        setFocused(idx >= 0 ? idx : 0);
      }
      return !prev;
    });
  }

  function select(val: string) {
    onChange(val);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFocused(options.findIndex((o) => o.value === value) || 0);
      }
      return;
    }
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused((f) => Math.min(f + 1, options.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setFocused((f) => Math.max(f - 1, 0)); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (focused >= 0) select(options[focused].value); return; }
    if (e.key === "Tab") { setOpen(false); }
  }

  const triggerBorder = hasError
    ? "border-red-400 ring-2 ring-red-200"
    : open
      ? "border-blue-600 ring-2 ring-blue-100"
      : "border-gray-300";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={buttonId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={hasError}
        aria-describedby={describedBy}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-base bg-white transition-all duration-200 text-left cursor-pointer focus:outline-none ${triggerBorder}`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`flex-shrink-0 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--color-gris-400)" }}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={buttonId}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-auto max-h-56 py-1"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isFocused = i === focused;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => { e.preventDefault(); select(opt.value); }}
                onMouseEnter={() => setFocused(i)}
                className={[
                  "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer select-none transition-colors duration-100",
                  isSelected
                    ? "font-semibold"
                    : "font-normal text-gray-700",
                  isFocused && !isSelected
                    ? "bg-blue-50 text-blue-700"
                    : "",
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "",
                ].filter(Boolean).join(" ")}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} aria-hidden="true" className="flex-shrink-0 ml-2" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

interface Props { mecanismos: MecanismoParticipacion[] }

export default function ParticipaForm({ mecanismos }: Props) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const { getToken } = useRecaptcha();

  const docTypeOptions: SelectOption[] = DOC_TYPES.map((t) => ({ value: t, label: t }));
  const espacioOptions: SelectOption[] = mecanismos.map((m) => ({ value: m.id, label: m.titulo }));

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
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

    setSubmitting(true);
    try {
      const recaptchaToken = await getToken("participa_inscripcion");
      const res = await fetch("/api/participa/inscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, recaptcha_token: recaptchaToken }),
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
          setErrors({ _global: json.error ?? "Error al enviar la inscripción." });
        }
        return;
      }

      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ _global: "Error de conexión. Verifique su internet e intente nuevamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="inscripcion"
      className="py-16 md:py-20"
      style={{ backgroundColor: "var(--color-gris-50)" }}
      aria-labelledby="inscripcion-title"
    >
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
          className="rounded-3xl border border-gray-200 bg-white shadow-lg p-6 md:p-8"
        >
          {status === "success" && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl mb-6 text-sm bg-green-50 border border-green-200 text-green-800"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 size={18} aria-hidden="true" className="flex-shrink-0 mt-0.5 text-green-600" />
              <span>
                ¡Inscripción enviada! Nos pondremos en contacto contigo pronto.
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
              <CustomSelect
                id={id("doc_type")}
                value={form.doc_type}
                onChange={(v) => set("doc_type", v)}
                options={docTypeOptions}
                hasError={!!errors.doc_type}
                aria-describedby={errors.doc_type ? id("doc_type-error") : undefined}
              />
              <FieldError id={id("doc_type-error")} message={errors.doc_type} />
            </div>

            <div>
              <Label htmlFor={id("doc_number")} required>Número de documento</Label>
              <input
                id={id("doc_number")}
                type="text"
                value={form.doc_number}
                onChange={(e) => set("doc_number", e.target.value.replace(/\D/g, "").slice(0, 20))}
                className={inputClass(!!errors.doc_number)}
                aria-invalid={!!errors.doc_number}
                aria-describedby={errors.doc_number ? id("doc_number-error") : undefined}
                placeholder="Número de documento"
                inputMode="numeric"
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
              <CustomSelect
                id={id("espacio_id")}
                value={form.espacio_id}
                onChange={(v) => set("espacio_id", v)}
                options={espacioOptions}
                hasError={!!errors.espacio_id}
                aria-describedby={errors.espacio_id ? id("espacio_id-error") : undefined}
              />
              <FieldError id={id("espacio_id-error")} message={errors.espacio_id} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor={id("message")}>Mensaje (opcional)</Label>
              <textarea
                id={id("message")}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                className={`${inputClass(!!errors.message)} resize-none`}
                rows={4}
                maxLength={500}
                placeholder="Cuéntanos brevemente por qué quieres participar"
              />
              <FieldError id={id("message-error")} message={errors.message} />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            {errors._global && (
              <p className="flex items-center gap-2 mb-4 text-sm" role="alert" style={{ color: "var(--color-rojo-500)" }}>
                <AlertCircle size={14} aria-hidden="true" />
                {errors._global}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || status === "success"}
              className="inline-flex items-center justify-center font-bold text-base rounded-full px-8 py-3.5 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-rojo-500)",
                color: "#fff",
                boxShadow: "0 4px 20px 0 rgba(238,53,56,0.35)",
              }}
            >
              {submitting ? "Enviando…" : "Enviar inscripción"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
