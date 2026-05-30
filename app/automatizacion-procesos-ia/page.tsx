import type { Metadata } from "next";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Automatización de Procesos con IA para Empresas España — InspireAI",
  description: "Identificamos y automatizamos los procesos que más tiempo cuestan en tu empresa usando N8N, Make y Claude API. Sin cambiar tu software actual. Diagnóstico previo incluido.",
  alternates: { canonical: "https://inspireai.es/automatizacion-procesos-ia" },
  openGraph: {
    title: "Automatización de Procesos con IA | InspireAI",
    description: "N8N, Make, Claude API. Pedidos, facturas, leads, informes. 18h/semana de media recuperadas.",
    url: "https://inspireai.es/automatizacion-procesos-ia",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};
