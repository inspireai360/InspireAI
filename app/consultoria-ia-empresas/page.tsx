import type { Metadata } from "next";
import ConsultoriaIA from "./page-client";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Consultoría IA para Empresas en España | Inspire Cyber 360 — InspireAI",
  description: "Auditamos tus procesos de negocio e identificamos oportunidades reales de IA y automatización. Diagnóstico completo en 4 áreas con entregable en Notion. Garantía de devolución. PYMEs de 5–50 empleados.",
  alternates: {
    canonical: "https://inspireai.es/consultoria-ia-empresas",
  },
  openGraph: {
    title: "Consultoría IA para Empresas | InspireAI",
    description: "Diagnóstico completo de IA en 4 áreas de tu empresa. Entregable en Notion, garantía de devolución.",
    url: "https://inspireai.es/consultoria-ia-empresas",
    siteName: "InspireAI",
    locale: "es_ES",
    type: "website",
  },
};
