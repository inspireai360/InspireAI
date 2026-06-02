import type { Metadata } from "next";
import ConsultoriaIA from "./page-client";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Consultoría IA para Empresas | Inspire Cyber 360 — InspireAI",
  description: "Auditamos tus procesos e identificamos oportunidades reales de IA con impacto económico estimado. Diagnóstico en 4 áreas, entregable en Notion y garantía de devolución.",
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
