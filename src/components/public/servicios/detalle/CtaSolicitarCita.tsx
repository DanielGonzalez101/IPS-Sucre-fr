interface Props {
  nombreServicio: string;
}

export function CtaSolicitarCita({ nombreServicio }: Props) {
  return (
    <a
      href="https://cardiocentro.gomedicaltm.co/portal-pacientes"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center font-heading font-semibold text-sm text-white rounded-full px-7 py-3.5 hover:opacity-90 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: "var(--color-rojo-500)" }}
      aria-label={`Solicitar cita para ${nombreServicio}`}
    >
      Solicitar cita
    </a>
  );
}
