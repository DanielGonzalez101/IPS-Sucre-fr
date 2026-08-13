import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function VolverAlfabetico() {
  return (
    <Link
      href="/#encuentra-tu-servicio"
      className="relative z-10 inline-flex items-center gap-1.5 font-heading font-semibold text-sm mb-8"
      style={{ color: "var(--color-azul-800)" }}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Volver a Encuentra tu servicio de A a Z
    </Link>
  );
}
