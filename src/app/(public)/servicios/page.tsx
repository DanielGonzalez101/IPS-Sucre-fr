import { getServiciosPublicos } from "@/actions/servicios";
import ServicioCard from "@/components/public/ServicioCard";

export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  const { data: servicios, error } = await getServiciosPublicos();

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Nuestros Servicios</h1>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          No se pudieron cargar los servicios. Intenta de nuevo más tarde.
        </p>
      )}

      {!error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(servicios ?? []).map((s) => (
            <ServicioCard
              key={s.id}
              titulo={s.titulo}
              descripcion={s.descripcion}
            />
          ))}
        </div>
      )}
    </section>
  );
}
