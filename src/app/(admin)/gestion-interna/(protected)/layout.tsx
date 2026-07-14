import Sidebar from "@/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MODULOS } from "@/lib/permisos";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let modulosPermitidos: string[] = MODULOS.map((m) => m.slug);

  if (user) {
    const admin = createAdminClient();
    const { data: perfil } = await admin
      .from("profiles")
      .select("modulos_permitidos")
      .eq("id", user.id)
      .maybeSingle();

    // Si no hay perfil todavía (migración pendiente en Supabase), se
    // muestran todos los módulos — mismo criterio permisivo que el proxy.
    if (perfil) modulosPermitidos = perfil.modulos_permitidos;
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--color-gris-50)" }}>
      <Sidebar modulosPermitidos={modulosPermitidos} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
