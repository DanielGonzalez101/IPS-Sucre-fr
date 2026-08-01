import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cardiocentro Pediátrico de Sucre — Especialistas en Cardiología Pediátrica",
    template: "%s | Cardiocentro Pediátrico de Sucre",
  },
  description:
    "IPS especializada en Cardiología Pediátrica, Radiología y Diagnóstico por Imágenes en Sincelejo, Sucre. Más de 16 años cuidando el corazón de los niños de la región.",
  keywords: ["cardiología pediátrica", "Sucre", "Sincelejo", "ecocardiograma", "IPS", "cardiocentro"],
  openGraph: {
    siteName: "Cardiocentro Pediátrico de Sucre",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido principal
        </a>
        {children}
        <Script
          src="https://api.wcx.cloud/widget/?id=9940af917b864606bbe22a837fc08179"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
