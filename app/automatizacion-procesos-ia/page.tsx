import type { Metadata } from "next";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Automatización de Procesos con IA para Empresas — InspireAI",
  description: "Automatizamos tus procesos repetitivos con N8N, Make y Claude API sin cambiar tu software actual. Diagnóstico previo incluido.",
  alternates: { canonical: "https://inspireai.es/automatizacion-procesos-ia" },
  openGraph: {
    title: "Automatización de Procesos con IA | InspireAI",
    description: "N8N, Make, Claude API. Pedidos, facturas, leads, informes. 18h/semana de media recuperadas.",
    url: "https://inspireai.es/automatizacion-procesos-ia",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};
