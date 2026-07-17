import Link from "next/link";
import {
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Search,
} from "lucide-react";
import { getPqrsdList, getPqrsdStats } from "@/actions/pqrsd-admin";
import PqrsdTypeFilter from "@/components/admin/PqrsdTypeFilter";

export const dynamic = "force-dynamic";
export const metadata = { title: "PQRSD — Admin" };

const TYPE_LABEL: Record<string, string> = {
  peticion:   "Petición",
  queja:      "Queja",
  reclamo:    "Reclamo",
  solicitud:  "Solicitud",
  denuncia:   "Denuncia",
  sugerencia: "Sugerencia",
};

const STATUS_STYLE: Record<string, { label: string; bg: string; text: string; Icon: React.ElementType }> = {
  recibido:    { label: "Recibido",    bg: "#EFF6FF", text: "#1D4ED8", Icon: Clock       },
  en_revision: { label: "En revisión", bg: "#FFFBEB", text: "#92400E", Icon: Loader2     },
  en_tramite:  { label: "En trámite",  bg: "#FFF7ED", text: "#9A3412", Icon: Loader2     },
  respondido:  { label: "Respondido",  bg: "#ECFDF5", text: "#065F46", Icon: CheckCircle },
  cerrado:     { label: "Cerrado",     bg: "#F9FAFB", text: "#374151", Icon: XCircle     },
};

interface PageProps {
  searchParams: Promise<{ status?: string; type?: string; q?: string; page?: string }>;
}

export default async function AdminPqrsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const [stats, { rows, total, pages }] = await Promise.all([
    getPqrsdStats(),
    getPqrsdList({
      status: params.status,
      type: params.type,
      search: params.q,
      page,
    }),
  ]);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { status: params.status, type: params.type, q: params.q, page: String(page), ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "undefined") p.set(k, v);
    }
    return `?${p.toString()}`;
  }

  const statCards = [
    { label: "Total",       value: stats.total,      color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "Recibidas",   value: stats.recibido,   color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "En proceso",  value: stats.en_proceso, color: "#92400E", bg: "#FFFBEB" }, // en_revision + en_tramite
    { label: "Respondidas", value: stats.respondido, color: "#065F46", bg: "#ECFDF5" },
    { label: "Vencidas",    value: stats.vencidas,   color: "#B91C1C", bg: "#FEF2F2" },
    { label: "Esta semana", value: stats.semana,     color: "#6D28D9", bg: "#F5F3FF" },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">PQRSD</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} solicitud{total !== 1 ? "es" : ""} en total
          </p>
        </div>
      </div>

      {/* Tarjetas de stats */}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {statCards.map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-gray-200 px-4 py-3"
          >
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-center">
        {/* Búsqueda */}
        <form method="GET" className="flex items-center gap-2 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Radicado, nombre, asunto…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
          {params.status && <input type="hidden" name="status" value={params.status} />}
          {params.type   && <input type="hidden" name="type"   value={params.type}   />}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white cursor-pointer"
            style={{ backgroundColor: "var(--color-azul-800)" }}
          >
            Buscar
          </button>
        </form>

        {/* Filtro estado */}
        <div className="flex gap-1.5 flex-wrap">
          {[
            { label: "Todos",       value: undefined },
            { label: "Recibido",    value: "recibido" },
            { label: "En revisión", value: "en_revision" },
            { label: "En trámite",  value: "en_tramite" },
            { label: "Respondido",  value: "respondido" },
            { label: "Cerrado",     value: "cerrado" },
          ].map(({ label, value }) => {
            const active = (params.status ?? undefined) === value;
            return (
              <Link
                key={label}
                href={buildUrl({ status: value, page: "1" })}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                style={{
                  backgroundColor: active ? "var(--color-azul-800)" : "#fff",
                  color: active ? "#fff" : "#6B7280",
                  borderColor: active ? "var(--color-azul-800)" : "#E5E7EB",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Filtro tipo */}
        <PqrsdTypeFilter
          currentType={params.type}
          currentStatus={params.status}
          currentQ={params.q}
        />

        {(params.status || params.type || params.q) && (
          <Link
            href="/gestion-interna/pqrs"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Limpiar filtros
          </Link>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <MessageSquare size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">No se encontraron solicitudes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3">Radicado</th>
                  <th className="px-5 py-3">Tipo</th>
                  <th className="px-5 py-3">Solicitante</th>
                  <th className="px-5 py-3">Asunto</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Plazo</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const st = STATUS_STYLE[row.status] ?? STATUS_STYLE.cerrado;
                  const deadline = row.response_deadline
                    ? new Date(row.response_deadline)
                    : null;
                  const daysLeft = deadline
                    ? Math.ceil((deadline.getTime() - Date.now()) / 86400000)
                    : null;

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-gray-700">
                          {row.tracking_code}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold text-gray-600">
                          {TYPE_LABEL[row.type] ?? row.type}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {row.is_anonymous ? (
                          <span className="text-xs italic text-gray-400">Anónimo</span>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-800 font-medium leading-tight">
                              {row.full_name ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400">{row.email ?? ""}</p>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5 max-w-xs">
                        <p className="text-sm text-gray-700 truncate">{row.subject}</p>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-xs text-gray-500">
                          {new Date(row.created_at).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        {daysLeft !== null ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-semibold"
                            style={{
                              color:
                                row.is_overdue
                                  ? "#B91C1C"
                                  : daysLeft <= 3
                                  ? "#92400E"
                                  : "#374151",
                            }}
                          >
                            {row.is_overdue && (
                              <AlertTriangle size={11} aria-hidden="true" />
                            )}
                            {row.is_overdue
                              ? "Vencida"
                              : daysLeft === 0
                              ? "Hoy"
                              : `${daysLeft}d`}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: st.bg, color: st.text }}
                        >
                          <st.Icon size={11} aria-hidden="true" />
                          {st.label}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <Link
                          href={`/gestion-interna/pqrs/${row.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold transition-colors"
                          style={{ color: "var(--color-azul-600)" }}
                        >
                          Ver <ChevronRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Página {page} de {pages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildUrl({ page: String(page - 1) })}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ← Anterior
              </Link>
            )}
            {page < pages && (
              <Link
                href={buildUrl({ page: String(page + 1) })}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
