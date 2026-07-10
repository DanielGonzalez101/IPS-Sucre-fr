"use client";

import { useState, useRef, useTransition } from "react";
import { FileText, Trash2, Download, Upload, Eye, EyeOff } from "lucide-react";
import { uploadAndCreateAuditDocument, deleteAuditDocument, toggleDocumentPublic } from "@/actions/documentos";

interface Documento {
  id: string;
  title: string;
  file_url: string;
  description: string | null;
  uploaded_at: string;
  is_public: boolean;
}

interface Props {
  docs: Documento[];
}

export function DocumentosAuditoriaManager({ docs: initialDocs }: Props) {
  const [docs, setDocs] = useState(initialDocs);

  return (
    <div className="space-y-6">
      <SubirDocumentoCard
        onCreated={(doc) => setDocs((prev) => [doc, ...prev])}
      />

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Documentos subidos ({docs.length})
        </h2>

        {docs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center">
            <FileText size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No hay documentos de auditoría todavía.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {docs.map((doc) => (
              <DocumentoFila
                key={doc.id}
                doc={doc}
                onDeleted={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Formulario de subida ─────────────────────────────────────

function SubirDocumentoCard({ onCreated }: { onCreated: (doc: Documento) => void }) {
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Solo se aceptan archivos PDF"); return; }
    if (file.size > 20 * 1024 * 1024) { setError("Máximo 20 MB"); return; }
    setError(null);
    setSelectedFile(file);
    if (!title) setTitle(file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "));
  }

  function handleSubmit() {
    if (!selectedFile) { setError("Primero selecciona un archivo PDF"); return; }
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("is_public", String(isPublic));

    startTransition(async () => {
      const result = await uploadAndCreateAuditDocument(formData);
      if (result.error) { setError(result.error); return; }

      onCreated({
        id: crypto.randomUUID(),
        title: title.trim(),
        file_url: result.file_url!,
        description: description.trim() || null,
        uploaded_at: new Date().toISOString(),
        is_public: isPublic,
      });

      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setIsPublic(true);
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Upload size={15} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Subir documento PDF</span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isPending}
            className="w-full rounded-lg border-2 border-dashed py-6 text-sm transition-colors disabled:opacity-50"
            style={{
              borderColor: selectedFile ? "var(--color-azul-400)" : "#D1D5DB",
              color: selectedFile ? "var(--color-azul-700)" : "#6B7280",
              backgroundColor: selectedFile ? "var(--color-azul-50)" : "transparent",
            }}
          >
            {selectedFile ? `✓ ${selectedFile.name}` : "Seleccionar PDF (máx. 20 MB)"}
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Informe de auditoría 2025"
            className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Descripción <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Descripción breve del documento…"
            className="w-full rounded border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-600 resize-none"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2.5">
          <div className="flex items-center gap-2">
            {isPublic
              ? <Eye size={14} className="text-green-600" />
              : <EyeOff size={14} className="text-gray-400" />
            }
            <span className="text-sm text-gray-700">
              {isPublic ? "Público — visible en el sitio" : "Privado — solo administradores"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${isPublic ? "bg-green-500" : "bg-gray-300"}`}
            role="switch"
            aria-checked={isPublic}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${isPublic ? "translate-x-4" : "translate-x-0"}`}
            />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !selectedFile}
          className="w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: "var(--color-azul-800)" }}
        >
          {isPending ? "Subiendo y guardando…" : "Guardar documento"}
        </button>
      </div>
    </div>
  );
}

// ── Fila de documento ─────────────────────────────────────────

function DocumentoFila({ doc, onDeleted }: { doc: Documento; onDeleted: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPublic, setIsPublic] = useState(doc.is_public);
  const [isPending, startTransition] = useTransition();

  const fecha = new Date(doc.uploaded_at).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", year: "numeric",
  });

  function handleTogglePublic() {
    const next = !isPublic;
    setIsPublic(next);
    startTransition(async () => {
      const r = await toggleDocumentPublic(doc.id, next);
      if (r.error) setIsPublic(!next);
    });
  }

  return (
    <li className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-3">
      <div
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
        style={{ backgroundColor: "var(--color-azul-50)" }}
      >
        <FileText size={18} style={{ color: "var(--color-azul-700)" }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{doc.title}</p>
        {doc.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{doc.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-400">{fecha}</p>
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${isPublic ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {isPublic ? <Eye size={10} /> : <EyeOff size={10} />}
            {isPublic ? "Público" : "Privado"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleTogglePublic}
          disabled={isPending}
          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50 ${isPublic ? "bg-green-500" : "bg-gray-300"}`}
          role="switch"
          aria-checked={isPublic}
          title={isPublic ? "Ocultar del sitio" : "Publicar en el sitio"}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${isPublic ? "translate-x-4" : "translate-x-0"}`}
          />
        </button>

        <a
          href={doc.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-azul-600)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-azul-50)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          title="Descargar / ver PDF"
        >
          <Download size={15} />
        </a>

        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-red-600 font-medium">¿Eliminar?</span>
            <button
              onClick={() =>
                startTransition(async () => {
                  const r = await deleteAuditDocument(doc.id);
                  if (!r.error) onDeleted();
                })
              }
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
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "#EF4444" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEE2E2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            title="Eliminar"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </li>
  );
}
