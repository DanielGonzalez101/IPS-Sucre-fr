interface ServicioCardProps {
  titulo: string;
  descripcion: string;
  icono?: React.ReactNode;
}

export default function ServicioCard({ titulo, descripcion, icono }: ServicioCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {icono && <div className="mb-3 text-blue-600">{icono}</div>}
      <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
      <p className="mt-2 text-sm text-gray-600">{descripcion}</p>
    </div>
  );
}
