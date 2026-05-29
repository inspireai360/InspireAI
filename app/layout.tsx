import type { Metadata } from "next";
import { Inter, DM_Sans, Syne, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700']
});

const syne = Syne({
  subsets: ["latin"],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800']
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: '--font-orbitron',
  weight: ['700', '800', '900']
});

const BASE_URL = "https://inspireai.es";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "InspireAI | Consultoría de IA y Automatización Empresarial en España",
  description: "Auditamos tus procesos con IA, detectamos ineficiencias reales y te entregamos un plan accionable en Notion. Primera consulta gratuita. Basados en España.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "InspireAI | Inteligencia que impulsa tu crecimiento",
    description: "Auditamos tus procesos, identificamos oportunidades reales de automatización y te entregamos un plan concreto para implementarlo con seguridad.",
    url: BASE_URL,
    siteName: "InspireAI",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InspireAI | Inteligencia que impulsa tu crecimiento",
    description: "Auditamos tus procesos y te entregamos un plan de IA accionable. Primera consulta gratuita.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "JgloMNQa-xh2Hzp_6NqGBUxdp0RZNM7iOHuzojz4Zww",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "InspireAI",
  url: BASE_URL,
  description: "Consultora tecnológica especializada en auditorías de IA y automatización empresarial para pymes y empresas en España.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ES",
  },
  areaServed: "España",
  serviceType: [
    "Auditoría de IA",
    "Automatización empresarial",
    "Ciberseguridad",
    "Arquitectura de IA",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    name: "Llamada de diagnóstico gratuita",
    description: "Primera consulta sin compromiso para analizar las necesidades de automatización e IA de tu empresa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${dmSans.variable} ${syne.variable} ${orbitron.variable} font-sans bg-dark text-white antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
