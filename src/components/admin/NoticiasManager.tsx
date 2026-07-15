"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Trash2, ImageOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  createNoticia,
  updateNoticia,
  deleteNoticia,
  getNoticias,
} from "@/actions/noticias";

// ── Constantes de límites ────────────────────────────────────
const LIMITES = {
  titulo: 80,
  extracto: 200,
  slug: 80,
} as const;

const TAGS = ["Tecnología", "Eventos", "Institucional"] as const;
type Tag = (typeof TAGS)[number];

// ── Utilidades ───────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, LIMITES.slug);
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const over = len > max;
  const near = len > max * 0.85;
  return (
    <span
      className="text-xs font-mono"
      style={{ color: over ? "var(--color-error)" : near ? "#B45309" : "var(--color-gris-400)" }}
    >
      {len}/{max}
    </span>
  );
}

function FieldLabel({
  label,
  required,
  value,
  max,
}: {
  label: string;
  required?: boolean;
  value?: string;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between mb-1">
      <label className="block text-xs font-medium text-gray-600">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {value !== undefined && max !== undefined && (
        <CharCount value={value} max={max} />
      )}
    </div>
  );
}

function inputClass(value: string, max: number) {
  return `w-full rounded border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none ${
    value.length > max
      ? "border-red-300 focus:ring-red-400"
      : "border-gray-200 focus:ring-blue-400"
  }`;
}

// ── Preview imagen ───────────────────────────────────────────

function ImgPreview({ url, localPreview }: { url: string; localPreview?: string }) {
  const src = localPreview ?? url;
  if (!src.trim()) {
    return (
      <div
        className="rounded-lg flex flex-col items-center justify-center gap-2"
        style={{ height: 120, backgroundColor: "var(--color-gris-100)", border: "1px dashed var(--color-gris-300)" }}
      >
        <ImageOff size={22} style={{ color: "var(--color-gris-400)" }} />
        <span className="text-xs" style={{ color: "var(--color-gris-400)" }}>Sin imagen</span>
      </div>
    );
  }

  if (localPreview) {
    return (
      <div className="rounded-lg overflow-hidden" style={{ height: 120 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={localPreview} alt="Vista previa" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ height: 120 }}>
      <Image
        src={url}
        alt="Vista previa"
        fill
        style={{ objectFit: "cover", objectPosition: "top center" }}
        sizes="300px"
        onError={() => {}}
      />
    </div>
  );
}

// ── Tipos ────────────────────────────────────────────────────

interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  tag: string;
  img_url: string;
  fecha: string;
  vistas: number;
  activo: boolean;
}

interface Props {
  noticias: Noticia[];
}

// ── Manager principal ────────────────────────────────────────

export function NoticiasManager({ noticias: initial }: Props) {
  const [noticias, setNoticias] = useState(initial);
  const [showNew, setShowNew] = useState(false);
  const [, startTransition] = useTransition();

  async function refresh() {
    const { data } = await getNoticias();
    if (data) setNoticias(data as Noticia[]);
  }

  return (
    <div className="space-y-3">
      {noticias.length === 0 && !showNew && (
        <div
          className="rounded-xl border-2 border-dashed py-12 text-center"
          style={{ borderColor: "var(--color-gris-200)" }}
        >
          <p className="text-sm text-gray-400">No hay noticias todavía.</p>
        </div>
      )}

      {noticias.map((noticia) => (
        <NoticiaCard
          key={noticia.id}
          noticia={noticia}
          onToggleActivo={() => {
            const next = noticias.map((n) =>
              n.id === noticia.id ? { ...n, activo: !n.activo } : n
            );
            setNoticias(next);
            startTransition(async () => {
              await updateNoticia(noticia.id, { activo: !noticia.activo });
            });
          }}
          onDeleted={() => setNoticias((prev) => prev.filter((n) => n.id !== noticia.id))}
        />
      ))}

      {showNew ? (
        <NuevaNoticiaCard
          onCancel={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); refresh(); }}
        />
      ) : (
        <button
          onClick={() => setShowNew(true)}
          className="w-full rounded-xl border-2 border-dashed py-4 text-sm font-medium transition-colors"
          style={{ borderColor: "var(--color-azul-200)", color: "var(--color-azul-700)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-azul-600)";
            e.currentTarget.style.backgroundColor = "var(--color-azul-50)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-azul-200)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          + Agregar noticia
        </button>
      )}
    </div>
  );
}

// ── Card de noticia existente ────────────────────────────────

function NoticiaCard({
  noticia,
  onToggleActivo,
  onDeleted,
}: {
  noticia: Noticia;
  onToggleActivo: () => void;
  onDeleted: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [localPreview, setLocalPreview] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titulo: noticia.titulo,
    extracto: noticia.extracto,
    tag: noticia.tag,
    slug: noticia.slug,
    img_url: noticia.img_url,
    fecha: noticia.fecha,
  });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede superar 5 MB."); return; }
    setLocalPreview(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `noticia-${noticia.id}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("noticias").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError("Error al subir la imagen: " + uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("noticias").getPublicUrl(filename);
    set("img_url", publicUrl);
    setUploadProgress("done");
  }

  function validate(): string | null {
    if (!form.titulo.trim()) return "El título es obligatorio.";
    if (form.titulo.length > LIMITES.titulo)
      return `El título no puede superar ${LIMITES.titulo} caracteres.`;
    if (form.extracto.length > LIMITES.extracto)
      return `El extracto no puede superar ${LIMITES.extracto} caracteres.`;
    if (!form.slug.trim()) return "El slug es obligatorio.";
    if (!form.fecha) return "La fecha es obligatoria.";
    return null;
  }

  function handleSave() {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateNoticia(noticia.id, form);
      if (result.error) setError(result.error);
      else { setSuccess(true); setTimeout(() => setSuccess(false), 3000); }
    });
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "#fff", borderColor: "#E5E7EB" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 min-w-0">
          {noticia.img_url ? (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "var(--color-azul-50)" }}>
              <Image
                src={noticia.img_url}
                alt={noticia.titulo}
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
                sizes="40px"
              />
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-azul-50)" }}
            >
              <ImageOff size={14} style={{ color: "var(--color-azul-300)" }} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate max-w-[260px]">
              {noticia.titulo}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "var(--color-azul-50)", color: "var(--color-azul-700)" }}
              >
                {noticia.tag}
              </span>
              <span className="text-xs text-gray-400">{noticia.fecha}</span>
              <span className="text-xs text-gray-400">{noticia.vistas} vistas</span>
              {!noticia.activo && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  Oculta
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Toggle activo */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <span className="text-xs text-gray-500">
              {noticia.activo ? "Activa" : "Oculta"}
            </span>
            <button
              onClick={onToggleActivo}
              disabled={isPending}
              className="relative inline-flex h-4 w-8 items-center rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: noticia.activo ? "var(--color-azul-800)" : "#D1D5DB" }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full bg-white shadow transition-transform"
                style={{ transform: noticia.activo ? "translateX(17px)" : "translateX(2px)" }}
              />
            </button>
          </label>

          {/* Eliminar */}
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
              <button
                onClick={() => {
                  startTransition(async () => {
                    const r = await deleteNoticia(noticia.id);
                    if (!r.error) onDeleted();
                  });
                }}
                disabled={isPending}
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
              >
                Sí
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="p-1 rounded transition-colors"
              style={{ color: "#EF4444" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Trash2 size={14} />
            </button>
          )}

          {/* Expandir */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1 rounded transition-colors"
            style={{ color: "#9CA3AF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <ChevronRight
              size={15}
              style={{
                transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

      {/* Formulario */}
      {!collapsed && (
        <div className="p-5 space-y-5">

          {/* Fila 1: título + tag + fecha */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FieldLabel label="Título" required value={form.titulo} max={LIMITES.titulo} />
              <input
                type="text"
                value={form.titulo}
                maxLength={LIMITES.titulo + 10}
                onChange={(e) => set("titulo", e.target.value)}
                className={inputClass(form.titulo, LIMITES.titulo)}
                placeholder="Título de la noticia"
              />
            </div>
            <div>
              <FieldLabel label="Categoría" required />
              <select
                value={form.tag}
                onChange={(e) => set("tag", e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Fila 2: extracto */}
          <div>
            <FieldLabel label="Extracto" required value={form.extracto} max={LIMITES.extracto} />
            <textarea
              value={form.extracto}
              maxLength={LIMITES.extracto + 20}
              onChange={(e) => set("extracto", e.target.value)}
              rows={3}
              className={inputClass(form.extracto, LIMITES.extracto)}
              placeholder="Resumen breve que aparece en la tarjeta de la noticia"
            />
            <p className="text-xs mt-1" style={{ color: "var(--color-gris-400)" }}>
              Aparece en las tarjetas del listado. Máx. {LIMITES.extracto} caracteres para no deformar el diseño.
            </p>
          </div>

          {/* Fila 3: imagen + slug + fecha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <FieldLabel label="Imagen de portada" />
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleImageUpload} />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadProgress === "uploading"}
                  className="w-full rounded border border-dashed px-3 py-2 text-sm transition-colors disabled:opacity-50"
                  style={{ borderColor: "var(--color-gris-300)", color: "var(--color-gris-500)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-400)"; e.currentTarget.style.color = "var(--color-azul-600)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gris-300)"; e.currentTarget.style.color = "var(--color-gris-500)"; }}
                >
                  {uploadProgress === "uploading" ? "Subiendo imagen…" : form.img_url ? "Cambiar imagen" : "Seleccionar imagen"}
                </button>
                {uploadProgress === "done" && <p className="text-xs mt-1 text-green-600">Imagen subida correctamente.</p>}
                {uploadProgress === "error" && <p className="text-xs mt-1 text-red-600">Error al subir. Intenta de nuevo.</p>}
                <p className="text-xs mt-1" style={{ color: "var(--color-gris-400)" }}>
                  JPG, PNG, WebP o AVIF. Máx. 5 MB. Relación 3:2 recomendada.
                </p>
              </div>
              <div>
                <FieldLabel label="Fecha" required />
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => set("fecha", e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Preview imagen */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Vista previa de imagen</p>
              <ImgPreview url={form.img_url} localPreview={localPreview} />
              <p className="text-xs mt-1.5" style={{ color: "var(--color-gris-400)" }}>
                La imagen se recorta desde arriba al centro en todos los layouts.
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-1">
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            {success && (
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mb-3">
                Cambios guardados correctamente.
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={isPending || uploadProgress === "uploading"}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
              style={{ backgroundColor: "var(--color-azul-800)" }}
            >
              {isPending ? "Guardando…" : uploadProgress === "uploading" ? "Subiendo imagen…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Nueva noticia ────────────────────────────────────────────

function NuevaNoticiaCard({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [localPreview, setLocalPreview] = useState<string | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    titulo: "",
    extracto: "",
    tag: "Tecnología" as Tag,
    slug: "",
    img_url: "",
    fecha: new Date().toISOString().slice(0, 10),
  });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleTituloChange(val: string) {
    set("titulo", val);
    set("slug", toSlug(val));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede superar 5 MB."); return; }
    setLocalPreview(URL.createObjectURL(file));
    setUploadProgress("uploading");
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const filename = `noticia-new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("noticias").upload(filename, file, { upsert: true });
    if (uploadError) { setUploadProgress("error"); setError("Error al subir la imagen: " + uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("noticias").getPublicUrl(filename);
    set("img_url", publicUrl);
    setUploadProgress("done");
  }

  function validate(): string | null {
    if (!form.titulo.trim()) return "El título es obligatorio.";
    if (form.titulo.length > LIMITES.titulo)
      return `El título no puede superar ${LIMITES.titulo} caracteres.`;
    if (form.extracto.length > LIMITES.extracto)
      return `El extracto no puede superar ${LIMITES.extracto} caracteres.`;
    if (!form.slug.trim()) return "El slug es obligatorio.";
    if (!form.fecha) return "La fecha es obligatoria.";
    return null;
  }

  function handleCreate() {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);
    startTransition(async () => {
      const result = await createNoticia(form);
      if (result.error) setError(result.error);
      else onCreated();
    });
  }

  return (
    <div
      className="bg-white rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--color-azul-200)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: "var(--color-gris-100)", backgroundColor: "var(--color-azul-50)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--color-azul-900)" }}>
          Nueva noticia
        </span>
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Cancelar
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* Título + categoría */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <FieldLabel label="Título" required value={form.titulo} max={LIMITES.titulo} />
            <input
              type="text"
              value={form.titulo}
              maxLength={LIMITES.titulo + 10}
              onChange={(e) => handleTituloChange(e.target.value)}
              className={inputClass(form.titulo, LIMITES.titulo)}
              placeholder="Título de la noticia"
              autoFocus
            />
          </div>
          <div>
            <FieldLabel label="Categoría" required />
            <select
              value={form.tag}
              onChange={(e) => set("tag", e.target.value as Tag)}
              className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Extracto */}
        <div>
          <FieldLabel label="Extracto" required value={form.extracto} max={LIMITES.extracto} />
          <textarea
            value={form.extracto}
            maxLength={LIMITES.extracto + 20}
            onChange={(e) => set("extracto", e.target.value)}
            rows={3}
            className={inputClass(form.extracto, LIMITES.extracto)}
            placeholder="Resumen breve que aparece en la tarjeta de la noticia"
          />
          <p className="text-xs mt-1" style={{ color: "var(--color-gris-400)" }}>
            Máx. {LIMITES.extracto} caracteres para no deformar el diseño.
          </p>
        </div>

        {/* Imagen + slug + fecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <FieldLabel label="Imagen de portada" />
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleImageUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploadProgress === "uploading"}
                className="w-full rounded border border-dashed px-3 py-2 text-sm transition-colors disabled:opacity-50"
                style={{ borderColor: "var(--color-gris-300)", color: "var(--color-gris-500)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-azul-400)"; e.currentTarget.style.color = "var(--color-azul-600)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-gris-300)"; e.currentTarget.style.color = "var(--color-gris-500)"; }}
              >
                {uploadProgress === "uploading" ? "Subiendo imagen…" : form.img_url ? "Cambiar imagen" : "Seleccionar imagen"}
              </button>
              {uploadProgress === "done" && <p className="text-xs mt-1 text-green-600">Imagen subida correctamente.</p>}
              {uploadProgress === "error" && <p className="text-xs mt-1 text-red-600">Error al subir. Intenta de nuevo.</p>}
              <p className="text-xs mt-1" style={{ color: "var(--color-gris-400)" }}>
                JPG, PNG, WebP o AVIF. Máx. 5 MB. Relación 3:2 recomendada.
              </p>
            </div>
            <div>
              <FieldLabel label="Fecha" required />
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set("fecha", e.target.value)}
                className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Vista previa de imagen</p>
            <ImgPreview url={form.img_url} localPreview={localPreview} />
            <p className="text-xs mt-1.5" style={{ color: "var(--color-gris-400)" }}>
              La imagen se recorta desde arriba al centro en todos los layouts.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="pt-1">
          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
              <AlertCircle size={13} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <button
            onClick={handleCreate}
            disabled={isPending || uploadProgress === "uploading"}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-opacity"
            style={{ backgroundColor: "var(--color-azul-800)" }}
          >
            {isPending ? "Publicando…" : uploadProgress === "uploading" ? "Subiendo imagen…" : "Publicar noticia"}
          </button>
        </div>
      </div>
    </div>
  );
}
