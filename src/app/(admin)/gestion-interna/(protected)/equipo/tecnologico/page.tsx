import { getEquipoTecnologico } from "@/actions/equipo";
import { EquipoTecManager } from "@/components/admin/EquipoTecManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Equipo Tecnológico — Admin" };

export default async function AdminEquipoTecPage() {
  const { data: equipos, error } = await getEquipoTecnologico();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Equipo tecnológico</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los equipos médicos que aparecen en la página pública.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar los equipos: {error}
        </div>
      )}

      <EquipoTecManager equipos={equipos ?? []} />
    </div>
  );
}
