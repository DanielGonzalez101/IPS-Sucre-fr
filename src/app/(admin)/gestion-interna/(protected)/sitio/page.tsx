import { getSedes, getEmailContacto, getRedesSociales } from "@/actions/sitio";
import { SitioManager } from "@/components/admin/SitioManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Datos del sitio — Admin" };

export default async function AdminSitioPage() {
  const [{ data: sedes }, emailContacto, redes] = await Promise.all([
    getSedes(),
    getEmailContacto(),
    getRedesSociales(),
  ]);

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Datos del sitio</h1>
        <p className="text-sm text-gray-500 mt-1">
          Teléfonos, direcciones, email de contacto y redes sociales.
        </p>
      </div>

      <SitioManager sedes={sedes} emailContacto={emailContacto} redes={redes} />
    </div>
  );
}
