import { getEquipoHero, getEquipoGrupos } from "@/actions/equipo";
import { EquipoHumanoManager } from "@/components/admin/EquipoHumanoManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Equipo Humano — Admin" };

export default async function AdminEquipoHumanoPage() {
  const [{ data: hero, error: heroError }, { data: grupos, error: gruposError }] =
    await Promise.all([getEquipoHero("humano"), getEquipoGrupos()]);

  const error = heroError ?? gruposError;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Equipo humano</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona la imagen del hero y los miembros de cada grupo.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar los datos: {error}
        </div>
      )}

      {!error && (
        <EquipoHumanoManager
          hero={hero ?? { id: "", pagina: "humano", imagen_url: "/images/hero-team.png", imagen_alt: "" }}
          grupos={grupos ?? []}
        />
      )}
    </div>
  );
}
