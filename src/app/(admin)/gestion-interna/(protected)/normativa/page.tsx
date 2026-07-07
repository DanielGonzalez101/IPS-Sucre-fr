import { getAuditDocuments } from "@/actions/documentos";
import { DocumentosAuditoriaManager } from "@/components/admin/DocumentosAuditoriaManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Normativa — Admin" };

export default async function AdminNormativaPage() {
  const { data: docs, error } = await getAuditDocuments();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Documentos de auditoría</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sube los PDFs que necesitas para las auditorías de la página.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
          Error al cargar los documentos: {error}
        </div>
      )}

      <DocumentosAuditoriaManager docs={docs ?? []} />
    </div>
  );
}
