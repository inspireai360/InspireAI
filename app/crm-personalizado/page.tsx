import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "CRM Personalizado para Empresas | Sin Salesforce ni HubSpot — InspireAI",
  description: "Construimos el CRM exacto que necesita tu empresa: con tu marca, conectado a tu web y adaptado a tu proceso de ventas. Sin licencias por usuario.",
  alternates: { canonical: "https://inspireai.es/crm-personalizado" },
  openGraph: {
    title: "CRM Personalizado para Empresas | InspireAI",
    description: "Tu propio CRM sin pagar por Salesforce. Adaptado a tu proceso, en tu dominio, código tuyo.",
    url: "https://inspireai.es/crm-personalizado",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service",
  "name": "CRM Personalizado para Empresas",
  "provider": { "@type": "Organization", "name": "InspireAI", "url": "https://inspireai.es" },
  "description": "Desarrollo de CRM a medida con tu marca, conectado a tu web y adaptado a tu proceso de ventas. Sin licencias por usuario, código propiedad del cliente.",
  "serviceType": "Desarrollo de software empresarial",
  "areaServed": { "@type": "Country", "name": "España" },
  "url": "https://inspireai.es/crm-personalizado",
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <PageClient />
    </>
  );
}
