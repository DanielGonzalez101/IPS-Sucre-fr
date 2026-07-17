import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Clock,
  Paperclip,
} from "lucide-react";
import { getPqrsdById, getAttachmentSignedUrl } from "@/actions/pqrsd-admin";
import PqrsdResponseForm from "@/components/admin/PqrsdResponseForm";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  peticion: "Petición", queja: "Queja", reclamo: "Reclamo",
  solicitud: "Solicitud", denuncia: "Denuncia", sugerencia: "Sugerencia",
};

const DOC_TYPE_LABEL: Record<string, string> = {
  CC: "Cédula de Ciudadanía", CE: "Cédula de Extranjería", NUIP: "NUIP",
  TI: "Tarjeta de Identidad", NIT: "NIT", Pasaporte: "Pasaporte",
  PPT: "Permiso de Protección Temporal", Otro: "Otro",
};

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  recibido:    { label: "Recibido",    bg: "#EFF6FF", text: "#1D4ED8" },
  en_revision: { label: "En revisión", bg: "#FFFBEB", text: "#92400E" },
  en_tramite:  { label: "En trámite",  bg: "#FFF7ED", text: "#9A3412" },
  respondido:  { label: "Respondido",  bg: "#ECFDF5", text: "#065F46" },
  cerrado:     { label: "Cerrado",     bg: "#F9FAFB", text: "#374151" },
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function DataItem({ label, value, icon: Icon }: {
  label: string; value: string | null | undefined; icon?: React.ElementType;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <div className="flex items-center gap-1.5 text-sm text-gray-800 font-medium">
        {Icon && <Icon size={14} className="text-gray-400 flex-shrink-0" />}
        {value || <span className="text-gray-300 font-normal">—</span>}
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPqrsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pqrsd = await getPqrsdById(id);
  if (!pqrsd) notFound();

  const st = STATUS_STYLE[pqrsd.status] ?? STATUS_STYLE.cerrado;

  // Generar signed URLs para adjuntos
  const attachmentsWithUrls = await Promise.all(
    pqrsd.attachments.map(async (a) => ({
      ...a,
      signedUrl: await getAttachmentSignedUrl(a.file_url),
    }))
  );

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const daysLeft = pqrsd.response_deadline
    ? Math.ceil((new Date(pqrsd.response_deadline).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Encabezado */}
      <div className="flex items-start gap-4">
        <Link
          href="/gestion-interna/pqrs"
          className="mt-0.5 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Volver al listado"
        >
          <ArrowLeft size={16} className="text-gray-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900 font-mono">
              {pqrsd.tracking_code}
            </h1>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: st.bg, color: st.text }}
            >
              {st.label}
            </span>
            {pqrsd.is_overdue && pqrsd.status !== "respondido" && pqrsd.status !== "cerrado" && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                Plazo vencido
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {TYPE_LABEL[pqrsd.type] ?? pqrsd.type} · Radicada el {formatDate(pqrsd.created_at)}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-5">

          {/* Contenido de la solicitud */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <FileText size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Contenido de la solicitud</span>
            </div>
            <div className="px-5 py-5 space-y-4">
              <DataItem label="Asunto" value={pqrsd.subject} />
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Descripción
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4">
                  {pqrsd.description}
                </p>
              </div>
            </div>
          </div>

          {/* Adjuntos */}
          {attachmentsWithUrls.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Paperclip size={15} className="text-gray-400" />
                <span className="text-sm font-semibold text-gray-700">
                  Adjuntos ({attachmentsWithUrls.length})
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {attachmentsWithUrls.map((a) => (
                  <li key={a.id} className="px-5 py-3.5 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--color-azul-50)" }}
                    >
                      <FileText size={15} style={{ color: "var(--color-azul-600)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{a.original_name}</p>
                      <p className="text-xs text-gray-400">{formatSize(a.file_size_bytes)}</p>
                    </div>
                    {a.signedUrl ? (
                      <a
                        href={a.signedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        Descargar
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">No disponible</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gestión */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Gestión de la solicitud</span>
            </div>
            <div className="px-5 py-5">
              <PqrsdResponseForm
                id={pqrsd.id}
                currentStatus={pqrsd.status}
                currentNotes={pqrsd.admin_notes}
                currentResponse={pqrsd.admin_response}
              />
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-5">

          {/* Solicitante */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <User size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Solicitante</span>
            </div>
            <div className="px-5 py-5 space-y-4">
              {pqrsd.is_anonymous ? (
                <p className="text-sm italic text-gray-400">Solicitud anónima</p>
              ) : (
                <>
                  <DataItem label="Nombre" value={pqrsd.full_name} icon={User} />
                  <DataItem
                    label="Documento"
                    value={
                      pqrsd.doc_type
                        ? `${DOC_TYPE_LABEL[pqrsd.doc_type] ?? pqrsd.doc_type} ${pqrsd.doc_number ?? ""}`
                        : null
                    }
                  />
                </>
              )}
              <DataItem label="Correo"    value={pqrsd.email}    icon={Mail}  />
              <DataItem label="Teléfono"  value={pqrsd.phone}    icon={Phone} />
              <DataItem label="Ciudad"    value={pqrsd.city}     icon={MapPin} />
              <DataItem label="Dirección" value={pqrsd.address}  icon={MapPin} />
              {pqrsd.address_detail && (
                <DataItem label="Barrio" value={pqrsd.address_detail} />
              )}
            </div>
          </div>

          {/* Fechas y plazos */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <Calendar size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Fechas</span>
            </div>
            <div className="px-5 py-5 space-y-4">
              <DataItem label="Radicación"     value={formatDate(pqrsd.created_at)}        icon={Clock} />
              <DataItem label="Fecha límite"   value={formatDate(pqrsd.response_deadline)} icon={Clock} />
              {pqrsd.responded_at && (
                <DataItem label="Respondida"   value={formatDate(pqrsd.responded_at)}      icon={Clock} />
              )}
              {daysLeft !== null && pqrsd.status !== "respondido" && pqrsd.status !== "cerrado" && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                    Días restantes
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: pqrsd.is_overdue ? "#B91C1C" : daysLeft <= 3 ? "#92400E" : "#1D4ED8" }}
                  >
                    {pqrsd.is_overdue ? "Vencida" : `${daysLeft}d`}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
