import type { Metadata } from "next";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Ciberseguridad en Proyectos de IA para Empresas — InspireAI",
  description: "Analizamos las vulnerabilidades de tus integraciones de IA antes de que alguien las explote. APIs sin autenticación, datos sin cifrar, permisos excesivos. Validado por hackers éticos.",
  alternates: { canonical: "https://inspireai.es/ciberseguridad-ia-empresas" },
  openGraph: {
    title: "Ciberseguridad IA para Empresas | InspireAI",
    description: "El 60% de las brechas en PYMEs vienen de integraciones de IA mal configuradas. Las revisamos antes de que sea tarde.",
    url: "https://inspireai.es/ciberseguridad-ia-empresas",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};
