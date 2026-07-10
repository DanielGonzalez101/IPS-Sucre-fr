import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { getSedes, getEmailContacto, getRedesSociales } from "@/actions/sitio";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [{ data: sedes }, emailContacto, redes] = await Promise.all([
    getSedes(),
    getEmailContacto(),
    getRedesSociales(),
  ]);

  const sedePrincipal = sedes[0]
    ? { ciudad: sedes[0].ciudad, direccion: sedes[0].direccion, telefono: sedes[0].telefono }
    : undefined;

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer emailContacto={emailContacto} sedePrincipal={sedePrincipal} redes={redes} />
      <FloatingWhatsApp />
    </>
  );
}
