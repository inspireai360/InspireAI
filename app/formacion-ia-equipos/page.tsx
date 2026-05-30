import type { Metadata } from "next";
export { default } from "./page-client";

export const metadata: Metadata = {
  title: "Formación IA para Equipos de Empresa España — InspireAI",
  description: "Formación práctica en IA para equipos de 5 a 30 personas. Prompting avanzado, N8N, Make y casos reales de tu sector. Sin código. Bonificable por FUNDAE.",
  alternates: { canonical: "https://inspireai.es/formacion-ia-equipos" },
  openGraph: {
    title: "Formación IA para Equipos | InspireAI",
    description: "Prompting, N8N, Make y IA generativa aplicada al día a día de tu empresa. Formación práctica, sin código, bonificable FUNDAE.",
    url: "https://inspireai.es/formacion-ia-equipos",
    siteName: "InspireAI", locale: "es_ES", type: "website",
  },
};
