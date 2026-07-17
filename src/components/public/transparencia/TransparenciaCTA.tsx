import Link from "next/link";
import { MessageSquareText, ArrowRight } from "lucide-react";

export default function TransparenciaCTA() {
  return (
    <section
      className="relative py-16 md:py-20 overflow-hidden"
      style={{ backgroundColor: "var(--color-azul-900)" }}
      aria-labelledby="trans-cta-title"
    >
      <div className="participa-section-blobs" aria-hidden="true" />

      <div className="container-main relative z-10 text-center max-w-2xl">
        <div
          className="participa-glass-dark inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
        >
          <MessageSquareText size={26} aria-hidden="true" style={{ color: "var(--color-rojo-400)" }} />
        </div>

        <h2
          id="trans-cta-title"
          className="font-heading font-bold text-2xl md:text-3xl text-white mb-4"
        >
          ¿No encontró la información que necesita?
        </h2>
        <p
          className="font-body text-base md:text-lg mb-8"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Radique su solicitud de información pública a través del formulario PQRSD. Respondemos en un plazo máximo de 10 días hábiles.
        </p>

        <Link
          href="/pqrs"
          className="inline-flex items-center gap-2 font-heading font-bold text-base rounded-full px-8 py-3.5 transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-azul-900)]"
          style={{
            backgroundColor: "var(--color-rojo-500)",
            color: "#fff",
            boxShadow: "0 4px 20px 0 rgba(238,53,56,0.35)",
          }}
        >
          Radicar solicitud PQRSD
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
