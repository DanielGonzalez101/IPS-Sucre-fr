import { getUsuarios } from "@/actions/usuarios";
import { UsuariosManager } from "@/components/admin/UsuariosManager";

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; suspendidos?: string }>;
}) {
  const { page, suspendidos } = await searchParams;
  const currentPage = Math.max(0, Number(page ?? 0));
  const incluirSuspendidos = suspendidos === "1";

  const { data: usuarios, total, pageCount, error } = await getUsuarios(currentPage, incluirSuspendidos);

  return (
    <div>
      <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
      <p className="mt-2 text-gray-600">
        Crea usuarios administrativos y controla a qué módulos del panel tiene acceso cada uno.
      </p>
      <div className="mt-6">
        <UsuariosManager
          usuarios={usuarios}
          total={total}
          currentPage={currentPage}
          pageCount={pageCount}
          incluirSuspendidos={incluirSuspendidos}
          error={error}
        />
      </div>
    </div>
  );
}
