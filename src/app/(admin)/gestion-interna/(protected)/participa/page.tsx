import { getInscripciones } from "@/actions/participa-admin";
import { ParticipaInscripcionesManager } from "@/components/admin/ParticipaInscripcionesManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Participa — Admin" };

export default async function AdminParticipaPage() {
  const { data: inscripciones, error } = await getInscripciones();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Inscripciones de Participa</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ciudadanos que se inscribieron a espacios de participación.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar las inscripciones: {error}
        </div>
      )}

      <ParticipaInscripcionesManager inscripciones={inscripciones ?? []} />
    </div>
  );
}
