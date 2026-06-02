import type { Metadata } from "next";
import PageClient from "./page-client";

export const metadata: Metadata = {
  title: "Consultoría IA para Empresas | Inspire Cyber 360 — InspireAI",
  description: "Auditamos tus procesos e identificamos oportunidades reales de IA con impacto económico estimado. Diagnóstico en 4 áreas, entregable en Notion y garantía de devolución.",
  alternates: { canonical: "https://inspireai.es/consultoria-ia-empresas" },
  openGraph: {
    title: "Consultoría IA para Empresas | InspireAI",
    description: "Diagnóstico completo de IA en 4 áreas de tu empresa. Entregable en Notion, garantía de devolución.",
    url: "https://inspireai.es/consultoria-ia-empresas",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org", "@type": "Service",
  "name": "Inspire Cyber 360 — Consultoría de IA para Empresas",
  "provider": { "@type": "Organization", "name": "InspireAI", "url": "https://inspireai.es" },
  "description": "Auditoría completa de procesos con IA en 4 áreas: ventas, marketing, operaciones y fulfillment. Incluye análisis de ciberseguridad y roadmap técnico en Notion.",
  "serviceType": "Consultoría de Inteligencia Artificial",
  "areaServed": { "@type": "Country", "name": "España" },
  "url": "https://inspireai.es/consultoria-ia-empresas",
  "offers": { "@type": "Offer", "priceCurrency": "EUR", "price": "1500" },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <PageClient />
    </>
  );
}
