import { getNoticias } from "@/actions/noticias";
import { NoticiasManager } from "@/components/admin/NoticiasManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Noticias — Admin" };

export default async function AdminNoticiasPage() {
  const { data: noticias, error } = await getNoticias();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Noticias</h1>
        <p className="text-sm text-gray-500 mt-1">
          Crea, edita y gestiona las noticias que aparecen en la página pública.
        </p>
      </div>

      {/* Límites de diseño — recordatorio visible */}
      <div
        className="flex items-start gap-3 rounded-lg border px-4 py-3 mb-6 text-sm"
        style={{
          backgroundColor: "var(--color-azul-50)",
          borderColor: "var(--color-azul-200)",
          color: "var(--color-azul-800)",
        }}
      >
        <span className="text-lg leading-none mt-0.5">ℹ</span>
        <div className="space-y-0.5">
          <p className="font-semibold">Límites para mantener el diseño</p>
          <p className="text-xs" style={{ color: "var(--color-azul-700)" }}>
            <strong>Título:</strong> máx. 80 caracteres ·{" "}
            <strong>Extracto:</strong> máx. 200 caracteres ·{" "}
            <strong>Categoría:</strong> solo Tecnología, Eventos o Institucional ·{" "}
            <strong>Imagen:</strong> recomendado 1200×800 px (relación 3:2)
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar las noticias: {error}
        </div>
      )}

      <NoticiasManager noticias={noticias ?? []} />
    </div>
  );
}
