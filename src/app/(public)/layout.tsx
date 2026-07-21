import Script from "next/script";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import { A11yProvider } from "@/components/public/accesibilidad/A11yContext";
import { AccessibilityWidget } from "@/components/public/accesibilidad/AccessibilityWidget";
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

  const whatsappUrl = redes.whatsapp_url || "https://wa.me/573009127565";

  return (
    <A11yProvider>
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}
      <Header sedes={sedes} emailContacto={emailContacto} whatsappUrl={whatsappUrl} />
      <main className="min-h-screen">{children}</main>
      <Footer emailContacto={emailContacto} sedePrincipal={sedePrincipal} redes={redes} />
      <FloatingWhatsApp />
      <AccessibilityWidget />
    </A11yProvider>
  );
}
