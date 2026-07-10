import Link from "next/link";

export default function CalidadCTA() {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "var(--color-azul-900)" }}
      aria-labelledby="calidad-cta-title"
    >
      <div className="container-main flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2
            id="calidad-cta-title"
            className="font-heading font-bold text-2xl md:text-3xl text-white mb-2"
          >
            Tu tranquilidad es nuestro compromiso
          </h2>
          <p className="font-body text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
            Conoce a los especialistas que cuidan de tu familia con la más
            alta calidad y transparencia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-6 py-3 transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--color-rojo-500)",
              boxShadow: "0 4px 16px 0 rgba(238,53,56,0.45)",
            }}
          >
            Contáctanos
          </Link>
          <Link
            href="/equipo"
            className="inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-6 py-3 border transition-all duration-200 hover:bg-white hover:text-[#06244D] active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            style={{ borderColor: "rgba(255,255,255,0.6)" }}
          >
            Ver equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
