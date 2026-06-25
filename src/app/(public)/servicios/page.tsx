import ServicioCard from "@/components/public/ServicioCard";

export default function ServiciosPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">Nuestros Servicios</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ServicioCard
          titulo="Ecocardiografía"
          descripcion="Diagnóstico cardíaco por ultrasonido."
        />
        <ServicioCard
          titulo="Holter"
          descripcion="Monitoreo cardíaco de 24 horas."
        />
        <ServicioCard
          titulo="Consulta pediátrica"
          descripcion="Atención cardiológica especializada."
        />
      </div>
    </section>
  );
}
