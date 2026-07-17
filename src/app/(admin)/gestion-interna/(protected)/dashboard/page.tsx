import Link from "next/link";
import {
  MessageSquare,
  Heart,
  FileText,
  Users,
  SlidersHorizontal,
  BookOpen,
  ArrowRight,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — Admin" };

const TIPO_LABEL: Record<string, { label: string; color: string; bg: string }> =
  {
    peticion: { label: "Petición", color: "#1D4ED8", bg: "#EFF6FF" },
    queja: { label: "Queja", color: "#B45309", bg: "#FFFBEB" },
    reclamo: { label: "Reclamo", color: "#DC2626", bg: "#FEF2F2" },
    solicitud: { label: "Solicitud", color: "#065F46", bg: "#ECFDF5" },
    denuncia: { label: "Denuncia", color: "#7C3AED", bg: "#F5F3FF" },
    sugerencia: { label: "Sugerencia", color: "#065F46", bg: "#ECFDF5" },
  };

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const tarjetas = [
    {
      label: "PQRS totales",
      valor: stats.pqrsTotal,
      sub: `${stats.pqrsSemana} esta semana`,
      Icon: MessageSquare,
      href: "/gestion-interna/pqrs",
      acento: "var(--color-azul-600)",
      bg: "var(--color-azul-50)",
    },
    {
      label: "Servicios activos",
      valor: stats.serviciosActivos,
      sub: `de ${stats.serviciosTotal} en total`,
      Icon: Heart,
      href: "/gestion-interna/servicios",
      acento: "#DC2626",
      bg: "#FEF2F2",
    },
    {
      label: "Documentos públicos",
      valor: stats.docsPublicos,
      sub: `de ${stats.docsTotal} subidos`,
      Icon: FileText,
      href: "/gestion-interna/normativa",
      acento: "#065F46",
      bg: "#ECFDF5",
    },
    {
      label: "Miembros del equipo",
      valor: stats.miembros,
      sub: "activos",
      Icon: UserRound,
      href: "/gestion-interna/equipo/humano",
      acento: "#7C3AED",
      bg: "#F5F3FF",
    },
  ];

  const accesos = [
    {
      href: "/gestion-interna/hero",
      label: "Carrusel principal",
      Icon: SlidersHorizontal,
    },
    { href: "/gestion-interna/servicios", label: "Servicios", Icon: Heart },
    {
      href: "/gestion-interna/equipo/humano",
      label: "Equipo humano",
      Icon: Users,
    },
    { href: "/gestion-interna/normativa", label: "Documentos", Icon: FileText },
    { href: "/gestion-interna/pqrs", label: "PQRS", Icon: MessageSquare },
    { href: "/gestion-interna/paginas", label: "Páginas", Icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen general del sistema de gestión.
        </p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {tarjetas.map(({ label, valor, sub, Icon, href, acento, bg }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-xl border border-gray-200 px-5 py-4 flex flex-col gap-3 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: bg }}
              >
                <Icon size={18} style={{ color: acento }} />
              </div>
              <ArrowRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: acento }}
              />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{valor}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <TrendingUp size={10} />
                {sub}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Fila inferior: PQRS recientes + Accesos rápidos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        {/* PQRS recientes — ocupa 3/5 */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              PQRS recientes
            </span>
            <Link
              href="/gestion-interna/pqrs"
              className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: "var(--color-azul-600)" }}
            >
              Ver todas <ArrowRight size={11} />
            </Link>
          </div>

          {stats.pqrsRecientes.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <MessageSquare size={28} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm text-gray-400">No hay PQRS todavía.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.pqrsRecientes.map((p) => {
                const tipo = TIPO_LABEL[p.type] ?? {
                  label: p.type,
                  color: "#374151",
                  bg: "#F9FAFB",
                };
                const fecha = new Date(p.created_at).toLocaleDateString(
                  "es-CO",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                );
                return (
                  <li key={p.id} className="px-5 py-3 flex items-center gap-3">
                    <span
                      className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: tipo.color, backgroundColor: tipo.bg }}
                    >
                      {tipo.label}
                    </span>
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {p.full_name ?? "Anónimo"}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400">
                      {fecha}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Accesos rápidos — ocupa 2/5 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">
              Accesos rápidos
            </span>
          </div>
          <ul className="divide-y divide-gray-100">
            {accesos.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                >
                  <Icon
                    size={15}
                    className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0"
                  />
                  <span className="flex-1">{label}</span>
                  <ArrowRight
                    size={12}
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
