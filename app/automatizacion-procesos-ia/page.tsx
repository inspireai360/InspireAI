import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "Automatización de Procesos con IA para Empresas — InspireAI",
  description: "Automatizamos los procesos repetitivos de tu empresa con N8N, Make y Claude API sin cambiar tu software actual. Diagnóstico previo incluido, sin permanencia.",
  alternates: { canonical: "https://inspireai.es/automatizacion-procesos-ia" },
  openGraph: {
    title: "Automatización de Procesos con IA | InspireAI",
    description: "N8N, Make, Claude API. Pedidos, facturas, leads, informes. 18h/semana de media recuperadas.",
    url: "https://inspireai.es/automatizacion-procesos-ia",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service",
  "name": "Automatización de Procesos con IA",
  "provider": { "@type": "Organization", "name": "InspireAI", "url": "https://inspireai.es" },
  "description": "Implementación de automatizaciones con N8N, Make y Claude API para eliminar tareas repetitivas en PYMEs españolas. Sin cambiar el software actual.",
  "serviceType": "Automatización de procesos empresariales",
  "areaServed": { "@type": "Country", "name": "España" },
  "url": "https://inspireai.es/automatizacion-procesos-ia",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <PageClient />
    </>
  );
}
