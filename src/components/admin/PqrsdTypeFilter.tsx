"use client";

const TYPE_LABEL: Record<string, string> = {
  peticion:   "Petición",
  queja:      "Queja",
  reclamo:    "Reclamo",
  solicitud:  "Solicitud",
  denuncia:   "Denuncia",
  sugerencia: "Sugerencia",
};

interface Props {
  currentType:   string | undefined;
  currentStatus: string | undefined;
  currentQ:      string | undefined;
}

export default function PqrsdTypeFilter({ currentType, currentStatus, currentQ }: Props) {
  function navigate(type: string | undefined) {
    const p = new URLSearchParams();
    if (currentStatus) p.set("status", currentStatus);
    if (type)          p.set("type",   type);
    if (currentQ)      p.set("q",      currentQ);
    p.set("page", "1");
    window.location.href = `?${p.toString()}`;
  }

  return (
    <select
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700 cursor-pointer"
      defaultValue={currentType ?? ""}
      onChange={(e) => navigate(e.target.value || undefined)}
    >
      <option value="">Todos los tipos</option>
      {Object.entries(TYPE_LABEL).map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
