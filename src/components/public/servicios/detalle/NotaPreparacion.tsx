import { ClipboardList } from "lucide-react";

interface Props {
  texto?: string;
}

export function NotaPreparacion({ texto }: Props) {
  if (!texto) return null;

  return (
    <div
      className="flex gap-3 p-5 mt-4"
      style={{
        backgroundColor: "var(--color-azul-50)",
        borderRadius: "16px",
        border: "1px solid var(--color-azul-100)",
      }}
    >
      <ClipboardList
        size={20}
        aria-hidden="true"
        className="shrink-0 mt-0.5"
        style={{ color: "var(--color-azul-800)" }}
      />
      <div>
        <p className="font-heading font-semibold text-sm mb-1" style={{ color: "var(--color-azul-900)" }}>
          Preparación para este examen
        </p>
        <p className="font-body text-sm leading-relaxed" style={{ color: "var(--color-azul-800)" }}>
          {texto}
        </p>
      </div>
    </div>
  );
}
