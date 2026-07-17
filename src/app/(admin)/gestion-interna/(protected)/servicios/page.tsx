import { getServicios } from "@/actions/servicios";
import { ServiciosManager } from "@/components/admin/ServiciosManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Servicios — Admin" };

export default async function AdminServiciosPage() {
  const { data: servicios, error } = await getServicios();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Servicios</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los servicios médicos que aparecen en el home y en la página de servicios.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar los servicios: {error}
        </div>
      )}

      {!error && (
        <ServiciosManager servicios={servicios ?? []} />
      )}
    </div>
  );
}
