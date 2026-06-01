import type { Metadata } from "next";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "CRM Personalizado para Empresas España — Sin Salesforce ni HubSpot | InspireAI",
  description: "Construimos el CRM exacto que necesita tu empresa: con tu marca, conectado a tu web y adaptado a tu proceso de ventas. Sin licencias por usuario. Sin funciones que no usas. Desde 3.500€.",
  alternates: { canonical: "https://inspireai.es/formacion-ia-equipos" },
  openGraph: {
    title: "CRM Personalizado para Empresas | InspireAI",
    description: "Tu propio CRM sin pagar por Salesforce. Adaptado a tu proceso, en tu dominio, código tuyo.",
    url: "https://inspireai.es/formacion-ia-equipos",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};
