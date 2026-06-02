import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "Ciberseguridad en Proyectos de IA para Empresas | InspireAI",
  description: "Auditamos las vulnerabilidades de tus integraciones de IA: APIs sin autenticación, datos sin cifrar, permisos excesivos. Validado por hackers éticos.",
  alternates: { canonical: "https://inspireai.es/ciberseguridad-ia-empresas" },
  openGraph: {
    title: "Ciberseguridad IA para Empresas | InspireAI",
    description: "El 60% de las brechas en PYMEs vienen de integraciones de IA mal configuradas. Las revisamos antes de que sea tarde.",
    url: "https://inspireai.es/ciberseguridad-ia-empresas",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service",
  "name": "Ciberseguridad en Proyectos de IA",
  "provider": { "@type": "Organization", "name": "InspireAI", "url": "https://inspireai.es" },
  "description": "Auditoría de vulnerabilidades en integraciones de IA: tokens expuestos, permisos excesivos, cumplimiento RGPD. Validado por hackers éticos.",
  "serviceType": "Ciberseguridad para Inteligencia Artificial",
  "areaServed": { "@type": "Country", "name": "España" },
  "url": "https://inspireai.es/ciberseguridad-ia-empresas",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <PageClient />
    </>
  );
}
